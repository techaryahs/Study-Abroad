/**
 * Consultation Booking Orchestrator
 *
 * Single entry point for all consultation booking paths.
 * Existing HTTP routes remain as compatibility wrappers.
 * Website uses POST /api/bookings/book-consultation → bookConsultation().
 *
 * Paths:
 *   - free        → legacy free counselling session
 *   - membership  → EntitlementEngine-metered booking (consultant OR website counselling)
 *   - paid        → paid counselling session (Razorpay paymentId; once per payment)
 *
 * Credits decrement only via reserveEntitlementUsage → commitEntitlementUsage (once).
 */

const crypto = require("crypto");
const { randomUUID } = require("crypto");
const mongoose = require("mongoose");
const { normalizeEmail } = require("../utils/emailUtils");
const logger = require("../utils/logger");

const Booking = require("../models/Booking");
const Consultant = require("../models/Consultant");
const Student = require("../models/Student");
const PaymentTransaction = require("../models/PaymentTransaction");
const sendEmail = require("../utils/sendEmail");
const { findUserByEmail } = require("../utils/userHelper");
const {
  reserveEntitlementUsage,
  commitEntitlementUsage,
  restoreCommittedEntitlementUsage,
} = require("../utils/membershipUtils");
const UsageReservation = require("../models/UsageReservation");

/** Must match payment.controller CONSULTATION_PURCHASE.ledgerPlanId */
const CONSULTATION_LEDGER_PLAN_ID = "consultation_addon";

/* ─────────────────────────────────────────────────────────────
   Phase 5 — cancellation + credit restore helpers
───────────────────────────────────────────────────────────── */

/** Statuses that may transition to cancelled. */
const CANCELLABLE_STATUSES = Object.freeze([
  "pending",
  "accepted",
  "booked",
  "rejected",
]);

/** Statuses that may transition to completed (never from cancelled). */
const COMPLETABLE_STATUSES = Object.freeze([
  "pending",
  "accepted",
  "booked",
]);

/**
 * True when the consultation session has already started or finished.
 * Uses Asia/Kolkata wall clock to match slot scheduling.
 */
function hasConsultationOccurred(booking, now = new Date()) {
  if (!booking) return true;
  if (booking.status === "completed") return true;

  const date = booking.date; // YYYY-MM-DD
  const time = booking.time || "00:00"; // HH:mm
  if (!date) return false;

  const istNow = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const y = istNow.getFullYear();
  const m = String(istNow.getMonth() + 1).padStart(2, "0");
  const d = String(istNow.getDate()).padStart(2, "0");
  const todayStr = `${y}-${m}-${d}`;
  const currentTime = `${String(istNow.getHours()).padStart(2, "0")}:${String(
    istNow.getMinutes()
  ).padStart(2, "0")}`;

  if (date < todayStr) return true;
  if (date > todayStr) return false;
  // Same calendar day: occurred once slot start time has been reached.
  return time <= currentTime;
}

function bookingHadMembershipCredit(booking) {
  return Boolean(
    booking?.membershipCreditConsumed || booking?.bookingPath === "membership"
  );
}

/**
 * Authorize cancel actor.
 *  - admin  → any booking
 *  - student → only own booking (email or userId match)
 *
 * @param {object} booking
 * @param {{ role?: string, id?: string, _id?: string, email?: string }|null} actor
 * @param {object|null} studentDoc optional preloaded Student for the actor
 */
function authorizeCancelActor(booking, actor, studentDoc = null) {
  if (!actor || !(actor.id || actor._id)) {
    return {
      ok: false,
      status: 401,
      code: "LOGIN_REQUIRED",
      message: "Authentication required to cancel a booking.",
    };
  }

  const role = String(actor.role || "").toLowerCase();
  const actorId = String(actor.id || actor._id);

  if (role === "admin") {
    return {
      ok: true,
      cancelledByRole: "admin",
      cancelledByUserId: actorId,
    };
  }

  // Students (and any non-admin authenticated user cancelling their own booking)
  const actorEmail = normalizeEmail(
    studentDoc?.email || actor.email || ""
  );
  const bookingEmail = normalizeEmail(booking.userEmail);
  const bookingUserId = booking.userId ? String(booking.userId) : null;

  const ownsByEmail = actorEmail && bookingEmail && actorEmail === bookingEmail;
  const ownsById = bookingUserId && bookingUserId === actorId;

  if (ownsByEmail || ownsById) {
    return {
      ok: true,
      cancelledByRole: role === "student" || !role ? "student" : "student",
      cancelledByUserId: actorId,
    };
  }

  return {
    ok: false,
    status: 403,
    code: "FORBIDDEN",
    message: "You can only cancel your own bookings.",
  };
}


async function findUsageReservationForBooking(booking, session = null) {
  if (!booking) return null;

  const withSession = (query) => {
    const find = UsageReservation.findOne(query);
    return session ? find.session(session) : find;
  };

  if (booking.usageReservationId) {
    const byId = session
      ? await UsageReservation.findById(booking.usageReservationId).session(
          session
        )
      : await UsageReservation.findById(booking.usageReservationId);
    if (byId) return byId;
  }

  // Fallback: committed consultation reservation tagged with this booking.
  const bookingId = booking._id;
  return withSession({
    featureId: "consultation",
    status: "committed",
    $or: [
      { "metadata.bookingId": bookingId },
      { "metadata.bookingId": String(bookingId) },
    ],
  });
}

/**
 * Cancel a booking with production-safe credit policy.
 *
 * Concurrency model (double-restore & race safe):
 *  1. Authz: admin any booking; student own only.
 *  2. Single Mongo transaction for cancel + optional restore.
 *  3. Atomic booking status transition (cancellable → cancelled) — one winner.
 *  4. Atomic creditRestoreStatus none → claimed — only winner may restore.
 *  5. Atomic reservation committed → restored — second restorer is no-op.
 *  6. Booking creditRestoreStatus claimed → restored (or skipped).
 *  7. Completed / session-started → cancel may succeed for admin cleanup but
 *     creditRestoreStatus → skipped (never restore).
 *
 * @param {string} bookingId
 * @param {{ actor?: object, student?: object }} [options]
 * @returns {Promise<{ success, status, body }>}
 */
async function cancelBookingWithCreditPolicy(bookingId, options = {}) {
  if (!bookingId) {
    return fail(400, { message: "Booking id is required" });
  }

  const actor = options.actor || null;
  const studentDoc = options.student || null;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return fail(404, { message: "Booking not found" });
  }

  // ── Authorization (admin vs student) ────────────────────────────────────
  const authz = authorizeCancelActor(booking, actor, studentDoc);
  if (!authz.ok) {
    return fail(authz.status, {
      message: authz.message,
      code: authz.code,
      creditRestored: false,
    });
  }

  // ── Fast-path idempotent re-cancel (no txn needed) ──────────────────────
  if (booking.status === "cancelled") {
    return ok(200, {
      message: "Booking already cancelled",
      booking,
      creditRestored:
        booking.creditRestoreStatus === "restored" ||
        Boolean(booking.creditRestoredAt),
      cancelledByRole: booking.cancelledByRole || null,
      idempotent: true,
    });
  }

  // Students cannot cancel completed sessions; admins also cannot (credit-safe).
  if (booking.status === "completed") {
    return fail(400, {
      message: "Completed consultations cannot be cancelled.",
      code: "ALREADY_COMPLETED",
      creditRestored: false,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  let creditRestored = false;
  let creditRestoreSkippedReason = null;
  let updatedBooking = null;

  try {
    // Re-read occurred flag inside the transaction window.
    const occurred = hasConsultationOccurred(booking);

    // ── 1) Atomic cancel (single winner under concurrency) ────────────────
    updatedBooking = await Booking.findOneAndUpdate(
      {
        _id: bookingId,
        status: { $in: CANCELLABLE_STATUSES },
      },
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
          cancelledByRole: authz.cancelledByRole,
          cancelledByUserId: authz.cancelledByUserId,
        },
      },
      { new: true, session }
    );

    if (!updatedBooking) {
      const latest = await Booking.findById(bookingId).session(session);
      await session.abortTransaction();
      session.endSession();

      if (latest?.status === "cancelled") {
        return ok(200, {
          message: "Booking already cancelled",
          booking: latest,
          creditRestored:
            latest.creditRestoreStatus === "restored" ||
            Boolean(latest.creditRestoredAt),
          cancelledByRole: latest.cancelledByRole || null,
          idempotent: true,
        });
      }
      if (latest?.status === "completed") {
        return fail(400, {
          message: "Completed consultations cannot be cancelled.",
          code: "ALREADY_COMPLETED",
          creditRestored: false,
        });
      }
      return fail(409, {
        message: "Unable to cancel booking in its current state.",
        code: "INVALID_STATE",
        creditRestored: false,
      });
    }

    const hadCredit = bookingHadMembershipCredit(updatedBooking);

    // ── 2) Decide restore eligibility (inside txn, post-cancel) ───────────
    // No membership credit, session already occurred, or restore already done.
    if (!hadCredit) {
      creditRestoreSkippedReason = "no_membership_credit";
      const skipped = await Booking.findOneAndUpdate(
        {
          _id: bookingId,
          creditRestoreStatus: "none",
        },
        { $set: { creditRestoreStatus: "skipped" } },
        { new: true, session }
      );
      if (skipped) updatedBooking = skipped;
    } else if (occurred) {
      creditRestoreSkippedReason = "consultation_already_occurred";
      const skipped = await Booking.findOneAndUpdate(
        {
          _id: bookingId,
          creditRestoreStatus: "none",
        },
        { $set: { creditRestoreStatus: "skipped" } },
        { new: true, session }
      );
      if (skipped) updatedBooking = skipped;
    } else if (
      updatedBooking.creditRestoreStatus === "restored" ||
      updatedBooking.creditRestoredAt
    ) {
      // Already restored (shouldn't happen pre-cancel, but race-safe)
      creditRestored = true;
      creditRestoreSkippedReason = null;
    } else {
      // ── 3) Atomic restore claim on booking (prevents double restore) ─────
      // Only one concurrent canceler wins none → claimed.
      const claimedBooking = await Booking.findOneAndUpdate(
        {
          _id: bookingId,
          status: "cancelled",
          creditRestoreStatus: "none",
          creditRestoredAt: null,
          $or: [
            { membershipCreditConsumed: true },
            { bookingPath: "membership" },
          ],
        },
        {
          $set: {
            creditRestoreStatus: "claimed",
          },
        },
        { new: true, session }
      );

      if (!claimedBooking) {
        // Another worker claimed/restored/skipped — do not restore again.
        updatedBooking =
          (await Booking.findById(bookingId).session(session)) || updatedBooking;
        creditRestored =
          updatedBooking.creditRestoreStatus === "restored" ||
          Boolean(updatedBooking.creditRestoredAt);
        creditRestoreSkippedReason = creditRestored
          ? null
          : updatedBooking.creditRestoreStatus === "skipped"
            ? "restore_already_skipped"
            : "restore_claimed_by_other";
      } else {
        updatedBooking = claimedBooking;

        // ── 4) Restore reservation (committed → restored, once) ───────────
        const reservation = await findUsageReservationForBooking(
          updatedBooking,
          session
        );

        if (!reservation) {
          // Fail closed: keep claim but mark skipped so we never invent credits.
          console.warn(
            `[Cancel] credit claimed but no reservation for booking ${bookingId}`
          );
          updatedBooking = await Booking.findOneAndUpdate(
            { _id: bookingId, creditRestoreStatus: "claimed" },
            { $set: { creditRestoreStatus: "skipped" } },
            { new: true, session }
          );
          creditRestoreSkippedReason = "reservation_missing";
          creditRestored = false;
        } else {
          const result = await restoreCommittedEntitlementUsage(reservation, {
            session,
            metadata: {
              bookingId: updatedBooking._id,
              reason: "booking_cancelled_before_session",
              cancelledByRole: authz.cancelledByRole,
              cancelledByUserId: authz.cancelledByUserId,
            },
          });

          if (result.restored) {
            // ── 5) Finalize booking restore stamp (claimed → restored) ────
            updatedBooking = await Booking.findOneAndUpdate(
              {
                _id: bookingId,
                creditRestoreStatus: "claimed",
              },
              {
                $set: {
                  creditRestoreStatus: "restored",
                  creditRestoredAt: new Date(),
                  usageReservationId: result.reservation?._id,
                },
              },
              { new: true, session }
            );
            creditRestored = true;
            creditRestoreSkippedReason = null;
          } else if (result.idempotent) {
            // Reservation already restored (prior partial success) — stamp booking.
            updatedBooking = await Booking.findOneAndUpdate(
              {
                _id: bookingId,
                creditRestoreStatus: { $in: ["claimed", "none"] },
              },
              {
                $set: {
                  creditRestoreStatus: "restored",
                  creditRestoredAt: new Date(),
                  usageReservationId:
                    result.reservation?._id || updatedBooking.usageReservationId,
                },
              },
              { new: true, session }
            );
            creditRestored = true;
            creditRestoreSkippedReason = null;
          } else {
            // Unexpected — release claim to skipped to avoid stuck "claimed"
            updatedBooking = await Booking.findOneAndUpdate(
              { _id: bookingId, creditRestoreStatus: "claimed" },
              { $set: { creditRestoreStatus: "skipped" } },
              { new: true, session }
            );
            creditRestoreSkippedReason = "restore_failed";
            creditRestored = false;
          }
        }
      }
    }

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch {
      /* ignore */
    }
    session.endSession();
    console.error("cancelBookingWithCreditPolicy failed:", err);
    return fail(500, {
      message: "Failed to cancel booking",
      error: err.message,
      creditRestored: false,
    });
  }

  const finalBooking = updatedBooking || (await Booking.findById(bookingId));
  const restored =
    creditRestored ||
    finalBooking?.creditRestoreStatus === "restored" ||
    Boolean(finalBooking?.creditRestoredAt);

  return ok(200, {
    message: restored
      ? "Booking cancelled and consultation credit restored"
      : creditRestoreSkippedReason === "consultation_already_occurred"
        ? "Booking cancelled. Consultation credit not restored because the session time has passed or the consultation was completed."
        : "Booking cancelled",
    booking: finalBooking,
    creditRestored: restored,
    creditRestoreSkippedReason: restored ? null : creditRestoreSkippedReason,
    cancelledByRole: authz.cancelledByRole,
    idempotent: false,
  });
}

const SECRET_KEY =
  process.env.MEETING_SECRET_KEY || "careergenai-meeting-secret-2024";

/* ─────────────────────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────────────────────── */

function generateMeetingId(sessionId) {
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(sessionId.toString());
  const hash = hmac.digest("hex");
  return hash.substring(0, 12).toUpperCase();
}

function ok(status, body) {
  return { success: true, status, body };
}

function fail(status, body) {
  return { success: false, status, body };
}

/* ─────────────────────────────────────────────────────────────
   Path resolution
───────────────────────────────────────────────────────────── */

/**
 * Decide which booking path to run.
 * Explicit `path` from compatibility wrappers wins.
 * Inference supports a future single HTTP entry point without changing rules.
 *
 * @param {object} input
 * @returns {'free'|'membership'|'paid'}
 */
function resolveBookingPath(input = {}) {
  const explicit = input.path || input.bookingPath;
  if (explicit === "free" || explicit === "membership" || explicit === "paid") {
    return explicit;
  }

  // Membership path always books a specific consultant with entitlement usage.
  if (input.consultantId && input.source === "membership") {
    return "membership";
  }

  if (input.isFreeBooking) {
    return "free";
  }

  return "paid";
}

/* ─────────────────────────────────────────────────────────────
   Path: membership
   - With consultantId → legacy consultant booking (book-consultant)
   - Without consultantId → website counselling session + one credit
───────────────────────────────────────────────────────────── */

/**
 * Website membership path: counselling slot + single EntitlementEngine debit.
 * No payment. No free-session flag. Credit reserved once inside the transaction.
 */
async function executeMembershipCounsellingBooking(input) {
  const { date, time, userEmail, userName, userPhone, userId } = input;

  if (!date || !time || !userEmail || !userPhone) {
    return fail(400, {
      message:
        "Missing required booking details (date, time, email, phone)",
    });
  }

  if (!userId) {
    return fail(401, {
      message: "Authentication required for membership booking.",
      code: "LOGIN_REQUIRED",
    });
  }

  const emailLower = String(userEmail).toLowerCase().trim();
  const phoneClean = String(userPhone).trim();

  const existing = await Booking.findOne({
    date,
    time,
    bookingType: "counselling",
    status: "booked",
  });
  if (existing) {
    return fail(400, {
      message:
        "This slot has already been booked. Please pick another one.",
    });
  }

  const finalConsultantName = "Admin";
  const finalConsultantEmail =
    process.env.ADMIN_EMAIL || "eduleaderglobal@gmail.com";

  const sessionId = randomUUID();
  const meetingId = generateMeetingId(`${sessionId}-${emailLower}`);
  const endH = parseInt(time.split(":")[0], 10) + 1;
  const endTime = `${String(endH).padStart(2, "0")}:00`;

  // Idempotent credit reservation key — second concurrent request cannot double-debit.
  const reservationKey = `consultation:${userId}:${date}:${time}`;

  const session = await mongoose.startSession();
  session.startTransaction();
  let booking;
  try {
    const student = await Student.findById(userId).session(session);
    if (!student) {
      throw new Error("Cannot reserve entitlement without valid user ID.");
    }

    const usageReservation = await reserveEntitlementUsage(
      userId,
      "consultation",
      {
        session,
        reservationKey,
        metadata: {
          source: "book_consultation_membership",
          date,
          time,
          style: "counselling",
        },
      }
    );

    const newBooking = new Booking({
      bookingType: "counselling",
      consultantId: null,
      consultantName: finalConsultantName,
      consultantEmail: finalConsultantEmail,
      date,
      time,
      endTime,
      userEmail: emailLower,
      userName,
      userPhone: phoneClean,
      status: "booked",
      sessionId,
      meetingId,
      // omit paymentId — free/membership bookings must not set null (unique index)
      isPaid: true,
      isFreeBooking: false,
      amountPaid: 0,
      bookingPath: "membership",
      membershipCreditConsumed: true,
      usageReservationId: usageReservation._id,
    });
    booking = await newBooking.save({ session });

    if (!student.profile) student.profile = {};
    if (!student.profile.mySessions) student.profile.mySessions = [];
    student.profile.mySessions.push(booking._id);
    await student.save({ session });

    await commitEntitlementUsage(usageReservation, {
      session,
      metadata: { bookingId: booking._id },
    });

    await session.commitTransaction();
    session.endSession();
  } catch (txnError) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Membership counselling booking failed:", txnError);

    const msg = txnError.message || "";
    if (
      msg.includes("Usage exhausted") ||
      msg.includes("Unknown usage") ||
      msg.includes("Invalid or inactive") ||
      msg.includes("Feature not enabled")
    ) {
      return fail(403, {
        message: msg,
        code: "NO_CREDITS",
        error: msg,
      });
    }

    // Duplicate reservationKey or unique counselling slot index
    if (txnError.code === 11000 || /duplicate key/i.test(msg)) {
      return fail(409, {
        message:
          "This slot has already been booked. Please pick another one.",
        code: "SLOT_TAKEN",
      });
    }

    return fail(500, {
      message:
        "Booking failed due to internal error or entitlement limits.",
      error: msg,
    });
  }

  try {
    await sendEmail(
      emailLower,
      "✅ Counselling Session Confirmed",
      "",
      `<p>Hi ${userName || "Student"},</p>
             <p>Your counselling session with Admin is confirmed for <b>${date}</b> at <b>${time}</b>.</p>
             <p>Meeting ID: <b>${meetingId}</b></p>
             <p>Session ID: <b>${sessionId}</b></p>
             <p>Booked using a membership consultation credit.</p>`
    );
  } catch (e) {
    logger.warn("Email notify failed during membership session booking", e.message);
  }

  try {
    await sendEmail(
      finalConsultantEmail,
      "🔔 New Counselling Session Booked (Membership)",
      "",
      `<p>New membership counselling session booked by <b>${userName || emailLower}</b>.</p>
             <p>Date: <b>${date}</b> at <b>${time}</b></p>
             <p>Meeting ID: <b>${meetingId}</b></p>`
    );
  } catch (e) {
    console.warn("Admin notification failed", e.message);
  }

  return ok(201, {
    message: "Session booked successfully",
    booking: {
      _id: booking._id,
      sessionId,
      meetingId,
      date,
      time,
      endTime,
      consultantName: finalConsultantName,
      userEmail: emailLower,
      userPhone: phoneClean,
      isFreeBooking: false,
      isPaid: true,
      amountPaid: 0,
      path: "membership",
    },
  });
}

async function executeMembershipBooking(input) {
  // Website / unified counselling booking — no consultantId.
  if (!input.consultantId) {
    return executeMembershipCounsellingBooking(input);
  }

  let {
    consultantId,
    consultantEmail,
    consultantName,
    date,
    time,
    userEmail,
    userPhone,
    userName,
    userId,
    consultantType,
  } = input;

  logger.debug(
    `[Booking] Request: ${date} ${time} for ID: ${consultantId}`
  );

  if (!consultantId || !date || !time || !userEmail || !userPhone) {
    return fail(400, { message: "Missing required data" });
  }

  const consultant = await Consultant.findById(consultantId);
  if (!consultant) {
    return fail(404, { message: "Consultant not found" });
  }

  if (!consultantEmail || !consultantName) {
    consultantEmail = consultantEmail || consultant.email;
    consultantName = consultantName || consultant.name;
  }

  if (!consultantEmail) {
    return fail(400, { message: "Consultant email not found" });
  }

  const alreadyBooked = await Booking.findOne({ consultantId, date, time });
  if (alreadyBooked) {
    logger.warn(
      `[Booking] Conflict found: ${date} ${time} for consultant ${consultantId}`
    );
    return fail(400, { message: "Slot already booked" });
  }

  const meetingId = generateMeetingId(
    `${consultantId}-${date}-${time}-${userEmail}`
  );

  const session = await mongoose.startSession();
  session.startTransaction();
  let booking;
  try {
    const student = await Student.findOne({ email: userEmail }).session(
      session
    );
    const realUserId = userId || (student ? student._id : null);
    if (!realUserId) {
      throw new Error("Cannot reserve entitlement without valid user ID.");
    }

    const usageReservation = await reserveEntitlementUsage(
      realUserId,
      "consultation",
      {
        session,
        metadata: { source: "book_consultant", consultantId, date, time },
      }
    );

    const newBooking = new Booking({
      consultantId,
      consultantEmail,
      consultantName,
      date,
      time,
      userEmail,
      userName,
      userPhone,
      userId,
      consultantType,
      meetingId,
      bookingPath: "membership",
      membershipCreditConsumed: true,
      usageReservationId: usageReservation._id,
    });
    booking = await newBooking.save({ session });

    if (student) {
      if (!student.profile) student.profile = {};
      if (!student.profile.myBookings) student.profile.myBookings = [];
      student.profile.myBookings.push(booking._id);
      await student.save({ session });
    }

    await commitEntitlementUsage(usageReservation, {
      session,
      metadata: { bookingId: booking._id },
    });

    await session.commitTransaction();
    session.endSession();
  } catch (txnError) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Booking transaction failed:", txnError);
    return fail(500, {
      message:
        "Booking failed due to internal error or entitlement limits.",
      error: txnError.message,
    });
  }

  try {
    await sendEmail(
      userEmail,
      "Your CareerGenAI Consultation is Confirmed",
      "",
      `<p>Your appointment with <b>${consultantName}</b> is confirmed.</p>
             <p>Date: <b>${date}</b></p>
             <p>Time: <b>${time}</b></p>
             <p>Meeting ID: <b>${meetingId}</b></p>`
    );

    await sendEmail(
      consultantEmail,
      "New Consultation Booking",
      "",
      `<p>You have a new booking from <b>${userName}</b>.</p>`
    );

    await sendEmail(
      process.env.ADMIN_NOTIFY_TO || "eduleaderglobal@gmail.com",
      "New Consultation Booking (Admin Copy)",
      "",
      `<p>User: ${userName} (${logger.maskEmail(userEmail)})</p><p>Mentor: ${consultantName}</p>`
    );
  } catch (emailErr) {
    logger.warn(
      "Email notification failed, but booking was successful:",
      emailErr.message
    );
  }

  return ok(200, { message: "Booking successful", booking });
}

/* ─────────────────────────────────────────────────────────────
   Path: free + paid counselling session (former bookCounsellingSession)
   Shared implementation — free only adds eligibility checks.
───────────────────────────────────────────────────────────── */

async function executeCounsellingSessionBooking(input) {
  const {
    date,
    time,
    userEmail,
    userName,
    userPhone,
    paymentId,
    amount,
    isFreeBooking,
  } = input;

  if (!date || !time || !userEmail || !userPhone) {
    return fail(400, {
      message:
        "Missing required booking details (date, time, email, phone)",
    });
  }

  const emailLower = userEmail.toLowerCase().trim();
  const phoneClean = userPhone.trim();

  const existing = await Booking.findOne({
    date,
    time,
    bookingType: "counselling",
    status: "booked",
  });
  if (existing) {
    return fail(400, {
      message:
        "This slot has already been booked. Please pick another one.",
      code: "SLOT_TAKEN",
    });
  }

  // Paid path: one real payment → one booking (no double booking on retry).
  if (!isFreeBooking && paymentId) {
    const paidExisting = await Booking.findOne({ paymentId });
    if (paidExisting) {
      return fail(409, {
        message: "This payment has already been used for a booking.",
        code: "PAYMENT_ALREADY_USED",
        booking: {
          _id: paidExisting._id,
          sessionId: paidExisting.sessionId,
          meetingId: paidExisting.meetingId,
          date: paidExisting.date,
          time: paidExisting.time,
          endTime: paidExisting.endTime,
          consultantName: paidExisting.consultantName,
          userEmail: paidExisting.userEmail,
          userPhone: paidExisting.userPhone,
          isFreeBooking: paidExisting.isFreeBooking,
          isPaid: paidExisting.isPaid,
          amountPaid: paidExisting.amountPaid,
        },
      });
    }
  }

  let student = await Student.findOne({ email: emailLower });
  let isActuallyFree = false;

  if (isFreeBooking) {
    const existingAccount = await findUserByEmail(emailLower);

    if (existingAccount && existingAccount.role !== "student") {
      return fail(403, {
        message: "Free sessions are available for student accounts.",
      });
    }

    if (!student) {
      return fail(400, {
        message:
          "Please verify your phone number before booking a free session.",
      });
    }

    if (student.profile?.hasUsedFreeBooking) {
      return fail(403, {
        message:
          "You've already used your free session. Please proceed with payment.",
      });
    }

    isActuallyFree = true;
  }

  const finalConsultantName = "Admin";
  const finalConsultantEmail =
    process.env.ADMIN_EMAIL || "eduleaderglobal@gmail.com";

  const sessionId = randomUUID();
  const meetingId = generateMeetingId(`${sessionId}-${emailLower}`);
  const endH = parseInt(time.split(":")[0]) + 1;
  const endTime = `${String(endH).padStart(2, "0")}:00`;

  const newBooking = new Booking({
    bookingType: "counselling",
    consultantId: null,
    consultantName: finalConsultantName,
    consultantEmail: finalConsultantEmail,
    date,
    time,
    endTime,
    userEmail: emailLower,
    userName,
    userPhone: phoneClean,
    status: "booked",
    sessionId,
    meetingId,
    ...(isActuallyFree || !paymentId ? {} : { paymentId }),
    isPaid: isActuallyFree ? true : !!paymentId,
    isFreeBooking: isActuallyFree,
    amountPaid: isActuallyFree ? 0 : amount || 599,
    bookingPath: isActuallyFree ? "free" : "paid",
    membershipCreditConsumed: false,
  });

  try {
    await newBooking.save();
  } catch (saveErr) {
    // Unique slot index or unique paymentId index
    if (saveErr?.code === 11000) {
      const msg = String(saveErr.message || "");
      if (/paymentId/i.test(msg)) {
        return fail(409, {
          message: "This payment has already been used for a booking.",
          code: "PAYMENT_ALREADY_USED",
        });
      }
      return fail(409, {
        message:
          "This slot has already been booked. Please pick another one.",
        code: "SLOT_TAKEN",
      });
    }
    throw saveErr;
  }

  try {
    if (student) {
      if (!student.profile) student.profile = {};
      if (!student.profile.mySessions) student.profile.mySessions = [];
      student.profile.mySessions.push(newBooking._id);
      if (isActuallyFree) {
        student.profile.hasUsedFreeBooking = true;
        student.profile.freeBookingUsedAt = new Date();
        logger.info(`Free booking marked for: ${logger.maskEmail(emailLower)}`);
      }
      await student.save();
    }
  } catch (err) {
    logger.warn(
      "Could not link session mapping to student profile:",
      err.message
    );
  }

  try {
    await sendEmail(
      emailLower,
      "✅ Counselling Session Confirmed",
      "",
      `<p>Hi ${userName || "Student"},</p>
             <p>Your counselling session with Admin is confirmed for <b>${date}</b> at <b>${time}</b>.</p>
             <p>Meeting ID: <b>${meetingId}</b></p>
             <p>Session ID: <b>${sessionId}</b></p>`
    );
  } catch (e) {
    logger.warn("Email notify failed during session booking", e.message);
  }

  try {
    await sendEmail(
      finalConsultantEmail,
      "🔔 New Counselling Session Booked",
      "",
      `<p>New counselling session booked by <b>${userName || logger.maskEmail(emailLower)}</b>.</p>
             <p>Date: <b>${date}</b> at <b>${time}</b></p>
             <p>Meeting ID: <b>${meetingId}</b></p>`
    );
  } catch (e) {
    logger.warn("Admin notification failed", e.message);
  }

  return ok(201, {
    message: "Session booked successfully",
    booking: {
      _id: newBooking._id,
      sessionId,
      meetingId,
      date,
      time,
      endTime,
      consultantName: finalConsultantName,
      userEmail: emailLower,
      userPhone: phoneClean,
      isFreeBooking: isActuallyFree,
      isPaid: newBooking.isPaid,
      amountPaid: newBooking.amountPaid,
    },
  });
}

async function executeFreeBooking(input) {
  return executeCounsellingSessionBooking({ ...input, isFreeBooking: true });
}

/**
 * Paid path: one verified consultation purchase (₹599) → one booking.
 * Does not touch membership plan or entitlement credits.
 * Sentinel paymentIds are NEVER accepted as entitlement proof.
 */
async function executePaidBooking(input) {
  if (!input.paymentId) {
    return fail(400, {
      message: "Payment required to complete booking.",
      code: "PAYMENT_REQUIRED",
    });
  }

  const paymentId = String(input.paymentId).trim();
  const sentinel = new Set([
    "membership_entitlement",
    "membership",
    "entitlement",
  ]);
  if (sentinel.has(paymentId.toLowerCase())) {
    return fail(400, {
      message:
        "Invalid payment credential. Membership bookings must use the membership path.",
      code: "SENTINEL_NOT_ALLOWED",
    });
  }

  // All paid bookings require a succeeded consultation_addon ledger entry.
  const ledger = await PaymentTransaction.findOne({
    $or: [
      { externalTransactionId: paymentId },
      { paymentId: paymentId }, 
      { transactionId: paymentId }
    ],
    planId: CONSULTATION_LEDGER_PLAN_ID,
    status: { $in: ["succeeded", "ENTITLED", "VERIFIED"] },
  });

  if (!ledger) {
    const other = await PaymentTransaction.findOne({
      $or: [
        { externalTransactionId: paymentId },
        { paymentId: paymentId }, 
        { transactionId: paymentId }
      ],
      status: { $in: ["succeeded", "ENTITLED", "VERIFIED"] },
    });
    if (other && other.planId !== CONSULTATION_LEDGER_PLAN_ID) {
      return fail(400, {
        message:
          "This payment is for a membership plan, not a single consultation.",
        code: "MEMBERSHIP_PAYMENT_NOT_VALID_FOR_CONSULTATION",
      });
    }
    return fail(400, {
      message:
        "Consultation payment not verified. Complete checkout for ₹599 first.",
      code: "CONSULTATION_PAYMENT_UNVERIFIED",
    });
  }

  return executeCounsellingSessionBooking({ ...input, isFreeBooking: false });
}

/* ─────────────────────────────────────────────────────────────
   Orchestrator — sole entry point for consultation booking
───────────────────────────────────────────────────────────── */

/**
 * Book a consultation via free | membership | paid path.
 *
 * @param {object} input  Request fields + optional `path` override
 * @returns {Promise<{ success: boolean, status: number, body: object }>}
 */
async function bookConsultation(input = {}) {
  const path = resolveBookingPath(input);

  try {
    switch (path) {
      case "membership":
        return await executeMembershipBooking(input);
      case "free":
        return await executeFreeBooking(input);
      case "paid":
        return await executePaidBooking(input);
      default:
        return fail(400, { message: "Unknown consultation booking path" });
    }
  } catch (err) {
    // Preserve path-specific outer error messages from the original controllers.
    if (path === "membership") {
      logger.error("Booking error:", err.message || err);
      return fail(500, {
        message: "Server error. Could not complete booking.",
      });
    }
    logger.error("bookCounsellingSession Error:", err);
    return fail(500, { message: "Error completing session booking" });
  }
}

module.exports = {
  bookConsultation,
  resolveBookingPath,
  generateMeetingId,
  cancelBookingWithCreditPolicy,
  hasConsultationOccurred,
  authorizeCancelActor,
  CANCELLABLE_STATUSES,
  COMPLETABLE_STATUSES,
  // Exported for unit tests / future direct use — not new HTTP surface
  executeMembershipBooking,
  executeMembershipCounsellingBooking,
  executeFreeBooking,
  executePaidBooking,
};

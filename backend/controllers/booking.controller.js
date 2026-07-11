const Booking = require("../models/Booking");
const Consultant = require("../models/Consultant");
const Student = require("../models/Student");
const sendEmail = require("../utils/sendEmail");
const { findUserByEmail, findUserByMobile } = require("../utils/userHelper");
const {
  bookConsultation,
  cancelBookingWithCreditPolicy,
} = require("../services/consultationBooking.service");
const {
  applyLifecycleToUser,
  canAccess,
  remainingUsage,
} = require("../utils/entitlementEngine");
const MembershipPlan = require("../models/MembershipPlan");

/* ─────────────────────────────────────────────────────────────
   Single booking engine helpers — all HTTP surfaces delegate here
───────────────────────────────────────────────────────────── */

const SENTINEL_PAYMENT_IDS = new Set([
  "membership_entitlement",
  "membership",
  "entitlement",
]);

function isSentinelPaymentId(paymentId) {
  if (paymentId == null || paymentId === "") return false;
  return SENTINEL_PAYMENT_IDS.has(String(paymentId).trim().toLowerCase());
}

/**
 * Membership consultation via EntitlementEngine only.
 * canAccess → remainingUsage → reserve/commit inside bookConsultation().
 */
async function runMembershipConsultationBooking(req, res, body, source) {
  const userId = req.user?.id || req.user?._id || null;
  if (!userId) {
    return res.status(401).json({
      message: "Please log in to use membership credits or continue booking.",
      code: "LOGIN_REQUIRED",
    });
  }

  const student = await Student.findById(userId);
  if (!student) {
    return res.status(401).json({
      message: "User not found. Membership is available for student accounts.",
      code: "LOGIN_REQUIRED",
    });
  }

  const lifecycle = await applyLifecycleToUser(student, { persist: true });
  const plan =
    lifecycle.isAccessAllowed && lifecycle.planId && lifecycle.planId !== "free"
      ? await MembershipPlan.findOne({ planId: lifecycle.planId, isActive: true })
      : null;

  const access = await canAccess("consultation", {
    student,
    membership: student.membership,
    lifecycle,
    plan,
    checkUsage: true,
  });

  if (!access.allowed) {
    return res.status(403).json({
      message: access.reason || "No consultation credits remaining.",
      code: "NO_CREDITS",
      planId: lifecycle.planId,
      remaining: access.remaining ?? 0,
    });
  }

  const usage = await remainingUsage("consultation", {
    student,
    membership: student.membership,
    lifecycle,
    plan,
  });

  if (!usage.unlimited && (!usage.knownUsage || usage.remaining <= 0)) {
    return res.status(403).json({
      message: usage.reason || "No consultation credits remaining.",
      code: "NO_CREDITS",
      remaining: usage.remaining ?? 0,
    });
  }

  // JWT userId is the only identity — never trust body.userId for credits.
  const result = await bookConsultation({
    ...body,
    path: "membership",
    source,
    userId,
    userEmail: body.userEmail || student.email,
    userName: body.userName || student.name,
    userPhone: body.userPhone || student.mobile || student.phone,
    // Strip sentinel / client payment claims for membership path
    paymentId: null,
    isFreeBooking: false,
  });
  return res.status(result.status).json(result.body);
}

/**
 * POST /api/bookings/book-consultant
 * Membership entitlement path (auth + requireMembership + entitlement middleware).
 * userId always from JWT.
 */
exports.bookConsultant = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", code: "LOGIN_REQUIRED" });
    }
    const result = await bookConsultation({
      ...req.body,
      path: "membership",
      source: "book-consultant",
      userId,
    });
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error("❌ Booking error:", err.message);
    return res
      .status(500)
      .json({ message: "Server error. Could not complete booking." });
  }
};

/**
 * POST /api/bookings/book-session
 * Legacy compatibility wrapper → bookConsultation() only.
 * Sentinels are NOT entitlement proof — rewritten to membership engine path.
 */
exports.bookCounsellingSession = async (req, res) => {
  try {
    const body = { ...(req.body || {}) };

    // P0-1: never accept sentinel as paid entitlement proof
    if (isSentinelPaymentId(body.paymentId)) {
      body.paymentId = null;
      body.isFreeBooking = false;
      body.path = "membership";
      return runMembershipConsultationBooking(req, res, body, "book-session");
    }

    if (body.path === "membership" || body.bookingPath === "membership") {
      return runMembershipConsultationBooking(req, res, body, "book-session");
    }

    if (body.isFreeBooking) {
      const result = await bookConsultation({
        ...body,
        path: "free",
        source: "book-session",
      });
      return res.status(result.status).json(result.body);
    }

    if (body.paymentId) {
      const result = await bookConsultation({
        ...body,
        path: "paid",
        source: "book-session",
        // paid path always requires verified consultation ledger
        requireConsultationPayment: true,
      });
      return res.status(result.status).json(result.body);
    }

    // No free flag, no payment → membership if authenticated, else login
    const userId = req.user?.id || req.user?._id;
    if (userId) {
      return runMembershipConsultationBooking(req, res, body, "book-session");
    }

    return res.status(401).json({
      message: "Please log in to book a consultation.",
      code: "LOGIN_REQUIRED",
    });
  } catch (err) {
    console.error("❌ bookCounsellingSession Error:", err);
    return res
      .status(500)
      .json({ message: "Error completing session booking" });
  }
};

/**
 * POST /api/bookings/book-consultation
 * Unified entry → bookConsultation() only.
 */
exports.bookConsultationEntry = async (req, res) => {
  try {
    const body = { ...(req.body || {}) };
    let path = body.path || body.bookingPath || null;
    const userId = req.user?.id || req.user?._id || null;

    // Never treat sentinel as paid
    if (isSentinelPaymentId(body.paymentId)) {
      body.paymentId = null;
      path = "membership";
    }

    if (!path) {
      if (body.isFreeBooking && !body.paymentId) path = "free";
      else if (body.paymentId) path = "paid";
    }

    if (
      path === "membership" ||
      (!path && userId && !body.paymentId && !body.isFreeBooking)
    ) {
      return runMembershipConsultationBooking(
        req,
        res,
        body,
        "book-consultation"
      );
    }

    if (!path) {
      if (!userId) {
        return res.status(401).json({
          message: "Please log in to continue booking.",
          code: "LOGIN_REQUIRED",
        });
      }
      return res.status(402).json({
        message: "Payment required to complete booking.",
        code: "PAYMENT_REQUIRED",
      });
    }

    if (path === "paid" && !body.paymentId) {
      return res.status(400).json({
        message: "Payment required to complete booking.",
        code: "PAYMENT_REQUIRED",
      });
    }

    if (path === "free" || path === "paid") {
      const result = await bookConsultation({
        ...body,
        path,
        source: "book-consultation",
        requireConsultationPayment: path === "paid",
      });
      return res.status(result.status).json(result.body);
    }

    return res.status(400).json({
      message: "Unknown consultation booking path.",
      code: "UNKNOWN_PATH",
    });
  } catch (err) {
    console.error("❌ bookConsultationEntry Error:", err);
    return res.status(500).json({
      message: "Server error. Could not complete booking.",
    });
  }
};

/* =========================
   GET BOOKED SLOTS
 ========================= */
exports.getBookedSlots = async (req, res) => {
  try {
    const { consultantId, date } = req.query;
    if (!consultantId || !date) {
      return res.status(400).json({ message: 'Missing consultantId or date' });
    }

    console.log(`🔍 [Consultant Slots] Fetching for: ${consultantId} on ${date}`);
    const bookings = await Booking.find({ consultantId, date });
    const bookedTimes = bookings.map(b => b.time);

    res.json({ bookedTimes });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   USER COUNSELLING HISTORY
 ========================= */
exports.getUserCounselling = async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email })
      .populate('consultantId')
      .sort({ date: -1 });

    const enrichedBookings = await Promise.all(bookings.map(async (b) => {
      const bookingObj = b.toObject();
      // Ensure student name is there (fetch from Student if missing in booking)
      if (!bookingObj.userName) {
        const user = await Student.findOne({ email: req.params.email });
        bookingObj.userName = user?.name || "Student";
      }
      return bookingObj;
    }));

    res.json({ bookings: enrichedBookings });
  } catch (error) {
    console.error('Error in getUserCounselling:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   GET USER BOOKINGS (FOR PROFILE)
 ========================= */
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email })
      .sort({ date: -1 });

    res.json(bookings); // Return array directly
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   CONSULTANTS LIST
 ========================= */
exports.getAllConsultants = async (req, res) => {
  const consultants = await Consultant.find({});
  res.json({ consultants });
};

/* =========================
   CONSULTANT BOOKINGS
 ========================= */
exports.getConsultantBookings = async (req, res) => {
  try {
    const { consultantId } = req.params;
    const { email } = req.query;

    if (!consultantId || consultantId === "undefined") {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    // Get consultant info first
    const consultant = await Consultant.findById(consultantId);
    if (!consultant) {
      return res.json([]);
    }

    const role = String(req.user?.role || "").toLowerCase();
    if (role !== "admin") {
      const actorId = String(req.user?.id || req.user?._id || "");
      const ownsById = actorId && String(consultant._id) === actorId;
      const ownsByEmail =
        req.user?.email &&
        String(consultant.email || "").toLowerCase() ===
          String(req.user.email).toLowerCase();
      if (!ownsById && !ownsByEmail) {
        return res.status(403).json({
          message: "You can only view your own consultant bookings",
          code: "FORBIDDEN",
        });
      }
    }

    const consultantVideoEnabled = consultant.videoCallEnabled || false;

    // Query bookings - match by ID or email
    let bookingsQuery = {
      $or: [
        { consultantId: consultantId },
        { consultantEmail: email }
      ]
    };

    const bookings = await Booking.find(bookingsQuery)
      .sort({ date: 1, time: 1 });

    // Auto-complete past bookings
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().substring(0, 5);

    for (const booking of bookings) {
      if (booking.status === 'booked' || booking.status === 'accepted') {
        const isPast = booking.date < todayStr ||
          (booking.date === todayStr && booking.endTime && booking.endTime < currentTime);

        if (isPast) {
          booking.status = 'completed';
          await booking.save();
        }
      }
    }

    // Enrich bookings with consultant video access info
    const enrichedBookings = bookings.map(booking => {
      const bookingObj = booking.toObject();
      bookingObj.consultantVideoEnabled = consultantVideoEnabled;
      return bookingObj;
    });

    res.json(enrichedBookings);
  } catch (err) {
    console.error("❌ [Dashboard] Error:", err.message);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};


/* =========================
   ACCEPT BOOKING (EMAIL)
 ========================= */
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "accepted";
    await booking.save();

    const user = await Student.findOne({ email: booking.userEmail });

    await sendEmail(
      booking.userEmail,
      "✅ Appointment Accepted",
      "",
      `<p>Hello ${user?.name || "User"}, your booking is accepted.</p>`
    );

    res.json({ message: "Booking accepted and email sent", booking });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   REJECT BOOKING (EMAIL)
 ========================= */
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "rejected";
    await booking.save();

    const user = await Student.findOne({ email: booking.userEmail });

    await sendEmail(
      booking.userEmail,
      "❌ Appointment Rejected",
      "",
      `<p>Hello ${user?.name || "User"}, your booking was rejected.</p>`
    );

    res.json({ message: "Booking rejected and email sent", booking });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   SEED DUMMY CONSULTANTS
========================= */
exports.seedConsultants = async (req, res) => {
  try {
    // If user is authenticated, use their real ID. 
    // Otherwise check body for a userId (helpful for testing via Postman)
    const creatorId = req.user?.id || req.body.userId || "64b0f1a2c3d4e5f6a7b8c9d0";

    const dummyConsultants = [
      {
        name: "Dr. Aryan Sharma",
        email: req.user?.email || "aryan@example.com",
        role: "Senior Career Pathologist",
        expertise: "Science & Engineering",
        experience: "10+ Years",
        bio: "Expert in helping students find their passion in STEM fields with a proven track record of successful placements.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        price: 0,
        isPremium: false,
        user: creatorId
      },
      {
        name: "Ms. Priya Varma",
        email: req.user?.email || "priya@example.com",
        role: "Academic Counselor",
        expertise: "Arts & Humanities",
        experience: "8 Years",
        bio: "Specializes in creative fields and helps students build portfolios for top design and arts colleges.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        price: 500,
        isPremium: true,
        user: creatorId
      },
      {
        name: "Personal Counselor",
        email: req.user?.email || "mentor@example.com",
        role: "Premium Mentor",
        expertise: "Holistic Guidance",
        experience: "15 Years",
        bio: "One-on-one personal guidance for high-achievers. Available only for premium subscribers.",
        image: "https://randomuser.me/api/portraits/men/85.jpg",
        price: 1500,
        isPremium: true,
        user: creatorId
      }
    ];

    // Warning: This is a simple seeding for demo, in production use a script
    for (const consultant of dummyConsultants) {
      const exists = await Consultant.findOne({ name: consultant.name });
      if (!exists) {
        await Consultant.create(consultant);
      }
    }

    res.json({ message: "Consultants seeded successfully" });
  } catch (err) {
    console.error("❌ Seeding error:", err.message);
    res.status(500).json({ message: "Seeding failed" });
  }
};

/* =========================
   DELETE BOOKING (admin) — soft-cancel via credit policy (no silent hard-delete)
========================= */
exports.deleteBooking = async (req, res) => {
  try {
    // Production-safe: never hard-delete credit-bearing bookings without restore.
    // Admin delete → same cancel + credit restore path as PUT /cancel/:id.
    const actor = {
      id: req.user?.id || req.user?._id,
      _id: req.user?._id || req.user?.id,
      role: req.user?.role || "admin",
      email: req.user?.email,
    };
    const result = await cancelBookingWithCreditPolicy(req.params.id, {
      actor,
      student: null,
    });
    return res.status(result.status).json({
      ...result.body,
      message:
        result.body?.message ||
        "Booking cancelled (delete maps to credit-safe cancel)",
      deleted: false,
      softCancelled: true,
    });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ================ CANCEL BOOKING (Phase 5 credit policy) ==================
// Admin: any booking. Student: own booking only.
// Shared restore path — membership credit restored at most once (race-safe).
// Completed / post-session: no credit restore.

exports.cancelBooking = async (req, res) => {
  try {
    const actor = req.user
      ? {
          id: req.user.id || req.user._id,
          _id: req.user._id || req.user.id,
          role: req.user.role,
          email: req.user.email,
        }
      : null;

    // Load student profile for ownership checks (email match).
    let student = null;
    if (actor && String(actor.role || "").toLowerCase() !== "admin") {
      student = await Student.findById(actor.id || actor._id);
      if (student && !actor.email) {
        actor.email = student.email;
      }
    }

    const result = await cancelBookingWithCreditPolicy(req.params.id, {
      actor,
      student,
    });
    console.log(
      `❌ Booking ${req.params.id} cancel by ${result.body?.cancelledByRole || "unknown"} → ${result.body?.message}` +
        (result.body?.creditRestored ? " [credit restored]" : "")
    );
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error("❌ Cancel error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ==============================================================================
   COUNSELLING SESSION LOGIC (Added to resolve TypeError crash)
============================================================================== */

/**
 * 📅 Get Available Slots for a specific Date (Weekly Schedule Based)
 * Uses WeeklySchedule model to generate slots automatically
 */
/**
 * GET AVAILABLE SLOTS FOR DATE (User-facing)
 * GET /api/bookings/available-slots?date=2025-04-15
 * Generates individual bookable slots based on weekly schedule time ranges
 */
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const WeeklySchedule = require("../models/WeeklySchedule");

    // Get day of week from selected date
    // Using T12:00:00 avoids timezone shifts when parsing YYYY-MM-DD
    const dateObj = new Date(date + "T12:00:00");
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayOfWeek = dayNames[dateObj.getDay()];

    // Get active weekly schedule
    const schedule = await WeeklySchedule.findOne({ isActive: true });

    if (!schedule) {
      return res.json({
        slots: [],
        message: "No schedule configured. Admin needs to set up weekly schedule.",
      });
    }

    // Find schedule for the selected day
    const daySchedule = schedule.schedule.find(
      (d) => d.dayOfWeek === dayOfWeek
    );

    if (!daySchedule || !daySchedule.isEnabled) {
      return res.json({
        slots: [],
        message: `No slots available on ${dayOfWeek}s`,
      });
    }

    // -------------------------------------------------------------
    // Get current date/time in Indian Standard Time (IST)
    // -------------------------------------------------------------
    const now = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

    const todayStr =
      `${now.getFullYear()}-` +
      `${String(now.getMonth() + 1).padStart(2, "0")}-` +
      `${String(now.getDate()).padStart(2, "0")}`;

    const currentTime =
      `${String(now.getHours()).padStart(2, "0")}:` +
      `${String(now.getMinutes()).padStart(2, "0")}`;

    // Helper: Convert HH:mm to minutes since midnight
    const timeToMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    // Helper: Convert minutes since midnight to HH:mm
    const minutesToTime = (mins) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    // Generate bookable slots
    const allSlots = [];

    for (const timeRange of daySchedule.timeSlots) {
      if (!timeRange.isActive) continue;

      const startMins = timeToMinutes(timeRange.startTime);
      const endMins = timeToMinutes(timeRange.endTime);
      const duration = timeRange.duration || 60;

      // Generate slots within this time range
      for (
        let slotStart = startMins;
        slotStart + duration <= endMins;
        slotStart += duration
      ) {
        const slotEnd = slotStart + duration;
        const slotStartTime = minutesToTime(slotStart);
        const slotEndTime = minutesToTime(slotEnd);

        // Check if already booked
        const existingBooking = await Booking.findOne({
          date,
          time: slotStartTime,
          bookingType: "counselling",
          status: "booked",
        });

        // Check if slot is in the past (for today's date only)
        const isPast =
          date === todayStr && slotStartTime < currentTime;

        const isBooked = !!existingBooking;
        const isAvailable = !isPast && !isBooked;

        allSlots.push({
          time: slotStartTime,
          endTime: slotEndTime,
          duration,
          available: isAvailable,
          booked: isBooked,
          past: isPast,
        });
      }
    }

    // Sort slots by time
    allSlots.sort((a, b) => a.time.localeCompare(b.time));

    console.log(
      `✅ Generated ${allSlots.length} slots for ${dayOfWeek} ${date} (IST now: ${todayStr} ${currentTime})`
    );

    res.json({ slots: allSlots });
  } catch (err) {
    console.error("❌ getAvailableSlots Error:", err);
    res.status(500).json({ message: "Error fetching slots" });
  }
};

/**
 * 🔍 Get details of a single Counselling Session
 */
exports.getCounsellingSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Booking.findOne({ sessionId })
      .populate('consultantId', 'videoCallEnabled name email');

    if (!session) return res.status(404).json({ message: "Session not found" });

    const sessionObj = session.toObject();

    // Add videoCallEnabled from populated consultant
    if (session.consultantId && typeof session.consultantId === 'object') {
      sessionObj.consultantVideoEnabled = session.consultantId.videoCallEnabled || false;
    } else {
      sessionObj.consultantVideoEnabled = false;
    }

    res.json(sessionObj);
  } catch (err) {
    res.status(500).json({ message: "Error fetching session details" });
  }
};

/* =========================
   GET BOOKINGS BY CONSULTANT EMAIL
   GET /api/bookings/by-email?email=...
   Used by the consultant dashboard when the Mongo _id is not available.
 ========================= */
exports.getBookingsByConsultantEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'email query param is required' });
    }

    const emailLower = String(email).trim().toLowerCase();
    const role = String(req.user?.role || "").toLowerCase();
    const Consultant = require("../models/Consultant");
    if (role !== "admin") {
      const me =
        (role === "consultant"
          ? await Consultant.findById(req.user?.id || req.user?._id)
          : null) ||
        (req.user?.email
          ? await Consultant.findOne({
              email: String(req.user.email).trim().toLowerCase(),
            })
          : null);
      const myEmail = String(me?.email || req.user?.email || "")
        .trim()
        .toLowerCase();
      if (!myEmail || myEmail !== emailLower) {
        return res.status(403).json({
          message: "You can only view your own consultant bookings",
          code: "FORBIDDEN",
        });
      }
    }

    // Get consultant info by email
    const consultant = await Consultant.findOne({ email: email });
    const consultantVideoEnabled = consultant?.videoCallEnabled || false;

    const bookings = await Booking.find({ consultantEmail: email })
      .sort({ date: 1, time: 1 });

    // Enrich bookings with consultant video access info
    const enrichedBookings = bookings.map(booking => {
      const bookingObj = booking.toObject();
      bookingObj.consultantVideoEnabled = consultantVideoEnabled;
      return bookingObj;
    });

    console.log(`📋 [ByEmail] Found ${bookings.length} bookings for consultant: ${email} with videoEnabled: ${consultantVideoEnabled}`);
    res.json(enrichedBookings);
  } catch (err) {
    console.error('❌ getBookingsByConsultantEmail error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   COMPLETE BOOKING
   PUT /api/bookings/:id/complete
   Marks a booking as completed (moves to history).
   Race-safe: never completes cancelled bookings (would skip credit restore incorrectly).
 ========================= */
exports.completeBooking = async (req, res) => {
  try {
    const existing = await Booking.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (existing.status === "completed") {
      return res.json(existing);
    }
    if (existing.status === "cancelled") {
      return res.status(409).json({
        message: "Cancelled bookings cannot be completed.",
        code: "ALREADY_CANCELLED",
      });
    }

    // Atomic: only pending/accepted/booked → completed (never cancelled).
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        status: { $in: ["pending", "accepted", "booked"] },
      },
      { $set: { status: "completed" } },
      { new: true }
    );

    if (!booking) {
      const latest = await Booking.findById(req.params.id);
      if (latest?.status === "completed") return res.json(latest);
      if (latest?.status === "cancelled") {
        return res.status(409).json({
          message: "Cancelled bookings cannot be completed.",
          code: "ALREADY_CANCELLED",
        });
      }
      return res.status(409).json({
        message: "Booking cannot be completed in its current state.",
        code: "INVALID_STATE",
      });
    }

    console.log(`✅ Booking ${req.params.id} marked as completed`);
    res.json(booking);
  } catch (err) {
    console.error("❌ completeBooking error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL BOOKINGS (Admin)
   GET /api/bookings?bookingType=counselling&status=booked
   Fetch all bookings with optional filters for admin dashboard
 ========================= */
exports.getAllBookings = async (req, res) => {
  try {
    const { bookingType, status } = req.query;
    const query = {};

    if (bookingType) {
      query.bookingType = bookingType;
    }

    if (status) {
      // Support comma-separated statuses: ?status=booked,completed
      const statuses = status.split(',');
      query.status = { $in: statuses };
    }

    const bookings = await Booking.find(query)
      .sort({ date: -1, time: -1 });

    console.log(`📋 [Admin] Found ${bookings.length} bookings with filters:`, query);
    res.json({ bookings });
  } catch (err) {
    console.error('❌ getAllBookings error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   CHECK FREE BOOKING ELIGIBILITY
   GET /api/bookings/free-eligibility?email=user@example.com
========================= */
exports.checkFreeBookingEligibility = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const emailLower = email.toLowerCase().trim();
    const existing = await findUserByEmail(emailLower);

    if (!existing) {
      return res.json({
        eligible: true,
        isNewUser: true,
        message: "New users get their first session FREE!"
      });
    }

    if (existing.role !== "student") {
      return res.json({
        eligible: false,
        isNewUser: false,
        hasUsedFreeBooking: true,
        message: "Free sessions are available for student accounts."
      });
    }

    const hasUsedFree = existing.user.profile?.hasUsedFreeBooking || false;

    res.json({
      eligible: !hasUsedFree,
      isNewUser: false,
      hasUsedFreeBooking: hasUsedFree,
      message: hasUsedFree
        ? "You've already used your free session"
        : "You're eligible for one FREE session!"
    });
  } catch (err) {
    console.error("checkFreeBookingEligibility Error:", err);
    res.status(500).json({ error: "Failed to check eligibility" });
  }
};

/* =========================
   SEND OTP FOR BOOKING (Mobile Verification)
   POST /api/bookings/send-booking-otp
========================= */
exports.sendBookingOtp = async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    const emailLower = email ? String(email).toLowerCase().trim() : "";
    const mobileClean = String(mobile).trim();

    if (!mobileClean) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    const existingEmail = emailLower ? await findUserByEmail(emailLower) : null;
    const existingMobile = await findUserByMobile(mobileClean);

    if (existingEmail || existingMobile) {
      return res.status(409).json({
        code: "LOGIN_REQUIRED",
        error: "An account already exists with this email or phone number. Please log in instead."
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const { getBookingOtpStore } = require("../utils/otpStore");
    const bookingOtpStore = getBookingOtpStore();

    bookingOtpStore.set(mobileClean, { otp, expiresAt, verified: false });

    console.log(`Booking OTP for ${mobileClean}: ${otp}`);

    const { sendSMSOTP } = require("../utils/otpsms");
    const smsResult = await sendSMSOTP(mobileClean, otp);

    if (!smsResult.success) {
      bookingOtpStore.delete(mobileClean);
      return res.status(500).json({ error: smsResult.message || "Failed to send OTP" });
    }

    res.json({
      message: "OTP sent successfully to your mobile",
      expiresIn: 600
    });
  } catch (err) {
    console.error("sendBookingOtp Error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

/* =========================
   VERIFY OTP FOR BOOKING
   POST /api/bookings/verify-booking-otp
========================= */
exports.verifyBookingOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ error: "Mobile and OTP are required" });
    }

    const mobileClean = String(mobile).trim();
    const { getBookingOtpStore } = require("../utils/otpStore");
    const bookingOtpStore = getBookingOtpStore();

    const storedData = bookingOtpStore.get(mobileClean);

    if (!storedData) {
      return res.status(400).json({ error: "OTP not found. Please request a new one." });
    }

    if (storedData.otp.toString() !== otp.toString()) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    if (Date.now() > storedData.expiresAt) {
      bookingOtpStore.delete(mobileClean);
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    storedData.verified = true;
    bookingOtpStore.set(mobileClean, storedData);

    res.json({
      message: "Mobile number verified successfully",
      verified: true
    });
  } catch (err) {
    console.error("verifyBookingOtp Error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

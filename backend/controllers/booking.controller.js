const Booking = require("../models/Booking");
const Consultant = require("../models/Consultant");
const Student = require("../models/Student");

// const transporter = require("../utils/transporter"); // nodemailer instance
const sendEmail = require("../utils/sendEmail"); // used in bookConsultant
const crypto = require("crypto");
const { randomUUID } = require("crypto");
const { findUserByEmail, findUserByMobile } = require("../utils/userHelper");

const SECRET_KEY =
  process.env.MEETING_SECRET_KEY || "careergenai-meeting-secret-2024";

const generateMeetingId = (sessionId) => {
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(sessionId.toString());
  const hash = hmac.digest("hex");
  return hash.substring(0, 12).toUpperCase();
};

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* =========================
   BOOK CONSULTANT
 ========================= */
exports.bookConsultant = async (req, res) => {
  try {
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
      userPlan,
    } = req.body;

    console.log(
      `📡 [Booking] Request: ${req.body.date} ${req.body.time} for ID: ${consultantId}`,
    );

    if (!consultantId || !date || !time || !userEmail || !userPhone) {
      return res.status(400).json({ message: "Missing required data" });
    }

    // Fetch consultant info if missing (Stronger Fetch)
    const consultant = await Consultant.findById(consultantId);
    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    if (!consultantEmail || !consultantName) {
      consultantEmail = consultantEmail || consultant.email;
      consultantName = consultantName || consultant.name;
    }

    if (!consultantEmail) {
      return res.status(400).json({ message: "Consultant email not found" });
    }

    if (consultantType === "Premium" && userPlan !== "Premium") {
      return res.status(403).json({
        message: "This counselor is available only for Premium Users.",
      });
    }

    if (userPlan !== "Premium") {
      const todayBooking = await Booking.findOne({ userEmail, date });
      if (todayBooking) {
        return res.status(403).json({
          message: "Free users can book only 1 consultation per day.",
        });
      }
    }

    const alreadyBooked = await Booking.findOne({ consultantId, date, time });
    if (alreadyBooked) {
      console.warn(
        `🚫 [Booking] Conflict found: ${date} ${time} for consultant ${consultantId}`,
      );
      return res.status(400).json({ message: "Slot already booked" });
    }

    // Generate deterministic meeting ID
    const meetingId = generateMeetingId(
      `${consultantId}-${date}-${time}-${userEmail}`,
    );

    const booking = await Booking.create({
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
      userPlan,
      meetingId,
    });

    try {
      const student = await Student.findOne({ email: userEmail });
      if (student) {
        if (!student.profile) student.profile = {};
        if (!student.profile.myBookings) student.profile.myBookings = [];
        student.profile.myBookings.push(booking._id);
        await student.save();
      }
    } catch (err) {
      console.warn("Could not link booking to student profile:", err.message);
    }

    try {
      await sendEmail(
        userEmail,
        "Your CareerGenAI Consultation is Confirmed",
        "",
        `<p>Your appointment with <b>${consultantName}</b> is confirmed.</p>
             <p>Date: <b>${date}</b></p>
             <p>Time: <b>${time}</b></p>
             <p>Meeting ID: <b>${meetingId}</b></p>`,
      );

      await sendEmail(
        consultantEmail,
        "New Consultation Booking",
        "",
        `<p>You have a new booking from <b>${userName}</b>.</p>`,
      );

      await sendEmail(
        process.env.ADMIN_NOTIFY_TO || "iec.aryahs@gmail.com",
        "New Consultation Booking (Admin Copy)",
        "",
        `<p>User: ${userName} (${userEmail})</p><p>Mentor: ${consultantName}</p>`,
      );
    } catch (emailErr) {
      console.warn(
        "⚠️ Email notification failed, but booking was successful:",
        emailErr.message,
      );
    }

    res.json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("❌ Booking error:", err.message);
    res
      .status(500)
      .json({ message: "Server error. Could not complete booking." });
  }
};

/* =========================
   GET BOOKED SLOTS
 ========================= */
exports.getBookedSlots = async (req, res) => {
  try {
    const { consultantId, date } = req.query;
    if (!consultantId || !date) {
      return res.status(400).json({ message: "Missing consultantId or date" });
    }

    console.log(
      `🔍 [Consultant Slots] Fetching for: ${consultantId} on ${date}`,
    );
    const bookings = await Booking.find({ consultantId, date });
    const bookedTimes = bookings.map((b) => b.time);

    res.json({ bookedTimes });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   USER COUNSELLING HISTORY
 ========================= */
exports.getUserCounselling = async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email })
      .populate("consultantId")
      .sort({ date: -1 });

    const enrichedBookings = await Promise.all(
      bookings.map(async (b) => {
        const bookingObj = b.toObject();
        // Ensure student name is there (fetch from Student if missing in booking)
        if (!bookingObj.userName) {
          const user = await Student.findOne({ email: req.params.email });
          bookingObj.userName = user?.name || "Student";
        }
        return bookingObj;
      }),
    );

    res.json({ bookings: enrichedBookings });
  } catch (error) {
    console.error("Error in getUserCounselling:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET USER BOOKINGS (FOR PROFILE)
 ========================= */
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email }).sort({
      date: -1,
    });

    res.json(bookings); // Return array directly
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Server error" });
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

    const consultantVideoEnabled = consultant.videoCallEnabled || false;

    // Query bookings - match by ID or email
    let bookingsQuery = {
      $or: [{ consultantId: consultantId }, { consultantEmail: email }],
    };

    const bookings = await Booking.find(bookingsQuery).sort({
      date: 1,
      time: 1,
    });

    // Auto-complete past bookings
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().substring(0, 5);

    for (const booking of bookings) {
      if (booking.status === "booked" || booking.status === "accepted") {
        const isPast =
          booking.date < todayStr ||
          (booking.date === todayStr &&
            booking.endTime &&
            booking.endTime < currentTime);

        if (isPast) {
          booking.status = "completed";
          await booking.save();
        }
      }
    }

    // Enrich bookings with consultant video access info
    const enrichedBookings = bookings.map((booking) => {
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
      `<p>Hello ${user?.name || "User"}, your booking is accepted.</p>`,
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
      `<p>Hello ${user?.name || "User"}, your booking was rejected.</p>`,
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
    const creatorId =
      req.user?.id || req.body.userId || "64b0f1a2c3d4e5f6a7b8c9d0";

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
        user: creatorId,
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
        user: creatorId,
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
        user: creatorId,
      },
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
   DELETE BOOKING
========================= */
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking successfully removed", id: req.params.id });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ================ DELETE BOOKING ==================================

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log(`❌ Booking ${req.params.id} cancelled`);
    res.json({ message: "Booking cancelled", booking });
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
        message:
          "No schedule configured. Admin needs to set up weekly schedule.",
      });
    }

    // Find schedule for the selected day
    const daySchedule = schedule.schedule.find(
      (d) => d.dayOfWeek === dayOfWeek,
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
      }),
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
        const isPast = date === todayStr && slotStartTime < currentTime;

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
      `✅ Generated ${allSlots.length} slots for ${dayOfWeek} ${date} (IST now: ${todayStr} ${currentTime})`,
    );

    res.json({ slots: allSlots });
  } catch (err) {
    console.error("❌ getAvailableSlots Error:", err);
    res.status(500).json({ message: "Error fetching slots" });
  }
};

/**
 * 🚀 Book a private Counselling Session (Admin-Only Simplified)
 */
exports.bookCounsellingSession = async (req, res) => {
  try {
    const {
      date,
      time,
      userEmail,
      userName,
      userPhone,
      paymentId,
      amount,
      isFreeBooking,
      paymentSource,
      platform,
      appleTransactionId,
      appleProductId,
    } = req.body;

    if (!date || !time || !userEmail || !userPhone) {
      return res.status(400).json({
        message: "Missing required booking details (date, time, email, phone)",
      });
    }

    const emailLower = userEmail.toLowerCase().trim();
    const phoneClean = userPhone.trim();

    // Check if slot already taken (counselling sessions only)
    const existing = await Booking.findOne({
      date,
      time,
      bookingType: "counselling",
      status: "booked",
    });
    if (existing) {
      return res.status(400).json({
        message: "This slot has already been booked. Please pick another one.",
      });
    }

    let student = await Student.findOne({ email: emailLower });
    let isActuallyFree = false;

    if (isFreeBooking) {
      const existingAccount = await findUserByEmail(emailLower);

      if (existingAccount && existingAccount.role !== "student") {
        return res.status(403).json({
          message: "Free sessions are available for student accounts.",
        });
      }

      if (!student) {
        return res.status(400).json({
          message:
            "Please verify your phone number before booking a free session.",
        });
      }

      if (student.profile?.hasUsedFreeBooking) {
        return res.status(403).json({
          message:
            "You've already used your free session. Please proceed with payment.",
        });
      }

      isActuallyFree = true;
    }

    const isAppleIapBooking = paymentSource === "apple_iap";
    const isRazorpayBooking = paymentSource === "razorpay";

    if (!isActuallyFree && isAppleIapBooking) {
      return res.status(400).json({
        message:
          "Apple In-App Purchase is not connected yet. Paid iOS counselling booking cannot be confirmed until real Apple purchase verification is implemented.",
      });
    }

    if (!isActuallyFree && !isRazorpayBooking && !paymentId) {
      return res.status(400).json({
        message: "Payment verification is required for paid bookings.",
      });
    }

    // Hardcode admin as session counsellor
    const finalConsultantName = "Admin";
    const finalConsultantEmail =
      process.env.ADMIN_EMAIL || "iec.aryahs@gmail.com";

    // Generate session & meeting identifiers
    const sessionId = randomUUID();
    const meetingId = generateMeetingId(`${sessionId}-${emailLower}`);
    const endH = parseInt(time.split(":")[0]) + 1;
    const endTime = `${String(endH).padStart(2, "0")}:00`;

    const newBooking = new Booking({
      bookingType: "counselling",
      consultantId: null, // No specific consultant assigned
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
      paymentId: isActuallyFree ? null : paymentId || null,
      paymentSource: isActuallyFree ? "free" : paymentSource || "razorpay",
      appleTransactionId: appleTransactionId || null,
      appleProductId: appleProductId || null,
      platform: platform || "web",
      isPaid: isActuallyFree ? true : !!paymentId,
      isFreeBooking: isActuallyFree,
      amountPaid: isActuallyFree ? 0 : amount || 599,
    });

    await newBooking.save();

    try {
      if (student) {
        if (!student.profile) student.profile = {};
        if (!student.profile.mySessions) student.profile.mySessions = [];
        student.profile.mySessions.push(newBooking._id);
        if (isActuallyFree) {
          student.profile.hasUsedFreeBooking = true;
          student.profile.freeBookingUsedAt = new Date();
          console.log(`Free booking marked for: ${emailLower}`);
        }
        await student.save();
      }
    } catch (err) {
      console.warn(
        "Could not link session mapping to student profile:",
        err.message,
      );
    }

    // Notify student
    try {
      await sendEmail(
        emailLower,
        "✅ Counselling Session Confirmed",
        "",
        `<p>Hi ${userName || "Student"},</p>
             <p>Your counselling session with Admin is confirmed for <b>${date}</b> at <b>${time}</b>.</p>
             <p>Meeting ID: <b>${meetingId}</b></p>
             <p>Session ID: <b>${sessionId}</b></p>`,
      );
    } catch (e) {
      console.warn("Email notify failed during session booking", e.message);
    }

    // Optional: Notify admin
    try {
      await sendEmail(
        finalConsultantEmail,
        "🔔 New Counselling Session Booked",
        "",
        `<p>New counselling session booked by <b>${userName || emailLower}</b>.</p>
             <p>Date: <b>${date}</b> at <b>${time}</b></p>
             <p>Meeting ID: <b>${meetingId}</b></p>`,
      );
    } catch (e) {
      console.warn("Admin notification failed", e.message);
    }

    res.status(201).json({
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
  } catch (err) {
    console.error("❌ bookCounsellingSession Error:", err);
    res.status(500).json({ message: "Error completing session booking" });
  }
};

/**
 * 🔍 Get details of a single Counselling Session
 */
exports.getCounsellingSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Booking.findOne({ sessionId }).populate(
      "consultantId",
      "videoCallEnabled name email",
    );

    if (!session) return res.status(404).json({ message: "Session not found" });

    const sessionObj = session.toObject();

    // Add videoCallEnabled from populated consultant
    if (session.consultantId && typeof session.consultantId === "object") {
      sessionObj.consultantVideoEnabled =
        session.consultantId.videoCallEnabled || false;
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
      return res.status(400).json({ message: "email query param is required" });
    }

    // Get consultant info by email
    const consultant = await Consultant.findOne({ email: email });
    const consultantVideoEnabled = consultant?.videoCallEnabled || false;

    const bookings = await Booking.find({ consultantEmail: email }).sort({
      date: 1,
      time: 1,
    });

    // Enrich bookings with consultant video access info
    const enrichedBookings = bookings.map((booking) => {
      const bookingObj = booking.toObject();
      bookingObj.consultantVideoEnabled = consultantVideoEnabled;
      return bookingObj;
    });

    console.log(
      `📋 [ByEmail] Found ${bookings.length} bookings for consultant: ${email} with videoEnabled: ${consultantVideoEnabled}`,
    );
    res.json(enrichedBookings);
  } catch (err) {
    console.error("❌ getBookingsByConsultantEmail error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   COMPLETE BOOKING
   PUT /api/bookings/:id/complete
   Marks a booking as completed (moves to history).
 ========================= */
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true },
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
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
      const statuses = status.split(",");
      query.status = { $in: statuses };
    }

    const bookings = await Booking.find(query).sort({ date: -1, time: -1 });

    console.log(
      `📋 [Admin] Found ${bookings.length} bookings with filters:`,
      query,
    );
    res.json({ bookings });
  } catch (err) {
    console.error("❌ getAllBookings error:", err.message);
    res.status(500).json({ message: "Server error" });
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
        message: "New users get their first session FREE!",
      });
    }

    if (existing.role !== "student") {
      return res.json({
        eligible: false,
        isNewUser: false,
        hasUsedFreeBooking: true,
        message: "Free sessions are available for student accounts.",
      });
    }

    const hasUsedFree = existing.user.profile?.hasUsedFreeBooking || false;

    res.json({
      eligible: !hasUsedFree,
      isNewUser: false,
      hasUsedFreeBooking: hasUsedFree,
      message: hasUsedFree
        ? "You've already used your free session"
        : "You're eligible for one FREE session!",
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
        error:
          "An account already exists with this email or phone number. Please log in instead.",
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
      return res
        .status(500)
        .json({ error: smsResult.message || "Failed to send OTP" });
    }

    res.json({
      message: "OTP sent successfully to your mobile",
      expiresIn: 600,
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
      return res
        .status(400)
        .json({ error: "OTP not found. Please request a new one." });
    }

    if (storedData.otp.toString() !== otp.toString()) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    if (Date.now() > storedData.expiresAt) {
      bookingOtpStore.delete(mobileClean);
      return res
        .status(400)
        .json({ error: "OTP has expired. Please request a new one." });
    }

    storedData.verified = true;
    bookingOtpStore.set(mobileClean, storedData);

    res.json({
      message: "Mobile number verified successfully",
      verified: true,
    });
  } catch (err) {
    console.error("verifyBookingOtp Error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

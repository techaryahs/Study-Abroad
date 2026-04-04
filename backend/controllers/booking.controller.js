const Booking = require("../models/Booking");
const Consultant = require("../models/Consultant");
const Student = require("../models/Student");

// const transporter = require("../utils/transporter"); // nodemailer instance
const sendEmail = require("../utils/sendEmail");     // used in bookConsultant
const crypto = require('crypto');
const { randomUUID } = require('crypto');

const SECRET_KEY = process.env.MEETING_SECRET_KEY || 'careergenai-meeting-secret-2024';

const generateMeetingId = (sessionId) => {
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(sessionId.toString());
  const hash = hmac.digest('hex');
  return hash.substring(0, 12).toUpperCase();
};

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
      userPlan
    } = req.body;

    console.log(`📡 [Booking] Request: ${req.body.date} ${req.body.time} for ID: ${consultantId}`);

    if (!consultantId || !date || !time || !userEmail || !userPhone) {
      return res.status(400).json({ message: 'Missing required data' });
    }

    // Fetch consultant info if missing (Stronger Fetch)
    const consultant = await Consultant.findById(consultantId);
    if (!consultant) {
      return res.status(404).json({ message: 'Consultant not found' });
    }

    if (!consultantEmail || !consultantName) {
      consultantEmail = consultantEmail || consultant.email;
      consultantName = consultantName || consultant.name;
    }
    

    if (!consultantEmail) {
      return res.status(400).json({ message: 'Consultant email not found' });
    }

    if (consultantType === "Premium" && userPlan !== "Premium") {
      return res.status(403).json({
        message: "This counselor is available only for Premium Users."
      });
    }

    if (userPlan !== "Premium") {
      const todayBooking = await Booking.findOne({ userEmail, date });
      if (todayBooking) {
        return res.status(403).json({
          message: "Free users can book only 1 consultation per day."
        });
      }
    }

    const alreadyBooked = await Booking.findOne({ consultantId, date, time });
    if (alreadyBooked) {
      console.warn(`🚫 [Booking] Conflict found: ${date} ${time} for consultant ${consultantId}`);
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // Generate deterministic meeting ID
    const meetingId = generateMeetingId(`${consultantId}-${date}-${time}-${userEmail}`);

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
      meetingId
    });

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
        process.env.ADMIN_NOTIFY_TO || "admin@careergenai.com",
        "New Consultation Booking (Admin Copy)",
        "",
        `<p>User: ${userName} (${userEmail})</p><p>Mentor: ${consultantName}</p>`
      );
    } catch (emailErr) {
      console.warn("⚠️ Email notification failed, but booking was successful:", emailErr.message);
    }

    res.json({ message: "Booking successful", booking });

  } catch (err) {
    console.error("❌ Booking error:", err.message);
    res.status(500).json({ message: "Server error. Could not complete booking." });
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
    const { consultantId } = req.params; // Document ID of the Consultant
    const { email } = req.query;
    console.log(`🔍 [Dashboard] Fetching bookings. ID: ${consultantId}, Email: ${email}`);

    if (!consultantId || consultantId === "undefined") {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    // Since consultants are now standalone, we just query by consultantId directly
    let bookingsQuery = {
      $or: [
        { consultantId: consultantId },
        { consultantEmail: email }
      ]
    };

    const bookings = await Booking.find(bookingsQuery)
      .populate('consultantId', 'videoCallEnabled name email')
      .sort({ date: 1, time: 1 });

    // Enrich bookings with consultant video access info
    const enrichedBookings = bookings.map(booking => {
      const bookingObj = booking.toObject();
      // Add videoCallEnabled from populated consultant
      if (booking.consultantId && typeof booking.consultantId === 'object') {
        bookingObj.consultantVideoEnabled = booking.consultantId.videoCallEnabled || false;
      } else {
        bookingObj.consultantVideoEnabled = false;
      }
      return bookingObj;
    });

    console.log(`📊 [Dashboard] Found ${bookings.length} bookings using query:`, JSON.stringify(bookingsQuery));
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

/* ==============================================================================
   COUNSELLING SESSION LOGIC (Added to resolve TypeError crash)
============================================================================== */

/**
 * 📅 Get Available Slots for a specific Date
 * returns 9:00 AM to 6:00 PM (1-hour slots)
 */
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date, consultantId } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    // Defined working hours: 9:00 to 18:00
    const allSlots = [];
    for (let h = 9; h < 18; h++) {
      const timeStr = `${String(h).padStart(2, "0")}:00`;
      const endTimeStr = `${String(h + 1).padStart(2, "0")}:00`;
      allSlots.push({ time: timeStr, endTime: endTimeStr });
    }

    // Find already booked sessions for this date
    // Note: for "auto-assign" (consultantId="auto"), we don't filter by consultant here yet, 
    // but in a real system we'd check if ANY consultant is free.
    const query = { date, status: { $nin: ["rejected", "cancelled"] } };
    if (consultantId && consultantId !== "auto") {
      query.consultantId = consultantId;
    }
    const bookedSessions = await Booking.find(query);
    const bookedTimes = bookedSessions.map(b => b.time);

    // Current time check for "past" slots
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const slots = allSlots.map(slot => {
      const isBooked = bookedTimes.includes(slot.time);
      const isPast = (date === todayStr && slot.time <= now.toTimeString().substring(0, 5));
      return {
        ...slot,
        booked: isBooked,
        past: isPast,
        available: !isBooked && !isPast
      };
    });

    res.json({ slots });
  } catch (err) {
    console.error("❌ getAvailableSlots Error:", err);
    res.status(500).json({ message: "Error fetching slots" });
  }
};

/**
 * 🚀 Book a private Counselling Session
 */
exports.bookCounsellingSession = async (req, res) => {
  try {
    const { date, time, userEmail, userName, consultantId } = req.body;

    if (!date || !time || !userEmail) {
      return res.status(400).json({ message: "Missing required booking details (date, time, email)" });
    }

    // Check if slot already taken
    const existing = await Booking.findOne({ date, time, status: "booked" });
    if (existing) {
      return res.status(400).json({ message: "This slot has already been booked. Please pick another one." });
    }

    // Auto-assign or use provided consultant
    let finalConsultantId = consultantId;
    let finalConsultantName = "Academic Counsellor";
    let finalConsultantEmail = "counselling@careergenai.com";
    let consultantVideoEnabled = false;

    if (consultantId && consultantId !== "auto") {
      const c = await Consultant.findById(consultantId);
      if (c) {
        finalConsultantName = c.name;
        finalConsultantEmail = c.email;
        consultantVideoEnabled = c.videoCallEnabled || false;
      }
    }

    // Generate session & meeting identifiers
    const sessionId = randomUUID();
    const meetingId = generateMeetingId(`${sessionId}-${userEmail}`);
    const endH = parseInt(time.split(":")[0]) + 1;
    const endTime = `${String(endH).padStart(2, "0")}:00`;

    const newBooking = new Booking({
      bookingType: "counselling",
      consultantId: finalConsultantId || null,
      consultantName: finalConsultantName,
      consultantEmail: finalConsultantEmail,
      date,
      time,
      endTime,
      userEmail,
      userName,
      status: "booked",
      sessionId,
      meetingId
    });

    await newBooking.save();

    // Notify student
    try {
        await sendEmail(
            userEmail,
            "✅ Counselling Session Confirmed",
            "",
            `<p>Hi ${userName || "Student"},</p>
             <p>Your counselling session is confirmed for <b>${date}</b> at <b>${time}</b>.</p>
             <p>Meeting ID: <b>${meetingId}</b></p>
             <p>Session ID: <b>${sessionId}</b></p>`
        );
    } catch (e) {
        console.warn("Email notify failed during session booking", e.message);
    }

    res.status(201).json({
      message: "Session booked successfully",
      booking: {
        sessionId,
        meetingId,
        date,
        time,
        endTime,
        consultantName: finalConsultantName,
        userEmail,
        consultantVideoEnabled
      }
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

    const bookings = await Booking.find({ consultantEmail: email })
      .populate('consultantId', 'videoCallEnabled name email')
      .sort({ date: 1, time: 1 });

    // Enrich bookings with consultant video access info
    const enrichedBookings = bookings.map(booking => {
      const bookingObj = booking.toObject();
      // Add videoCallEnabled from populated consultant
      if (booking.consultantId && typeof booking.consultantId === 'object') {
        bookingObj.consultantVideoEnabled = booking.consultantId.videoCallEnabled || false;
      } else {
        bookingObj.consultantVideoEnabled = false;
      }
      return bookingObj;
    });

    console.log(`📋 [ByEmail] Found ${bookings.length} bookings for consultant: ${email}`);
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
 ========================= */
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    console.log(`✅ Booking ${req.params.id} marked as completed`);
    res.json(booking);
  } catch (err) {
    console.error('❌ completeBooking error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

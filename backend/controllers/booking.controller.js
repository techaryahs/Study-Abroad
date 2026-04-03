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
    if (!consultantEmail || !consultantName) {
      const consultant = await Consultant.findById(consultantId);
      if (consultant) {
        consultantEmail = consultantEmail || consultant.email;
        consultantName = consultantName || consultant.name;
      }
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
      .sort({ date: 1, time: 1 });

    console.log(`📊 [Dashboard] Found ${bookings.length} bookings using query:`, JSON.stringify(bookingsQuery));
    res.json(bookings);
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
   BOOK COUNSELLING SESSION
   POST /api/bookings/book-session
 ========================= */
exports.bookCounsellingSession = async (req, res) => {
  try {
    const {
      consultantId,
      date,
      time,         // "HH:mm" start of 1-hour slot
      userEmail,
      userName,
      userPhone = ""
    } = req.body;

    if (!date || !time || !userEmail) {
      return res.status(400).json({ message: 'Missing required fields: date, time, userEmail' });
    }

    // --- Resolve counsellor ---
    let resolvedConsultantId = consultantId;
    let consultantName = "Our Counsellor";
    let consultantEmail = process.env.ADMIN_NOTIFY_TO || "admin@careergenai.com";

    if (consultantId) {
      const consultant = await Consultant.findById(consultantId);
      if (consultant) {
        consultantName = consultant.name;
        consultantEmail = consultant.email || consultantEmail;
      }
    } else {
      // Auto-assign: pick first available consultant who has no booking on this slot
      const allConsultants = await Consultant.find({});
      for (const c of allConsultants) {
        const conflict = await Booking.findOne({ consultantId: c._id, date, time });
        if (!conflict) {
          resolvedConsultantId = c._id;
          consultantName = c.name;
          consultantEmail = c.email || consultantEmail;
          break;
        }
      }
    }

    // --- Check slot conflict ---
    const conflict = await Booking.findOne({ consultantId: resolvedConsultantId, date, time });
    if (conflict) {
      return res.status(409).json({ message: 'This slot is already booked. Please choose another.' });
    }

    // --- Generate IDs ---
    const sessionId = randomUUID(); // e.g. "550e8400-e29b-41d4-a716-446655440000"
    const meetingId = generateMeetingId(`${resolvedConsultantId}-${date}-${time}-${userEmail}`);

    // --- Calculate endTime (+1 hour) ---
    const [hh, mm] = time.split(':').map(Number);
    const endHour = (hh + 1) % 24;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;

    // --- Create Booking ---
    const booking = await Booking.create({
      consultantId: resolvedConsultantId,
      consultantName,
      consultantEmail,
      bookingType: 'counselling',
      date,
      time,
      endTime,
      duration: 60,
      userEmail,
      userName: userName || userEmail.split('@')[0],
      userPhone,
      status: 'booked',
      sessionId,
      meetingId,
    });

    // --- Confirmation emails (non-blocking) ---
    try {
      await sendEmail(
        userEmail,
        '📅 Your Counselling Session is Confirmed — Study Abroad',
        '',
        `<p>Hello <b>${userName || 'there'}</b>,</p>
         <p>Your 1-hour counselling session has been confirmed.</p>
         <p><b>Date:</b> ${date}</p>
         <p><b>Time:</b> ${time} – ${endTime}</p>
         <p><b>Counsellor:</b> ${consultantName}</p>
         <p><b>Session ID:</b> ${sessionId}</p>
         <p><b>Meeting ID:</b> ${meetingId}</p>
         <p>Join your meeting at the scheduled time using the link in your dashboard.</p>`
      );
      await sendEmail(
        consultantEmail,
        'New Counselling Session Booked',
        '',
        `<p>New session booked by <b>${userName || userEmail}</b> on <b>${date}</b> at <b>${time}</b>.</p>
         <p>Session ID: ${sessionId} | Meeting ID: ${meetingId}</p>`
      );
    } catch (emailErr) {
      console.warn('⚠️ Email notification failed (booking still created):', emailErr.message);
    }

    res.status(201).json({
      message: 'Counselling session booked successfully',
      booking: {
        _id: booking._id,
        sessionId,
        meetingId,
        date,
        time,
        endTime,
        consultantName,
        userEmail,
        status: 'booked',
      }
    });

  } catch (err) {
    console.error('❌ bookCounsellingSession error:', err.message);
    res.status(500).json({ message: 'Server error. Could not complete booking.' });
  }
};

/* =========================
   GET AVAILABLE SLOTS
   GET /api/bookings/available-slots?date=YYYY-MM-DD&counsellorId=...
 ========================= */
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date, counsellorId } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'date query param is required' });
    }

    // All possible 1-hour slots: 09:00 – 18:00
    const ALL_SLOTS = [
      '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // Build query: if counsellorId given, check only that counsellor's bookings
    const query = { date, bookingType: 'counselling' };
    if (counsellorId) query.consultantId = counsellorId;

    const existingBookings = await Booking.find(query).select('time consultantId');
    const bookedTimes = existingBookings.map(b => b.time);

    // Mark each slot
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const slots = ALL_SLOTS.map(slot => {
      const [h, m] = slot.split(':').map(Number);
      const slotMinutes = h * 60 + m;
      const isPast = date === todayStr && slotMinutes <= currentMinutes;
      const isBooked = bookedTimes.includes(slot);
      return {
        time: slot,
        endTime: `${String((h + 1) % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        available: !isBooked && !isPast,
        booked: isBooked,
        past: isPast,
      };
    });

    res.json({ date, slots });
  } catch (err) {
    console.error('❌ getAvailableSlots error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   GET COUNSELLING SESSION
   GET /api/bookings/session/:sessionId
 ========================= */
exports.getCounsellingSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const booking = await Booking.findOne({ sessionId }).lean();
    if (!booking) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ session: booking });
  } catch (err) {
    console.error('❌ getCounsellingSession error:', err.message);
    res.status(500).json({ message: 'Server error' });
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
      .sort({ date: 1, time: 1 });

    console.log(`📋 [ByEmail] Found ${bookings.length} bookings for consultant: ${email}`);
    res.json(bookings);
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

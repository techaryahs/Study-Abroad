const express = require("express");
const router = express.Router();
const bookingCtrl = require("../controllers/booking.controller");

// ── Existing routes ────────────────────────────────────────────────────────
router.post("/book-consultant", bookingCtrl.bookConsultant);
router.get("/booked-slots", bookingCtrl.getBookedSlots);
router.get("/counselling/:email", bookingCtrl.getUserCounselling);
router.get("/user/:email", bookingCtrl.getUserBookings);
router.get("/consultants", bookingCtrl.getAllConsultants);

// ── Consultant booking lookup ──────────────────────────────────────────────
// By email (used by consultant-dashboard when _id is unavailable)
router.get("/by-email", bookingCtrl.getBookingsByConsultantEmail);
// By consultant document ID (main dashboard route)
router.get("/consultant/:consultantId", bookingCtrl.getConsultantBookings);

router.put("/:id/accept", bookingCtrl.acceptBooking);
router.put("/:id/reject", bookingCtrl.rejectBooking);
router.put("/:id/complete", bookingCtrl.completeBooking);
router.delete("/:id", bookingCtrl.deleteBooking);
router.post("/seed", bookingCtrl.seedConsultants);

// ── Counselling Session routes ─────────────────────────────────────────────
router.post("/book-session", bookingCtrl.bookCounsellingSession);
router.get("/available-slots", bookingCtrl.getAvailableSlots);
router.get("/session/:sessionId", bookingCtrl.getCounsellingSession);

module.exports = router;

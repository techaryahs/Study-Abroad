const express = require("express");
const router = express.Router();
const bookingCtrl = require("../controllers/booking.controller");

// ── Existing routes ────────────────────────────────────────────────────────
router.post("/book-consultant", bookingCtrl.bookConsultant);
router.get("/booked-slots", bookingCtrl.getBookedSlots);
router.get("/counselling/:email", bookingCtrl.getUserCounselling);
router.get("/user/:email", bookingCtrl.getUserBookings); // Get bookings by user email
router.get("/consultants", bookingCtrl.getAllConsultants);
router.get("/consultant/:consultantId", bookingCtrl.getConsultantBookings);
router.put("/:id/accept", bookingCtrl.acceptBooking);
router.put("/:id/reject", bookingCtrl.rejectBooking);
router.delete("/:id", bookingCtrl.deleteBooking);
router.post("/seed", bookingCtrl.seedConsultants);

// ── Counselling Session routes ─────────────────────────────────────────────
router.post("/book-session", bookingCtrl.bookCounsellingSession);
router.get("/available-slots", bookingCtrl.getAvailableSlots);
router.get("/session/:sessionId", bookingCtrl.getCounsellingSession);

module.exports = router;


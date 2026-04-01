const express = require("express");
const router = express.Router();
const bookingCtrl = require("../controllers/booking.controller");

router.post("/book-consultant", bookingCtrl.bookConsultant);
router.get("/booked-slots", bookingCtrl.getBookedSlots);
router.get("/counselling/:email", bookingCtrl.getUserCounselling);
router.get("/user/:email", bookingCtrl.getUserBookings); // ✅ NEW - Get bookings by user email
router.get("/consultants", bookingCtrl.getAllConsultants);
router.get("/consultant/:consultantId", bookingCtrl.getConsultantBookings);
router.put("/:id/accept", bookingCtrl.acceptBooking);
router.put("/:id/reject", bookingCtrl.rejectBooking);
router.post("/seed", bookingCtrl.seedConsultants);

module.exports = router;

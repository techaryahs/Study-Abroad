const express = require("express");
const router = express.Router();
const bookingCtrl = require("../controllers/booking.controller");
const auth = require("../middleware/auth");
const {
  requireMembership,
  requireEntitlement,
  requireUsage,
} = require("../middleware/membershipAuth.middleware");

// ── Paid human consultation (membership entitlement) ───────────────────────
router.post(
  "/book-consultant",
  auth,
  requireMembership(),
  requireEntitlement("human", "consultation"),
  requireUsage("consultation"),
  bookingCtrl.bookConsultant
);

// ── Public / operational booking surfaces ──────────────────────────────────
router.get("/booked-slots", bookingCtrl.getBookedSlots);
router.get("/counselling/:email", bookingCtrl.getUserCounselling);
router.get("/user/:email", bookingCtrl.getUserBookings);
router.get("/consultants", bookingCtrl.getAllConsultants);
router.get("/free-eligibility", bookingCtrl.checkFreeBookingEligibility);
router.post("/send-booking-otp", bookingCtrl.sendBookingOtp);
router.post("/verify-booking-otp", bookingCtrl.verifyBookingOtp);

// ── Consultant booking lookup ──────────────────────────────────────────────
router.get("/by-email", bookingCtrl.getBookingsByConsultantEmail);
router.get("/consultant/:consultantId", bookingCtrl.getConsultantBookings);

router.put("/:id/accept", bookingCtrl.acceptBooking);
router.put("/:id/reject", bookingCtrl.rejectBooking);
router.put("/:id/complete", bookingCtrl.completeBooking);
router.delete("/:id", bookingCtrl.deleteBooking);
router.put("/cancel/:id", bookingCtrl.cancelBooking);
router.post("/seed", bookingCtrl.seedConsultants);

// ── Counselling session (free/OTP path stays public; paid path uses book-consultant) ─
router.post("/book-session", bookingCtrl.bookCounsellingSession);
router.get("/available-slots", bookingCtrl.getAvailableSlots);
router.get("/session/:sessionId", bookingCtrl.getCounsellingSession);

router.get("/", bookingCtrl.getAllBookings);

module.exports = router;

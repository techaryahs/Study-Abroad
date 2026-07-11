const express = require("express");
const router = express.Router();
const bookingCtrl = require("../controllers/booking.controller");
const auth = require("../middleware/auth");
const optionalAuth = auth.optionalAuth || ((req, res, next) => next());
const requireAdmin = auth.requireAdmin;
const requireSelfEmailOrAdmin = auth.requireSelfEmailOrAdmin;
const requireAdminOrBookingConsultant = auth.requireAdminOrBookingConsultant;
const {
  requireMembership,
  requireEntitlement,
  requireUsage,
} = require("../middleware/membershipAuth.middleware");

// ── Unified consultation entry → bookConsultation() ────────────────────────
// free (public/OTP), membership (auth+engine), paid (verified payment ledger)
router.post(
  "/book-consultation",
  optionalAuth,
  bookingCtrl.bookConsultationEntry
);

// ── Membership consultant booking (auth + entitlement middleware + engine) ─
// Compatibility wrapper → bookConsultation({ path: "membership" })
router.post(
  "/book-consultant",
  auth,
  requireMembership(),
  requireEntitlement("human", "consultation"),
  requireUsage("consultation"),
  bookingCtrl.bookConsultant
);

// ── Counselling session compatibility wrapper → orchestrator only ──────────
// Free stays public; membership/paid require auth + engine / payment ledger.
router.post("/book-session", optionalAuth, bookingCtrl.bookCounsellingSession);

// ── Public operational surfaces (no PII mutation) ──────────────────────────
router.get("/booked-slots", bookingCtrl.getBookedSlots);
router.get("/consultants", bookingCtrl.getAllConsultants);
router.get("/free-eligibility", bookingCtrl.checkFreeBookingEligibility);
router.post("/send-booking-otp", bookingCtrl.sendBookingOtp);
router.post("/verify-booking-otp", bookingCtrl.verifyBookingOtp);
router.get("/available-slots", bookingCtrl.getAvailableSlots);
// Meeting join uses opaque sessionId (capability URL)
router.get("/session/:sessionId", bookingCtrl.getCounsellingSession);

// ── Authenticated owner or admin (PII) ─────────────────────────────────────
router.get(
  "/counselling/:email",
  auth,
  requireSelfEmailOrAdmin,
  bookingCtrl.getUserCounselling
);
router.get(
  "/user/:email",
  auth,
  requireSelfEmailOrAdmin,
  bookingCtrl.getUserBookings
);

// ── Consultant / admin booking lookup ──────────────────────────────────────
router.get("/by-email", auth, bookingCtrl.getBookingsByConsultantEmail);
router.get(
  "/consultant/:consultantId",
  auth,
  bookingCtrl.getConsultantBookings
);

// ── Mutations: staff (admin or owning consultant) ──────────────────────────
router.put(
  "/:id/accept",
  auth,
  requireAdminOrBookingConsultant,
  bookingCtrl.acceptBooking
);
router.put(
  "/:id/reject",
  auth,
  requireAdminOrBookingConsultant,
  bookingCtrl.rejectBooking
);
router.put(
  "/:id/complete",
  auth,
  requireAdminOrBookingConsultant,
  bookingCtrl.completeBooking
);

// Hard delete removed from public surface → soft-cancel with credit policy (admin)
router.delete("/:id", auth, requireAdmin, bookingCtrl.deleteBooking);

// Admin or owning student — shared credit restore policy
router.put("/cancel/:id", auth, bookingCtrl.cancelBooking);

// Admin-only operational
router.post("/seed", auth, requireAdmin, bookingCtrl.seedConsultants);
router.get("/", auth, requireAdmin, bookingCtrl.getAllBookings);

module.exports = router;

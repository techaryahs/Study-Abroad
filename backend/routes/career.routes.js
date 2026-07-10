const express = require("express");
const router = express.Router();
const careerCtrl = require("../controllers/career.controller");
const auth = require("../middleware/auth");
const {
  requireMembership,
  requireEntitlement,
  requireUsage,
} = require("../middleware/membershipAuth.middleware");

// Public / marketing career data
router.get("/", careerCtrl.getCareers);
router.get("/quiz-questions", careerCtrl.getQuizQuestions);

// Paid AI / access features — backend is authority
// unipredict: college lists + course compare + recommendations
router.post(
  "/recommend",
  auth,
  requireMembership(),
  requireEntitlement("access", "unipredict"),
  careerCtrl.recommendCareers
);

router.post(
  "/colleges",
  auth,
  requireMembership(),
  requireEntitlement("access", "unipredict"),
  careerCtrl.getColleges
);

router.post(
  "/compare-courses",
  auth,
  requireMembership(),
  requireEntitlement("access", "unipredict"),
  careerCtrl.compareCourses
);

// Human document feature
router.post(
  "/generate-resume",
  auth,
  requireMembership(),
  requireEntitlement("human", "resume_drafting"),
  requireUsage("resume_drafting"),
  careerCtrl.generateResume
);

// Quiz submit — requires active membership (starter+ access tier features)
router.post(
  "/quiz/submit",
  auth,
  requireMembership(),
  requireEntitlement("access", "unipredict"),
  careerCtrl.submitQuiz
);

module.exports = router;

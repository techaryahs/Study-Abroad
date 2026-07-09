const express = require("express");
const router = express.Router();
const careerCtrl = require("../controllers/career.controller");
const auth = require("../middleware/auth");

const requireEntitlement = require("../middleware/entitlement.middleware");

// 🔹 Career recommendations (STATIC JSON)
router.post("/recommend", careerCtrl.recommendCareers);

// 🔹 AI-powered features
router.post("/colleges", careerCtrl.getColleges);
router.get("/quiz-questions", careerCtrl.getQuizQuestions);
router.post("/compare-courses", careerCtrl.compareCourses);
router.post("/generate-resume", auth, requireEntitlement('human', 'resume_drafting'), careerCtrl.generateResume);
router.post("/quiz/submit", auth, careerCtrl.submitQuiz);


// 🔹 Search careers (AI)
router.get("/", careerCtrl.getCareers); // ✅ FIXED

module.exports = router;

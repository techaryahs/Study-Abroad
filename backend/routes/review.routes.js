const express = require("express");
const router = express.Router();
const { getReviews, createReview, getServiceList } = require("../controllers/review.controller");

router.get("/", getReviews);           // GET /api/reviews
router.post("/", createReview);        // POST /api/reviews
router.get("/services", getServiceList); // GET /api/reviews/services

module.exports = router;

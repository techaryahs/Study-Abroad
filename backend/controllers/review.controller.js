const Review = require("../models/Review");

// GET /api/reviews?service=sop&limit=20&page=1
exports.getReviews = async (req, res) => {
  try {
    const { service, page = 1, limit = 20 } = req.query;
    const filter = { isApproved: true };
    if (service && service !== "all") filter.service = service;

    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Review.countDocuments(filter),
    ]);

    // Aggregate average per service for stats
    const stats = await Review.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: "$service",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ reviews, total, page: Number(page), stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { name, email, service, rating, title, body } = req.body;
    if (!name || !service || !rating || !body) {
      return res.status(400).json({ message: "name, service, rating and body are required." });
    }
    const review = await Review.create({ name, email, service, rating, title, body });
    res.status(201).json({ message: "Review submitted successfully!", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/reviews/services  — list of distinct service values that have reviews
exports.getServiceList = async (req, res) => {
  try {
    const services = await Review.distinct("service", { isApproved: true });
    res.json({ services });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    service: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    body: { type: String, required: true, trim: true },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true }, // auto-publish; set false for moderation
    avatar: { type: String, default: "" }, // optional profile pic URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);

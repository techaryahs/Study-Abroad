const mongoose = require("mongoose");

const RateLimitSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    count: {
      type: Number,
      default: 0
    },
    resetAt: {
      type: Date,
      required: true,
      expires: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);

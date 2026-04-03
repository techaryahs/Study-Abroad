const mongoose = require("mongoose");

const ResearchGroupSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    maxAuthors: {
      type: Number,
      required: true,
      default: 1,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    status: {
      type: String,
      enum: ["open", "closed", "full"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResearchGroup", ResearchGroupSchema);

const mongoose = require("mongoose");

const progressReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true,
    index: true,
  },
  
  // Percentage completion (e.g. { "Self-Assessment": 20 })
  categories: {
    type: Map,
    of: Number,
    default: {}  
  },

  // FINAL completed results
  stageResults: {
    type: Map,
    of: Object,
    default: {}
  },

  // 🔥 NEW FIELD: Partial Progress (Resume Functionality)
  stageProgress: {
    type: Map,
    of: new mongoose.Schema({
      currentQuestionIndex: { type: Number, default: 0 },
      answers: { type: [String], default: [] }, 
      totalQuestions: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now }
    }, { _id: false }),
    default: {}
  }
}, { timestamps: true, autoCreate: false, autoIndex: false });

module.exports = mongoose.model("ProgressReport", progressReportSchema);
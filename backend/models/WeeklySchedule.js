// backend/models/WeeklySchedule.js
const mongoose = require("mongoose");

/**
 * WeeklySchedule Model
 * Admin defines recurring weekly availability
 * Automatically generates slots for future dates
 */

const timeSlotSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // HH:mm format (24-hour, converted to AM/PM in UI)
  endTime: { type: String, required: true },   // HH:mm format (24-hour, converted to AM/PM in UI)
  duration: { type: Number, default: 60 },     // minutes
  isActive: { type: Boolean, default: true }
}, { _id: true });

const dayScheduleSchema = new mongoose.Schema({
  dayOfWeek: { 
    type: String, 
    required: true,
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  },
  isEnabled: { type: Boolean, default: true },
  timeSlots: [timeSlotSchema]
}, { _id: false });

const weeklyScheduleSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      default: "Default Schedule" 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    schedule: [dayScheduleSchema],
    createdBy: { type: String },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

// Only allow one active schedule at a time
weeklyScheduleSchema.index({ isActive: 1 });

module.exports = mongoose.models.WeeklySchedule || mongoose.model("WeeklySchedule", weeklyScheduleSchema);

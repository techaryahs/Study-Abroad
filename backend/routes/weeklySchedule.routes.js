// backend/routes/weeklySchedule.routes.js
const express = require("express");
const router = express.Router();
const scheduleCtrl = require("../controllers/weeklySchedule.controller");

// ── Public routes (for user booking) ───────────────────────────────────────
router.get("/available", scheduleCtrl.getAvailableSlotsForDate);

// ── Admin routes ───────────────────────────────────────────────────────────
router.get("/", scheduleCtrl.getActiveSchedule);
router.put("/", scheduleCtrl.updateSchedule);
router.patch("/day/:dayOfWeek/toggle", scheduleCtrl.toggleDay);
router.post("/day/:dayOfWeek/slot", scheduleCtrl.addTimeSlot);
router.post("/slots/batch", scheduleCtrl.addTimeSlotBatch); // Batch add to multiple days
router.delete("/day/:dayOfWeek/slot/:slotId", scheduleCtrl.removeTimeSlot);
router.patch("/day/:dayOfWeek/slot/:slotId/toggle", scheduleCtrl.toggleTimeSlot);

module.exports = router;

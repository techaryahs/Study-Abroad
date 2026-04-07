// backend/controllers/weeklySchedule.controller.js
const WeeklySchedule = require("../models/WeeklySchedule");
const Booking = require("../models/Booking");

/**
 * GET ACTIVE WEEKLY SCHEDULE
 * GET /api/weekly-schedule
 */
exports.getActiveSchedule = async (req, res) => {
  try {
    let schedule = await WeeklySchedule.findOne({ isActive: true });
    
    // Create default schedule if none exists
    if (!schedule) {
      schedule = await WeeklySchedule.create({
        name: "Default Schedule",
        isActive: true,
        schedule: [
          { dayOfWeek: "monday", isEnabled: true, timeSlots: [] },
          { dayOfWeek: "tuesday", isEnabled: true, timeSlots: [] },
          { dayOfWeek: "wednesday", isEnabled: true, timeSlots: [] },
          { dayOfWeek: "thursday", isEnabled: true, timeSlots: [] },
          { dayOfWeek: "friday", isEnabled: true, timeSlots: [] },
          { dayOfWeek: "saturday", isEnabled: false, timeSlots: [] },
          { dayOfWeek: "sunday", isEnabled: false, timeSlots: [] }
        ]
      });
    } else {
      // Ensure all 7 days exist in the schedule
      const existingDays = schedule.schedule.map(d => d.dayOfWeek);
      const allDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      const missingDays = allDays.filter(day => !existingDays.includes(day));
      
      if (missingDays.length > 0) {
        missingDays.forEach(day => {
          schedule.schedule.push({
            dayOfWeek: day,
            isEnabled: day !== "saturday" && day !== "sunday",
            timeSlots: []
          });
        });
        await schedule.save();
      }
    }
    
    res.json({ schedule });
  } catch (err) {
    console.error("❌ getActiveSchedule Error:", err);
    res.status(500).json({ message: "Error fetching schedule" });
  }
};

/**
 * UPDATE WEEKLY SCHEDULE
 * PUT /api/weekly-schedule
 * Admin updates the entire weekly schedule
 */
exports.updateSchedule = async (req, res) => {
  try {
    const { schedule, name, notes } = req.body;
    const adminEmail = req.user?.email || "admin";

    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({ message: "Schedule array is required" });
    }

    // Validate schedule structure
    const validDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    for (const day of schedule) {
      if (!validDays.includes(day.dayOfWeek)) {
        return res.status(400).json({ message: `Invalid day: ${day.dayOfWeek}` });
      }
    }

    // Find or create active schedule
    let activeSchedule = await WeeklySchedule.findOne({ isActive: true });
    
    if (!activeSchedule) {
      activeSchedule = new WeeklySchedule({
        name: name || "Default Schedule",
        isActive: true,
        schedule,
        createdBy: adminEmail,
        notes: notes || ""
      });
    } else {
      activeSchedule.schedule = schedule;
      if (name) activeSchedule.name = name;
      if (notes !== undefined) activeSchedule.notes = notes;
    }

    await activeSchedule.save();

    console.log(`✅ [Schedule Updated] by ${adminEmail}`);
    res.json({ 
      message: "Schedule updated successfully", 
      schedule: activeSchedule 
    });
  } catch (err) {
    console.error("❌ updateSchedule Error:", err);
    res.status(500).json({ message: "Error updating schedule" });
  }
};

/**
 * TOGGLE DAY
 * PATCH /api/weekly-schedule/day/:dayOfWeek/toggle
 * Enable/disable a specific day
 */
exports.toggleDay = async (req, res) => {
  try {
    const { dayOfWeek } = req.params;
    
    const schedule = await WeeklySchedule.findOne({ isActive: true });
    if (!schedule) {
      return res.status(404).json({ message: "No active schedule found" });
    }

    const daySchedule = schedule.schedule.find(d => d.dayOfWeek === dayOfWeek);
    if (!daySchedule) {
      return res.status(404).json({ message: "Day not found" });
    }

    daySchedule.isEnabled = !daySchedule.isEnabled;
    await schedule.save();

    console.log(`✅ [Day Toggled] ${dayOfWeek} → ${daySchedule.isEnabled ? "Enabled" : "Disabled"}`);
    res.json({ 
      message: `${dayOfWeek} ${daySchedule.isEnabled ? "enabled" : "disabled"}`,
      schedule 
    });
  } catch (err) {
    console.error("❌ toggleDay Error:", err);
    res.status(500).json({ message: "Error toggling day" });
  }
};

/**
 * ADD TIME SLOT TO MULTIPLE DAYS (BATCH)
 * POST /api/weekly-schedule/slots/batch
 * Body: { days: ["monday", "tuesday", ...], startTime, endTime, duration }
 */
exports.addTimeSlotBatch = async (req, res) => {
  try {
    const { days, startTime, endTime, duration } = req.body;

    console.log('📥 Batch Add Request:', { days, startTime, endTime, duration });

    if (!days || !Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ message: "Days array is required" });
    }

    if (!startTime || !endTime) {
      return res.status(400).json({ message: "Start time and end time are required" });
    }

    let schedule = await WeeklySchedule.findOne({ isActive: true });
    
    // Create schedule if it doesn't exist
    if (!schedule) {
      schedule = await WeeklySchedule.create({
        name: "Default Schedule",
        isActive: true,
        schedule: [
          { dayOfWeek: "monday", isEnabled: true, timeSlots: [] },
          { dayOfWeek: "tuesday", isEnabled: true, timeSlots: [] },
          { dayOfWeek: "wednesday", isEnabled: true, timeSlots: [] },
          { dayOfWeek: "thursday", isEnabled: true, timeSlots: [] },
          { dayOfWeek: "friday", isEnabled: true, timeSlots: [] },
          { dayOfWeek: "saturday", isEnabled: false, timeSlots: [] },
          { dayOfWeek: "sunday", isEnabled: false, timeSlots: [] }
        ]
      });
    }

    const newSlot = {
      startTime,
      endTime,
      duration: duration || 60,
      isActive: true
    };

    // Add slot to all specified days in a single transaction
    days.forEach(dayOfWeek => {
      let daySchedule = schedule.schedule.find(d => d.dayOfWeek === dayOfWeek);
      
      // Add day if it doesn't exist
      if (!daySchedule) {
        daySchedule = {
          dayOfWeek,
          isEnabled: dayOfWeek !== "saturday" && dayOfWeek !== "sunday",
          timeSlots: []
        };
        schedule.schedule.push(daySchedule);
      }

      daySchedule.timeSlots.push({ ...newSlot });
    });

    await schedule.save();

    console.log(`✅ [Time Slots Added] ${days.join(", ")} ${startTime}-${endTime}`);
    res.json({ message: `Time slot added to ${days.length} day(s)`, schedule });
  } catch (err) {
    console.error("❌ addTimeSlotBatch Error:", err);
    res.status(500).json({ message: "Error adding time slots", error: err.message });
  }
};

/**
 * ADD TIME SLOT TO DAY
 * POST /api/weekly-schedule/day/:dayOfWeek/slot
 */
/**
 * ADD TIME SLOT TO DAY
 * POST /api/weekly-schedule/day/:dayOfWeek/slot
 * 
 * NOTE: For concurrent operations, use /slots/batch endpoint instead
 * to avoid MongoDB version conflicts
 */
exports.addTimeSlot = async (req, res) => {
  try {
    const { dayOfWeek } = req.params;
    const { startTime, endTime, duration } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: "Start time and end time are required" });
    }

    // Retry logic for handling concurrent updates (optional enhancement)
    const MAX_RETRIES = 3;
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
      try {
        let schedule = await WeeklySchedule.findOne({ isActive: true });
        
        // Create schedule if it doesn't exist
        if (!schedule) {
          schedule = await WeeklySchedule.create({
            name: "Default Schedule",
            isActive: true,
            schedule: [
              { dayOfWeek: "monday", isEnabled: true, timeSlots: [] },
              { dayOfWeek: "tuesday", isEnabled: true, timeSlots: [] },
              { dayOfWeek: "wednesday", isEnabled: true, timeSlots: [] },
              { dayOfWeek: "thursday", isEnabled: true, timeSlots: [] },
              { dayOfWeek: "friday", isEnabled: true, timeSlots: [] },
              { dayOfWeek: "saturday", isEnabled: false, timeSlots: [] },
              { dayOfWeek: "sunday", isEnabled: false, timeSlots: [] }
            ]
          });
        }

        let daySchedule = schedule.schedule.find(d => d.dayOfWeek === dayOfWeek);
        
        // Add day if it doesn't exist
        if (!daySchedule) {
          daySchedule = {
            dayOfWeek,
            isEnabled: dayOfWeek !== "saturday" && dayOfWeek !== "sunday",
            timeSlots: []
          };
          schedule.schedule.push(daySchedule);
        }

        daySchedule.timeSlots.push({
          startTime,
          endTime,
          duration: duration || 60,
          isActive: true
        });

        await schedule.save();

        console.log(`✅ [Time Slot Added] ${dayOfWeek} ${startTime}-${endTime}`);
        return res.json({ message: "Time slot added", schedule });
        
      } catch (saveErr) {
        // Check if it's a version conflict error
        if (saveErr.message && saveErr.message.includes('No matching document found')) {
          retries++;
          if (retries >= MAX_RETRIES) {
            throw new Error(`Failed after ${MAX_RETRIES} retries due to concurrent updates. Use /slots/batch endpoint for bulk operations.`);
          }
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 100 * retries));
          continue;
        }
        throw saveErr;
      }
    }
  } catch (err) {
    console.error("❌ addTimeSlot Error:", err);
    res.status(500).json({ message: "Error adding time slot", error: err.message });
  }
};

/**
 * REMOVE TIME SLOT FROM DAY
 * DELETE /api/weekly-schedule/day/:dayOfWeek/slot/:slotId
 */
exports.removeTimeSlot = async (req, res) => {
  try {
    const { dayOfWeek, slotId } = req.params;

    const schedule = await WeeklySchedule.findOne({ isActive: true });
    if (!schedule) {
      return res.status(404).json({ message: "No active schedule found" });
    }

    const daySchedule = schedule.schedule.find(d => d.dayOfWeek === dayOfWeek);
    if (!daySchedule) {
      return res.status(404).json({ message: "Day not found" });
    }

    daySchedule.timeSlots = daySchedule.timeSlots.filter(
      slot => slot._id.toString() !== slotId
    );

    await schedule.save();

    console.log(`✅ [Time Slot Removed] ${dayOfWeek} slot ${slotId}`);
    res.json({ message: "Time slot removed", schedule });
  } catch (err) {
    console.error("❌ removeTimeSlot Error:", err);
    res.status(500).json({ message: "Error removing time slot" });
  }
};

/**
 * GET AVAILABLE SLOTS FOR DATE (User-facing)
 * GET /api/weekly-schedule/available?date=2025-04-15
 * Generates individual bookable slots based on weekly schedule time ranges
 */
exports.getAvailableSlotsForDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Get day of week from date
    const dateObj = new Date(date + "T12:00:00");
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const dayOfWeek = dayNames[dateObj.getDay()];

    // Get active schedule
    const schedule = await WeeklySchedule.findOne({ isActive: true });
    if (!schedule) {
      return res.json({ 
        slots: [],
        message: "No schedule configured. Admin needs to set up weekly schedule." 
      });
    }

    // Find day schedule
    const daySchedule = schedule.schedule.find(d => d.dayOfWeek === dayOfWeek);
    if (!daySchedule || !daySchedule.isEnabled) {
      return res.json({ 
        slots: [],
        message: `No slots available on ${dayOfWeek}s` 
      });
    }

    // Check current time for past slots
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().substring(0, 5);

    // Helper: Convert HH:mm to minutes since midnight
    const timeToMinutes = (time) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    // Helper: Convert minutes since midnight to HH:mm
    const minutesToTime = (mins) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    // Generate individual bookable slots from time ranges
    const allSlots = [];
    
    for (const timeRange of daySchedule.timeSlots) {
      if (!timeRange.isActive) continue;

      const startMins = timeToMinutes(timeRange.startTime);
      const endMins = timeToMinutes(timeRange.endTime);
      const duration = timeRange.duration || 60;

      // Generate slots within this time range
      for (let slotStart = startMins; slotStart + duration <= endMins; slotStart += duration) {
        const slotEnd = slotStart + duration;
        const slotStartTime = minutesToTime(slotStart);
        const slotEndTime = minutesToTime(slotEnd);

        // Check if slot is already booked
        const existingBooking = await Booking.findOne({
          date,
          time: slotStartTime,
          bookingType: "counselling",
          status: "booked"
        });

        const isPast = date === todayStr && slotStartTime <= currentTime;
        const isBooked = !!existingBooking;
        const isAvailable = !isPast && !isBooked;

        allSlots.push({
          time: slotStartTime,
          endTime: slotEndTime,
          duration: duration,
          available: isAvailable,
          booked: isBooked,
          past: isPast
        });
      }
    }

    // Sort by time
    allSlots.sort((a, b) => a.time.localeCompare(b.time));

    console.log(`✅ Generated ${allSlots.length} slots for ${dayOfWeek} ${date}`);
    res.json({ slots: allSlots });
  } catch (err) {
    console.error("❌ getAvailableSlotsForDate Error:", err);
    res.status(500).json({ message: "Error fetching available slots" });
  }
};

/**
 * TOGGLE TIME SLOT
 * PATCH /api/weekly-schedule/day/:dayOfWeek/slot/:slotId/toggle
 */
exports.toggleTimeSlot = async (req, res) => {
  try {
    const { dayOfWeek, slotId } = req.params;

    const schedule = await WeeklySchedule.findOne({ isActive: true });
    if (!schedule) {
      return res.status(404).json({ message: "No active schedule found" });
    }

    const daySchedule = schedule.schedule.find(d => d.dayOfWeek === dayOfWeek);
    if (!daySchedule) {
      return res.status(404).json({ message: "Day not found" });
    }

    const timeSlot = daySchedule.timeSlots.id(slotId);
    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }

    timeSlot.isActive = !timeSlot.isActive;
    await schedule.save();

    console.log(`✅ [Time Slot Toggled] ${dayOfWeek} ${timeSlot.startTime} → ${timeSlot.isActive ? "Active" : "Inactive"}`);
    res.json({ 
      message: `Time slot ${timeSlot.isActive ? "enabled" : "disabled"}`,
      schedule 
    });
  } catch (err) {
    console.error("❌ toggleTimeSlot Error:", err);
    res.status(500).json({ message: "Error toggling time slot" });
  }
};

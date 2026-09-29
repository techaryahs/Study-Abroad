const mongoose = require("mongoose");
const Consultant = require("../models/Consultant");
const StudentLead = require("../models/StudentLead");
const Seminar = require("../models/Seminar");
const logger = require("../utils/logger");

/* =========================
   GET CONSULTANT PROFILE
========================= */
exports.getConsultantProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }

    const actorRole = String(req.user?.role || "").toLowerCase();
    const actorId = String(req.user?.id || req.user?._id || "");

    // Consultant can only fetch their own profile; admins can fetch any
    if (actorRole === "consultant" && actorId !== String(userId)) {
      return res.status(403).json({ message: "Access denied. Cannot view other consultant profiles." });
    }

    logger.debug(`[ConsultantProfile] Fetching ID: ${userId}`);

    const consultant = await Consultant.findById(userId).select("-password");

    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    res.json({
      user: consultant,
      role: "consultant",
    });

  } catch (err) {
    logger.error("Consultant profile fetch error:", err);
    res.status(500).json({ message: "Server error fetching consultant profile" });
  }
};

/* =========================
   UPDATE CONSULTANT PROFILE
========================= */
exports.updateConsultantProfile = async (req, res) => {
  try {
    // 🔐 Always use logged-in user (NO param trust)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updateData = req.body;

    // 📸 Handle image upload
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const consultant = await Consultant.findById(userId);
    if (!consultant) {
      return res.status(404).json({ message: "Consultant not found" });
    }

    /* =========================
       ALLOWED FIELDS ONLY
    ========================= */
    const allowedFields = [
      "name",
      "mobile",
      "expertise",
      "experience",
      "bio",
      "price",
    ];

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        consultant[field] = updateData[field];
      }
    });

    /* =========================
       AVAILABILITY UPDATE
    ========================= */
    if (updateData.availability) {
      if (!Array.isArray(updateData.availability)) {
        return res.status(400).json({ message: "Availability must be an array" });
      }

      // Validate time slots
      for (let slot of updateData.availability) {
        if (!slot.day || !slot.startTime || !slot.endTime) {
          return res.status(400).json({ message: "Invalid availability format" });
        }

        if (slot.startTime >= slot.endTime) {
          return res.status(400).json({
            message: `Invalid time range for ${slot.day}`,
          });
        }
      }

      consultant.availability = updateData.availability;
    }

    /* =========================
       IMAGE UPDATE
    ========================= */
    if (imagePath) {
      consultant.image = imagePath;
    }

    await consultant.save();

    logger.info(`[ConsultantProfile] Updated: ${logger.maskEmail(consultant.email)}`);

    res.json({
      message: "Consultant profile updated successfully",
      user: consultant,
    });

  } catch (err) {
    logger.error("Consultant profile update error:", err);
    res.status(500).json({ message: "Server error updating consultant profile" });
  }
};

/* =========================
   GET ASSIGNED STUDENTS
   Strictly scoped to req.user.id (authenticated consultant)
========================= */
exports.getAssignedStudents = async (req, res) => {
  try {
    const consultantId = req.user.id;

    const rawStudents = await StudentLead.find({ assignedConsultantId: consultantId })
      .populate("collegeId", "name city state")
      .select("studentLeadId fullName email mobile course graduationYear preferredCountry preferredProgram studyAbroadTimeline leadStatus pipelineStage assignedAt assignmentNotes sourceSeminarId seminarId createdAt")
      .sort({ assignedAt: -1, createdAt: -1 })
      .lean();

    const seminarIds = [...new Set(rawStudents.map((s) => s.seminarId || s.sourceSeminarId).filter(Boolean))];
    const seminars = await Seminar.find({ seminarId: { $in: seminarIds } })
      .select("seminarId collegeId collegeName")
      .lean();
    const seminarMap = new Map(seminars.map((s) => [s.seminarId, s]));

    const students = rawStudents.map((s) => {
      const linkedSeminar =
        (s.seminarId && seminarMap.get(s.seminarId)) ||
        (s.sourceSeminarId && seminarMap.get(s.sourceSeminarId)) ||
        null;
      const resolvedCollegeName = s.collegeId?.name || linkedSeminar?.collegeName || s.collegeName || null;

      const collegeObj =
        s.collegeId && typeof s.collegeId === "object"
          ? s.collegeId
          : resolvedCollegeName
          ? { _id: linkedSeminar?.collegeId || null, name: resolvedCollegeName }
          : null;

      return {
        ...s,
        collegeId: collegeObj,
        collegeName: resolvedCollegeName,
        phone: s.mobile,
        leadId: s.studentLeadId,
      };
    });

    res.json({
      success: true,
      students,
      count: students.length,
    });
  } catch (err) {
    logger.error("Error fetching assigned students for consultant:", err);
    res.status(500).json({ success: false, message: "Server error fetching assigned students" });
  }
};
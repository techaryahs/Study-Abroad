const mongoose = require("mongoose");
const Consultant = require("../models/Consultant");
const StudentLead = require("../models/StudentLead");
const User = require("../models/User");
const Audit = require("../models/Audit");
const { findUserByEmail } = require("../utils/userHelper");
const logger = require("../utils/logger");

const normalizeEmail = (email) => {
  return String(email ?? "").trim().toLowerCase();
};

/**
 * Audit Logger Helper
 */
const recordAudit = async (req, action, entity, entityId, previousValue, newValue, reason = "") => {
  try {
    await Audit.create({
      userId: req.user.id,
      role: req.user.role,
      action,
      entity,
      entityId: String(entityId),
      previousValue,
      newValue,
      reason: String(reason || ""),
    });
  } catch (err) {
    logger.error("[Audit] Failed to record audit log:", err.message);
  }
};

/**
 * POST /api/partnership/consultants
 * Creates a consultant owned by the requesting partner (or admin-specified partner).
 */
exports.createPartnerConsultant = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role: jobTitle,
      expertise,
      experience,
      bio,
      mobile,
      price,
    } = req.body;

    const emailNormalized = normalizeEmail(email);

    if (!emailNormalized || !password || !name || !jobTitle) {
      return res.status(400).json({
        success: false,
        error: "Name, email, password, and professional role/title are required.",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long.",
      });
    }

    // 1. Determine tenant partnerId with explicit admin semantics
    let targetPartnerId = null;
    const actorRole = String(req.user.role || "").toLowerCase();
    if (actorRole === "partner") {
      targetPartnerId = req.user.id;
    } else if (actorRole === "admin" || actorRole === "super_admin") {
      if (req.body.partnerId) {
        if (!mongoose.Types.ObjectId.isValid(req.body.partnerId)) {
          return res.status(400).json({
            success: false,
            error: "Invalid partnerId format.",
          });
        }
        const partnerDoc = await User.findOne({
          _id: req.body.partnerId,
          role: "partner",
        });
        if (!partnerDoc || partnerDoc.partnerProfile?.partnerType !== "edu_mitra") {
          return res.status(400).json({
            success: false,
            error: "Specified partnerId does not exist or is not an approved Edu Mitra partner.",
          });
        }
        targetPartnerId = partnerDoc._id;
      } else {
        // Admin creates platform consultant
        targetPartnerId = null;
      }
    } else {
      return res.status(403).json({ success: false, error: "Access denied." });
    }

    // 2. Check email uniqueness across Student, Consultant, User
    const existing = await findUserByEmail(emailNormalized);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "An account with this email address already exists.",
      });
    }

    // 3. Process Availability slots
    let parsedAvailability = [];
    if (req.body.availability) {
      if (typeof req.body.availability === "string") {
        try {
          parsedAvailability = JSON.parse(req.body.availability);
        } catch (e) {
          logger.warn("Failed to parse availability JSON string:", e.message);
          parsedAvailability = [];
        }
      } else if (Array.isArray(req.body.availability)) {
        parsedAvailability = req.body.availability;
      }
    }

    // 4. Handle Profile Image
    let imagePath = "/avatar-default.png";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image && typeof req.body.image === "string") {
      imagePath = req.body.image.trim();
    }

    // 5. Instantiate new Consultant
    const newConsultant = new Consultant({
      name: name.trim(),
      email: emailNormalized,
      mobile: mobile ? String(mobile).trim() : "0000000000",
      password: password, // Mongoose pre-save hook will hash this via bcrypt
      role: jobTitle.trim(),
      expertise: expertise ? expertise.trim() : "General Counseling",
      experience: experience ? experience.trim() : "1+ years",
      bio: bio ? bio.trim() : "",
      image: imagePath,
      price: Number(price) || 0,
      availability: parsedAvailability,
      partnerId: targetPartnerId,
      createdBy: req.user.id,
      status: "ACTIVE",
      isVerified: true,
      isPremium: true,
      videoCallEnabled: true,
    });

    await newConsultant.save();

    // 6. Record Audit
    await recordAudit(
      req,
      "CREATE_PARTNER_CONSULTANT",
      "Consultant",
      newConsultant._id,
      null,
      {
        email: emailNormalized,
        partnerId: targetPartnerId,
        role: jobTitle,
      },
      `Created consultant ${newConsultant.name} for partner ${targetPartnerId || "platform"}`
    );

    // 7. Safe response (NEVER return password or hash)
    return res.status(201).json({
      success: true,
      message: "Consultant created successfully.",
      consultant: {
        _id: newConsultant._id,
        name: newConsultant.name,
        email: newConsultant.email,
        mobile: newConsultant.mobile,
        role: newConsultant.role,
        expertise: newConsultant.expertise,
        experience: newConsultant.experience,
        bio: newConsultant.bio,
        image: newConsultant.image,
        partnerId: newConsultant.partnerId,
        status: newConsultant.status,
        createdAt: newConsultant.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "An account with this email address already exists.",
      });
    }
    logger.error("❌ createPartnerConsultant Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create consultant.",
    });
  }
};

/**
 * GET /api/partnership/consultants
 * Lists consultants owned strictly by the requesting partner (or filtered by admin).
 */
exports.getPartnerConsultants = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "partner") {
      filter = { partnerId: req.user.id };
    } else if (req.user.role === "admin" || req.user.role === "super_admin") {
      if (req.query.partnerId) {
        if (!mongoose.Types.ObjectId.isValid(req.query.partnerId)) {
          return res.status(400).json({ success: false, error: "Invalid partnerId format in query." });
        }
        filter = { partnerId: req.query.partnerId };
      } else {
        // By default, list partner-associated consultants
        filter = { partnerId: { $ne: null } };
      }
    } else {
      return res.status(403).json({ success: false, error: "Access denied." });
    }

    const consultants = await Consultant.find(filter)
      .select("name email mobile role expertise experience bio image partnerId status isVerified createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Compute active assigned student lead counts
    const consultantIds = consultants.map((c) => c._id);
    const leadCounts = await StudentLead.aggregate([
      { $match: { assignedConsultantId: { $in: consultantIds } } },
      { $group: { _id: "$assignedConsultantId", count: { $sum: 1 } } },
    ]);

    const countMap = new Map();
    leadCounts.forEach((lc) => countMap.set(String(lc._id), lc.count));

    const enriched = consultants.map((c) => ({
      ...c,
      assignedStudentsCount: countMap.get(String(c._id)) || 0,
    }));

    return res.json({
      success: true,
      consultants: enriched,
    });
  } catch (error) {
    logger.error("❌ getPartnerConsultants Error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to load partner consultants.",
    });
  }
};

/**
 * PATCH /api/partnership/consultants/:id/status
 * Updates consultant lifecycle status (ACTIVE or INACTIVE).
 */
exports.updatePartnerConsultantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid consultant ID format.",
      });
    }

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Status must be either 'ACTIVE' or 'INACTIVE'.",
      });
    }

    let query = { _id: id };
    if (req.user.role === "partner") {
      query.partnerId = req.user.id;
    }

    const consultant = await Consultant.findOne(query);
    if (!consultant) {
      return res.status(404).json({
        success: false,
        error: "Consultant not found or not owned by your organization.",
      });
    }

    const previousStatus = consultant.status;
    consultant.status = status;
    await consultant.save();

    await recordAudit(
      req,
      "UPDATE_CONSULTANT_STATUS",
      "Consultant",
      consultant._id,
      { status: previousStatus },
      { status },
      `Status changed from ${previousStatus} to ${status}`
    );

    return res.json({
      success: true,
      message: `Consultant is now ${status}.`,
      consultant: {
        _id: consultant._id,
        name: consultant.name,
        email: consultant.email,
        status: consultant.status,
      },
    });
  } catch (error) {
    logger.error("❌ updatePartnerConsultantStatus Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update consultant status.",
    });
  }
};

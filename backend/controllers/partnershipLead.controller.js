const mongoose = require("mongoose");
const StudentLead = require("../models/StudentLead");
const Consultant = require("../models/Consultant");
const Audit = require("../models/Audit");

// Helper to create audit logs
const createAudit = async (req, action, entity, entityId, previousValue, newValue, reason = "") => {
  try {
    await Audit.create({
      userId: req.user.id,
      role: req.user.role,
      action,
      entity,
      entityId,
      previousValue,
      newValue,
      reason
    });
  } catch (err) {
    console.error("Audit creation failed:", err);
  }
};

exports.updatePipelineStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage, reason } = req.body;
    
    const lead = await StudentLead.findOne({ studentLeadId: id });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    
    const previousStage = lead.pipelineStage;
    lead.pipelineStage = stage;
    await lead.save();
    
    await createAudit(req, "UPDATE_PIPELINE_STAGE", "StudentLead", id, previousStage, stage, reason);
    
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { docType, status, proofReference, notes } = req.body;

    const lead = await StudentLead.findOne({ studentLeadId: id });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    let doc = lead.documents.find(d => d.docType === docType);
    const previousValue = doc ? { ...doc.toObject() } : null;

    if (doc) {
      doc.status = status || doc.status;
      doc.proofReference = proofReference || doc.proofReference;
      doc.notes = notes || doc.notes;
      if (status === "VERIFIED") {
        doc.verifiedAt = new Date();
        doc.verifiedBy = req.user.id;
      }
    } else {
      lead.documents.push({
        docType,
        status,
        proofReference,
        notes,
        uploadedAt: new Date()
      });
    }

    await lead.save();
    await createAudit(req, "UPDATE_DOCUMENT", "StudentLead", id, previousValue, { docType, status, proofReference }, "");

    res.json({ success: true, documents: lead.documents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addShortlist = async (req, res) => {
  try {
    const { id } = req.params;
    const { university, course, country, intake, eligibility, notes } = req.body;
    const lead = await StudentLead.findOne({ studentLeadId: id });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    lead.shortlists.push({
      university, course, country, intake, eligibility, notes,
      shortlistDate: new Date(),
      createdBy: req.user.id
    });
    await lead.save();

    await createAudit(req, "SHORTLIST_CREATED", "StudentLead", id, null, { university, course, intake }, "");
    res.json({ success: true, shortlists: lead.shortlists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateShortlist = async (req, res) => {
  try {
    const { id, shortlistId } = req.params;
    const lead = await StudentLead.findOne({ studentLeadId: id });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    const sl = lead.shortlists.id(shortlistId);
    if (!sl) return res.status(404).json({ success: false, message: "Shortlist not found" });

    const prev = { ...sl.toObject() };
    Object.assign(sl, req.body);
    sl.updatedBy = req.user.id;
    await lead.save();

    await createAudit(req, "SHORTLIST_UPDATED", "StudentLead", id, prev, sl.toObject(), "");
    res.json({ success: true, shortlists: lead.shortlists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/partnership-leads/:id/assign-consultant
 * Assigns, reassigns, or unassigns a consultant to a student lead.
 * Enforces: StudentLead.partnerId === Consultant.partnerId === req.user.id
 */
exports.assignConsultant = async (req, res) => {
  try {
    const { id } = req.params;
    const { consultantId, notes } = req.body;

    // 1. Enforce StudentLead tenant ownership directly in the database query
    const leadQuery = { studentLeadId: id };
    if (req.user.role === "partner") {
      leadQuery.partnerId = req.user.id;
    }

    const lead = await StudentLead.findOne(leadQuery);
    if (!lead) {
      // Check if lead exists under another tenant to return 403 vs 404
      const existsElsewhere = await StudentLead.findOne({ studentLeadId: id }).select("partnerId");
      if (existsElsewhere) {
        return res.status(403).json({
          success: false,
          error: "Access denied. Student lead belongs to another organization.",
        });
      }
      return res.status(404).json({ success: false, error: "Student lead not found." });
    }

    const previousAssignment = lead.assignedConsultantId ? String(lead.assignedConsultantId) : null;

    // 2. Handle Unassignment ({ consultantId: null })
    if (!consultantId) {
      lead.assignedConsultantId = null;
      lead.assignedAt = null;
      lead.assignedBy = req.user.id;
      if (notes !== undefined) lead.assignmentNotes = String(notes || "").trim();

      await lead.save();

      await createAudit(
        req,
        "UNASSIGN_STUDENT_CONSULTANT",
        "StudentLead",
        id,
        { assignedConsultantId: previousAssignment },
        { assignedConsultantId: null },
        notes || "Consultant unassigned"
      );

      return res.json({
        success: true,
        message: "Consultant unassigned successfully.",
        lead: {
          studentLeadId: lead.studentLeadId,
          assignedConsultantId: null,
          assignedAt: null,
        },
      });
    }

    // 3. Handle Assignment / Reassignment - Validate Consultant Ownership and ACTIVE Status
    if (!mongoose.Types.ObjectId.isValid(consultantId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid consultant ID format.",
      });
    }

    const consultantQuery = { _id: consultantId };
    if (req.user.role === "partner") {
      consultantQuery.partnerId = req.user.id;
    }

    const consultant = await Consultant.findOne(consultantQuery);
    if (!consultant) {
      const existsOtherTenant = await Consultant.findById(consultantId).select("partnerId");
      if (existsOtherTenant) {
        return res.status(403).json({
          success: false,
          error: "Access denied. Consultant does not belong to your organization.",
        });
      }
      return res.status(404).json({ success: false, error: "Consultant not found." });
    }

    // Enforce Active Status
    if (consultant.status === "INACTIVE") {
      return res.status(400).json({
        success: false,
        error: "Cannot assign an inactive consultant.",
      });
    }

    // Admin cross-tenant check: consultant and student lead must belong to the same tenant organization
    const actorRole = String(req.user.role || "").toLowerCase();
    if (["admin", "super_admin"].includes(actorRole)) {
      const leadPartner = lead.partnerId ? String(lead.partnerId) : null;
      const consultantPartner = consultant.partnerId ? String(consultant.partnerId) : null;
      if (leadPartner !== consultantPartner) {
        return res.status(400).json({
          success: false,
          error: "Consultant and student lead must belong to the same tenant organization.",
        });
      }
    }

    lead.assignedConsultantId = consultant._id;
    lead.assignedAt = new Date();
    lead.assignedBy = req.user.id;
    if (notes !== undefined) lead.assignmentNotes = String(notes || "").trim();

    await lead.save();

    const actionType = previousAssignment ? "REASSIGN_STUDENT_CONSULTANT" : "ASSIGN_STUDENT_CONSULTANT";
    await createAudit(
      req,
      actionType,
      "StudentLead",
      id,
      { assignedConsultantId: previousAssignment },
      {
        assignedConsultantId: consultant._id,
        consultantName: consultant.name,
        consultantEmail: consultant.email,
      },
      notes || `Assigned to ${consultant.name}`
    );

    return res.json({
      success: true,
      message: `Student lead assigned to ${consultant.name} successfully.`,
      lead: {
        studentLeadId: lead.studentLeadId,
        assignedConsultantId: {
          _id: consultant._id,
          name: consultant.name,
          email: consultant.email,
          role: consultant.role,
        },
        assignedAt: lead.assignedAt,
        assignmentNotes: lead.assignmentNotes,
      },
    });
  } catch (err) {
    console.error("❌ assignConsultant Error:", err);
    return res.status(500).json({ success: false, error: "Failed to assign consultant." });
  }
};

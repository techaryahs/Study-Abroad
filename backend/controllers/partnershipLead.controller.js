const StudentLead = require("../models/StudentLead");
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

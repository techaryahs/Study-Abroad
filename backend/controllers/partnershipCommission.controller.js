const Application = require("../models/Application");
const Commission = require("../models/Commission");
const StudentLead = require("../models/StudentLead");
const Audit = require("../models/Audit");
const { addWorkingDays } = require("../utils/workingDays");

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
  } catch (err) {}
};

exports.updateVisa = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    const prev = { visaStatus: app.visaStatus };
    Object.assign(app, req.body); // expecting visaStatus, visaFilingDate, etc.
    app.updatedBy = req.user.id;
    await app.save();

    await createAudit(req, "VISA_STATUS_CHANGED", "Application", app._id, prev, { visaStatus: app.visaStatus });
    
    // Update Lead Pipeline
    if (app.visaStatus === "APPROVED") {
      const lead = await StudentLead.findOne({ studentLeadId: app.studentLeadId });
      if (lead) {
        lead.pipelineStage = "VISA_APPROVED";
        await lead.save();
      }
    }
    
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateEnrolment = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    const prev = { isEnrolled: app.isEnrolled };
    app.isEnrolled = req.body.isEnrolled;
    app.enrolmentDate = req.body.enrolmentDate;
    app.enrolmentProof = req.body.enrolmentProof;
    app.enrolmentVerifiedBy = req.user.id;
    app.enrolmentVerifiedAt = new Date();
    app.updatedBy = req.user.id;
    await app.save();

    await createAudit(req, "ENROLMENT_STATUS_CHANGED", "Application", app._id, prev, { isEnrolled: app.isEnrolled });
    
    if (app.isEnrolled) {
      const lead = await StudentLead.findOne({ studentLeadId: app.studentLeadId });
      if (lead) {
        lead.pipelineStage = "ENROLLED";
        await lead.save();
      }
    }

    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCommission = async (req, res) => {
  try {
    const { studentLeadId, applicationId, university, intake, expectedCommission } = req.body;
    
    const existing = await Commission.findOne({ applicationId });
    if (existing) return res.status(409).json({ success: false, message: "Commission already tracking for this application" });

    const comm = new Commission({
      studentLeadId,
      applicationId,
      university,
      intake,
      expectedCommission,
      status: "EXPECTED",
      createdBy: req.user.id
    });
    await comm.save();

    await createAudit(req, "COMMISSION_CREATED", "Commission", comm._id, null, comm.toObject());
    res.status(201).json({ success: true, commission: comm });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.recordCommissionReceived = async (req, res) => {
  try {
    const { commissionId } = req.params;
    const { receivedAmount, paymentReference, evidence, receivedDate } = req.body;
    
    const comm = await Commission.findById(commissionId);
    if (!comm) return res.status(404).json({ success: false, message: "Commission not found" });

    const prev = { ...comm.toObject() };
    
    comm.commissionReceivedAmount = receivedAmount;
    comm.paymentReference = paymentReference;
    comm.evidence = evidence;
    comm.commissionReceivedDate = receivedDate || new Date();
    comm.status = "RECEIVED";
    
    // Calculate 50% Edu Leader Share
    comm.eduLeaderShare = receivedAmount * 0.50;
    comm.shareDueDate = addWorkingDays(comm.commissionReceivedDate, 7);
    comm.updatedBy = req.user.id;
    
    await comm.save();

    await createAudit(req, "COMMISSION_RECEIVED", "Commission", comm._id, prev, comm.toObject());
    
    // Update Lead Pipeline
    const lead = await StudentLead.findOne({ studentLeadId: comm.studentLeadId });
    if (lead) {
      lead.pipelineStage = "COMMISSION_RECEIVED";
      await lead.save();
    }
    
    res.json({ success: true, commission: comm });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.recordSharePaid = async (req, res) => {
  try {
    const { commissionId } = req.params;
    const { sharePaidAmount, sharePaymentReference } = req.body;
    
    const comm = await Commission.findById(commissionId);
    if (!comm) return res.status(404).json({ success: false, message: "Commission not found" });

    const prev = { ...comm.toObject() };
    
    comm.sharePaidAmount = sharePaidAmount;
    comm.sharePaymentReference = sharePaymentReference;
    comm.sharePaidDate = new Date();
    comm.status = "SHARE_PAID";
    comm.updatedBy = req.user.id;
    
    await comm.save();

    await createAudit(req, "EDU_LEADER_SHARE_PAID", "Commission", comm._id, prev, comm.toObject());
    
    // Update Lead Pipeline
    const lead = await StudentLead.findOne({ studentLeadId: comm.studentLeadId });
    if (lead) {
      lead.pipelineStage = "SHARE_PAID";
      await lead.save();
    }

    res.json({ success: true, commission: comm });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCommissions = async (req, res) => {
  try {
    const filter = req.query.studentLeadId ? { studentLeadId: req.query.studentLeadId } : {};
    const comms = await Commission.find(filter).populate("applicationId");
    res.json({ success: true, commissions: comms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

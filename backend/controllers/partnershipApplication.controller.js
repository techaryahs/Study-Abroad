const Application = require("../models/Application");
const StudentLead = require("../models/StudentLead");
const Offer = require("../models/Offer");
const Audit = require("../models/Audit");

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

exports.createApplication = async (req, res) => {
  try {
    const { studentLeadId } = req.params;
    const { universityName, course, country, intake } = req.body;

    const lead = await StudentLead.findOne({ studentLeadId });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    // Check duplicate
    const existing = await Application.findOne({ studentLeadId, universityName, course, intake });
    if (existing) return res.status(409).json({ success: false, message: "Duplicate application exists" });

    const count = await Application.countDocuments();
    const applicationId = `APP-${(count + 1).toString().padStart(4, '0')}`;

    const app = new Application({
      studentLeadId,
      universityName, course, country, intake,
      applicationId,
      createdBy: req.user.id
    });
    await app.save();

    await createAudit(req, "APPLICATION_CREATED", "Application", app._id, null, app.toObject());
    res.status(201).json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    const prev = { ...app.toObject() };
    Object.assign(app, req.body);
    app.updatedBy = req.user.id;
    await app.save();

    let action = "APPLICATION_UPDATED";
    if (req.body.status && req.body.status !== prev.status) {
      action = "APPLICATION_STATUS_CHANGED";
      if (req.body.status === "SUBMITTED") action = "APPLICATION_SUBMITTED";
      if (req.body.status === "WITHDRAWN") action = "APPLICATION_WITHDRAWN";
      if (req.body.status === "REJECTED") action = "APPLICATION_REJECTED";
    }

    await createAudit(req, action, "Application", app._id, prev, app.toObject());
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { studentLeadId } = req.params;
    const apps = await Application.find({ studentLeadId });
    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const { studentLeadId } = req.params;
    const { applicationId, universityName, course, country, intake, offerType, offerDate } = req.body;

    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    const offer = new Offer({
      studentLeadId,
      applicationId,
      universityName: universityName || app.universityName,
      course: course || app.course,
      country: country || app.country,
      intake: intake || app.intake,
      offerType,
      offerDate,
      createdBy: req.user.id
    });
    await offer.save();

    await createAudit(req, "OFFER_CREATED", "Offer", offer._id, null, offer.toObject());
    res.status(201).json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });

    const prev = { ...offer.toObject() };
    Object.assign(offer, req.body);
    offer.updatedBy = req.user.id;
    await offer.save();

    await createAudit(req, "OFFER_UPDATED", "Offer", offer._id, prev, offer.toObject());
    res.json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.acceptOffer = async (req, res) => {
  try {
    const { studentLeadId, offerId } = req.params;
    const { depositAmount, currency, notes } = req.body;

    // Check if another offer is already accepted
    const existingAccepted = await Offer.findOne({ studentLeadId, acceptanceStatus: "ACCEPTED" });
    if (existingAccepted && existingAccepted._id.toString() !== offerId) {
      return res.status(409).json({ success: false, message: "Another offer is already accepted. Please change accepted offer explicitly." });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ success: false, message: "Offer not found" });

    const prev = { ...offer.toObject() };
    offer.acceptanceStatus = "ACCEPTED";
    offer.acceptanceDate = new Date();
    offer.depositAmount = depositAmount;
    offer.currency = currency;
    offer.notes = notes;
    offer.updatedBy = req.user.id;
    await offer.save();

    // Update Student Pipeline Stage
    const lead = await StudentLead.findOne({ studentLeadId });
    if (lead) {
      const prevStage = lead.pipelineStage;
      lead.pipelineStage = "OFFER_ACCEPTED";
      await lead.save();
      await createAudit(req, "UPDATE_PIPELINE_STAGE", "StudentLead", studentLeadId, prevStage, "OFFER_ACCEPTED", "Offer accepted");
    }

    await createAudit(req, "OFFER_ACCEPTED", "Offer", offer._id, prev, offer.toObject());
    res.json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOffers = async (req, res) => {
  try {
    const { studentLeadId } = req.params;
    const offers = await Offer.find({ studentLeadId });
    res.json({ success: true, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

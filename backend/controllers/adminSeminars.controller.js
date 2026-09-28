const Seminar = require("../models/Seminar");
const Audit = require("../models/Audit");

const createAudit = async (req, action, entity, entityId, previousValue, newValue, reason = "") => {
  try {
    await Audit.create({
      userId: req.user?.id || req.user?._id,
      role: req.user?.role,
      action,
      entity,
      entityId,
      previousValue,
      newValue,
      reason
    });
  } catch (err) {}
};

exports.getSeminars = async (req, res) => {
  try {
    const seminars = await Seminar.find()
      .populate("createdBy", "name email")
      .populate("collegeId", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, seminars });
  } catch (error) {
    console.error("Error fetching seminars:", error);
    res.status(500).json({ success: false, message: "Server error fetching seminars." });
  }
};

exports.approveSeminar = async (req, res) => {
  try {
    const { id } = req.params;
    const seminar = await Seminar.findById(id);

    if (!seminar) {
      return res.status(404).json({ success: false, message: "Seminar not found" });
    }

    seminar.status = "APPROVED";
    seminar.approvedBy = req.user.id;
    seminar.approvedAt = new Date();
    await seminar.save();

    await createAudit(req, "SEMINAR_APPROVED", "Seminar", seminar._id, { previousStatus: "PENDING" }, seminar.toObject());

    res.json({ success: true, message: "Seminar approved successfully", seminar });
  } catch (error) {
    console.error("Error approving seminar:", error);
    res.status(500).json({ success: false, message: "Server error approving seminar." });
  }
};

exports.rejectSeminar = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: "Rejection reason is required." });
    }

    const seminar = await Seminar.findById(id);

    if (!seminar) {
      return res.status(404).json({ success: false, message: "Seminar not found" });
    }

    seminar.status = "REJECTED";
    seminar.rejectedBy = req.user.id;
    seminar.rejectedAt = new Date();
    seminar.rejectionReason = reason;
    await seminar.save();

    await createAudit(req, "SEMINAR_REJECTED", "Seminar", seminar._id, { previousStatus: "PENDING", reason }, seminar.toObject());

    res.json({ success: true, message: "Seminar rejected successfully", seminar });
  } catch (error) {
    console.error("Error rejecting seminar:", error);
    res.status(500).json({ success: false, message: "Server error rejecting seminar." });
  }
};

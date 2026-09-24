const Commission = require("../models/Commission");
const Application = require("../models/Application");
const StudentLead = require("../models/StudentLead");

exports.getReconciliation = async (req, res) => {
  try {
    const commissions = await Commission.find().populate("applicationId").lean();
    
    // We fetch all enrolled apps to see if they miss commission
    const enrolledApps = await Application.find({ isEnrolled: true }).lean();
    
    const results = [];
    
    // 1. Check commissions
    for (const comm of commissions) {
      let status = "OK";
      if (comm.status === "EXPECTED" && !comm.invoiceAmount) status = "EXPECTED_NOT_INVOICED";
      if (comm.status === "INVOICED" && !comm.commissionReceivedAmount) status = "INVOICED_NOT_RECEIVED";
      if (comm.status === "RECEIVED" && (!comm.evidence || comm.eduLeaderShare === 0)) status = "RECEIVED_MISSING_PROOF_OR_SHARE";
      if (comm.status === "RECEIVED" && comm.shareDueDate < new Date()) status = "SHARE_OVERDUE";
      
      results.push({
        type: "COMMISSION",
        studentLeadId: comm.studentLeadId,
        university: comm.university,
        intake: comm.intake,
        expected: comm.expectedCommission,
        invoiced: comm.invoiceAmount,
        received: comm.commissionReceivedAmount,
        share: comm.eduLeaderShare,
        sharePaid: comm.sharePaidAmount,
        dueDate: comm.shareDueDate,
        reconciliationStatus: status,
        commission: comm
      });
    }

    // 2. Missing commissions for Enrolled
    for (const app of enrolledApps) {
      const hasComm = commissions.some(c => c.applicationId?._id.toString() === app._id.toString());
      if (!hasComm) {
        results.push({
          type: "MISSING_COMMISSION",
          studentLeadId: app.studentLeadId,
          university: app.university,
          intake: app.intake,
          reconciliationStatus: "ENROLLED_NO_COMMISSION",
          application: app
        });
      }
    }

    res.json({ success: true, reconciliation: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

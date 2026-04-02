const User = require("../models/User");
const Student = require("../models/Student");
const ProgressReport = require("../models/ProgressReport");

exports.getParentDashboard = async (req, res) => {
  try {
    const parentId = req.user.id;
    const parent = await User.findById(parentId).select("-password");
    if (!parent || parent.role !== "parent") {
      return res.status(403).json({ message: "Access denied. Parent only." });
    }

    let studentId = parent.profile?.parentOf?.[0] || null;

    if (!studentId) {
      const linkedStudent = await Student.findOne({ "profile.parents": parent._id });
      if (linkedStudent) {
        studentId = linkedStudent._id;
        if (!parent.profile) parent.profile = {};
        parent.profile.parentOf = [studentId];
        await parent.save();
      }
    }

    if (!studentId) {
      return res.json({
        parentProfile: { name: parent.name, email: parent.email, mobile: parent.mobile },
        studentProfile: null,
        studentProgress: null
      });
    }

    const [student, studentProgress] = await Promise.all([
      Student.findById(studentId).select("-password"),
      ProgressReport.findOne({ userId: studentId })
    ]);

    if (!student) {
      return res.status(404).json({ message: "Linked student not found" });
    }

    res.json({
      parentProfile: {
        name: parent.name,
        email: parent.email,
        mobile: parent.mobile,
      },
      studentProfile: {
        _id: student._id,
        name: student.name,
        email: student.email,
        mobile: student.mobile,
        isPremium: student.profile?.isPremium || false,
        services: student.profile?.services || {}
      },
      studentProgress: studentProgress || {}
    });

  } catch (error) {
    console.error("Parent Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const College = require("../models/College");

exports.getColleges = async (req, res) => {
  try {
    const filter = req.user.role === "partner" ? { createdBy: req.user.id } : {};
    const colleges = await College.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, colleges });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to load colleges." });
  }
};

exports.createCollege = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const city = typeof req.body.city === "string" ? req.body.city.trim() : "";
    const coordinatorName = typeof req.body.coordinatorName === "string"
      ? req.body.coordinatorName.trim()
      : "";

    if (!name || !city) {
      return res.status(400).json({
        success: false,
        message: "College name and city are required.",
      });
    }

    const college = new College({
      name,
      city,
      coordinatorName,
      status: "PENDING",
      createdBy: req.user.id,
    });
    const collegeCode = name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4).padEnd(4, "X");
    college.collegeId = `${collegeCode}-${String(college._id).slice(-6).toUpperCase()}`;

    await college.save();
    res.status(201).json({ success: true, college });
  } catch (error) {
    res.status(400).json({ success: false, message: "Unable to create college." });
  }
};
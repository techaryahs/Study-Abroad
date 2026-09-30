const Student = require("../models/Student");
const universityService = require("../services/university.service");

/**
 * GET /api/universities
 * Supports query params: country, state, search
 */
exports.getUniversities = async (req, res) => {
  try {
    let student = null;
    if (req.user && (req.user.id || req.user._id)) {
      student = await Student.findById(req.user.id || req.user._id);
    }

    const { country, state, search } = req.query;
    const result = await universityService.getUniversities({ country, state, search }, student);

    return res.status(200).json({
      success: true,
      count: result.count,
      data: result.data,
    });
  } catch (error) {
    console.error("[UniversityController] Error listing universities:", error);
    return res.status(500).json({ success: false, message: "Failed to load university directory" });
  }
};

/**
 * GET /api/universities/:slug
 */
exports.getUniversityBySlug = async (req, res) => {
  try {
    let student = null;
    if (req.user && (req.user.id || req.user._id)) {
      student = await Student.findById(req.user.id || req.user._id);
    }

    const { slug } = req.params;
    const university = await universityService.getUniversityBySlug(slug, student);

    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    return res.status(200).json({
      success: true,
      data: university,
    });
  } catch (error) {
    console.error("[UniversityController] Error fetching university by slug:", error);
    return res.status(500).json({ success: false, message: "Failed to load university details" });
  }
};

const express = require("express");
const router = express.Router();
const coordinatorCtrl = require("../controllers/collegeCoordinator.controller");
const { verifyToken } = require("../middleware/auth");

const requireCoordinator = (req, res, next) => {
  if (req.user && req.user.role === "college_coordinator") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Access denied. College coordinator only." });
};

router.use(verifyToken);
router.use(requireCoordinator);

router.get("/profile", coordinatorCtrl.getProfile);
router.get("/seminars", coordinatorCtrl.getSeminars);
router.get("/seminars/:id", coordinatorCtrl.getSeminar);
router.put("/seminars/:id/attendance", coordinatorCtrl.verifyAttendance);

module.exports = router;

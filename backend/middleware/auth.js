const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Consultant = require("../models/Consultant");

function attachUserFromToken(decoded) {
  return {
    id: decoded.userId,
    _id: decoded.userId,
    role: decoded.role,
    email: decoded.email || null,
  };
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = attachUserFromToken(decoded);
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

/**
 * Attach req.user when a valid Bearer token is present; never fail the request.
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = attachUserFromToken(decoded);
  } catch {
    // Ignore invalid token — route handlers decide if auth is required.
  }
  return next();
};

/** Admin role only (after verifyToken). */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "No token provided" });
  }
  if (String(req.user.role || "").toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Admin access required", code: "ADMIN_ONLY" });
  }
  return next();
};

/**
 * Authenticated user may access resource for :email (self) or admin may access any.
 * Loads student onto req.student when the actor is a student.
 */
const requireSelfEmailOrAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No token provided" });
    }
    if (String(req.user.role || "").toLowerCase() === "admin") {
      return next();
    }

    const paramEmail = String(req.params.email || req.query.email || "")
      .trim()
      .toLowerCase();
    if (!paramEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    const student = await Student.findById(req.user.id || req.user._id);
    if (!student) {
      return res.status(403).json({ error: "Access denied", code: "FORBIDDEN" });
    }

    if (String(student.email || "").trim().toLowerCase() !== paramEmail) {
      return res.status(403).json({
        error: "You can only access your own records",
        code: "FORBIDDEN",
      });
    }

    req.student = student;
    return next();
  } catch (err) {
    console.error("requireSelfEmailOrAdmin:", err.message);
    return res.status(500).json({ error: "Authorization failed" });
  }
};

/**
 * Admin, or the consultant who owns the booking (by consultantId / consultantEmail).
 * Consultant JWT uses userId = Consultant._id.
 * Expects req.params.id = booking id. Loads booking onto req.booking.
 */
const requireAdminOrBookingConsultant = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "No token provided" });
    }
    if (String(req.user.role || "").toLowerCase() === "admin") {
      return next();
    }

    const Booking = require("../models/Booking");
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const actorId = req.user.id || req.user._id;
    // Consultant documents are looked up by _id (JWT userId for consultant role)
    let consultant = null;
    if (String(req.user.role || "").toLowerCase() === "consultant") {
      consultant = await Consultant.findById(actorId);
    }
    if (!consultant && req.user.email) {
      consultant = await Consultant.findOne({
        email: String(req.user.email).trim().toLowerCase(),
      });
    }

    const actorEmail = String(consultant?.email || req.user.email || "")
      .trim()
      .toLowerCase();

    const ownsById =
      consultant &&
      booking.consultantId &&
      String(booking.consultantId) === String(consultant._id);
    const ownsByEmail =
      actorEmail &&
      booking.consultantEmail &&
      String(booking.consultantEmail).trim().toLowerCase() === actorEmail;

    if (!ownsById && !ownsByEmail) {
      return res.status(403).json({
        error: "Not allowed to modify this booking",
        code: "FORBIDDEN",
      });
    }

    req.booking = booking;
    return next();
  } catch (err) {
    console.error("requireAdminOrBookingConsultant:", err.message);
    return res.status(500).json({ error: "Authorization failed" });
  }
};

module.exports = verifyToken;
module.exports.optionalAuth = optionalAuth;
module.exports.verifyToken = verifyToken;
module.exports.requireAdmin = requireAdmin;
module.exports.requireSelfEmailOrAdmin = requireSelfEmailOrAdmin;
module.exports.requireAdminOrBookingConsultant = requireAdminOrBookingConsultant;

const Student = require("../models/Student");
const Consultant = require("../models/Consultant");
const User = require("../models/User");
const { getEmailSearchRegex } = require("./emailUtils");

/**
 * Finds a user across all 3 collections by ID.
 * Returns { user, model, role }
 */
exports.findUserById = async (id) => {
  let user = await Student.findById(id);
  if (user) return { user, model: Student, role: "student" };
  
  user = await Consultant.findById(id);
  if (user) return { user, model: Consultant, role: "consultant" };
  
  user = await User.findById(id);
  if (user) return { user, model: User, role: user.role || "parent" };
  
  return null;
};

/**
 * Finds a user across all 3 collections using dot-insensitive regex.
 * Takes original email, returns { user, model, role }
 */
exports.findUserByEmail = async (email) => {
  if (!email) return null;
  const regex = getEmailSearchRegex(email);
  const query = { email: { $regex: regex } };
  
  let user = await Student.findOne(query);
  if (user) return { user, model: Student, role: "student" };
  
  user = await Consultant.findOne(query);
  if (user) return { user, model: Consultant, role: "consultant" };
  
  user = await User.findOne(query);
  if (user) return { user, model: User, role: user.role || "parent" };
  
  return null;
};

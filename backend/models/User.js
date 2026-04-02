const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    dob: { type: String },
    gender: { type: String },
    country: { type: String },
    state: { type: String },
    role: {
      type: String,
      enum: ["student", "consultant", "parent", "admin"],
      default: "student",
    },

    // 🔥 PROFILE DETAILS (NESTED OBJECT) 🔥
    // The user explicitly requested an embedded subdocument so that it can simply be expanded in their database IDE.
    profile: {
      // LINKING
      parentOf: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Now ref Student

      // OTP & VERIFICATION
      isVerified: { type: Boolean, default: false },

      // COSMETIC PROFILE DATA
      profileImage: { type: String, default: null },
      bio: { type: String, default: "" },
      location: { type: String, default: "" },
    }
  },
  { timestamps: true, autoCreate: false, autoIndex: false }
);

// Pre-save hook to hash password
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);

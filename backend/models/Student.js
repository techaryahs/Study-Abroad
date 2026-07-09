const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const WorkExperienceSchema = new mongoose.Schema({
  role: String,
  organization: String,
  type: String,
  startDate: Date,
  endDate: Date,
  isOngoing: { type: Boolean, default: false },
  country: String,
  state: String,
  description: String
}, { _id: true });

const StudentSchema = new mongoose.Schema(
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
      default: "student",
    },
    loginOtp: { type: String, default: null },
    loginOtpExpiresAt: { type: Date, default: null },
    loginOtpAttempts: { type: Number, default: 0 },

    profile: {
      parents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      isVerified: { type: Boolean, default: false },
      isPremium: { type: Boolean, default: false },
      isPublic: { type: Boolean, default: false },
      hasUsedFreeBooking: { type: Boolean, default: false },
      freeBookingUsedAt: { type: Date },
      isBasicAccount: { type: Boolean, default: false },

      profileImage: { type: String, default: null },
      resumeUrl: { type: String, default: null },
      bio: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      source: { type: String, default: "" },
      lookUpFor: [{ type: String }],
      loanInterest: { type: Boolean, default: false },

      // QUIZ & ROADMAP
      services: {
        quiz: {
          attempted: { type: Boolean, default: false },
          totalAttempts: { type: Number, default: 0 },
          bestScore: { type: Number, default: 0 }
        }
      },

      // EDUCATIONAL DATA
      highSchool: [{
        schoolName: String, cgpa: String, outOf: String, addedAt: { type: Date, default: Date.now }
      }],
      underGrad: [{
        uniName: String, degreeName: String, cgpa: String, outOf: String, startDate: Date, endDate: Date, isOngoing: { type: Boolean, default: false }
      }],
      masters: [{
        uniName: String, degreeName: String, cgpa: String, outOf: String, startDate: Date, endDate: Date, isOngoing: { type: Boolean, default: false }
      }],
      testScores: [{
        testType: String, score: String, sectionScores: mongoose.Schema.Types.Mixed, date: Date
      }],
      workExperience: [WorkExperienceSchema],
      research: [{
        title: String, publisher: String, date: Date, url: String
      }],
      projects: [{
        title: String, category: String, description: String, technologies: [String], startDate: Date, endDate: Date, projectUrl: String
      }],
      volunteering: [{
        organization: String, role: String, startDate: Date, endDate: Date, isOngoing: { type: Boolean, default: false }, cause: String, description: String
      }],
      targetUniversities: [{
        uniName: String, degree: String, major: String, term: String, year: String
      }],
      myBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
      mySessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    },
    
    membership: {
      planId: { type: String, default: "free" },
      catalogVersion: { type: Number, default: 1 },
      status: { type: String, enum: ['active', 'grace_period', 'expired', 'cancelled', 'none'], default: 'none' },
      platform: { type: String, enum: ['apple_iap', 'razorpay', 'admin', 'none'], default: 'none' },
      productId: { type: String },
      transactionId: { type: String },
      purchaseDate: { type: Date },
      expiryDate: { type: Date },
      usage: {
        type: Map,
        of: new mongoose.Schema({
          used: { type: Number, default: 0 },
          remaining: { type: Number },
          lastUsedAt: { type: Date }
        }, { _id: false }),
        default: {}
      },
      history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MembershipHistory' }]
    },
    
    cart: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true, autoCreate: false, autoIndex: false }
);

// Pre-save hook to hash password
StudentSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
StudentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.Student || mongoose.model("Student", StudentSchema);

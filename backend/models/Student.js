const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const EducationItemSchema = new mongoose.Schema({
  schoolName: String,
  uniName: String,
  degreeName: String,
  board: String,
  major: String,
  startYear: String,
  endYear: String,
  startDate: Date,
  endDate: Date,
  isOngoing: { type: Boolean, default: false },
  cgpa: String,
  outOf: String,
  backlogs: String,
  documentUrl: String,
  documentName: String,
  fileType: String,
  size: Number,
  addedAt: { type: Date, default: Date.now }
}, { _id: true, strict: false });

const TestScoreItemSchema = new mongoose.Schema({
  testType: String,
  score: String,
  sectionScores: mongoose.Schema.Types.Mixed,
  date: Date,
  documentUrl: String,
  documentName: String,
  fileType: String,
  size: Number,
  addedAt: { type: Date, default: Date.now }
}, { _id: true, strict: false });

const WorkExperienceSchema = new mongoose.Schema({
  role: String,
  organization: String,
  type: String,
  startDate: Date,
  endDate: Date,
  isOngoing: { type: Boolean, default: false },
  country: String,
  state: String,
  description: String,
  documentUrl: String,
  documentName: String,
  fileType: String,
  size: Number,
  addedAt: { type: Date, default: Date.now }
}, { _id: true, strict: false });

const ResearchItemSchema = new mongoose.Schema({
  title: String,
  publisher: String,
  date: Date,
  url: String,
  description: String,
  documentUrl: String,
  documentName: String,
  fileType: String,
  size: Number,
  addedAt: { type: Date, default: Date.now }
}, { _id: true, strict: false });

const ProjectItemSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  technologies: [String],
  startDate: Date,
  endDate: Date,
  projectUrl: String,
  documentUrl: String,
  documentName: String,
  fileType: String,
  size: Number,
  addedAt: { type: Date, default: Date.now }
}, { _id: true, strict: false });

const VolunteeringItemSchema = new mongoose.Schema({
  organization: String,
  role: String,
  startDate: Date,
  endDate: Date,
  isOngoing: { type: Boolean, default: false },
  cause: String,
  description: String,
  documentUrl: String,
  documentName: String,
  fileType: String,
  size: Number,
  addedAt: { type: Date, default: Date.now }
}, { _id: true, strict: false });

const TargetUniversitySchema = new mongoose.Schema({
  uniName: String,
  degree: String,
  major: String,
  term: String,
  year: String,
  targetCountry: String,
  tuitionBudget: String,
  scholarshipRequired: Boolean,
  documentUrl: String,
  documentName: String,
  fileType: String,
  size: Number,
  addedAt: { type: Date, default: Date.now }
}, { _id: true, strict: false });

const AchievementSchema = new mongoose.Schema({
  title: String,
  organization: String,
  issuer: String,
  year: String,
  date: String,
  description: String,
  documentUrl: String,
  documentName: String,
  fileType: String,
  size: Number,
  addedAt: { type: Date, default: Date.now }
}, { _id: true, strict: false });

const VaultDocumentSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  documentUrl: String,
  documentName: String,
  fileType: String,
  size: Number,
  addedAt: { type: Date, default: Date.now }
}, { _id: true, strict: false });

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
    location: { type: String, default: "" },
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
      resumeName: { type: String, default: null },
      resume: { type: String, default: null },
      location: { type: String, default: "" },
      bio: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
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
      highSchool: [EducationItemSchema],
      underGrad: [EducationItemSchema],
      masters: [EducationItemSchema],
      testScores: [TestScoreItemSchema],
      workExperience: [WorkExperienceSchema],
      research: [ResearchItemSchema],
      projects: [ProjectItemSchema],
      volunteering: [VolunteeringItemSchema],
      targetUniversities: [TargetUniversitySchema],
      achievements: [AchievementSchema],
      documents: [VaultDocumentSchema],
      myBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
      mySessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    },
    
    membership: { type: require("./schemas/UserMembershipSchema"), default: () => ({}) },
    
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

if (mongoose.models && mongoose.models.Student) {
  delete mongoose.models.Student;
}
module.exports = mongoose.model("Student", StudentSchema);

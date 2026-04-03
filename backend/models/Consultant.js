const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const bookingSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true }
}, { _id: false });

const slotSchema = new mongoose.Schema({
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
}, { _id: false });

const consultantSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  isVerified: { type: Boolean, default: false },

  name: { type: String, required: true },
  role: { type: String, required: true }, // job role (Career Counselor, etc.)
  expertise: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  availability: [slotSchema],
  bookings: [bookingSchema]
}, { timestamps: true, autoCreate: false, autoIndex: false });

// Pre-save hook to hash password
consultantSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify password
consultantSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.Consultant || mongoose.model('Consultant', consultantSchema);

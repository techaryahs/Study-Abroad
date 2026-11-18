const assert = require("assert");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const User = require("./models/User");
const profileController = require("./controllers/profile.controller");
const userHelper = require("./utils/userHelper");

mongoose.Document.prototype.populate = async function() { return this; };
mongoose.Document.prototype.save = async function() { return this; };

let activeMockUser = null;
Student.findById = () => Promise.resolve(activeMockUser);
User.findById = () => Promise.resolve(null);
const Consultant = require("./models/Consultant");
Consultant.findById = () => Promise.resolve(null);

async function runTests() {
  console.log("==================================================");
  console.log("🧪 STARTING USER PROFILE EMAIL FEATURE TEST SUITE");
  console.log("==================================================");

  // Test 1: getProfile returns email and strips password/loginOtp
  console.log("\n[TEST 1] Testing getProfile email delivery & security sanitation...");
  const mockStudent = new Student({
    _id: new mongoose.Types.ObjectId(),
    name: "Aarya Sharma",
    email: "aarya.sharma@eduleaderglobal.com",
    mobile: "+919876543210",
    password: "hashed_super_secret_password",
    loginOtp: "654321",
    gender: "Female",
    dob: "Aug 15, 2003",
    country: "India",
    profile: {
      bio: "Aspiring Oxford Scholar",
      location: "New Delhi, India"
    }
  });

  mockStudent.populate = async () => mockStudent;
  mockStudent.save = async () => mockStudent;

  activeMockUser = mockStudent;

  const req1 = { params: { userId: mockStudent._id.toString() } };
  let responseData = null;
  const res1 = {
    json(data) {
      responseData = data;
      return res1;
    },
    status(code) {
      this.statusCode = code;
      return res1;
    }
  };

  await profileController.getProfile(req1, res1);

  assert.ok(responseData, "Response data should be returned");
  assert.strictEqual(responseData.email, "aarya.sharma@eduleaderglobal.com", "Email address must match database record");
  assert.strictEqual(responseData.password, undefined, "Password must be sanitized and not returned");
  assert.strictEqual(responseData.loginOtp, undefined, "Login OTP must be sanitized and not returned");
  assert.strictEqual(responseData.name, "Aarya Sharma", "Name must match");
  console.log("✅ [TEST 1 PASSED] Profile returns email accurately without sensitive credentials.");

  // Test 2: Phone OTP user profile
  console.log("\n[TEST 2] Testing Phone OTP registered user email delivery...");
  const mockOtpUser = new Student({
    _id: new mongoose.Types.ObjectId(),
    name: "Rohan Patel",
    email: "rohan.patel@harvard.edu",
    mobile: "+919988776655",
    password: "otp_generated_random_password",
    gender: "Male",
    dob: "Jan 10, 2004",
    country: "India"
  });

  activeMockUser = mockOtpUser;

  await profileController.getProfile(req1, res1);
  assert.strictEqual(responseData.email, "rohan.patel@harvard.edu", "Phone OTP user's linked email must be returned");
  console.log("✅ [TEST 2 PASSED] Phone OTP user email returned properly.");

  // Test 3: Fallback handling when email is missing in record
  console.log("\n[TEST 3] Testing graceful fallback when email is not set...");
  const mockNoEmailUser = new Student({
    _id: new mongoose.Types.ObjectId(),
    name: "Guest User",
    mobile: "+919000000000",
    password: "random_password"
  });
  // Clear required email for test simulation
  mockNoEmailUser.email = undefined;

  activeMockUser = mockNoEmailUser;

  await profileController.getProfile(req1, res1);
  assert.strictEqual(responseData.email, undefined, "Should safely handle missing email without crash");
  console.log("✅ [TEST 3 PASSED] Missing email handled gracefully without errors.");

  // Test 4: updateProfile security - prevent arbitrary email tampering
  console.log("\n[TEST 4] Testing updateProfile security on existing email...");
  const existingUser = new Student({
    _id: new mongoose.Types.ObjectId(),
    name: "Original Name",
    email: "verified.student@eduleaderglobal.com",
    mobile: "+919876543210",
    password: "secret_password"
  });
  existingUser.save = async function() { return this; };

  activeMockUser = existingUser;

  const reqUpdate = {
    params: { userId: existingUser._id.toString() },
    body: {
      name: "Updated Name",
      email: "hacker@malicious.com" // Attempt to overwrite existing email
    }
  };

  const resUpdate = {
    json(data) { responseData = data; return resUpdate; },
    status(code) { this.statusCode = code; return resUpdate; }
  };

  await profileController.updateProfile(reqUpdate, resUpdate);
  assert.strictEqual(existingUser.name, "Updated Name", "Name should update");
  assert.strictEqual(existingUser.email, "verified.student@eduleaderglobal.com", "Existing email must NOT be overwritten without verification");
  console.log("✅ [TEST 4 PASSED] Existing verified email is protected against unauthorized tampering.");

  console.log("\n==================================================");
  console.log("🎉 ALL USER PROFILE EMAIL TESTS PASSED!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("❌ Test error:", err);
  process.exit(1);
});

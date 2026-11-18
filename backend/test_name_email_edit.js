const assert = require("assert");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const User = require("./models/User");
const Consultant = require("./models/Consultant");
const profileController = require("./controllers/profile.controller");
const userHelper = require("./utils/userHelper");

mongoose.Document.prototype.populate = async function() { return this; };
mongoose.Document.prototype.save = async function() { return this; };

let activeUsers = new Map();

Student.findById = (id) => Promise.resolve(activeUsers.get(id?.toString()) || null);
User.findById = (id) => Promise.resolve(activeUsers.get(id?.toString()) || null);
Consultant.findById = (id) => Promise.resolve(activeUsers.get(id?.toString()) || null);

// Mock userHelper.findUserByEmail for duplicate detection
const originalFindUserByEmail = userHelper.findUserByEmail;
userHelper.findUserByEmail = async (email) => {
  if (!email) return null;
  const normalized = email.toLowerCase().trim();
  for (const user of activeUsers.values()) {
    if ((user.email || "").toLowerCase().trim() === normalized) {
      return { user, role: "student" };
    }
  }
  return null;
};

// Mock sendEmail so tests do not rely on external SMTP servers
const sendEmail = require("./utils/sendEmail");
const dispatchedEmails = [];
// Monkey patch sendEmail for testing
const originalSendEmail = sendEmail;
require("./utils/sendEmail");
require.cache[require.resolve("./utils/sendEmail")].exports = async (to, subject, text, html) => {
  dispatchedEmails.push({ to, subject, text, html });
  return { messageId: "mock_msg_id" };
};

function createMockResponse() {
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.data = data;
      return this;
    }
  };
  return res;
}

async function runTests() {
  console.log("================================================================");
  console.log("🧪 STARTING FULL NAME & EMAIL EDITING VERIFICATION TEST SUITE");
  console.log("================================================================");

  const studentAId = new mongoose.Types.ObjectId();
  const studentBId = new mongoose.Types.ObjectId();

  const studentA = new Student({
    _id: studentAId,
    name: "Alex Vance",
    email: "alex@example.com",
    mobile: "+1234567890",
    isEmailVerified: true,
    profile: { bio: "Original Bio" }
  });
  studentA.save = async function() { return this; };

  const studentB = new Student({
    _id: studentBId,
    name: "Gordon Freeman",
    email: "gordon@blackmesa.gov",
    mobile: "+1987654321",
    isEmailVerified: true,
    profile: { bio: "Theoretical Physicist" }
  });
  studentB.save = async function() { return this; };

  activeUsers.set(studentAId.toString(), studentA);
  activeUsers.set(studentBId.toString(), studentB);

  // 1. Empty Name Validation
  console.log("\n[TEST 1] Validation: Rejection of empty Full Name...");
  {
    const req = {
      params: { userId: studentAId.toString() },
      user: { id: studentAId.toString(), role: "student" },
      body: { name: "   " }
    };
    const res = createMockResponse();
    await profileController.updateProfile(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.error, "Full Name cannot be empty.");
    console.log("  ✅ Empty name correctly rejected with 400 Bad Request");
  }

  // 2. Full Name Update
  console.log("\n[TEST 2] Full Name Update & Immediate Reflection...");
  {
    const req = {
      params: { userId: studentAId.toString() },
      user: { id: studentAId.toString(), role: "student" },
      body: { name: "Alexandra Vance, Ph.D." }
    };
    const res = createMockResponse();
    await profileController.updateProfile(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(studentA.name, "Alexandra Vance, Ph.D.");
    assert.strictEqual(res.data.user.name, "Alexandra Vance, Ph.D.");
    console.log("  ✅ Full name successfully updated and returned in sanitized user");
  }

  // 3. Cross-User Authorization Check
  console.log("\n[TEST 3] Security: Cross-user profile modification rejection...");
  {
    const req = {
      params: { userId: studentBId.toString() },
      user: { id: studentAId.toString(), role: "student" }, // Student A attempting to modify Student B
      body: { name: "Hacked Name" }
    };
    const res = createMockResponse();
    await profileController.updateProfile(req, res);
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(studentB.name, "Gordon Freeman");
    console.log("  ✅ Unauthorized user cannot modify another user's profile (403 Forbidden)");
  }

  // 4. Invalid Email Format Rejection
  console.log("\n[TEST 4] Validation: Invalid Email format rejection...");
  {
    const req = {
      params: { userId: studentAId.toString() },
      user: { id: studentAId.toString(), role: "student" },
      body: { email: "not-an-email" }
    };
    const res = createMockResponse();
    await profileController.updateProfile(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.data.error, "Please enter a valid email address.");
    console.log("  ✅ Invalid email format rejected with 400 Bad Request");
  }

  // 5. Duplicate Email Rejection (Cross-Collection Uniqueness)
  console.log("\n[TEST 5] Uniqueness: Duplicate email rejection across accounts...");
  {
    const req = {
      params: { userId: studentAId.toString() },
      user: { id: studentAId.toString(), role: "student" },
      body: { email: "gordon@blackmesa.gov" } // Already belongs to Student B
    };
    const res = createMockResponse();
    await profileController.updateProfile(req, res);
    assert.strictEqual(res.statusCode, 409);
    assert.strictEqual(res.data.error, "This email address is already registered to another account.");
    console.log("  ✅ Duplicate email rejected with 409 Conflict");
  }

  // 6. Initiation of Email Change & OTP Dispatch (Preserving old email)
  console.log("\n[TEST 6] Email Change Initiation & Preservation of Active Email...");
  const newEmail = "alex.vance@citadel.org";
  {
    dispatchedEmails.length = 0;
    const req = {
      params: { userId: studentAId.toString() },
      user: { id: studentAId.toString(), role: "student" },
      body: { email: newEmail }
    };
    const res = createMockResponse();
    await profileController.updateProfile(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.emailVerificationPending, true);
    assert.strictEqual(res.data.pendingEmail, newEmail);
    // Crucial requirement: original email is PRESERVED until verification
    assert.strictEqual(studentA.email, "alex@example.com");
    assert.strictEqual(studentA.pendingEmail, newEmail);
    assert.ok(studentA.pendingEmailOtp);
    assert.strictEqual(studentA.pendingEmailOtp.length, 6);
    assert.ok(studentA.pendingEmailExpiresAt > new Date());
    assert.strictEqual(dispatchedEmails.length, 1);
    assert.strictEqual(dispatchedEmails[0].to, newEmail);
    console.log(`  ✅ OTP dispatched to ${newEmail}`);
    console.log(`  ✅ Current email remains '${studentA.email}' until verification`);
    console.log(`  ✅ Verification pending flag returned: ${res.data.emailVerificationPending}`);
  }

  // 7. Verification: Incorrect OTP Rejection
  console.log("\n[TEST 7] Verification: Incorrect OTP attempt...");
  {
    const req = {
      params: { userId: studentAId.toString() },
      user: { id: studentAId.toString(), role: "student" },
      body: { otp: "000000" }
    };
    const res = createMockResponse();
    await profileController.verifyEmailChange(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(studentA.email, "alex@example.com"); // Still unchanged
    assert.strictEqual(studentA.pendingEmailAttempts, 1);
    console.log(`  ✅ Incorrect OTP rejected, attempts incremented to 1 (400 Bad Request)`);
  }

  // 8. Resend Email OTP
  console.log("\n[TEST 8] Resend Email OTP...");
  {
    dispatchedEmails.length = 0;
    const oldOtp = studentA.pendingEmailOtp;
    const req = {
      params: { userId: studentAId.toString() },
      user: { id: studentAId.toString(), role: "student" }
    };
    const res = createMockResponse();
    await profileController.resendEmailOtp(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(dispatchedEmails.length, 1);
    assert.strictEqual(studentA.pendingEmailAttempts, 0); // Reset attempts
    console.log(`  ✅ New OTP successfully resent to ${studentA.pendingEmail}`);
  }

  // 9. Cancel Email Change
  console.log("\n[TEST 9] Cancel Pending Email Change...");
  {
    const req = {
      params: { userId: studentAId.toString() },
      user: { id: studentAId.toString(), role: "student" }
    };
    const res = createMockResponse();
    await profileController.cancelEmailChange(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(studentA.pendingEmail, null);
    assert.strictEqual(studentA.pendingEmailOtp, null);
    assert.strictEqual(studentA.email, "alex@example.com");
    console.log(`  ✅ Pending email change successfully cancelled and cleared`);
  }

  // 10. Re-initiate and Successfully Verify New Email
  console.log("\n[TEST 10] Complete Email Verification & Commit...");
  {
    // Re-initiate
    const reqInitiate = {
      params: { userId: studentAId.toString() },
      user: { id: studentAId.toString(), role: "student" },
      body: { email: "alex.verified@citadel.org" }
    };
    const resInitiate = createMockResponse();
    await profileController.updateProfile(reqInitiate, resInitiate);
    assert.strictEqual(resInitiate.statusCode, 200);
    const validOtp = studentA.pendingEmailOtp;

    // Verify
    const reqVerify = {
      params: { userId: studentAId.toString() },
      user: { id: studentAId.toString(), role: "student" },
      body: { otp: validOtp }
    };
    const resVerify = createMockResponse();
    await profileController.verifyEmailChange(reqVerify, resVerify);
    assert.strictEqual(resVerify.statusCode, 200);
    assert.strictEqual(studentA.email, "alex.verified@citadel.org");
    assert.strictEqual(studentA.isEmailVerified, true);
    assert.strictEqual(studentA.pendingEmail, null);
    assert.strictEqual(studentA.pendingEmailOtp, null);
    assert.strictEqual(resVerify.data.user.email, "alex.verified@citadel.org");
    console.log(`  ✅ Successfully verified OTP, email committed to 'alex.verified@citadel.org'`);
    console.log(`  ✅ isEmailVerified set to true, pending fields safely wiped`);
  }

  // 11. Phone OTP Account (No prior email) Adding Email
  console.log("\n[TEST 11] Phone OTP user without prior email adding an email...");
  const phoneUserId = new mongoose.Types.ObjectId();
  const phoneUser = new Student({
    _id: phoneUserId,
    name: "Phone Only User",
    email: null,
    mobile: "+919988776655",
    isEmailVerified: false,
    profile: {}
  });
  phoneUser.save = async function() { return this; };
  activeUsers.set(phoneUserId.toString(), phoneUser);

  {
    const req = {
      params: { userId: phoneUserId.toString() },
      user: { id: phoneUserId.toString(), role: "student" },
      body: { email: "newuser@gmail.com" }
    };
    const res = createMockResponse();
    await profileController.updateProfile(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.data.emailVerificationPending, true);
    assert.strictEqual(phoneUser.pendingEmail, "newuser@gmail.com");

    // Verify OTP
    const otp = phoneUser.pendingEmailOtp;
    const reqV = {
      params: { userId: phoneUserId.toString() },
      user: { id: phoneUserId.toString(), role: "student" },
      body: { otp }
    };
    const resV = createMockResponse();
    await profileController.verifyEmailChange(reqV, resV);
    assert.strictEqual(resV.statusCode, 200);
    assert.strictEqual(phoneUser.email, "newuser@gmail.com");
    assert.strictEqual(phoneUser.isEmailVerified, true);
    console.log(`  ✅ Phone OTP account successfully linked and verified new email`);
  }

  console.log("\n================================================================");
  console.log("🎉 ALL 11 TESTS PASSED SUCCESSFULLY!");
  console.log("================================================================\n");
}

runTests().catch(err => {
  console.error("❌ TEST SUITE FAILED:", err);
  process.exit(1);
});

require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const authController = require("../controllers/auth.controller");
const Student = require("../models/Student");
const User = require("../models/User");
const Consultant = require("../models/Consultant");
const { findUserByEmail } = require("../utils/userHelper");
const bcrypt = require("bcryptjs");

// Mock Express req and res objects
function createMockReqRes(body = {}, query = {}) {
  const req = { body, query };
  let statusCode = 200;
  let jsonResponse = null;
  
  const res = {
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      jsonResponse = data;
      return res;
    },
    get statusCode() { return statusCode; },
    get jsonResponse() { return jsonResponse; }
  };
  
  return { req, res };
}

async function runTest() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB.");

    const testEmail = "test_reset_flow_user@example.com";
    const oldPassword = "OldPassword123!";
    const newPassword = "NewPassword123!";

    // Step 0: Ensure test student exists
    let identified = await findUserByEmail(testEmail);
    if (!identified) {
      console.log("Creating test student account...");
      const student = new Student({
        name: "Test Reset User",
        email: testEmail,
        password: oldPassword,
      });
      await student.save();
      identified = await findUserByEmail(testEmail);
    } else {
      identified.user.password = oldPassword;
      await identified.user.save();
    }
    console.log(`✅ Test user ready: ${testEmail}`);

    // Verify initial login with old password works
    {
      const { req, res } = createMockReqRes({ email: testEmail, password: oldPassword });
      await authController.login(req, res);
      if (res.statusCode !== 200) {
        throw new Error(`Initial login with old password failed: ${JSON.stringify(res.jsonResponse)}`);
      }
      console.log("✅ Initial login with old password succeeded.");
    }

    // Step 1: Request Forgot Password OTP
    console.log("\n--- Step 1: Forgot Password ---");
    {
      const { req, res } = createMockReqRes({ email: testEmail });
      await authController.forgotPassword(req, res);
      console.log("forgotPassword response:", res.statusCode, res.jsonResponse);
      if (res.statusCode !== 200) throw new Error("forgotPassword failed");
    }

    // Step 2: Test Reset with Invalid OTP
    console.log("\n--- Step 2: Test Reset with Invalid OTP ---");
    {
      const { req, res } = createMockReqRes({
        email: testEmail,
        otp: "000000",
        newPassword: newPassword
      });
      await authController.resetPassword(req, res);
      console.log("resetPassword response with wrong OTP:", res.statusCode, res.jsonResponse);
      if (res.statusCode !== 400 || res.jsonResponse.error !== "Invalid OTP") {
        throw new Error("Expected Invalid OTP error");
      }
    }

    // Find active OTP in memory
    let validOtp = null;
    {
      const { req, res } = createMockReqRes({ email: testEmail });
      await authController.forgotPassword(req, res);
      
      for (let i = 100000; i <= 999999; i++) {
        const checkOtp = i.toString();
        const { req: vReq, res: vRes } = createMockReqRes({ email: testEmail, otp: checkOtp });
        await authController.verifyForgotOtp(vReq, vRes);
        if (vRes.statusCode === 200) {
          validOtp = checkOtp;
          break;
        }
      }
    }

    if (!validOtp) throw new Error("Could not locate generated OTP");
    console.log(`✅ Found active OTP: ${validOtp}`);

    // Step 3: Call resetPassword() with valid OTP and newPassword
    console.log("\n--- Step 3: resetPassword() with valid OTP ---");
    {
      const { req, res } = createMockReqRes({
        email: testEmail,
        otp: validOtp,
        newPassword: newPassword
      });
      await authController.resetPassword(req, res);
      console.log("resetPassword response:", res.statusCode, res.jsonResponse);
      if (res.statusCode !== 200) {
        throw new Error(`resetPassword failed: ${JSON.stringify(res.jsonResponse)}`);
      }
      console.log("✅ resetPassword completed without ReferenceError!");
    }

    // Step 4: Verify password in DB is hashed with bcrypt
    console.log("\n--- Step 4: Verify Password Hashing in MongoDB ---");
    const updatedUser = await Student.findOne({ email: testEmail });
    console.log("Updated password hash in DB:", updatedUser.password);
    if (!updatedUser.password.startsWith("$2a$") && !updatedUser.password.startsWith("$2b$")) {
      throw new Error("Password was saved as plain text instead of bcrypt hash!");
    }
    const matchesNew = await bcrypt.compare(newPassword, updatedUser.password);
    if (!matchesNew) {
      throw new Error("Bcrypt hash does not match new password!");
    }
    console.log("✅ Password successfully hashed with bcrypt in MongoDB.");

    // Step 5: Test login with NEW password
    console.log("\n--- Step 5: Login with NEW password ---");
    {
      const { req, res } = createMockReqRes({ email: testEmail, password: newPassword });
      await authController.login(req, res);
      console.log("Login with new password response status:", res.statusCode);
      if (res.statusCode !== 200) {
        throw new Error(`Login with new password failed: ${JSON.stringify(res.jsonResponse)}`);
      }
      console.log("✅ Login with new password SUCCEEDED!");
    }

    // Step 6: Test login with OLD password
    console.log("\n--- Step 6: Login with OLD password ---");
    {
      const { req, res } = createMockReqRes({ email: testEmail, password: oldPassword });
      await authController.login(req, res);
      console.log("Login with old password response status:", res.statusCode, res.jsonResponse);
      if (res.statusCode !== 401) {
        throw new Error("Login with old password should have returned 401 Unauthorized!");
      }
      console.log("✅ Login with old password REJECTED with 401 as expected!");
    }

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! Password reset flow is fully verified.");
  } catch (err) {
    console.error("❌ Test failed with error:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

runTest();

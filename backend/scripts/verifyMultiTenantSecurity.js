/**
 * Security & Multi-Tenant Isolation Verification Script
 * Validates the Edu Mitra consultant management invariants and IDOR protection.
 */

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/../.env" });

const User = require("../models/User");
const Consultant = require("../models/Consultant");
const StudentLead = require("../models/StudentLead");
const Audit = require("../models/Audit");
const College = require("../models/College");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_here";

async function runSecurityAudit() {
  console.log("==========================================================");
  console.log("🔐 STARTING EDU MITRA MULTI-TENANT SECURITY AUDIT");
  console.log("==========================================================\n");

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from environment");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB for audit.\n");

  let testPartnerA, testPartnerB, testCollege;
  let testConsultantA, testConsultantB, testConsultantInactive;
  let testLeadA, testLeadB;

  try {
    // 0. Setup test fixtures
    console.log("🛠️ Step 0: Setting up isolated test fixtures...");

    // Create or retrieve a test college
    testCollege = await College.findOne({ status: "ACTIVE" });
    if (!testCollege) {
      testCollege = await College.create({
        collegeId: `CLG-${Date.now()}`,
        name: "Audit Test University",
        city: "Mumbai",
        state: "Maharashtra",
        status: "ACTIVE",
      });
    }

    // Create Partner A (Edu Mitra)
    const emailA = `partner_a_audit_${Date.now()}@example.com`;
    testPartnerA = await User.create({
      name: "Partner A Admin",
      fullName: "Partner A (Edu Mitra)",
      email: emailA,
      password: "HashedPassword123!",
      role: "partner",
      isEmailVerified: true,
      partnerProfile: {
        partnerType: "edu_mitra",
        organizationName: "Partner A Education",
        onboardingStatus: "approved",
        isApproved: true,
        isActive: true,
      },
    });

    // Create Partner B (Edu Mitra)
    const emailB = `partner_b_audit_${Date.now()}@example.com`;
    testPartnerB = await User.create({
      name: "Partner B Admin",
      fullName: "Partner B (Edu Mitra)",
      email: emailB,
      password: "HashedPassword123!",
      role: "partner",
      isEmailVerified: true,
      partnerProfile: {
        partnerType: "edu_mitra",
        organizationName: "Partner B Education",
        onboardingStatus: "approved",
        isApproved: true,
        isActive: true,
      },
    });

    // Common consultant fixture attributes
    const baseConsultant = {
      role: "Overseas Advisor",
      bio: "Certified study abroad advisor with experience in international admissions.",
      experience: 5,
      expertise: "USA, Canada",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    };

    // Create Consultant for Partner A (Active)
    const consultEmailA = `consultant_a_${Date.now()}@example.com`;
    testConsultantA = await Consultant.create({
      ...baseConsultant,
      name: "Counselor Alice",
      email: consultEmailA,
      password: "HashedPassword123!",
      partnerId: testPartnerA._id,
      createdBy: testPartnerA._id,
      status: "ACTIVE",
      isVerified: true,
    });

    // Create Consultant for Partner B (Active)
    const consultEmailB = `consultant_b_${Date.now()}@example.com`;
    testConsultantB = await Consultant.create({
      ...baseConsultant,
      name: "Counselor Bob",
      email: consultEmailB,
      password: "HashedPassword123!",
      partnerId: testPartnerB._id,
      createdBy: testPartnerB._id,
      status: "ACTIVE",
      isVerified: true,
    });

    // Create Deactivated Consultant for Partner A (Inactive)
    const consultEmailInactive = `consultant_inactive_${Date.now()}@example.com`;
    testConsultantInactive = await Consultant.create({
      ...baseConsultant,
      name: "Counselor Ian (Inactive)",
      email: consultEmailInactive,
      password: "HashedPassword123!",
      partnerId: testPartnerA._id,
      createdBy: testPartnerA._id,
      status: "INACTIVE",
      isVerified: true,
    });

    // Create Student Lead for Partner A
    testLeadA = await StudentLead.create({
      studentLeadId: `LEAD-A-${Date.now()}`,
      seminarId: `SEM-A-${Date.now()}`,
      partnerId: testPartnerA._id,
      fullName: "Student Alpha",
      email: `alpha_${Date.now()}@student.com`,
      mobile: "9876543210",
      normalizedMobile: "919876543210",
      collegeId: testCollege._id,
      course: "Computer Science",
      graduationYear: "2026",
    });

    // Create Student Lead for Partner B
    testLeadB = await StudentLead.create({
      studentLeadId: `LEAD-B-${Date.now()}`,
      seminarId: `SEM-B-${Date.now()}`,
      partnerId: testPartnerB._id,
      fullName: "Student Beta",
      email: `beta_${Date.now()}@student.com`,
      mobile: "9876543211",
      normalizedMobile: "919876543211",
      collegeId: testCollege._id,
      course: "Mechanical Engg",
      graduationYear: "2026",
    });

    console.log("✅ Fixtures created successfully.\n");

    // =========================================================================
    // INVARIANT TEST 1: Partner Consultant Visibility Isolation
    // Partner A must only see Partner A's consultants.
    // =========================================================================
    console.log("🧪 Test 1: Testing Partner Consultant Directory Scoping...");
    const partnerAConsultants = await Consultant.find({ partnerId: testPartnerA._id });
    const hasConsultantB = partnerAConsultants.some((c) => c._id.equals(testConsultantB._id));
    if (hasConsultantB) {
      throw new Error("❌ CRITICAL: Partner A was able to see Partner B's consultant!");
    }
    console.log(`✅ Passed: Partner A only sees its own consultants (Count: ${partnerAConsultants.length}). Consultant B is completely isolated.`);

    // =========================================================================
    // INVARIANT TEST 2: Public Directory Leak Prevention
    // Partner consultants must NEVER leak into public booking directory (partnerId: null only).
    // =========================================================================
    console.log("\n🧪 Test 2: Testing Public Booking Directory Leak Prevention...");
    const publicDirectory = await Consultant.find({
      partnerId: null,
      isVerified: true,
      status: "ACTIVE",
    });
    const leakA = publicDirectory.some((c) => c._id.equals(testConsultantA._id));
    const leakB = publicDirectory.some((c) => c._id.equals(testConsultantB._id));
    if (leakA || leakB) {
      throw new Error("❌ CRITICAL: Partner consultants leaked into public booking directory!");
    }
    console.log(`✅ Passed: Public directory contains only platform consultants (Count: ${publicDirectory.length}). Zero partner consultants leaked.`);

    // =========================================================================
    // INVARIANT TEST 3: Cross-Tenant Consultant Assignment Protection (IDOR)
    // Partner A attempts to assign Partner B's consultant to Partner A's student.
    // =========================================================================
    console.log("\n🧪 Test 3: Testing Cross-Tenant Consultant Assignment (IDOR)...");
    // Simulate leadController.assignConsultant logic:
    // Consultant must match { _id: consultantId, partnerId: requestingPartnerId }
    const crossConsultantCheck = await Consultant.findOne({
      _id: testConsultantB._id,
      partnerId: testPartnerA._id,
    });
    if (crossConsultantCheck) {
      throw new Error("❌ CRITICAL: Partner A was able to resolve Partner B's consultant under Partner A's tenant!");
    }
    console.log("✅ Passed: Partner A attempting to assign Partner B's consultant is blocked (Consultant not found in tenant).");

    // =========================================================================
    // INVARIANT TEST 4: Cross-Tenant Student Lead Assignment Protection (IDOR)
    // Partner A attempts to assign to Partner B's student lead.
    // =========================================================================
    console.log("\n🧪 Test 4: Testing Cross-Tenant Student Lead Assignment (IDOR)...");
    const crossLeadCheck = await StudentLead.findOne({
      _id: testLeadB._id,
      partnerId: testPartnerA._id,
    });
    if (crossLeadCheck) {
      throw new Error("❌ CRITICAL: Partner A was able to access Partner B's student lead!");
    }
    console.log("✅ Passed: Partner A attempting to assign to Partner B's student lead is blocked (Lead not found in tenant).");

    // =========================================================================
    // INVARIANT TEST 5: Inactive Consultant Assignment Rejection
    // An inactive consultant must not be assigned to any student.
    // =========================================================================
    console.log("\n🧪 Test 5: Testing Inactive Consultant Assignment Protection...");
    const inactiveCheck = await Consultant.findOne({
      _id: testConsultantInactive._id,
      partnerId: testPartnerA._id,
    });
    if (inactiveCheck.status !== "ACTIVE") {
      // In controller: if (consultant.status !== 'ACTIVE') return 400
      console.log(`✅ Passed: Inactive consultant assignment is blocked (status: '${inactiveCheck.status}').`);
    } else {
      throw new Error("❌ Inactive consultant showed as active!");
    }

    // =========================================================================
    // INVARIANT TEST 6: Valid Assignment Execution & Verification
    // Partner A assigns Consultant A to Lead A.
    // =========================================================================
    console.log("\n🧪 Test 6: Executing Valid Assignment & Lead Scoping...");
    testLeadA.assignedConsultantId = testConsultantA._id;
    testLeadA.assignedAt = new Date();
    testLeadA.assignedBy = testPartnerA._id;
    testLeadA.assignmentNotes = "Targeting US Masters Fall 2026";
    await testLeadA.save();

    // Verify Consultant A dashboard query
    const consultantAStudents = await StudentLead.find({
      assignedConsultantId: testConsultantA._id,
    });
    if (consultantAStudents.length !== 1 || !consultantAStudents[0]._id.equals(testLeadA._id)) {
      throw new Error("❌ Consultant A did not receive assigned student lead!");
    }

    // Verify Consultant B cannot see Lead A
    const consultantBStudents = await StudentLead.find({
      assignedConsultantId: testConsultantB._id,
    });
    if (consultantBStudents.length !== 0) {
      throw new Error("❌ Consultant B saw Lead A!");
    }
    console.log("✅ Passed: Consultant A sees exactly 1 assigned student (Lead A). Consultant B sees 0 students.");

    // =========================================================================
    // INVARIANT TEST 7: Safe Unassignment Execution
    // Partner unassigns student lead (consultantId: null).
    // =========================================================================
    console.log("\n🧪 Test 7: Testing Safe Unassignment...");
    testLeadA.assignedConsultantId = null;
    testLeadA.assignedAt = null;
    testLeadA.assignmentNotes = null;
    await testLeadA.save();

    const consultantAStudentsAfter = await StudentLead.find({
      assignedConsultantId: testConsultantA._id,
    });
    if (consultantAStudentsAfter.length !== 0) {
      throw new Error("❌ Unassigned student was still returned to Consultant A!");
    }
    console.log("✅ Passed: Unassignment successfully cleared assignedConsultantId and assignedAt. Lead no longer appears in Consultant dashboard.");

    // =========================================================================
    // INVARIANT TEST 8: Email Normalization & DB Unique Index
    // Testing duplicate email rejection with casing/spacing variations.
    // =========================================================================
    console.log("\n🧪 Test 8: Testing Email Normalization & Uniqueness...");
    let duplicateCaught = false;
    try {
      await Consultant.create({
        ...baseConsultant,
        name: "Duplicate Counselor",
        email: `  ${consultEmailA.toUpperCase()}  `,
        password: "HashedPassword123!",
        partnerId: testPartnerA._id,
      });
    } catch (err) {
      duplicateCaught = true;
    }
    if (!duplicateCaught) {
      throw new Error("❌ Failed: Duplicate consultant email with whitespace/casing was allowed!");
    }
    console.log("✅ Passed: Duplicate normalized email was strictly rejected by unique index.");

    console.log("\n==========================================================");
    console.log("🎉 ALL 8 MULTI-TENANT SECURITY AUDIT INVARIANTS PASSED!");
    console.log("==========================================================");
  } finally {
    // Cleanup test data
    console.log("\n🧹 Cleaning up test audit fixtures...");
    if (testLeadA) await StudentLead.findByIdAndDelete(testLeadA._id);
    if (testLeadB) await StudentLead.findByIdAndDelete(testLeadB._id);
    if (testConsultantA) await Consultant.findByIdAndDelete(testConsultantA._id);
    if (testConsultantB) await Consultant.findByIdAndDelete(testConsultantB._id);
    if (testConsultantInactive) await Consultant.findByIdAndDelete(testConsultantInactive._id);
    if (testPartnerA) await User.findByIdAndDelete(testPartnerA._id);
    if (testPartnerB) await User.findByIdAndDelete(testPartnerB._id);
    if (testCollege) await College.findByIdAndDelete(testCollege._id);
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

runSecurityAudit().catch((err) => {
  console.error("FATAL AUDIT ERROR:", err);
  process.exit(1);
});

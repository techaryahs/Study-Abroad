/**
 * Comprehensive HTTP/API Authorization & Security Verification Suite
 * Tests actual HTTP requests against live Express server for:
 * 1. Partner A vs Partner B multi-tenant isolation (Listing, Status, Assignment)
 * 2. Consultant A vs Consultant B data isolation & IDOR
 * 3. Admin cross-tenant invariants & explicit partnerId validation
 * 4. Inactive accounts & Stale JWT request-time revocation
 * 5. Malformed ID resilience (no 500 crashes)
 * 6. Cross-collection email uniqueness
 * 7. Guaranteed fixture teardown & database isolation
 */

const http = require("http");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config({ path: __dirname + "/../.env" });

const app = require("../index");
const User = require("../models/User");
const Consultant = require("../models/Consultant");
const StudentLead = require("../models/StudentLead");
const College = require("../models/College");
const Booking = require("../models/Booking");

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_here";

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

async function runHttpSecurityAudit() {
  console.log("==================================================================");
  console.log("🚀 STARTING COMPREHENSIVE PRODUCTION HTTP/API SECURITY AUDIT");
  console.log("==================================================================\n");

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGO_URI is missing");

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }

  // Start ephemeral HTTP server on dynamic port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`🌐 Ephemeral test server active on ${baseUrl}\n`);

  const client = axios.create({
    baseURL: baseUrl,
    validateStatus: () => true, // Don't throw on non-2xx
  });

  const timestamp = Date.now();
  const testIds = [];

  // Variables for fixtures
  let partnerA, partnerB, nonEduMitraPartner, adminUser;
  let consultantA, consultantB;
  let leadA, leadB;
  let college;

  try {
    console.log("📦 [Setup] Creating isolated production-like test fixtures...");

    // 1. College
    college = await College.create({
      collegeId: `CLG_TEST_${timestamp}`,
      name: `Test Univ ${timestamp}`,
      status: "ACTIVE",
    });
    testIds.push({ model: College, id: college._id });

    // 2. Partner A (Edu Mitra)
    partnerA = await User.create({
      name: `Partner A Admin ${timestamp}`,
      fullName: `Partner A Inc`,
      email: `partner_a_${timestamp}@example.com`,
      password: "TestPassword123!",
      role: "partner",
      isEmailVerified: true,
      partnerProfile: {
        partnerType: "edu_mitra",
        organizationName: "Org A",
        onboardingStatus: "approved",
        isApproved: true,
        isActive: true,
      },
    });
    testIds.push({ model: User, id: partnerA._id });

    // 3. Partner B (Edu Mitra)
    partnerB = await User.create({
      name: `Partner B Admin ${timestamp}`,
      fullName: `Partner B Inc`,
      email: `partner_b_${timestamp}@example.com`,
      password: "TestPassword123!",
      role: "partner",
      isEmailVerified: true,
      partnerProfile: {
        partnerType: "edu_mitra",
        organizationName: "Org B",
        onboardingStatus: "approved",
        isApproved: true,
        isActive: true,
      },
    });
    testIds.push({ model: User, id: partnerB._id });

    // 4. Partner C (Edu Leader - non Edu Mitra)
    nonEduMitraPartner = await User.create({
      name: `Leader C Admin ${timestamp}`,
      fullName: `Leader C Inc`,
      email: `leader_c_${timestamp}@example.com`,
      password: "TestPassword123!",
      role: "partner",
      isEmailVerified: true,
      partnerProfile: {
        partnerType: "edu_leader",
        organizationName: "Leader C",
        onboardingStatus: "approved",
        isApproved: true,
        isActive: true,
      },
    });
    testIds.push({ model: User, id: nonEduMitraPartner._id });

    // 5. Admin User
    adminUser = await User.create({
      name: `Platform Admin ${timestamp}`,
      email: `admin_${timestamp}@example.com`,
      password: "AdminPassword123!",
      role: "admin",
      isEmailVerified: true,
    });
    testIds.push({ model: User, id: adminUser._id });

    // 6. Consultant A (under Partner A)
    consultantA = await Consultant.create({
      name: "Counselor Alice",
      email: `counselor_a_${timestamp}@example.com`,
      password: "ConsultantPass123!",
      role: "Overseas Advisor",
      expertise: "USA, Canada",
      experience: "5 years",
      bio: "Advising students for 5 years",
      image: "/avatar.png",
      partnerId: partnerA._id,
      createdBy: partnerA._id,
      status: "ACTIVE",
      isVerified: true,
    });
    testIds.push({ model: Consultant, id: consultantA._id });

    // 7. Consultant B (under Partner B)
    consultantB = await Consultant.create({
      name: "Counselor Bob",
      email: `counselor_b_${timestamp}@example.com`,
      password: "ConsultantPass123!",
      role: "Overseas Advisor",
      expertise: "UK, Australia",
      experience: "4 years",
      bio: "Advising students for 4 years",
      image: "/avatar.png",
      partnerId: partnerB._id,
      createdBy: partnerB._id,
      status: "ACTIVE",
      isVerified: true,
    });
    testIds.push({ model: Consultant, id: consultantB._id });

    // 8. Student Lead A (Partner A)
    leadA = await StudentLead.create({
      studentLeadId: `LEAD-A-${timestamp}`,
      seminarId: `SEM-A-${timestamp}`,
      partnerId: partnerA._id,
      fullName: "Student Alpha",
      email: `student_a_${timestamp}@example.com`,
      mobile: "9100000001",
      normalizedMobile: "919100000001",
      collegeId: college._id,
    });
    testIds.push({ model: StudentLead, id: leadA._id });

    // 9. Student Lead B (Partner B)
    leadB = await StudentLead.create({
      studentLeadId: `LEAD-B-${timestamp}`,
      seminarId: `SEM-B-${timestamp}`,
      partnerId: partnerB._id,
      fullName: "Student Beta",
      email: `student_b_${timestamp}@example.com`,
      mobile: "9100000002",
      normalizedMobile: "919100000002",
      collegeId: college._id,
    });
    testIds.push({ model: StudentLead, id: leadB._id });

    console.log("✅ Fixtures created.\n");

    // Tokens
    const tokenPartnerA = createToken({ userId: partnerA._id, role: "partner", email: partnerA.email });
    const tokenPartnerB = createToken({ userId: partnerB._id, role: "partner", email: partnerB.email });
    const tokenAdmin = createToken({ userId: adminUser._id, role: "admin", email: adminUser.email });
    const tokenConsultantA = createToken({ userId: consultantA._id, role: "consultant", email: consultantA.email });
    const tokenConsultantB = createToken({ userId: consultantB._id, role: "consultant", email: consultantB.email });

    // =========================================================================
    // TEST SECTION 1: Partner A vs Partner B Multi-Tenant Isolation
    // =========================================================================
    console.log("🧪 [1.1] Partner A lists consultants -> must only see Consultant A");
    const listResA = await client.get("/api/partnership/consultants", {
      headers: { Authorization: `Bearer ${tokenPartnerA}` },
    });
    if (listResA.status !== 200) throw new Error(`Expected 200, got ${listResA.status}`);
    const consA = listResA.data.consultants;
    if (!consA.some((c) => c._id === String(consultantA._id)) || consA.some((c) => c._id === String(consultantB._id))) {
      throw new Error("❌ Partner A saw Consultant B or missed Consultant A!");
    }
    console.log("   ✅ PASSED: Scoped strictly to Partner A's consultants.");

    console.log("\n🧪 [1.2] Partner A attempts to modify status of Partner B's consultant -> 404 forbidden");
    const statusRes = await client.patch(
      `/api/partnership/consultants/${consultantB._id}/status`,
      { status: "INACTIVE" },
      { headers: { Authorization: `Bearer ${tokenPartnerA}` } }
    );
    if (statusRes.status !== 404) {
      throw new Error(`Expected 404, got ${statusRes.status}: ${JSON.stringify(statusRes.data)}`);
    }
    console.log("   ✅ PASSED: Partner A blocked from modifying Partner B's consultant.");

    console.log("\n🧪 [1.3] Partner A attempts to assign Partner B's consultant to Lead A -> 403 denied");
    const crossAssignConsRes = await client.put(
      `/api/partnership-leads/${leadA.studentLeadId}/assign-consultant`,
      { consultantId: String(consultantB._id) },
      { headers: { Authorization: `Bearer ${tokenPartnerA}` } }
    );
    if (crossAssignConsRes.status !== 403) {
      throw new Error(`Expected 403, got ${crossAssignConsRes.status}: ${JSON.stringify(crossAssignConsRes.data)}`);
    }
    console.log("   ✅ PASSED: Cross-tenant consultant assignment strictly rejected (403).");

    console.log("\n🧪 [1.4] Partner A attempts to assign to Partner B's student lead -> 403 denied");
    const crossAssignLeadRes = await client.put(
      `/api/partnership-leads/${leadB.studentLeadId}/assign-consultant`,
      { consultantId: String(consultantA._id) },
      { headers: { Authorization: `Bearer ${tokenPartnerA}` } }
    );
    if (crossAssignLeadRes.status !== 403) {
      throw new Error(`Expected 403, got ${crossAssignLeadRes.status}: ${JSON.stringify(crossAssignLeadRes.data)}`);
    }
    console.log("   ✅ PASSED: Cross-tenant lead assignment strictly rejected (403).");

    // =========================================================================
    // TEST SECTION 2: Consultant Data Isolation & IDOR
    // =========================================================================
    console.log("\n🧪 [2.1] Assign Lead A to Consultant A, Lead B to Consultant B");
    await client.put(
      `/api/partnership-leads/${leadA.studentLeadId}/assign-consultant`,
      { consultantId: String(consultantA._id), notes: "Alice handling" },
      { headers: { Authorization: `Bearer ${tokenPartnerA}` } }
    );
    await client.put(
      `/api/partnership-leads/${leadB.studentLeadId}/assign-consultant`,
      { consultantId: String(consultantB._id), notes: "Bob handling" },
      { headers: { Authorization: `Bearer ${tokenPartnerB}` } }
    );

    console.log("\n🧪 [2.2] Consultant A queries assigned-students -> must see Lead A only");
    const assignedA = await client.get("/api/consultant/assigned-students", {
      headers: { Authorization: `Bearer ${tokenConsultantA}` },
    });
    if (assignedA.status !== 200) throw new Error(`Expected 200, got ${assignedA.status}`);
    const studentsA = assignedA.data.students;
    if (studentsA.length !== 1 || studentsA[0].studentLeadId !== leadA.studentLeadId) {
      throw new Error(`❌ Consultant A saw unexpected students: ${JSON.stringify(studentsA)}`);
    }
    console.log("   ✅ PASSED: Consultant A sees only own assigned student lead.");

    console.log("\n🧪 [2.3] Consultant B queries assigned-students -> must see Lead B only");
    const assignedB = await client.get("/api/consultant/assigned-students", {
      headers: { Authorization: `Bearer ${tokenConsultantB}` },
    });
    if (assignedB.status !== 200) throw new Error(`Expected 200, got ${assignedB.status}`);
    const studentsB = assignedB.data.students;
    if (studentsB.length !== 1 || studentsB[0].studentLeadId !== leadB.studentLeadId) {
      throw new Error(`❌ Consultant B saw unexpected students: ${JSON.stringify(studentsB)}`);
    }
    console.log("   ✅ PASSED: Consultant B sees only own assigned student lead.");

    console.log("\n🧪 [2.4] Consultant A attempts to view Consultant B's profile -> 403 denied");
    const idorProfileRes = await client.get(`/api/consultant/profile/${consultantB._id}`, {
      headers: { Authorization: `Bearer ${tokenConsultantA}` },
    });
    if (idorProfileRes.status !== 403) {
      throw new Error(`Expected 403, got ${idorProfileRes.status}`);
    }
    console.log("   ✅ PASSED: Consultant A blocked from viewing Consultant B's private profile.");

    // =========================================================================
    // TEST SECTION 3: Admin Cross-Tenant Semantics & Partner Validation
    // =========================================================================
    console.log("\n🧪 [3.1] Admin attempts to provision consultant for non-Edu-Mitra partner -> 400 rejected");
    const adminBadPartnerRes = await client.post(
      "/api/partnership/consultants",
      {
        name: "Illegal Consultant",
        email: `illegal_${timestamp}@example.com`,
        password: "Password123!",
        role: "Advisor",
        partnerId: String(nonEduMitraPartner._id),
      },
      { headers: { Authorization: `Bearer ${tokenAdmin}` } }
    );
    if (adminBadPartnerRes.status !== 400) {
      throw new Error(`Expected 400, got ${adminBadPartnerRes.status}: ${JSON.stringify(adminBadPartnerRes.data)}`);
    }
    console.log("   ✅ PASSED: Admin cannot assign consultants to non-Edu-Mitra partners.");

    console.log("\n🧪 [3.2] Admin attempts cross-tenant assignment (Consultant B to Lead A) -> 400 rejected");
    const adminCrossAssignRes = await client.put(
      `/api/partnership-leads/${leadA.studentLeadId}/assign-consultant`,
      { consultantId: String(consultantB._id) },
      { headers: { Authorization: `Bearer ${tokenAdmin}` } }
    );
    if (adminCrossAssignRes.status !== 400) {
      throw new Error(`Expected 400, got ${adminCrossAssignRes.status}: ${JSON.stringify(adminCrossAssignRes.data)}`);
    }
    console.log("   ✅ PASSED: Admin blocked from assigning across mismatched tenants.");

    // =========================================================================
    // TEST SECTION 4: Inactive Accounts & Stale JWT Request-Time Revocation
    // =========================================================================
    console.log("\n🧪 [4.1] Deactivate Consultant A via Partner A");
    const deactRes = await client.patch(
      `/api/partnership/consultants/${consultantA._id}/status`,
      { status: "INACTIVE" },
      { headers: { Authorization: `Bearer ${tokenPartnerA}` } }
    );
    if (deactRes.status !== 200) throw new Error(`Failed to deactivate: ${deactRes.status}`);

    console.log("\n🧪 [4.2] Attempt assigning inactive consultant -> 400 rejected");
    const assignInactiveRes = await client.put(
      `/api/partnership-leads/${leadA.studentLeadId}/assign-consultant`,
      { consultantId: String(consultantA._id) },
      { headers: { Authorization: `Bearer ${tokenPartnerA}` } }
    );
    if (assignInactiveRes.status !== 400) {
      throw new Error(`Expected 400, got ${assignInactiveRes.status}`);
    }
    console.log("   ✅ PASSED: Cannot assign inactive consultant.");

    console.log("\n🧪 [4.3] Stale JWT: Inactive Consultant A calls assigned-students -> 403 denied");
    const staleJwtAssignedRes = await client.get("/api/consultant/assigned-students", {
      headers: { Authorization: `Bearer ${tokenConsultantA}` }, // token issued BEFORE deactivation
    });
    if (staleJwtAssignedRes.status !== 403) {
      throw new Error(`Expected 403, got ${staleJwtAssignedRes.status}: ${JSON.stringify(staleJwtAssignedRes.data)}`);
    }
    console.log("   ✅ PASSED: Stale JWT blocked at request-time on assigned-students.");

    console.log("\n🧪 [4.4] Stale JWT: Inactive Consultant A calls get profile -> 403 denied");
    const staleJwtProfileRes = await client.get(`/api/consultant/profile/${consultantA._id}`, {
      headers: { Authorization: `Bearer ${tokenConsultantA}` },
    });
    if (staleJwtProfileRes.status !== 403) {
      throw new Error(`Expected 403, got ${staleJwtProfileRes.status}: ${JSON.stringify(staleJwtProfileRes.data)}`);
    }
    console.log("   ✅ PASSED: Stale JWT blocked at request-time on profile routes.");

    console.log("\n🧪 [4.5] Stale JWT: Inactive Consultant A calls get bookings -> 403 denied");
    const staleJwtBookingsRes = await client.get(`/api/bookings/consultant/${consultantA._id}`, {
      headers: { Authorization: `Bearer ${tokenConsultantA}` },
    });
    if (staleJwtBookingsRes.status !== 403) {
      throw new Error(`Expected 403, got ${staleJwtBookingsRes.status}: ${JSON.stringify(staleJwtBookingsRes.data)}`);
    }
    console.log("   ✅ PASSED: Stale JWT blocked at request-time on booking routes.");

    // =========================================================================
    // TEST SECTION 5: Malformed IDs Resilience (No 500 Crashes)
    // =========================================================================
    console.log("\n🧪 [5.1] Malformed consultantId in assign-consultant -> 400 Bad Request");
    const malformedAssignRes = await client.put(
      `/api/partnership-leads/${leadA.studentLeadId}/assign-consultant`,
      { consultantId: "malformed-id-123" },
      { headers: { Authorization: `Bearer ${tokenPartnerA}` } }
    );
    if (malformedAssignRes.status !== 400) {
      throw new Error(`Expected 400, got ${malformedAssignRes.status}`);
    }
    console.log("   ✅ PASSED: Malformed consultantId handled gracefully with 400.");

    console.log("\n🧪 [5.2] Malformed consultant ID in status route -> 400 Bad Request");
    const malformedStatusRes = await client.patch(
      "/api/partnership/consultants/not-a-valid-object-id/status",
      { status: "ACTIVE" },
      { headers: { Authorization: `Bearer ${tokenPartnerA}` } }
    );
    if (malformedStatusRes.status !== 400) {
      throw new Error(`Expected 400, got ${malformedStatusRes.status}`);
    }
    console.log("   ✅ PASSED: Malformed ID in status route handled gracefully with 400.");

    console.log("\n🧪 [5.3] Malformed user ID in profile route -> 400 Bad Request");
    const malformedProfileRes = await client.get("/api/consultant/profile/bad-object-id", {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    });
    if (malformedProfileRes.status !== 400) {
      throw new Error(`Expected 400, got ${malformedProfileRes.status}`);
    }
    console.log("   ✅ PASSED: Malformed ID in profile route handled gracefully with 400.");

    // =========================================================================
    // TEST SECTION 6: Cross-Collection Email Uniqueness
    // =========================================================================
    console.log("\n🧪 [6.1] Attempt to create consultant with email of existing Partner A -> 409 Conflict");
    const dupEmailRes = await client.post(
      "/api/partnership/consultants",
      {
        name: "Duplicate Counselor",
        email: partnerA.email, // already used by User model
        password: "Password123!",
        role: "Counselor",
      },
      { headers: { Authorization: `Bearer ${tokenPartnerA}` } }
    );
    if (dupEmailRes.status !== 409) {
      throw new Error(`Expected 409, got ${dupEmailRes.status}`);
    }
    console.log("   ✅ PASSED: Cross-collection duplicate email prevented with 409 Conflict.");

    console.log("\n==================================================================");
    console.log("🎉 ALL 17 PRODUCTION HTTP/API SECURITY TESTS PASSED PERFECTLY!");
    console.log("==================================================================");

  } finally {
    console.log("\n🧹 [Teardown] Cleaning up all test fixtures cleanly...");
    for (const item of testIds) {
      try {
        await item.model.findByIdAndDelete(item.id);
      } catch (e) {
        // ignore
      }
    }
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    console.log("✅ Teardown complete. Database isolated and connection closed.");
  }
}

runHttpSecurityAudit().catch((err) => {
  console.error("\n❌ FATAL HTTP SECURITY AUDIT FAILURE:", err);
  process.exit(1);
});

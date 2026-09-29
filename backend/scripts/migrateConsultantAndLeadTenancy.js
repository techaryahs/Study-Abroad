/**
 * Migration script to backfill multi-tenant ownership fields:
 * 1. Consultant: Ensures legacy consultants have `partnerId: null` and `status: "ACTIVE"`.
 * 2. StudentLead: Backfills `partnerId` from linked Seminar / College `createdBy`.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Consultant = require("../models/Consultant");
const StudentLead = require("../models/StudentLead");
const Seminar = require("../models/Seminar");
const College = require("../models/College");

async function migrate() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI missing from environment.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log(" Connected to MongoDB for tenancy migration.");

  // 1. Migrate Consultants
  const consultants = await Consultant.find({
    $or: [{ partnerId: { $exists: false } }, { partnerId: undefined }]
  });

  console.log(`Found ${consultants.length} legacy consultants without explicit partnerId.`);
  for (const c of consultants) {
    c.partnerId = null;
    if (!c.status || c.status === "approved") {
      c.status = "ACTIVE";
    }
    await c.save();
    console.log(` Migrated Consultant: ${c.email} -> partnerId: null, status: ${c.status}`);
  }

  // 2. Migrate StudentLeads & Seminars
  const { resolveEduMitraPartnerId } = require("../utils/tenantHelper");
  const leads = await StudentLead.find({});

  console.log(`Found ${leads.length} total student leads to inspect for tenant mapping.`);
  let leadsUpdated = 0;
  for (const lead of leads) {
    let resolvedPartnerId = null;

    if (lead.seminarId) {
      const seminar = await Seminar.findOne({ seminarId: lead.seminarId });
      if (seminar) {
        resolvedPartnerId = await resolveEduMitraPartnerId(seminar);
        if (resolvedPartnerId && !seminar.eduMitraId) {
          seminar.eduMitraId = resolvedPartnerId;
          await seminar.save();
          console.log(` Backfilled seminar ${seminar.seminarId} -> eduMitraId: ${resolvedPartnerId}`);
        }
      }
    }

    if (!resolvedPartnerId && lead.collegeId) {
      const college = await College.findById(lead.collegeId).select("createdBy");
      if (college && college.createdBy) {
        resolvedPartnerId = college.createdBy;
      }
    }

    if (resolvedPartnerId && String(lead.partnerId || "") !== String(resolvedPartnerId)) {
      console.log(` Corrected StudentLead: ${lead.studentLeadId} (${lead.fullName}) -> partnerId: ${resolvedPartnerId}`);
      lead.partnerId = resolvedPartnerId;
      await lead.save();
      leadsUpdated++;
    }
  }

  console.log(` Migration complete. ${consultants.length} consultants updated, ${leadsUpdated} student leads updated.`);
  await mongoose.disconnect();
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });

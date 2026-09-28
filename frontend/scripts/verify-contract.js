/* eslint-disable */
const fs = require('fs');
const http = require('http');

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";

async function verifyContract() {
  console.log(`Verifying API Contract against ${BACKEND_URL}...`);
  try {
    const plansRes = await fetch(`${BACKEND_URL}/api/memberships/plans`);
    const plans = await plansRes.json();
    
    if (!Array.isArray(plans)) {
      throw new Error("Contract violation: /plans did not return an array.");
    }

    const servicesRes = await fetch(`${BACKEND_URL}/api/memberships/services`);
    const services = await servicesRes.json();
    
    if (!Array.isArray(services)) {
      throw new Error("Contract violation: /services did not return an array.");
    }
    
    // Check required fields based on our MembershipMapper expectation
    const firstPlan = plans[0];
    if (firstPlan) {
      const requiredPlanFields = ['planId', 'name', 'price', 'type', 'benefits'];
      for (const field of requiredPlanFields) {
        if (!(field in firstPlan)) {
          throw new Error(`Contract violation: Plan is missing expected field '${field}'`);
        }
      }
    }
    
    const firstService = services[0];
    if (firstService) {
      const requiredServiceFields = ['serviceId', 'name', 'requiredPlanTier'];
      for (const field of requiredServiceFields) {
        if (!(field in firstService)) {
          throw new Error(`Contract violation: Service is missing expected field '${field}'`);
        }
      }
    }

    console.log("✅ API Contract verified successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ API Contract Verification Failed:");
    console.error(err.message);
    process.exit(1);
  }
}

verifyContract();

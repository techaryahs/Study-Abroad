/**
 * Membership catalog — source of plan entitlements and service definitions.
 *
 * Phase 2 — consultation is fully metered (no unlimited consultation):
 *   Starter   → 1  (renewal: never; one_time plan)
 *   Essential → 3  (renewal: yearly)
 *   Premium   → 5  (renewal: yearly)
 *   Elite     → 10 (renewal: yearly)
 *
 * Usage authority (do not duplicate here):
 *   EntitlementEngine.remainingUsage / canAccess
 *   membershipUtils.reserveEntitlementUsage / commitEntitlementUsage
 *   membershipLifecycle.buildUsageMapFromPlan / applyPlanToMembership
 *
 * Migration / plan-change safety (engine-owned):
 *   - Re-seed MembershipPlan docs after catalog deploy (seedInitialCatalog).
 *   - version bumps mark this metering revision (user.catalogVersion updates on provision).
 *   - initial_purchase: used=0, remaining=limit
 *   - upgrade: preserve overlapping used, expand remaining within new limit
 *   - downgrade: preserve used capped to new limit (no negative remaining)
 *   - renewal: reset only when entitlement.renewal matches plan.type
 *   - renewal: never counters preserved on same-plan re-provision
 *   - Prior unlimited consultation (no usage row) fail-closed until next provision
 *     initializes counters via buildUsageMapFromPlan (safe; never invents free uses).
 */

const SERVICES = [
  { serviceId: "ai_sop", name: "AI SOP Generator", category: "ai", requiresConsultant: false, requiredPlanTier: "starter" },
  { serviceId: "ai_humanizer", name: "AI Humanizer / Plagiarism Tools", category: "ai", requiresConsultant: false, requiredPlanTier: "starter" },
  { serviceId: "mock_interview", name: "Mock Interview (AI / Visa)", category: "ai", requiresConsultant: false, requiredPlanTier: "starter" },
  { serviceId: "study_abroad_assistant", name: "Study Abroad AI Assistant", category: "ai", requiresConsultant: false, requiredPlanTier: "starter" },

  { serviceId: "university_search", name: "University Search & Directory", category: "access", requiresConsultant: false, requiredPlanTier: "starter" },
  { serviceId: "scholarship_search", name: "Scholarship Search", category: "access", requiresConsultant: false, requiredPlanTier: "starter" },
  { serviceId: "unipredict", name: "UniPredict Admission Predictor", category: "access", requiresConsultant: false, requiredPlanTier: "starter" },
  { serviceId: "rate_my_chances", name: "Rate My Chances", category: "access", requiresConsultant: false, requiredPlanTier: "starter" },
  { serviceId: "country_explorer", name: "Country Explorer", category: "access", requiresConsultant: false, requiredPlanTier: "starter" },
  { serviceId: "dashboard_insights", name: "Dashboard Admission Insights", category: "access", requiresConsultant: false, requiredPlanTier: "essential" },

  { serviceId: "consultation", name: "Consultation Session", category: "human", requiresConsultant: true, requiredPlanTier: "starter" },
  { serviceId: "university_shortlist", name: "University Shortlisting", category: "human", requiresConsultant: true, requiredPlanTier: "essential" },
  { serviceId: "profile_evaluation", name: "Profile Evaluation & Building", category: "human", requiresConsultant: true, requiredPlanTier: "essential" },
  { serviceId: "education_loan", name: "Education Loan Guidance", category: "human", requiresConsultant: true, requiredPlanTier: "essential" },
  { serviceId: "gre_prep", name: "GRE Prep Plan", category: "human", requiresConsultant: true, requiredPlanTier: "essential" },
  { serviceId: "toefl_prep", name: "TOEFL Prep / Coaching", category: "human", requiresConsultant: true, requiredPlanTier: "essential" },
  { serviceId: "research_groups", name: "Research Groups", category: "human", requiresConsultant: true, requiredPlanTier: "essential" },

  { serviceId: "sop_writing", name: "Human SOP Drafting", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "resume_drafting", name: "Resume Drafting", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "lor_drafting", name: "Letter of Recommendation Drafting", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "visa_guidance", name: "Visa Application Guidance", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "cover_letter", name: "Cover Letter Drafting", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "linkedin_optimization", name: "LinkedIn Profile Optimization", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "application_review", name: "Complete Application Review", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "application_help", name: "Complete Application Help", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "personal_history", name: "Personal History Statement", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "research_paper", name: "Research Paper Drafting & Publishing", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "portfolio_building", name: "Portfolio Building & Management", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
  { serviceId: "university_finalization", name: "University Finalization Help", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },

  { serviceId: "express_entry", name: "Express Entry / PNP Help", category: "human", requiresConsultant: true, requiredPlanTier: "elite" },
  { serviceId: "global_talent", name: "UK Global Talent Visa", category: "human", requiresConsultant: true, requiredPlanTier: "elite" },
  { serviceId: "australia_visa", name: "Australia National Innovation Visa", category: "human", requiresConsultant: true, requiredPlanTier: "elite" },
  { serviceId: "singapore_one_pass", name: "Singapore ONE Pass", category: "human", requiresConsultant: true, requiredPlanTier: "elite" },
  { serviceId: "eb1", name: "EB-1 Visa Pathway", category: "human", requiresConsultant: true, requiredPlanTier: "elite" },
  { serviceId: "eb2_niw", name: "EB-2 NIW Visa Pathway", category: "human", requiresConsultant: true, requiredPlanTier: "elite" },
  { serviceId: "o1", name: "O-1 Visa Pathway", category: "human", requiresConsultant: true, requiredPlanTier: "elite" },
];

/** Fully metered consultation quotas — never omit `limit` (unlimited removed). */
const CONSULTATION_LIMITS = Object.freeze({
  starter: 1,
  essential: 3,
  premium: 5,
  elite: 10,
});

/**
 * Catalog revision for Phase 2 consultation metering.
 * Bump when re-seed must replace MembershipPlan entitlement maps in Mongo.
 */
const CATALOG_VERSION = 2;

function meteredConsultation(planId) {
  const limit = CONSULTATION_LIMITS[planId];
  if (limit == null) {
    throw new Error(`Unknown consultation limit for plan: ${planId}`);
  }
  // one_time starter does not reset; yearly plans reset on yearly renewal.
  const renewal = planId === "starter" ? "never" : "yearly";
  return { enabled: true, limit, renewal };
}

function allProtectedEntitlements() {
  return SERVICES.reduce(
    (acc, service) => {
      acc[service.category][service.serviceId] = { enabled: true };
      return acc;
    },
    { ai: {}, human: {}, access: {} }
  );
}

/** Elite base entitlements with consultation forced to metered (no unlimited). */
function eliteEntitlements() {
  const entitlements = allProtectedEntitlements();
  entitlements.human.consultation = meteredConsultation("elite");
  return entitlements;
}

const PLANS = [
  {
    planId: "starter",
    version: CATALOG_VERSION,
    name: "Starter",
    type: "one_time",
    appleProductId: "com.iecstudyabroad.starter.onetime",
    description: "Onboarding step with expert counselling and 30-day AI access.",
    price: 499,
    currency: "INR",
    recommended: false,
    sortOrder: 1,
    allAccess: false,
    benefits: [
      "Profile Evaluation",
      "Admission Probability Report",
      "Country Selection Strategy",
      "Scholarship Eligibility Check",
      "One 10 Minute Counselling Session",
    ],
    entitlements: {
      ai: {
        ai_sop: { enabled: true, limit: 5, renewal: "never", accessDays: 30 },
        ai_humanizer: { enabled: true, limit: 5, renewal: "never", accessDays: 30 },
        mock_interview: { enabled: true, limit: 2, renewal: "never", accessDays: 30 },
        study_abroad_assistant: { enabled: true, limit: 20, renewal: "never", accessDays: 30 },
      },
      human: {
        consultation: meteredConsultation("starter"),
      },
      access: {
        university_search: { enabled: true },
        scholarship_search: { enabled: true },
        unipredict: { enabled: true },
        rate_my_chances: { enabled: true },
        country_explorer: { enabled: true },
      },
    },
  },
  {
    planId: "essential",
    version: CATALOG_VERSION,
    name: "Essential",
    type: "yearly",
    appleProductId: "com.iecstudyabroad.essential.yearly",
    description: "Unlimited AI tools and automated shortlisting for independent applicants.",
    price: 4999,
    currency: "INR",
    recommended: true,
    badge: "Most Popular",
    sortOrder: 2,
    allAccess: false,
    benefits: [
      "Everything in Starter",
      "Personalized University Shortlist",
      "Scholarship Strategy",
      "Resume Optimization",
      "Application Timeline Planning",
      "Dedicated Counselor (30 Days)",
    ],
    entitlements: {
      ai: {
        ai_sop: { enabled: true, renewal: "yearly" },
        ai_humanizer: { enabled: true, renewal: "yearly" },
        mock_interview: { enabled: true, renewal: "yearly" },
        study_abroad_assistant: { enabled: true, renewal: "yearly" },
      },
      human: {
        consultation: meteredConsultation("essential"),
        university_shortlist: { enabled: true, limit: 1, renewal: "yearly" },
        profile_evaluation: { enabled: true, limit: 1, renewal: "yearly" },
        education_loan: { enabled: true },
        research_groups: { enabled: true },
        gre_prep: { enabled: true },
        toefl_prep: { enabled: true },
      },
      access: {
        university_search: { enabled: true },
        scholarship_search: { enabled: true },
        unipredict: { enabled: true },
        rate_my_chances: { enabled: true },
        country_explorer: { enabled: true },
        dashboard_insights: { enabled: true },
      },
    },
  },
  {
    planId: "premium",
    version: CATALOG_VERSION,
    name: "Premium",
    type: "yearly",
    appleProductId: "com.iecstudyabroad.premium.yearly",
    description: "Complete human guidance and document drafting.",
    price: 14999,
    currency: "INR",
    recommended: false,
    sortOrder: 3,
    allAccess: false,
    benefits: [
      "Everything in Essential",
      "SOP & LOR Support",
      "Application Assistance",
      "Visa Documentation Guidance",
      "Interview Preparation",
      "Dedicated Counselor (90 Days)",
    ],
    entitlements: {
      ai: {
        ai_sop: { enabled: true, renewal: "yearly" },
        ai_humanizer: { enabled: true, renewal: "yearly" },
        mock_interview: { enabled: true, renewal: "yearly" },
        study_abroad_assistant: { enabled: true, renewal: "yearly" },
      },
      human: {
        consultation: meteredConsultation("premium"),
        sop_writing: { enabled: true, limit: 1, renewal: "yearly" },
        resume_drafting: { enabled: true, limit: 1, renewal: "yearly" },
        lor_drafting: { enabled: true, limit: 3, renewal: "yearly" },
        visa_guidance: { enabled: true, renewal: "yearly" },
        university_shortlist: { enabled: true, limit: 1, renewal: "yearly" },
        profile_evaluation: { enabled: true, limit: 1, renewal: "yearly" },
        education_loan: { enabled: true },
        research_groups: { enabled: true },
        gre_prep: { enabled: true },
        toefl_prep: { enabled: true },
        cover_letter: { enabled: true, limit: 1, renewal: "yearly" },
        linkedin_optimization: { enabled: true, limit: 1, renewal: "yearly" },
        application_review: { enabled: true, limit: 1, renewal: "yearly" },
        application_help: { enabled: true, renewal: "yearly" },
        personal_history: { enabled: true, limit: 1, renewal: "yearly" },
        research_paper: { enabled: true, limit: 1, renewal: "yearly" },
        portfolio_building: { enabled: true, limit: 1, renewal: "yearly" },
        university_finalization: { enabled: true, limit: 1, renewal: "yearly" },
      },
      access: {
        university_search: { enabled: true },
        scholarship_search: { enabled: true },
        unipredict: { enabled: true },
        rate_my_chances: { enabled: true },
        country_explorer: { enabled: true },
        dashboard_insights: { enabled: true },
      },
    },
  },
  {
    planId: "elite",
    version: CATALOG_VERSION,
    name: "Elite",
    type: "yearly",
    appleProductId: "com.iecstudyabroad.elite.yearly",
    description: "Full-service global admissions and immigration guidance.",
    price: 49999,
    currency: "INR",
    recommended: true,
    badge: "Best Value",
    sortOrder: 4,
    allAccess: false,
    benefits: [
      "Everything in Premium",
      "Unlimited University Applications",
      "Scholarship Application Assistance",
      "Visa Filing Assistance",
      "Accommodation Support",
      "Dedicated Success Manager",
    ],
    // Base grants all services; consultation is overridden to metered (limit 10).
    entitlements: eliteEntitlements(),
  },
];

module.exports = {
  PLANS,
  SERVICES,
  CONSULTATION_LIMITS,
  CATALOG_VERSION,
};

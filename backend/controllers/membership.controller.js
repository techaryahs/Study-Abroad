const MembershipPlan = require("../models/MembershipPlan");
const Service = require("../models/Service");

exports.getActivePlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({ priceINR: 1 });
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    res.status(500).json({ message: "Failed to fetch membership plans" });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

exports.seedInitialCatalog = async (req, res) => {
  try {
    const plansData = [
      {
        planId: "starter",
        version: 1,
        name: "Starter",
        type: "one_time",
        appleProductId: "com.iecstudyabroad.starter.onetime",
        description: "Onboarding step with expert counselling and 30-day AI access.",
        price: 499,
        currency: "INR",
        recommended: false,
        sortOrder: 1,
        benefits: [
          "Profile Evaluation",
          "Admission Probability Report",
          "Country Selection Strategy",
          "Scholarship Eligibility Check",
          "One 10 Minute Counselling Session"
        ],
        entitlements: {
          ai: {
            ai_sop: { enabled: true, limit: 5, renewal: "never", accessDays: 30 },
            ai_humanizer: { enabled: true, limit: 5, renewal: "never", accessDays: 30 },
            mock_interview: { enabled: true, limit: 2, renewal: "never", accessDays: 30 }
          },
          human: {
            consultation: { enabled: true, limit: 1, renewal: "never" }
          },
          access: {
            university_search: { enabled: true },
            scholarship_search: { enabled: true },
            unipredict: { enabled: true }
          }
        }
      },
      {
        planId: "essential",
        version: 1,
        name: "Essential",
        type: "yearly",
        appleProductId: "com.iecstudyabroad.essential.yearly",
        description: "Unlimited AI tools and automated shortlisting for independent applicants.",
        price: 4999,
        currency: "INR",
        recommended: true,
        badge: "Most Popular",
        sortOrder: 2,
        benefits: [
          "Everything in Starter",
          "Personalized University Shortlist",
          "Scholarship Strategy",
          "Resume Optimization",
          "Application Timeline Planning",
          "Dedicated Counselor (30 Days)"
        ],
        entitlements: {
          ai: {
            ai_sop: { enabled: true, renewal: "yearly" },
            ai_humanizer: { enabled: true, renewal: "yearly" },
            mock_interview: { enabled: true, renewal: "yearly" }
          },
          human: {
            university_shortlist: { enabled: true, limit: 1, renewal: "yearly" },
            profile_evaluation: { enabled: true, limit: 1, renewal: "yearly" },
            education_loan: { enabled: true }
          },
          access: {
            university_search: { enabled: true },
            scholarship_search: { enabled: true },
            unipredict: { enabled: true }
          }
        }
      },
      {
        planId: "premium",
        version: 1,
        name: "Premium",
        type: "yearly",
        appleProductId: "com.iecstudyabroad.premium.yearly",
        description: "Complete human guidance and document drafting.",
        price: 14999,
        currency: "INR",
        recommended: false,
        sortOrder: 3,
        benefits: [
          "Everything in Essential",
          "SOP & LOR Support",
          "Application Assistance",
          "Visa Documentation Guidance",
          "Interview Preparation",
          "Dedicated Counselor (90 Days)"
        ],
        entitlements: {
          ai: {
            ai_sop: { enabled: true, renewal: "yearly" },
            ai_humanizer: { enabled: true, renewal: "yearly" },
            mock_interview: { enabled: true, renewal: "yearly" }
          },
          human: {
            consultation: { enabled: true, renewal: "yearly" },
            sop_writing: { enabled: true, limit: 1, renewal: "yearly" },
            resume_drafting: { enabled: true, limit: 1, renewal: "yearly" },
            lor_drafting: { enabled: true, limit: 3, renewal: "yearly" },
            visa_guidance: { enabled: true, renewal: "yearly" },
            university_shortlist: { enabled: true, limit: 1, renewal: "yearly" },
            profile_evaluation: { enabled: true, limit: 1, renewal: "yearly" },
            education_loan: { enabled: true }
          },
          access: {
            university_search: { enabled: true },
            scholarship_search: { enabled: true },
            unipredict: { enabled: true }
          }
        }
      },
      {
        planId: "elite",
        version: 1,
        name: "Elite Global",
        type: "yearly",
        appleProductId: "com.iecstudyabroad.elite.yearly",
        description: "Zero restrictions. Unlocks every current and future feature.",
        price: 49999,
        currency: "INR",
        recommended: true,
        badge: "Best Value",
        sortOrder: 4,
        allAccess: true,
        benefits: [
          "Everything in Premium",
          "Unlimited University Applications",
          "Scholarship Application Assistance",
          "Visa Filing Assistance",
          "Accommodation Support",
          "Dedicated Success Manager"
        ],
        entitlements: {
          ai: {}, human: {}, access: {}
        }
      }
    ];

    // Idempotent upsert
    for (const plan of plansData) {
      await MembershipPlan.findOneAndUpdate(
        { planId: plan.planId },
        { $set: plan },
        { upsert: true, new: true }
      );
    }
    
    // Seed basic services
    const services = [
      { serviceId: "visa_guidance", name: "Visa Application Guidance", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
      { serviceId: "consultation", name: "Consultation Session", category: "human", requiresConsultant: true, requiredPlanTier: "starter" },
      { serviceId: "ai_sop", name: "AI SOP Generator", category: "ai", requiresConsultant: false, requiredPlanTier: "starter" },
      { serviceId: "sop_writing", name: "Human SOP Drafting", category: "human", requiresConsultant: true, requiredPlanTier: "premium" },
      { serviceId: "university_shortlist", name: "University Shortlisting", category: "human", requiresConsultant: true, requiredPlanTier: "essential" }
    ];
    for (const service of services) {
      await Service.findOneAndUpdate(
        { serviceId: service.serviceId },
        { $set: service },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({ message: "Catalog and services seeded successfully" });
  } catch (error) {
    console.error("Error seeding catalog:", error);
    res.status(500).json({ message: "Failed to seed catalog" });
  }
};

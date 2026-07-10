const MembershipPlan = require("../models/MembershipPlan");
const Service = require("../models/Service");
const Student = require("../models/Student");
const { PLANS, SERVICES } = require("../catalog/membershipCatalog");
const {
  applyLifecycleToUser,
  buildAccessSummary,
  requiredPlan,
} = require("../utils/entitlementEngine");

exports.getActivePlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true }).sort({
      sortOrder: 1,
      price: 1,
    });
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    res.status(500).json({ message: "Failed to fetch membership plans" });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({
      category: 1,
      requiredPlanTier: 1,
      name: 1,
    }).lean();
    const plans = await MembershipPlan.find({ isActive: true }).sort({
      sortOrder: 1,
      price: 1,
    });
    const enrichedServices = await Promise.all(
      services.map(async (service) => {
        const plan = await requiredPlan(service.serviceId, { service, plans });
        return {
          ...service,
          requiredPlanTier: plan?.planId || null,
        };
      })
    );
    res.status(200).json(enrichedServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

exports.getAccessSummary = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. No user ID found." });
    }

    const student = await Student.findById(userId);
    if (!student) {
      return res.status(401).json({
        message: "User not found. Membership is available for student accounts.",
      });
    }

    const lifecycle = await applyLifecycleToUser(student, { persist: true });
    const summary = await buildAccessSummary(student, { lifecycle });
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching membership access summary:", error);
    res.status(500).json({ message: "Failed to fetch membership access summary" });
  }
};

exports.seedInitialCatalog = async (req, res) => {
  try {
    for (const plan of PLANS) {
      await MembershipPlan.findOneAndUpdate(
        { planId: plan.planId },
        { $set: { ...plan, isActive: true } },
        { upsert: true, new: true }
      );
    }

    for (const service of SERVICES) {
      await Service.findOneAndUpdate(
        { serviceId: service.serviceId },
        { $set: { ...service, isActive: true } },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({
      message: "Catalog and services seeded successfully",
      plans: PLANS.length,
      services: SERVICES.length,
    });
  } catch (error) {
    console.error("Error seeding catalog:", error);
    res.status(500).json({ message: "Failed to seed catalog" });
  }
};

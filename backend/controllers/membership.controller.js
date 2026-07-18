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
    const plans = await MembershipPlan.find({ isActive: true })
      .sort({ sortOrder: 1, price: 1 })
      .lean();

    if (plans.length === 0) {
      console.warn(
        "[MembershipPlans] ⚠️ No active plans found — catalog may be unseeded"
      );
      return res.status(200).json([]);
    }

    // Fail loudly on malformed plans — never hide corrupted data
    const malformed = [];
    for (const plan of plans) {
      const missing = [];
      if (!plan.planId) missing.push("planId");
      if (!plan.appleProductId) missing.push("appleProductId");
      if (plan.price == null || typeof plan.price !== "number") missing.push("price");
      if (!plan.entitlements) missing.push("entitlements");
      if (missing.length > 0) {
        malformed.push({ planId: plan.planId || "(unknown)", missing });
      }
    }

    if (malformed.length > 0) {
      for (const m of malformed) {
        console.error(
          `[MembershipPlans] ❌ Malformed MembershipPlan detected: planId=${m.planId}, missing=[${m.missing.join(", ")}]`
        );
      }
      return res.status(500).json({
        message: "Catalog validation failed — malformed plans detected. See server logs.",
      });
    }

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
      return res.status(403).json({
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

/**
 * Admin-only catalog sync (same rules as scripts/syncMembershipCatalog.js).
 * JWT + requireAdmin enforced on the route — never public.
 */
exports.seedInitialCatalog = async (req, res) => {
  try {
    const { syncCatalog, verifyCatalog } = require("../scripts/syncMembershipCatalog");
    await syncCatalog();
    const verification = await verifyCatalog();

    if (!verification.allPass) {
      return res.status(500).json({
        message: "Catalog seeded but verification failed — runtime does not match source",
        table: verification.rows,
      });
    }

    res.status(201).json({
      message: "Catalog and services synchronized successfully",
      plans: PLANS.length,
      services: SERVICES.length,
      verification: verification.rows,
    });
  } catch (error) {
    console.error("Error seeding catalog:", error);
    res.status(500).json({ message: "Failed to seed catalog" });
  }
};

exports.getMyMembership = async (req, res) => {
  try {
    const { findUserById } = require("../utils/userHelper");
    const usageService = require("../services/membership/usage.service");
    const {
      serializeMembership,
      applyLifecycleToUser,
    } = require("../utils/membershipLifecycle");
    const PaymentTransaction = require("../models/PaymentTransaction");

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const found = await findUserById(userId);
    if (!found || !found.user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const user = found.user;
    await applyLifecycleToUser(user, { persist: true });

    const membership = user.membership || { status: "none", planId: "free" };

    // Generate dynamic usage preview for the frontend
    const usagePreview = {};
    if (membership.usage && typeof membership.usage.keys === "function") {
      for (const feature of membership.usage.keys()) {
        usagePreview[feature] = usageService.preview(user, feature);
      }
    } else if (membership.usage && typeof membership.usage === "object") {
      for (const feature of Object.keys(membership.usage)) {
        usagePreview[feature] = usageService.preview(user, feature);
      }
    }

    const serialized = serializeMembership(membership) || {
      planId: "free",
      status: "none",
    };

    // Backfill amount/dates from PaymentTransaction when missing on membership
    if (
      serialized.planId &&
      serialized.planId !== "free" &&
      (serialized.amountPaid == null ||
        !serialized.purchaseDate ||
        !serialized.paymentDate ||
        !serialized.transactionId)
    ) {
      try {
        const txnQuery = {
          userId: user._id,
          status: { $in: ["ENTITLED", "VERIFIED", "succeeded"] },
        };
        if (serialized.transactionId) {
          txnQuery.$or = [
            { transactionId: serialized.transactionId },
            { externalTransactionId: serialized.transactionId },
          ];
        } else {
          txnQuery.planId = serialized.planId;
        }

        const txn = await PaymentTransaction.findOne(txnQuery)
          .sort({ createdAt: -1 })
          .lean();

        if (txn) {
          if (serialized.amountPaid == null && typeof txn.amount === "number") {
            serialized.amountPaid = txn.amount;
          }
          if (!serialized.currency && txn.currency) {
            serialized.currency = txn.currency;
          }
          if (!serialized.transactionId) {
            serialized.transactionId =
              txn.externalTransactionId || txn.transactionId || null;
          }
          const txnDate = txn.processedAt || txn.createdAt;
          if (txnDate) {
            const iso = new Date(txnDate).toISOString();
            if (!serialized.purchaseDate) {
              serialized.purchaseDate = iso;
              serialized.purchasedAt = iso;
              serialized.activatedAt = iso;
            }
            if (!serialized.paymentDate) {
              serialized.paymentDate = iso;
            }
          }
          if (!serialized.paymentStatus && txn.status) {
            serialized.paymentStatus =
              txn.status === "ENTITLED" || txn.status === "VERIFIED"
                ? "paid"
                : String(txn.status).toLowerCase();
          }
        }
      } catch (txnErr) {
        console.warn(
          "[MembershipController] PaymentTransaction backfill skipped:",
          txnErr.message
        );
      }
    }

    serialized.usage = usagePreview;

    res.status(200).json({
      success: true,
      membership: serialized,
    });
  } catch (error) {
    console.error("[MembershipController] Error fetching my membership:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

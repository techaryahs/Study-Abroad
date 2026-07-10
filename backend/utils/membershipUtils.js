const mongoose = require("mongoose");
const Student = require("../models/Student");
const MembershipEvent = require("../models/MembershipEvent");
const UsageReservation = require("../models/UsageReservation");
const {
  applyLifecycleToUser,
  evaluateMembership,
} = require("./membershipLifecycle");
const {
  canAccess,
  remainingUsage,
} = require("./entitlementEngine");

function getSessionOptions(session) {
  return session ? { session } : undefined;
}

async function withOwnedTransaction(externalSession, fn) {
  if (externalSession) {
    return fn(externalSession);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async function validateUsageSubject(userId, featureId, session) {
  if (!userId || !featureId) {
    throw new Error("Usage reservation requires userId and featureId.");
  }

  const student = await Student.findById(userId).session(session);
  if (!student) {
    throw new Error("Invalid or inactive membership.");
  }

  const lifecycle = await applyLifecycleToUser(student, {
    persist: true,
    session,
  });

  if (!lifecycle.isAccessAllowed) {
    throw new Error(lifecycle.denyReason || "Invalid or inactive membership.");
  }

  if (
    lifecycle.effectiveStatus !== "active" &&
    lifecycle.effectiveStatus !== "grace_period"
  ) {
    throw new Error("Invalid or inactive membership.");
  }

  const access = await canAccess(featureId, {
    student,
    membership: student.membership,
    lifecycle,
    checkUsage: false,
  });

  if (!access.allowed) {
    throw new Error(access.reason || "Feature not enabled.");
  }

  const usage = await remainingUsage(featureId, {
    student,
    membership: student.membership,
    lifecycle,
  });

  return { student, lifecycle, access, usage };
}

async function reserveEntitlementUsage(userId, featureId, options = {}) {
  const { session: externalSession = null, reservationKey = null, metadata = {} } = options;

  return withOwnedTransaction(externalSession, async (session) => {
    const { student, lifecycle, usage } = await validateUsageSubject(
      userId,
      featureId,
      session
    );

    if (usage.unlimited) {
      const [reservation] = await UsageReservation.create(
        [
          {
            userId: student._id,
            featureId,
            planId: lifecycle.planId,
            ...(reservationKey ? { reservationKey } : {}),
            status: "reserved",
            metered: false,
            metadata,
          },
        ],
        getSessionOptions(session)
      );
      return reservation;
    }

    if (!usage.knownFeature) {
      throw new Error("Unknown usage.");
    }

    if (usage.limit == null || !Number.isFinite(Number(usage.limit))) {
      throw new Error("Unknown usage.");
    }

    const limit = Math.max(0, Number(usage.limit));
    if (limit <= 0 || usage.remaining <= 0) {
      throw new Error("Usage exhausted.");
    }

    const usedPath = `membership.usage.${featureId}.used`;
    const remainingPath = `membership.usage.${featureId}.remaining`;
    const lastUsedPath = `membership.usage.${featureId}.lastUsedAt`;

    const updated = await Student.findOneAndUpdate(
      {
        _id: student._id,
        "membership.planId": lifecycle.planId,
        "membership.status": { $in: ["active", "grace_period"] },
        [usedPath]: { $gte: 0, $lt: limit },
        [remainingPath]: { $gt: 0, $lte: limit },
      },
      {
        $inc: {
          [usedPath]: 1,
          [remainingPath]: -1,
        },
        $set: {
          [lastUsedPath]: new Date(),
        },
      },
      {
        new: true,
        session,
      }
    );

    if (!updated) {
      throw new Error("Usage exhausted.");
    }

    const usedAfter = updated.membership.usage.get(featureId)?.used;
    const remainingAfter = updated.membership.usage.get(featureId)?.remaining;

    if (
      !Number.isFinite(Number(usedAfter)) ||
      !Number.isFinite(Number(remainingAfter)) ||
      Number(usedAfter) < 0 ||
      Number(remainingAfter) < 0 ||
      Number(usedAfter) > limit ||
      Number(remainingAfter) > limit ||
      Number(usedAfter) + Number(remainingAfter) !== limit
    ) {
      throw new Error("Usage invariant violation.");
    }

    const [reservation] = await UsageReservation.create(
      [
        {
          userId: student._id,
          featureId,
          planId: lifecycle.planId,
          ...(reservationKey ? { reservationKey } : {}),
          status: "reserved",
          metered: true,
          usedBefore: Number(usedAfter) - 1,
          remainingBefore: Number(remainingAfter) + 1,
          limit,
          metadata,
        },
      ],
      getSessionOptions(session)
    );

    return reservation;
  });
}

async function commitEntitlementUsage(reservationOrId, options = {}) {
  const { session: externalSession = null, metadata = {} } = options;

  return withOwnedTransaction(externalSession, async (session) => {
    const reservationId =
      typeof reservationOrId === "object" ? reservationOrId._id : reservationOrId;
    const reservation = await UsageReservation.findOneAndUpdate(
      { _id: reservationId, status: "reserved" },
      {
        $set: {
          status: "committed",
          committedAt: new Date(),
          metadata: {
            ...(typeof reservationOrId?.metadata === "object" ? reservationOrId.metadata : {}),
            ...metadata,
          },
        },
      },
      { new: true, session }
    );

    if (!reservation) {
      return UsageReservation.findById(reservationId).session(session);
    }

    await MembershipEvent.create(
      [
        {
          userId: reservation.userId,
          userModel: "Student",
          eventType: "Feature Used",
          planId: reservation.planId,
          featureId: reservation.featureId,
          metadata: {
            reservationId: reservation._id,
            metered: reservation.metered,
            limit: reservation.limit,
            ...metadata,
          },
        },
      ],
      getSessionOptions(session)
    );

    return reservation;
  });
}

async function releaseEntitlementUsage(reservationOrId, options = {}) {
  const { session: externalSession = null, metadata = {} } = options;

  return withOwnedTransaction(externalSession, async (session) => {
    const reservationId =
      typeof reservationOrId === "object" ? reservationOrId._id : reservationOrId;
    const reservation = await UsageReservation.findOneAndUpdate(
      { _id: reservationId, status: "reserved" },
      {
        $set: {
          status: "released",
          releasedAt: new Date(),
          metadata: {
            ...(typeof reservationOrId?.metadata === "object" ? reservationOrId.metadata : {}),
            ...metadata,
          },
        },
      },
      { new: true, session }
    );

    if (!reservation) {
      return UsageReservation.findById(reservationId).session(session);
    }

    if (!reservation.metered) {
      return reservation;
    }

    const usedPath = `membership.usage.${reservation.featureId}.used`;
    const remainingPath = `membership.usage.${reservation.featureId}.remaining`;
    const limit = Math.max(0, Number(reservation.limit));

    const restored = await Student.findOneAndUpdate(
      {
        _id: reservation.userId,
        [usedPath]: { $gte: 1, $lte: limit },
        [remainingPath]: { $gte: 0, $lt: limit },
      },
      {
        $inc: {
          [usedPath]: -1,
          [remainingPath]: 1,
        },
      },
      { new: true, session }
    );

    if (!restored) {
      throw new Error("Usage release would violate usage bounds.");
    }

    const restoredUsage = restored.membership.usage.get(reservation.featureId);
    const restoredUsed = Number(restoredUsage?.used);
    const restoredRemaining = Number(restoredUsage?.remaining);
    if (
      !Number.isFinite(restoredUsed) ||
      !Number.isFinite(restoredRemaining) ||
      restoredUsed < 0 ||
      restoredRemaining < 0 ||
      restoredUsed + restoredRemaining !== limit
    ) {
      throw new Error("Usage release invariant violation.");
    }

    return reservation;
  });
}

async function withEntitlementUsage(userId, featureId, execute, options = {}) {
  const reservation = await reserveEntitlementUsage(userId, featureId, options);
  try {
    const result = await execute(reservation);
    await commitEntitlementUsage(reservation, options);
    return result;
  } catch (error) {
    await releaseEntitlementUsage(reservation, {
      ...options,
      metadata: { error: error.message },
    });
    throw error;
  }
}

const consumeEntitlement = async (userId, featureId, externalSession = null) => {
  const reservation = await reserveEntitlementUsage(userId, featureId, {
    session: externalSession,
  });
  await commitEntitlementUsage(reservation, { session: externalSession });
  return true;
};

module.exports = {
  reserveEntitlementUsage,
  commitEntitlementUsage,
  releaseEntitlementUsage,
  withEntitlementUsage,
  consumeEntitlement,
  evaluateMembership,
  applyLifecycleToUser,
};

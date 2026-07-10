"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  Membership,
  MembershipAccessSummary,
  MembershipCatalog,
  MembershipPlan,
} from "@/types/membership";
import { getToken } from "@/app/lib/token";
import { MembershipMapper } from "./MembershipMapper";

interface MembershipContextType {
  membership: Membership | null;
  currentPlan: MembershipPlan | null;
  catalog: MembershipCatalog | null;
  accessSummary: MembershipAccessSummary | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;

  canAccess: (serviceId: string) => boolean;
  requiredPlan: (serviceId: string) => MembershipPlan | null;
  canUpgrade: (serviceId: string) => boolean;
  missingEntitlements: (serviceId: string) => string[];
  remainingUsage: (serviceId: string) => number;

  isCurrentPlan: (planId: string) => boolean;
  isElite: () => boolean;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const MembershipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [catalog, setCatalog] = useState<MembershipCatalog | null>(null);
  const [accessSummary, setAccessSummary] = useState<MembershipAccessSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";

  const fetchMembershipData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();

      const [plansRes, servicesRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/memberships/plans`).catch(() => null),
        fetch(`${BACKEND_URL}/api/memberships/services`).catch(() => null),
      ]);

      const rawPlans = plansRes && plansRes.ok ? await plansRes.json() : [];
      const rawServices = servicesRes && servicesRes.ok ? await servicesRes.json() : [];

      setCatalog(
        MembershipMapper.mapCatalog({
          plans: Array.isArray(rawPlans) ? rawPlans : [],
          services: Array.isArray(rawServices) ? rawServices : [],
        })
      );

      if (!token) {
        setMembership(null);
        setAccessSummary(null);
        setLoading(false);
        return;
      }

      const authHeaders = { Authorization: `Bearer ${token}` };
      const [meRes, accessRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/auth/me`, { headers: authHeaders }).catch(() => null),
        fetch(`${BACKEND_URL}/api/memberships/access`, { headers: authHeaders }).catch(() => null),
      ]);

      if (meRes && meRes.ok) {
        const payload = await meRes.json();
        const user = payload.user ?? payload;
        setMembership(
          MembershipMapper.mapMembership(user?.membership ?? null, user?._id ?? user?.id)
        );
      } else {
        setMembership(null);
      }

      if (accessRes && accessRes.ok) {
        setAccessSummary((await accessRes.json()) as MembershipAccessSummary);
      } else {
        setAccessSummary(null);
      }
    } catch (err: unknown) {
      console.error("Failed to load membership data:", err);
      setError(err instanceof Error ? err.message : "Failed to load membership data");
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchMembershipData();

    const handleUserUpdate = () => fetchMembershipData();
    const handleMembershipUpdate = () => fetchMembershipData();

    window.addEventListener("user-updated", handleUserUpdate);
    window.addEventListener("membership-updated", handleMembershipUpdate);

    return () => {
      window.removeEventListener("user-updated", handleUserUpdate);
      window.removeEventListener("membership-updated", handleMembershipUpdate);
    };
  }, [fetchMembershipData]);

  const currentPlan = React.useMemo(() => {
    if (!accessSummary?.currentPlanId || !catalog?.plans?.length) return null;
    return catalog.plans.find((plan) => plan.id === accessSummary.currentPlanId) || null;
  }, [accessSummary, catalog]);

  const canAccess = useCallback(
    (serviceId: string) => Boolean(serviceId && accessSummary?.features?.[serviceId]?.canAccess),
    [accessSummary]
  );

  const requiredPlan = useCallback(
    (serviceId: string) => {
      if (!serviceId || !catalog?.plans?.length) return null;
      const requiredPlanId = accessSummary?.features?.[serviceId]?.requiredPlanId;
      if (!requiredPlanId) return null;
      return catalog.plans.find((plan) => plan.id === requiredPlanId) || null;
    },
    [accessSummary, catalog]
  );

  const canUpgrade = useCallback(
    (serviceId: string) => !canAccess(serviceId) && requiredPlan(serviceId) != null,
    [canAccess, requiredPlan]
  );

  const missingEntitlements = useCallback(
    (serviceId: string) => (serviceId && !canAccess(serviceId) ? [serviceId] : []),
    [canAccess]
  );

  const remainingUsage = useCallback(
    (serviceId: string) => {
      if (!serviceId) return 0;
      const row = accessSummary?.features?.[serviceId];
      if (!row) return 0;
      if (row.unlimited) return Infinity;
      return Math.max(0, row.remaining ?? 0);
    },
    [accessSummary]
  );

  const isCurrentPlan = useCallback(
    (planId: string) => Boolean(planId && accessSummary?.currentPlanId === planId),
    [accessSummary]
  );

  const isElite = useCallback(
    () => Boolean(accessSummary?.currentPlanId === "elite"),
    [accessSummary]
  );

  const contextValue: MembershipContextType = {
    membership,
    currentPlan,
    catalog,
    accessSummary,
    loading,
    error,
    refresh: fetchMembershipData,
    canAccess,
    requiredPlan,
    canUpgrade,
    missingEntitlements,
    remainingUsage,
    isCurrentPlan,
    isElite,
  };

  return (
    <MembershipContext.Provider value={contextValue}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembership = (): MembershipContextType => {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error("useMembership must be used within a MembershipProvider");
  }
  return context;
};

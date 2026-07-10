"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MembershipPlan } from "@/types/membership";
import { MembershipCard } from "@/components/shared/MembershipUI/MembershipCard";
import { useMembership } from "@/app/lib/membership/MembershipContext";
import CheckoutModal from "@/app/User/cart/checkoutmodal";
import { getToken } from "@/app/lib/token";

interface PricingClientProps {
  initialPlans: MembershipPlan[];
  error?: string;
}

export default function PricingClient({ initialPlans, error }: PricingClientProps) {
  // Prefer live catalog from MembershipContext (already MembershipMapper-normalized)
  const { currentPlan, catalog, loading: membershipLoading, isCurrentPlan } = useMembership();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [intentRestored, setIntentRestored] = useState(false);
  const router = useRouter();

  const plans = useMemo(() => {
    const source =
      catalog?.plans && catalog.plans.length > 0
        ? catalog.plans
        : initialPlans;

    // Only render plans that have a real id (never compare undefined)
    // Sort by price from backend data — no client-side tier hierarchy for ordering
    return [...source]
      .filter((p) => Boolean(p?.id))
      .sort((a, b) => (a.price || 0) - (b.price || 0));
  }, [catalog, initialPlans]);

  /**
   * Auth gate before checkout.
   * Unauthenticated users never open CheckoutModal.
   */
  const handleSelectPlan = (plan: MembershipPlan) => {
    if (!plan?.id) return;

    const token = getToken();
    if (!token) {
      const returnTo = `/pricing?planId=${encodeURIComponent(plan.id)}`;
      router.push(`/auth/login?redirect=${encodeURIComponent(returnTo)}`);
      return;
    }

    setSelectedPlan(plan);
  };

  /**
   * After login redirect back to /pricing?planId=…, reopen checkout once.
   */
  useEffect(() => {
    if (intentRestored || membershipLoading || plans.length === 0) return;
    if (typeof window === "undefined") return;
    if (!getToken()) return;

    const params = new URLSearchParams(window.location.search);
    const planId = params.get("planId");
    if (!planId) return;

    const match = plans.find((p) => p.id === planId);
    if (!match) return;

    setSelectedPlan(match);
    setIntentRestored(true);
    // Clean query so refresh doesn't re-open forever
    window.history.replaceState({}, "", "/pricing");
  }, [plans, membershipLoading, intentRestored]);

  if (error && plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
        <h2 className="fd text-2xl font-semibold text-[#3C2A21] mb-3 tracking-tight">
          Plans temporarily unavailable
        </h2>
        <p className="text-[14px] font-medium text-[#6B5E51] mb-8 max-w-md leading-relaxed">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#3C2A21] text-white rounded-xl text-[12px] font-semibold tracking-wide hover:bg-[#C5A059] transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
        <h2 className="fd text-2xl font-semibold text-[#3C2A21] mb-3 tracking-tight">
          Plans coming soon
        </h2>
        <p className="text-[14px] font-medium text-[#6B5E51] max-w-md leading-relaxed">
          We&apos;re preparing membership options. Please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-auto relative z-10 items-stretch">
        {plans.map((plan) => {
          // Safe current-plan check: require both ids and use MembershipContext helper
          const isCurrent =
            Boolean(plan.id) &&
            Boolean(currentPlan?.id) &&
            (isCurrentPlan(plan.id) || currentPlan!.id === plan.id);

          return (
            <MembershipCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={isCurrent}
              currentPlanId={currentPlan?.id ?? null}
              isLoading={membershipLoading}
              onSelectPlan={() => handleSelectPlan(plan)}
            />
          );
        })}
      </div>

      {/* Checkout only when authenticated (selectedPlan set after token check) */}
      {selectedPlan && selectedPlan.id && getToken() && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          items={[
            {
              id: selectedPlan.id,
              title: selectedPlan.name,
              name: selectedPlan.name,
              price: selectedPlan.price,
              currency: selectedPlan.currency,
              type: "membership"
            },
          ]}
          subtotal={selectedPlan.price}
          discount={0}
          total={selectedPlan.price}
          currency={selectedPlan.currency}
          onSuccess={() => {
            setSelectedPlan(null);
            window.dispatchEvent(new Event('membership-updated'));
          }}
        />
      )}
    </>
  );
}

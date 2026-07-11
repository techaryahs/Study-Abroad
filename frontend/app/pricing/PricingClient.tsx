"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MembershipPlan } from "@/types/membership";
import { MembershipCard } from "@/components/shared/MembershipUI/MembershipCard";
import { useMembership } from "@/app/lib/membership/MembershipContext";
import CheckoutModal from "@/app/User/cart/checkoutmodal";
import { getSessionToken, isAuthenticated } from "@/app/lib/session";
import { resolveUnlockContext } from "@/app/lib/membership/unlockContext";
import { membershipDisplayPrice } from "@/app/lib/testPaymentMode";
import { Check } from "lucide-react";

interface PricingClientProps {
  initialPlans: MembershipPlan[];
  error?: string;
  /**
   * Resolved once by PricingPage (Server Component).
   * Must be identical for SSR and hydration — do not re-read env here.
   */
  testPaymentMode: boolean;
}

function readQueryParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

export default function PricingClient({
  initialPlans,
  error,
  testPaymentMode,
}: PricingClientProps) {
  // Prefer live catalog from MembershipContext (already MembershipMapper-normalized)
  const { currentPlan, catalog, loading: membershipLoading, isCurrentPlan } =
    useMembership();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [intentRestored, setIntentRestored] = useState(false);
  const [unlockServiceId, setUnlockServiceId] = useState<string | null>(null);
  const router = useRouter();

  // Read ?unlock= once on mount (and if user navigates client-side with a new query)
  useEffect(() => {
    setUnlockServiceId(readQueryParam("unlock"));
  }, []);

  /**
   * Catalog plans sorted by original catalog price (stable tier order).
   * Display price is computed separately via membershipDisplayPrice(testPaymentMode)
   * so server and client never disagree on the flag.
   */
  const plans = useMemo(() => {
    const source =
      catalog?.plans && catalog.plans.length > 0
        ? catalog.plans
        : initialPlans;

    return [...source]
      .filter((p) => Boolean(p?.id))
      .sort((a, b) => (a.price || 0) - (b.price || 0));
  }, [catalog, initialPlans]);

  const unlockContext = useMemo(
    () => resolveUnlockContext(plans, catalog, unlockServiceId),
    [plans, catalog, unlockServiceId]
  );

  /**
   * Auth gate before checkout.
   * Unauthenticated users never open CheckoutModal.
   * Preserve unlock context on login return.
   */
  const handleSelectPlan = (plan: MembershipPlan) => {
    if (!plan?.id) return;

    if (!isAuthenticated()) {
      const params = new URLSearchParams();
      if (unlockServiceId) params.set("unlock", unlockServiceId);
      params.set("planId", plan.id);
      const returnTo = `/pricing?${params.toString()}`;
      router.push(`/auth/login?redirect=${encodeURIComponent(returnTo)}`);
      return;
    }

    setSelectedPlan(plan);
  };

  /**
   * After login redirect back to /pricing?planId=…[&unlock=…], reopen checkout once.
   */
  useEffect(() => {
    if (intentRestored || membershipLoading || plans.length === 0) return;
    if (typeof window === "undefined") return;
    if (!isAuthenticated()) return;

    const params = new URLSearchParams(window.location.search);
    const planId = params.get("planId");
    const unlock = params.get("unlock");
    if (unlock) setUnlockServiceId(unlock);
    if (!planId) return;

    const match = plans.find((p) => p.id === planId);
    if (!match) return;

    // Do not auto-open checkout for plans that do not include the unlock service
    if (unlock) {
      const ctx = resolveUnlockContext(plans, catalog, unlock);
      if (ctx && ctx.roleForPlan(planId) === "not_included") {
        setIntentRestored(true);
        const keep = unlock
          ? `/pricing?unlock=${encodeURIComponent(unlock)}`
          : "/pricing";
        window.history.replaceState({}, "", keep);
        return;
      }
    }

    setSelectedPlan(match);
    setIntentRestored(true);
    // Drop planId so refresh does not re-open forever; keep unlock context
    const next =
      unlock != null && unlock !== ""
        ? `/pricing?unlock=${encodeURIComponent(unlock)}`
        : "/pricing";
    window.history.replaceState({}, "", next);
  }, [plans, membershipLoading, intentRestored, catalog]);

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

  const selectedDisplayPrice = selectedPlan
    ? membershipDisplayPrice(selectedPlan.price, testPaymentMode)
    : 0;

  return (
    <>
      {/* Contextual banner — only when ?unlock= is present and catalog resolves */}
      {unlockContext && (
        <div className="mx-auto mb-12 max-w-3xl rounded-2xl border border-[#C5A059]/25 bg-white/90 px-6 py-7 text-center shadow-[0_12px_40px_-24px_rgba(60,42,33,0.18)] md:px-10 md:py-8">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A7B3C]">
            Service unlock
          </p>
          <h2 className="fd text-2xl font-semibold tracking-tight text-[#2D2926] md:text-3xl">
            Unlock {unlockContext.serviceName}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[14px] font-medium leading-relaxed text-[#6B5E51]">
            This service is included in the membership tiers below. Choose the
            recommended plan for the simplest path, or a higher tier for additional
            benefits.
          </p>

          {unlockContext.qualifyingPlans.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8B8078]">
                Included in
              </span>
              {unlockContext.qualifyingPlans.map((p) => {
                const isMin = unlockContext.minimumPlan?.id === p.id;
                return (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${
                      isMin
                        ? "bg-[#C5A059] text-white"
                        : "border border-[#EDE6DC] bg-[#FDFBF7] text-[#3C2A21]"
                    }`}
                  >
                    {isMin && <Check className="h-3 w-3" strokeWidth={2.5} />}
                    {p.name}
                    {isMin && (
                      <span className="ml-0.5 text-[10px] font-medium uppercase tracking-wide opacity-90">
                        · recommended
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          )}

          {unlockContext.qualifyingPlans.length === 0 && !membershipLoading && (
            <p className="mt-4 text-[13px] font-medium text-[#8B8078]">
              We could not determine which plans include this service yet. You can
              still browse all memberships below.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-auto relative z-10 items-stretch">
        {plans.map((plan) => {
          const isCurrent =
            Boolean(plan.id) &&
            Boolean(currentPlan?.id) &&
            (isCurrentPlan(plan.id) || currentPlan!.id === plan.id);

          const unlockRole = unlockContext
            ? unlockContext.roleForPlan(plan.id)
            : null;

          // Pure function of catalog price + server flag — identical on SSR & client
          const displayPrice = membershipDisplayPrice(
            plan.price,
            testPaymentMode
          );

          return (
            <MembershipCard
              key={plan.id}
              plan={plan}
              displayPrice={displayPrice}
              isCurrentPlan={isCurrent}
              currentPlanId={currentPlan?.id ?? null}
              isLoading={membershipLoading}
              onSelectPlan={() => handleSelectPlan(plan)}
              unlockRole={unlockRole}
              unlockServiceName={unlockContext?.serviceName ?? null}
              unlockMinimumPlanName={unlockContext?.minimumPlan?.name ?? null}
            />
          );
        })}
      </div>

      {/* Checkout only when authenticated (selectedPlan set after token check) */}
      {selectedPlan && selectedPlan.id && getSessionToken() && (
        <CheckoutModal
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          items={[
            {
              id: selectedPlan.id,
              title: selectedPlan.name,
              name: selectedPlan.name,
              // Catalog metadata for plan resolution; charged amount comes from server order
              price: selectedPlan.price,
              currency: selectedPlan.currency,
              type: "membership",
            },
          ]}
          subtotal={selectedDisplayPrice}
          discount={0}
          total={selectedDisplayPrice}
          currency={selectedPlan.currency}
          onSuccess={() => {
            setSelectedPlan(null);
            window.dispatchEvent(new Event("membership-updated"));
          }}
        />
      )}
    </>
  );
}

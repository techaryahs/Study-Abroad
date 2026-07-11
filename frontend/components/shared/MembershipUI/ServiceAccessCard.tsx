"use client";

import React from "react";
import { Check, ShieldCheck, Sparkles } from "lucide-react";

/**
 * Service Access Card — single layout system for every service page.
 *
 * Fixed skeleton (content is dynamic; geometry is not):
 *   Badge → Title → Subtitle → Divider → Membership label →
 *   Benefits title → Flexible benefits → Spacer → Primary CTA → Secondary CTA → Trust
 *
 * CTAs are always pinned with mt-auto. Benefits sit in flex-1.
 * No page-specific spacing. No serviceId branches.
 */

export type ServiceAccessCardTone = "dark" | "light";

export interface ServiceAccessCardProps {
  tone?: ServiceAccessCardTone;
  /** Optional elite visual variant (dark gradient only) */
  elite?: boolean;
  badge: string;
  title: string;
  subtitle: string;
  membershipLine?: string;
  benefitsTitle?: string;
  benefits?: string[];
  /** Optional row under benefits (e.g. current plan chip) — still above CTAs */
  meta?: React.ReactNode;
  primaryAction: React.ReactNode;
  secondaryAction?: React.ReactNode;
  trustLine?: string;
  /** Center icon above badge */
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Shared geometry tokens — single source of truth.
 * ~10% wider than 380px for long service titles; still capped for premium proportion.
 * Bottom padding slightly open so CTAs breathe when pinned.
 */
const CARD_MIN_H = "min-h-[560px]";
/** ~10% wider than 380; full width of hero right column on large screens so it anchors to the image */
const CARD_MAX_W = "max-w-[420px] lg:max-w-none";
const CARD_PAD = "p-8 pb-9";
const CARD_RADIUS = "rounded-[2rem]";

export function ServiceAccessCard({
  tone = "dark",
  elite = false,
  badge,
  title,
  subtitle,
  membershipLine,
  benefitsTitle = "Everything included",
  benefits = [],
  meta,
  primaryAction,
  secondaryAction,
  trustLine,
  icon,
  className = "",
}: ServiceAccessCardProps) {
  const isDark = tone === "dark";

  const shell = isDark
    ? elite
      ? "bg-gradient-to-b from-[#3C2A21] to-[#1a1512] border-[#C5A059]/30 text-white"
      : "bg-[#40332D] border-[#D4A848]/20 text-white"
    : "bg-[#FDFBF7] border-[#EDE6DC] text-[#2D2926]";

  const badgeCls = isDark
    ? "bg-[#D4A848]/10 border-[#D4A848]/25 text-[#D4A848]"
    : "bg-[#C5A059]/10 border-[#C5A059]/20 text-[#9A7B3C]";

  const titleCls = isDark ? "text-white" : "text-[#2D2926]";
  const subtitleCls = isDark ? "text-[#FDFBF7]/72" : "text-[#6B5E51]";
  const labelMuted = isDark ? "text-white/40" : "text-[#9A7B3C]/80";
  const labelAccent = isDark ? "text-[#C5A059]/90" : "text-[#9A7B3C]";
  const benefitText = isDark ? "text-white/90" : "text-[#3C2A21]";
  const checkIcon = isDark ? "text-[#C5A059]" : "text-[#C5A059]";
  const divider = isDark ? "border-white/10" : "border-[#EDE6DC]";
  const trustCls = isDark ? "text-white/35" : "text-[#8B8078]";
  const iconWrap = isDark
    ? "bg-[#C5A059]/15 border-[#C5A059]/25"
    : "bg-white border-[#EDE6DC] shadow-sm";

  return (
    <div
      className={`
        relative overflow-hidden border shadow-[0_30px_100px_-20px_rgba(194,168,120,0.35)]
        ${CARD_RADIUS} ${CARD_PAD} ${CARD_MIN_H} ${CARD_MAX_W}
        mx-auto flex w-full flex-col lg:mx-0
        ${shell}
        ${className}
      `}
    >
      {/* Atmosphere — decorative only */}
      {isDark ? (
        <div className="pointer-events-none absolute -top-24 -right-20 h-48 w-48 rounded-full bg-[#D4A848]/12 blur-[80px]" />
      ) : (
        <>
          <div className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-[#C5A059]/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-[#3C2A21]/5 blur-3xl" />
        </>
      )}

      {/* ── Header block (fixed vertical rhythm) ── */}
      <div className="relative z-10 flex flex-col items-center text-center shrink-0">
        <div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full border ${iconWrap}`}
        >
          {icon ?? <Sparkles className="h-5 w-5 text-[#C5A059]" />}
        </div>

        {/* Badge */}
        <span
          className={`mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${badgeCls}`}
        >
          <Sparkles className="h-3 w-3" />
          {badge}
        </span>

        {/* Title — fixed line clamp keeps height stable */}
        <h3
          className={`mb-3 line-clamp-2 min-h-[3.25rem] text-xl font-semibold leading-snug tracking-tight md:text-2xl ${titleCls}`}
        >
          {title}
        </h3>

        {/* Subtitle — fixed lines */}
        <p
          className={`line-clamp-3 min-h-[3.75rem] max-w-[280px] text-[13px] font-medium leading-relaxed ${subtitleCls}`}
        >
          {subtitle}
        </p>
      </div>

      {/* Divider */}
      <div className={`relative z-10 my-6 shrink-0 border-t ${divider}`} />

      {/* ── Middle: membership labels + flexible benefits ── */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <p
          className={`mb-2 shrink-0 text-center text-[10px] font-semibold uppercase tracking-[0.16em] ${labelMuted}`}
        >
          {membershipLine || "\u00A0"}
        </p>
        <p
          className={`mb-3 shrink-0 text-center text-[11px] font-semibold uppercase tracking-[0.12em] ${labelAccent}`}
        >
          {benefitsTitle}
        </p>

        {/* Flexible benefits area — grows; never pushes CTAs when short */}
        <div className="min-h-[8.5rem] flex-1">
          {benefits.length > 0 ? (
            <ul className="space-y-2.5 px-0.5">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <Check
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${checkIcon}`}
                    strokeWidth={2.5}
                  />
                  <span
                    className={`text-[13px] font-medium leading-snug ${benefitText}`}
                  >
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full" aria-hidden />
          )}
        </div>

        {meta ? <div className="mt-4 shrink-0">{meta}</div> : null}
      </div>

      {/* ── CTA block — always pinned to bottom with comfortable breathing room ── */}
      <div className="relative z-10 mt-auto flex w-full shrink-0 flex-col gap-2.5 pt-8">
        <div className="flex w-full flex-col gap-2.5 [&_a]:w-full [&_button]:w-full">
          {primaryAction}
          {secondaryAction}
        </div>

        {trustLine ? (
          <div className={`mt-5 border-t pt-5 text-center ${divider}`}>
            <p
              className={`flex items-center justify-center gap-2 text-[10px] font-medium tracking-wide ${trustCls}`}
            >
              <ShieldCheck size={13} className="text-[#C5A059]/80" />
              {trustLine}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Shared primary button classes for dark service access cards */
export const serviceAccessPrimaryBtnClass =
  "inline-flex w-full items-center justify-center rounded-xl bg-[#C5A059] px-6 py-3.5 text-center text-[12px] font-semibold tracking-wide text-[#2D2926] transition-colors hover:bg-white";

/** Shared secondary button classes for dark service access cards */
export const serviceAccessSecondaryBtnClass =
  "inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 transition-colors hover:bg-white/5";

/** Light-theme primary (EntitlementGuard / LockedFeatureCard) */
export const serviceAccessLightPrimaryBtnClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2D2926] px-6 py-3.5 text-[12px] font-semibold tracking-wide text-white shadow-md transition-all hover:bg-[#C5A059] hover:text-[#2D2926] active:scale-[0.98]";

/** Light-theme secondary */
export const serviceAccessLightSecondaryBtnClass =
  "inline-flex w-full items-center justify-center rounded-xl border border-transparent px-6 py-3 text-center text-[12px] font-medium text-[#6B5E51] transition-colors hover:text-[#C5A059]";

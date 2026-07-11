/**
 * TEST_PAYMENT_MODE helpers.
 *
 * IMPORTANT: For SSR/hydration safety, PricingPage (Server Component) must
 * call `isTestPaymentMode()` once and pass the boolean into PricingClient.
 * Client components must NOT re-read env for displayed prices — they use the
 * server-provided flag / displayPrice prop only.
 *
 * Does NOT change catalog, Mongo, or entitlements.
 */

const TEST_CHARGE_RUPEES = 1;

/**
 * Read TEST_PAYMENT_MODE / NEXT_PUBLIC_TEST_PAYMENT_MODE.
 * Safe on the server during RSC render. next.config mirrors TEST_PAYMENT_MODE
 * into NEXT_PUBLIC_TEST_PAYMENT_MODE so the value is identical for SSR and
 * the client bundle when the flag is set at build/start time.
 */
export function isTestPaymentMode(): boolean {
  const v = String(
    process.env.NEXT_PUBLIC_TEST_PAYMENT_MODE ||
      process.env.TEST_PAYMENT_MODE ||
      ""
  )
    .trim()
    .toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

/** Charged/display amount for membership when test mode is on (₹1). */
export function testMembershipChargeRupees(): number {
  return TEST_CHARGE_RUPEES;
}

/**
 * Pure display price from catalog price + server-provided flag.
 * Never reads env — both SSR and client must pass the same `testPaymentMode`.
 */
export function membershipDisplayPrice(
  catalogPrice: number | undefined | null,
  testPaymentMode: boolean
): number {
  if (testPaymentMode) return TEST_CHARGE_RUPEES;
  return Number(catalogPrice) || 0;
}

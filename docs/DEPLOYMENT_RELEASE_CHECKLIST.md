# Membership & Consultation — Deployment Release Checklist

**Architecture is frozen.** This checklist is the standard deployment procedure for operational consistency only.

Source of truth for plans: `backend/catalog/membershipCatalog.js`  
Runtime store: MongoDB `membershipplans` + `services`

---

## Prerequisites

- [ ] `MONGO_URI` set in environment / `.env`
- [ ] Node.js available
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed if shipping web (`cd frontend && npm install`)

---

## 1. Catalog synchronization (P0 — release blocker)

```bash
cd backend
node scripts/syncMembershipCatalog.js
```

**Must print:** `CATALOG SYNC PASS`

### Verification table (must all PASS)

| Plan | Expected | Mongo | PASS/FAIL |
| --- | --- | --- | --- |
| starter | v2 limit=1 renewal=never | (from script output) | PASS |
| essential | v2 limit=3 renewal=yearly | (from script output) | PASS |
| premium | v2 limit=5 renewal=yearly | (from script output) | PASS |
| elite | v2 limit=10 renewal=yearly | (from script output) | PASS |

**Release must FAIL if any row is FAIL.**

Optional usage backfill for existing active members (former unlimited → metered):

```bash
node scripts/opsBackfillConsultationUsage.js
```

---

## 2. Deployment verification (P1-2)

```bash
cd backend
node scripts/deployVerify.js
# or: npm run deploy:verify
```

Checks:

- [ ] Catalog version matches source (`CATALOG_VERSION`)
- [ ] Consultation limits 1 / 3 / 5 / 10
- [ ] Entitlements present on all four plans
- [ ] Plan count ≥ catalog
- [ ] Service count ≥ catalog
- [ ] No missing catalog services
- [ ] Index `unique_active_counselling_slot` present
- [ ] Zero duplicate active counselling slots

**Release must FAIL if script exits non-zero.**

---

## 3. Admin seed protection (P1-1)

Confirm route is **not public**:

```
POST /api/memberships/seed
  → verifyToken (JWT)
  → requireAdmin
  → seedInitialCatalog
```

- [ ] Anonymous call → **401**
- [ ] Non-admin JWT → **403**
- [ ] Admin JWT → **201** (only when intentionally re-seeding)

Prefer `node scripts/syncMembershipCatalog.js` in CI/CD over HTTP seed.

---

## 4. Smoke tests (P1-3)

```bash
cd backend
node scripts/releaseSmokeTest.js
# or: npm run smoke
```

Must cover:

- [ ] Starter consultation limit = 1
- [ ] Essential consultation limit = 3
- [ ] Premium consultation limit = 5
- [ ] Elite consultation limit = 10
- [ ] 6th Premium denied (remaining 0)
- [ ] 11th Elite denied (remaining 0)
- [ ] Expired membership denied
- [ ] Sentinel / unverified payment rejected
- [ ] Reused paymentId rejected
- [ ] Forged userId rule (mismatch reject)
- [ ] Duplicate slot index present

**Must print:** `SMOKE: PASS`

---

## 5. Lifecycle unit scripts

```bash
cd backend
node scripts/verifyUsageLifecycle.js
node scripts/verifyPaymentLifecycle.js
```

- [ ] Usage lifecycle PASS  
- [ ] Payment lifecycle PASS  

---

## 6. Application builds / startup

### Backend

```bash
cd backend
node -e "require('./index.js')"   # or: npm start (nodemon)
```

- [ ] Server starts without crash  
- [ ] Boot log includes: `unique_active_counselling_slot` (via `config/db.js`)  

### Frontend

```bash
cd frontend
npm run build
```

- [ ] Build succeeds  

---

## 7. Manual production smoke (optional but recommended)

| Check | Expected |
| --- | --- |
| Website free book (eligible) | 201 / booked, free flag set |
| Website membership book | credit −1 |
| Website paid ₹599 after credits=0 | ledger + book |
| Mobile membership book | `/book-consultation` path membership |
| Cancel pre-session | credit restored once |
| Payment verify forged userId | 403 IDENTITY_MISMATCH |
| Double book same slot | 409 SLOT_TAKEN |

---

## 8. Production readiness sign-off

| Item | Owner | Status |
| --- | --- | --- |
| Catalog sync PASS | Ops | ☐ |
| Deploy verify PASS | Ops | ☐ |
| Smoke PASS | Ops | ☐ |
| Admin seed protected | Eng | ☐ |
| Frontend build PASS | Eng | ☐ |
| Backend startup PASS | Eng | ☐ |
| **GO / NO-GO** | Release | ☐ |

**Do not ship if catalog sync or deploy verify fails.**

---

## NPM scripts (backend)

```json
"catalog:sync": "node scripts/syncMembershipCatalog.js",
"deploy:verify": "node scripts/deployVerify.js",
"smoke": "node scripts/releaseSmokeTest.js",
"release:check": "node scripts/syncMembershipCatalog.js && node scripts/deployVerify.js && node scripts/releaseSmokeTest.js && node scripts/verifyUsageLifecycle.js && node scripts/verifyPaymentLifecycle.js"
```

---

## Notes

- Architecture (EntitlementEngine, orchestrator, payment branches) is **frozen**.
- This procedure only keeps **runtime Mongo** aligned with the frozen source catalog.
- Extra active planIds in Mongo not present in catalog are reported but do not auto-delete (backward compatibility).

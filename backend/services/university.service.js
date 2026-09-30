const fs = require("fs");
const path = require("path");
const { DEFAULT_FREE_UNIVERSITY_LIMIT } = require("../catalog/membershipCatalog");
const { evaluateMembership } = require("../utils/membershipLifecycle");
const { getPlanEntitlement, loadActivePlan } = require("../utils/entitlementEngine");

// Data directory paths
const UNIVERSITIES_DIR = path.join(__dirname, "../data/universities");
const COUNTRIES_DIR = path.join(UNIVERSITIES_DIR, "countries");

let cachedDataset = null;

/**
 * Load all university records from disk and structure them with canonical country lists.
 */
function loadUniversityDataset() {
  if (cachedDataset) return cachedDataset;

  const countryUniversitiesMap = {}; // slug -> Array of university items
  const allUniversities = [];

  try {
    if (fs.existsSync(COUNTRIES_DIR)) {
      const files = fs.readdirSync(COUNTRIES_DIR);
      for (const file of files) {
        if (!file.endsWith(".json")) continue;
        if (file === "scolarship.json" || file === "services-pricing.json") continue;

        const filePath = path.join(COUNTRIES_DIR, file);
        try {
          const raw = fs.readFileSync(filePath, "utf8");
          const parsed = JSON.parse(raw);

          if (Array.isArray(parsed)) {
            parsed.forEach((uni, index) => {
              if (uni && uni.slug) {
                const countryName = uni.location?.country || file.replace(".json", "");
                const countrySlug = countryName.toLowerCase().replace(/[^a-z0-9]/g, "-");

                if (!countryUniversitiesMap[countrySlug]) {
                  countryUniversitiesMap[countrySlug] = [];
                }
                countryUniversitiesMap[countrySlug].push(uni);
                allUniversities.push({ ...uni, countrySlug });
              }
            });
          }
        } catch (fileErr) {
          console.error(`[UniversityService] Error parsing ${file}:`, fileErr.message);
        }
      }
    }
  } catch (err) {
    console.error("[UniversityService] Error reading countries directory:", err.message);
  }

  // Also check universities.json for any top-level metadata or missing items
  const metaPath = path.join(UNIVERSITIES_DIR, "universities.json");
  if (fs.existsSync(metaPath)) {
    try {
      const metaRaw = fs.readFileSync(metaPath, "utf8");
      const metaParsed = JSON.parse(metaRaw);
      if (metaParsed && Array.isArray(metaParsed.countries)) {
        for (const countryMeta of metaParsed.countries) {
          const countrySlug = (countryMeta.slug || "").toLowerCase();
          if (!countryUniversitiesMap[countrySlug] && Array.isArray(countryMeta.universities)) {
            countryUniversitiesMap[countrySlug] = countryMeta.universities;
            countryMeta.universities.forEach((uni) => {
              allUniversities.push({ ...uni, countrySlug });
            });
          }
        }
      }
    } catch (metaErr) {
      console.error("[UniversityService] Error reading universities.json:", metaErr.message);
    }
  }

  cachedDataset = { countryUniversitiesMap, allUniversities };
  return cachedDataset;
}

/**
 * Resolves university entitlement & limit for a student.
 */
async function getUniversityAccessLimit(student) {
  const membership = student?.membership || null;
  const lifecycle = evaluateMembership(membership);

  if (lifecycle.isAccessAllowed) {
    let plan = null;
    try {
      plan = await loadActivePlan(lifecycle.planId);
    } catch (e) {
      // Ignore DB timeout and use catalog fallback
    }

    if (!plan) {
      const { PLANS } = require("../catalog/membershipCatalog");
      plan = PLANS.find((p) => p.planId === lifecycle.planId) || null;
    }

    if (plan) {
      const entitlement = getPlanEntitlement(plan, "university_search", "access");
      if (entitlement && entitlement.enabled !== false) {
        if (entitlement.limit != null && typeof entitlement.limit === "number") {
          return { isUnlimited: false, limit: entitlement.limit, planId: lifecycle.planId };
        }
        return { isUnlimited: true, limit: null, planId: lifecycle.planId };
      }
    }
  }

  return { isUnlimited: false, limit: DEFAULT_FREE_UNIVERSITY_LIMIT, planId: "free" };
}

/**
 * Determines whether a university is accessible or locked based on canonical directory index.
 */
function checkAccessForUniversity(university, accessLimitInfo, countryList = []) {
  if (accessLimitInfo.isUnlimited) {
    return { hasAccess: true, access: "full" };
  }

  const limit = accessLimitInfo.limit ?? DEFAULT_FREE_UNIVERSITY_LIMIT;

  // Find canonical index in the university's country directory list
  let canonicalIndex = countryList.findIndex(
    (u) => (u._id && u._id === university._id) || (u.slug && u.slug === university.slug)
  );

  // If not found in country list, check index in global dataset
  if (canonicalIndex === -1) {
    const dataset = loadUniversityDataset();
    canonicalIndex = dataset.allUniversities.findIndex(
      (u) => (u._id && u._id === university._id) || (u.slug && u.slug === university.slug)
    );
  }

  if (canonicalIndex >= 0 && canonicalIndex < limit) {
    return { hasAccess: true, access: "full" };
  }

  return { hasAccess: false, access: "locked" };
}

/**
 * Sanitizes university record to strictly prevent exposing restricted data for locked items.
 */
function sanitizeUniversity(university, accessInfo) {
  if (accessInfo.hasAccess) {
    return {
      ...university,
      hasAccess: true,
      access: "full",
    };
  }

  // Teaser representation for locked universities — NO sensitive admission/financial stats
  const city = university.location?.city || "";
  const state = university.location?.state || "";
  const country = university.location?.country || "";

  return {
    _id: university._id || university.slug,
    slug: university.slug,
    name: university.name,
    logo: university.logo,
    location: { city, state, country },
    rank: university.rank || "Top Tier",
    type: university.type || "Research University",
    hasAccess: false,
    access: "locked",
    fee: "🔒 Membership Required",
    about: "Unlock full university information, admission stats, tuition fees, program specifications, and admit chance calculations with Membership.",
    highlights: [
      "🔒 Premium University",
      "Unlock detailed requirements & stats with Membership",
    ],
  };
}

/**
 * Retrieves university search/listing with server-enforced access checks.
 */
async function getUniversities(queryOptions = {}, student = null) {
  const { country, state, search } = queryOptions;
  const dataset = loadUniversityDataset();
  const accessLimitInfo = await getUniversityAccessLimit(student);

  let targetUniversities = dataset.allUniversities;

  // Filter by country if specified
  if (country && country.trim().isNotEmpty !== false) {
    const lowerCountry = country.toLowerCase().trim();
    targetUniversities = targetUniversities.filter((u) => {
      const uCountry = (u.location?.country || u.countrySlug || "").toLowerCase();
      return uCountry === lowerCountry || u.countrySlug === lowerCountry;
    });
  }

  // Filter by state if specified
  if (state) {
    const lowerState = state.toLowerCase().trim();
    targetUniversities = targetUniversities.filter((u) => {
      const uState = (u.location?.state || "").toLowerCase();
      return uState === lowerState;
    });
  }

  // Filter by search term if specified (Name, City, Country, Slug)
  if (search && search.trim().length > 0) {
    const q = search.toLowerCase().trim();
    targetUniversities = targetUniversities.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const city = (u.location?.city || "").toLowerCase();
      const countryName = (u.location?.country || "").toLowerCase();
      const slug = (u.slug || "").toLowerCase();
      return name.includes(q) || city.includes(q) || countryName.includes(q) || slug.includes(q);
    });
  }

  // Process access control for each university
  const sanitizedList = targetUniversities.map((uni) => {
    const countrySlug = (uni.location?.country || uni.countrySlug || "").toLowerCase().replace(/[^a-z0-9]/g, "-");
    const countryList = dataset.countryUniversitiesMap[countrySlug] || [];
    const accessInfo = checkAccessForUniversity(uni, accessLimitInfo, countryList);
    return sanitizeUniversity(uni, accessInfo);
  });

  return {
    count: sanitizedList.length,
    data: sanitizedList,
  };
}

/**
 * Retrieves single university details by slug with server-enforced access check.
 */
async function getUniversityBySlug(slug, student = null) {
  if (!slug) return null;
  const dataset = loadUniversityDataset();
  const lowerSlug = slug.toLowerCase().trim();

  const university = dataset.allUniversities.find((u) => (u.slug || "").toLowerCase() === lowerSlug);
  if (!university) return null;

  const accessLimitInfo = await getUniversityAccessLimit(student);
  const countrySlug = (university.location?.country || university.countrySlug || "").toLowerCase().replace(/[^a-z0-9]/g, "-");
  const countryList = dataset.countryUniversitiesMap[countrySlug] || [];

  const accessInfo = checkAccessForUniversity(university, accessLimitInfo, countryList);
  return sanitizeUniversity(university, accessInfo);
}

module.exports = {
  getUniversities,
  getUniversityBySlug,
  getUniversityAccessLimit,
  checkAccessForUniversity,
  sanitizeUniversity,
  loadUniversityDataset,
};

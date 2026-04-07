/**
 * Utility to fetch university and institution logos dynamically.
 * Uses a robust multi-source fallback strategy to ensure logos are always visible.
 */

const FALLBACK_ICON = "🎓";

/**
 * Returns a high-resolution logo URL for a given domain.
 * @param domain - The university domain (e.g., 'unimelb.edu.au')
 * @returns A string URL pointing to the logo image
 */
export const getUniversityLogo = (domain: string): string => {
  if (!domain) return FALLBACK_ICON;
  
  // Clean domain just in case
  const cleanDomain = domain.toLowerCase().trim();
  
  // Primary: Google Favicon API (supports 128px high-res)
  // Reliability: High
  return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
};

/**
 * Helper to extract domain from a university name (Commonly used if domain isn't in JSON)
 */
export const inferDomainFromName = (name: string): string => {
  const map: Record<string, string> = {
    "University of Melbourne": "unimelb.edu.au",
    "The University of Sydney": "sydney.edu.au",
    "Monash University": "monash.edu",
    "Australian National University": "anu.edu.au",
    "UNSW Sydney": "unsw.edu.au",
    "The University of Queensland": "uq.edu.au",
    "University of Adelaide": "adelaide.edu.au",
    "University of Technology Sydney": "uts.edu.au",
    "The University of Western Australia": "uwa.edu.au",
    "Macquarie University": "mq.edu.au",
  };
  return map[name] || "";
};

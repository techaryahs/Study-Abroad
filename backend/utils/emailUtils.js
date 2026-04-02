/**
 * Generates a case-insensitive regex that treats dots as optional
 * in the local part of an email address.
 * Matches "john.doe@gmail.com" against "johndoe@gmail.com" and vice-versa.
 */
exports.getEmailSearchRegex = (email) => {
  if (!email) return null;
  
  const trimmed = email.toLowerCase().trim();
  const parts = trimmed.split("@");
  
  if (parts.length !== 2) {
    // Fallback for malformed emails
    return new RegExp(`^${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  }

  const [local, domain] = parts;
  
  // 1. Remove existing dots from local part to build the base
  const baseLocal = local.replace(/\./g, "");
  
  // 2. Escape special characters in baseLocal and domain
  const escapedDomain = domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // 3. Create regex pattern: 
  // For "johndoe", make it "j\.?o\.?h\.?n\.?d\.?o\.?e"
  const regexPattern = baseLocal
    .split("")
    .map(char => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "\\.?")
    .join("");

  // Construct final regex: ^ local_part @ domain $
  // The local part regex will allow 0 or 1 dot between any character.
  return new RegExp(`^${regexPattern}@${escapedDomain}$`, "i");
};

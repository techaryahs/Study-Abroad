const User = require("../models/User");

/**
 * Resolves the Edu Mitra partner ObjectId for a given Seminar document.
 * 
 * Order of resolution:
 * 1. seminar.eduMitraId (direct ObjectId reference)
 * 2. seminar.eduMitraCounsellor (matches User.name with partnerType: "edu_mitra")
 * 3. seminar.createdBy (if creator is an Edu Mitra partner)
 */
async function resolveEduMitraPartnerId(seminar) {
  if (!seminar) return null;

  if (seminar.eduMitraId) {
    return seminar.eduMitraId;
  }

  if (seminar.eduMitraCounsellor) {
    const counselorName = String(seminar.eduMitraCounsellor).trim();
    const mitraUser = await User.findOne({
      name: counselorName,
      role: "partner",
      "partnerProfile.partnerType": "edu_mitra",
    });
    if (mitraUser) return mitraUser._id;
  }

  if (seminar.createdBy) {
    const creator = await User.findById(seminar.createdBy);
    if (creator && creator.partnerProfile?.partnerType === "edu_mitra") {
      return creator._id;
    }
  }

  return null;
}

module.exports = {
  resolveEduMitraPartnerId,
};

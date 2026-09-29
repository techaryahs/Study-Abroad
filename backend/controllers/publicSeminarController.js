const Seminar = require("../models/Seminar");
const StudentLead = require("../models/StudentLead");
const studentLeadService = require("../services/partnership/studentLeadService");
const { getPartnershipOtpStore } = require("../utils/partnershipOtpStore");
const { sendSMSOTP } = require("../utils/otpsms");
const crypto = require("crypto");
const { resolveEduMitraPartnerId } = require("../utils/tenantHelper");

exports.getPublicSeminar = async (req, res) => {
  try {
    const seminar = await Seminar.findOne({ seminarId: req.params.seminarId });
    if (!seminar) return res.status(404).json({ success: false, message: "Seminar not found" });
    if (["PENDING", "REJECTED", "CANCELLED", "DRAFT"].includes(seminar.status)) {
      return res.status(403).json({ success: false, message: "Seminar is currently unavailable for registration." });
    }
    
    // Return only safe fields
    res.json({ 
      success: true, 
      seminar: {
        seminarId: seminar.seminarId,
        title: seminar.title,
        collegeName: seminar.collegeName,
        date: seminar.date,
        description: seminar.description
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const { seminarId } = req.params;
    const { fullName, mobile, email, course, graduationYear, preferredCountry, preferredProgram, studyAbroadTimeline, consentGiven } = req.body;
    
    if (!consentGiven) {
      return res.status(400).json({ success: false, message: "Consent is required" });
    }

    const seminar = await Seminar.findOne({ seminarId });
    if (!seminar) return res.status(404).json({ success: false, message: "Seminar not found" });
    if (["PENDING", "REJECTED", "CANCELLED", "DRAFT"].includes(seminar.status)) {
      return res.status(403).json({ success: false, message: "Seminar is currently unavailable for registration." });
    }

    // Handle duplicates
    const duplicate = await studentLeadService.findDuplicate(mobile, email, fullName, seminar.collegeId);
    if (duplicate) {
      // Add interaction
      if (!duplicate.interactions.some(i => i.seminarId === seminarId)) {
        duplicate.interactions.push({ seminarId, interactionDate: new Date(), type: "REGISTRATION" });
        await duplicate.save();
      }
      return res.json({ 
        success: true, 
        message: `Your details are already registered with EduLeader Global. We have linked this seminar activity to your existing Student Lead ID.`,
        studentLeadId: duplicate.studentLeadId,
        isDuplicate: true
      });
    }

    // New student registration requires OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = crypto.randomBytes(16).toString("hex");
    
    const store = getPartnershipOtpStore();
    const resolvedMitraId = await resolveEduMitraPartnerId(seminar);
    store.set(mobile, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0,
      data: { ...req.body, collegeId: seminar.collegeId, partnerId: resolvedMitraId || seminar.createdBy || null }
    });

    // Send SMS (Mock for local dev if API key missing)
    await sendSMSOTP(mobile, otp);

    res.json({ success: true, message: "OTP sent successfully", token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { seminarId } = req.params;
    const { mobile, otp } = req.body;

    const store = getPartnershipOtpStore();
    const otpRecord = store.get(mobile);

    if (!otpRecord) return res.status(400).json({ success: false, message: "OTP expired or invalid" });
    if (otpRecord.attempts >= 3) return res.status(400).json({ success: false, message: "Too many attempts. Request a new OTP." });
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP Verified, create lead
    const data = otpRecord.data;
    const year = new Date().getFullYear();
    const studentLeadId = await studentLeadService.generateStudentLeadId(data.collegeId, year);

    const now = new Date();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 24);

    const lead = new StudentLead({
      studentLeadId,
      seminarId,
      collegeId: data.collegeId,
      partnerId: data.partnerId || null,
      fullName: data.fullName,
      mobile: data.mobile,
      normalizedMobile: studentLeadService.normalizePhone(data.mobile),
      email: data.email,
      normalizedEmail: studentLeadService.normalizeEmail(data.email),
      course: data.course,
      graduationYear: data.graduationYear,
      preferredCountry: data.preferredCountry,
      preferredProgram: data.preferredProgram,
      studyAbroadTimeline: data.studyAbroadTimeline,
      consentGiven: data.consentGiven,
      consentTimestamp: now,
      otpVerified: true,
      otpVerifiedAt: now,
      sourceSeminarId: seminarId,
      sourceCollegeId: data.collegeId,
      sourceDate: now,
      attributionStartDate: now,
      attributionExpiryDate: expiry,
      interactions: [{ seminarId, interactionDate: now, type: "REGISTRATION" }]
    });

    await lead.save();
    store.delete(mobile);

    res.json({ success: true, message: "Registration successful", studentLeadId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

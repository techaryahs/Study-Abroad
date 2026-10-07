const fs = require('fs');
const file = 'backend/controllers/partnershipController.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /exports\.getStudentLeads = async \(req, res\) => \{[\s\S]*?res\.json\(\{ \n      success: true, \n      leads, \n      pagination: \{[\s\S]*?\}\n    \}\);\n  \} catch \(err\) \{\n    res\.status\(500\)\.json\(\{ success: false, message: err\.message \}\);\n  \}\n\};/g;

// Fallback regex if the above fails
const regexFallback = /exports\.getStudentLeads = async \(req, res\) => \{[\s\S]*?\n\};/g;

const replacement = `exports.getStudentLeads = async (req, res) => {
  try {
    const role = String(req.user?.role || "").toLowerCase();
    
    // Check access
    if (role === "partner") {
      const userDoc = await User.findById(req.user.id).select("partnerProfile");
      if (!userDoc || !userDoc.partnerProfile || userDoc.partnerProfile.onboardingStatus !== "approved") {
        return res.status(403).json({ success: false, message: "Access denied." });
      }
    } else if (!["admin", "super_admin", "consultant", "counsellor"].includes(role)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const { page, limit, search, status, collegeId, preferredCountry, course, consultantId } = req.query;
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : null;
    const skip = limitNumber ? (pageNumber - 1) * limitNumber : 0;

    const pipeline = [];

    // Pre-lookup search (on Student fields)
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { mobile: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Lookup StudentLead
    pipeline.push({
      $lookup: {
        from: "studentleads",
        localField: "email",
        foreignField: "email",
        as: "leadData"
      }
    });

    pipeline.push({
      $unwind: {
        path: "$leadData",
        preserveNullAndEmptyArrays: true
      }
    });

    // Post-lookup match (on StudentLead fields or Lead ID)
    const postMatch = {};
    if (search) {
      // If we searched, we might have matched a Lead ID
      postMatch.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { "leadData.studentLeadId": { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) postMatch["leadData.leadStatus"] = status;
    if (preferredCountry) postMatch["leadData.preferredCountry"] = preferredCountry;
    if (course) postMatch["leadData.course"] = { $regex: course, $options: 'i' };
    
    if (consultantId) {
      const mongoose = require('mongoose');
      if (consultantId === 'unassigned') {
        postMatch["leadData.assignedConsultantId"] = null;
      } else {
        postMatch["leadData.assignedConsultantId"] = new mongoose.Types.ObjectId(consultantId);
      }
    }

    if (Object.keys(postMatch).length > 0) {
      pipeline.push({ $match: postMatch });
    }

    // Lookup College info for the lead
    pipeline.push({
      $lookup: {
        from: "colleges",
        localField: "leadData.collegeId",
        foreignField: "_id",
        as: "collegeData"
      }
    });
    
    pipeline.push({
      $unwind: {
        path: "$collegeData",
        preserveNullAndEmptyArrays: true
      }
    });

    // Lookup Consultant info
    pipeline.push({
      $lookup: {
        from: "users", // Consultant/Counsellor is in User collection
        localField: "leadData.assignedConsultantId",
        foreignField: "_id",
        as: "consultantData"
      }
    });
    
    pipeline.push({
      $unwind: {
        path: "$consultantData",
        preserveNullAndEmptyArrays: true
      }
    });

    pipeline.push({ $sort: { createdAt: -1 } });
    
    // Pagination
    const totalPipeline = [...pipeline, { $count: "total" }];
    const Student = require("../models/Student");
    const countResult = await Student.aggregate(totalPipeline);
    const total = countResult[0] ? countResult[0].total : 0;

    if (skip) pipeline.push({ $skip: skip });
    if (limitNumber) pipeline.push({ $limit: limitNumber });
    
    // Exclusion projection
    pipeline.push({
      $project: {
        password: 0,
        loginOtp: 0,
        "leadData.__v": 0
      }
    });

    const rawStudents = await Student.aggregate(pipeline);

    // Map to the expected format
    const leads = rawStudents.map(student => {
      const lead = student.leadData || {};
      const college = student.collegeData || {};
      const consultant = student.consultantData || {};
      
      const resolvedCollegeName = college.name || lead.collegeName || "-";
      const collegeObj = college._id ? { _id: college._id, name: college.name } : null;
      
      let assignedConsultantObj = null;
      if (consultant._id) {
        assignedConsultantObj = {
          _id: consultant._id,
          name: consultant.name,
          email: consultant.email,
          role: consultant.role
        };
      }

      return {
        _id: student._id, // the true Student ID
        studentId: student._id,
        studentLeadId: lead.studentLeadId || "-",
        leadId: lead.studentLeadId || "-",
        fullName: student.name || lead.fullName || "Unknown",
        email: student.email || lead.email || "-",
        mobile: student.mobile || lead.mobile || "-",
        course: lead.course || lead.preferredProgram || "-",
        preferredProgram: lead.preferredProgram || "-",
        preferredCountry: lead.preferredCountry || student.country || "-",
        graduationYear: lead.graduationYear || "",
        leadStatus: lead.leadStatus || "REGISTERED",
        attributionStartDate: lead.attributionStartDate || null,
        collegeId: collegeObj,
        collegeName: resolvedCollegeName,
        assignedConsultantId: assignedConsultantObj,
        inquirySource: lead.inquirySource || "DIRECT",
        hasLead: !!student.leadData
      };
    });

    res.json({ 
      success: true, 
      leads, 
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber || total,
        totalPages: limitNumber ? Math.ceil(total / limitNumber) : 1
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
} else {
  content = content.replace(regexFallback, replacement);
}

fs.writeFileSync(file, content);
console.log('patched getStudentLeads with aggregation');

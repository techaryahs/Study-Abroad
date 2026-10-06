const fs = require('fs');
const file = 'frontend/app/partnership/students/[studentLeadId]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// We will overwrite the entire file with a merged version.
const newContent = `"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PartnerGuard from "../../../../components/partnership/common/PartnerGuard";
import axios from "axios";
import { getToken, getUser } from "@/app/lib/token";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  FileText, 
  CheckCircle, 
  UserCheck,
  AlertCircle,
  Briefcase,
  Award
} from "lucide-react";

export default function StudentProfilePage() {
  const { studentLeadId } = useParams();
  const router = useRouter();
  
  const [lead, setLead] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const headers = { Authorization: \`Bearer \${token}\` };

      // 1. Fetch main profile
      const res = await axios.get(
        \`\${API_URL}/api/partnership/student-leads/\${studentLeadId}\`,
        { headers }
      );
      
      if (res.data.success) {
        setLead(res.data.lead);
      } else {
        setError(res.data.message || "Failed to load student profile");
        return;
      }
      
      // 2. Fetch applications
      try {
        const appsRes = await axios.get(\`\${API_URL}/api/partnership-applications/\${studentLeadId}/applications\`, { headers });
        setApplications(appsRes.data.applications || []);
      } catch (e) { console.error("Error fetching applications", e); }
      
      // 3. Fetch offers
      try {
        const offersRes = await axios.get(\`\${API_URL}/api/partnership-applications/\${studentLeadId}/offers\`, { headers });
        setOffers(offersRes.data.offers || []);
      } catch (e) { console.error("Error fetching offers", e); }

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to load student profile");
    } finally {
      setLoading(false);
    }
  }, [studentLeadId]);

  useEffect(() => {
    fetchStudentProfile();
  }, [fetchStudentProfile]);

  if (loading) {
    return (
      <PartnerGuard>
        <div className="p-4 sm:p-6 lg:p-8 animate-pulse space-y-6 max-w-6xl mx-auto">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </PartnerGuard>
    );
  }

  if (error || !lead) {
    return (
      <PartnerGuard>
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          <Link href="/partnership/students" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 font-medium">
            <ArrowLeft size={16} className="mr-1.5" /> Back to Students
          </Link>
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Profile Not Found</h3>
            <p className="text-gray-500 mb-6">{error || "The student profile could not be loaded."}</p>
            <button onClick={fetchStudentProfile} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-blue-700">
              Try Again
            </button>
          </div>
        </div>
      </PartnerGuard>
    );
  }

  // Determine current stage for timeline
  const stages = [
    { id: "REGISTERED", label: "Registered" },
    { id: "COUNSELLING", label: "Counselling" },
    { id: "DOCUMENTS", label: "Documents" },
    { id: "SHORTLISTING", label: "Shortlisting" },
    { id: "APPLICATION", label: "Application" },
    { id: "OFFER", label: "Offer" },
    { id: "ADMISSION", label: "Admission" }
  ];
  
  const currentStageId = lead.pipelineStage || "REGISTERED";
  const currentStageIndex = stages.findIndex(s => s.id === currentStageId) !== -1 
    ? stages.findIndex(s => s.id === currentStageId) 
    : 0;

  return (
    <PartnerGuard>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header & Back Button */}
          <div>
            <Link href="/partnership/students" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-700 mb-4 font-medium transition-colors">
              <ArrowLeft size={16} className="mr-1.5" /> Back to Students
            </Link>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl shrink-0">
                  {lead.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{lead.fullName}</h1>
                  <p className="text-sm text-gray-500 font-medium mt-1">Lead ID: {lead.studentLeadId}</p>
                </div>
              </div>
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  {lead.leadStatus || "REGISTERED"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Journey Timeline */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="text-blue-600" size={18} /> Study Abroad Journey
                </h3>
                
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full hidden sm:block"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full hidden sm:block transition-all duration-500"
                    style={{ width: \`\${(currentStageIndex / (stages.length - 1)) * 100}%\` }}
                  ></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between gap-4 relative z-10">
                    {stages.map((stage, idx) => {
                      const isCompleted = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      
                      return (
                        <div key={stage.id} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center group">
                          <div className={\`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-colors
                            \${isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 
                              isCurrent ? 'bg-white border-blue-600 text-blue-700 ring-4 ring-blue-50' : 
                              'bg-white border-gray-200 text-gray-400'}\`}
                          >
                            {isCompleted ? <CheckCircle size={16} /> : (idx + 1)}
                          </div>
                          <span className={\`text-xs font-semibold \${isCurrent ? 'text-blue-700' : isCompleted ? 'text-gray-900' : 'text-gray-400'}\`}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Student Overview Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <User className="text-blue-600" size={18} /> Student Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</span>
                    <div className="flex items-center text-sm text-gray-900 font-medium">
                      <Mail size={14} className="text-gray-400 mr-2" /> {lead.email || "Not available"}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phone</span>
                    <div className="flex items-center text-sm text-gray-900 font-medium">
                      <Phone size={14} className="text-gray-400 mr-2" /> {lead.phone || lead.mobile || "Not available"}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">College</span>
                    <div className="flex items-center text-sm text-gray-900 font-medium">
                      <GraduationCap size={14} className="text-gray-400 mr-2" /> {lead.collegeName || "Not available"}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Course / Program</span>
                    <div className="text-sm text-gray-900 font-medium">
                      {lead.course || lead.preferredProgram || "Not available"} {lead.graduationYear && \`(\${lead.graduationYear})\`}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Preferred Country</span>
                    <div className="text-sm text-gray-900 font-medium">
                      {lead.preferredCountry || "Not available"}
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Registration Date</span>
                    <div className="flex items-center text-sm text-gray-900 font-medium">
                      <Calendar size={14} className="text-gray-400 mr-2" /> 
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "Not available"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <FileText className="text-blue-600" size={18} /> Documents
                </h3>
                
                {(!lead.documents || lead.documents.length === 0) ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    <FileText className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {lead.documents.map((doc: any, i: number) => (
                      <div key={i} className="py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{doc.docType}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                        </div>
                        <span className={\`text-xs font-bold px-2.5 py-1 rounded-full border
                          \${doc.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            doc.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' : 
                            'bg-amber-50 text-amber-700 border-amber-200'}\`}>
                          {doc.status || 'PENDING'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Shortlisted Universities & Applications */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Briefcase className="text-blue-600" size={18} /> Shortlists & Applications
                </h3>
                
                <div className="space-y-6">
                  {/* Applications */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Applications</h4>
                    {(!applications || applications.length === 0) ? (
                      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">No applications found.</p>
                    ) : (
                      <div className="space-y-3">
                        {applications.map((app: any) => (
                          <div key={app._id} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div>
                              <h5 className="text-sm font-bold text-gray-900">{app.universityName}</h5>
                              <p className="text-xs text-gray-500 font-medium mt-1">ID: {app.applicationId || "N/A"} • {app.country || "N/A"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100">
                                {app.status || "PENDING"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Offers */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Offers</h4>
                    {(!offers || offers.length === 0) ? (
                      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">No offers received yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {offers.map((offer: any) => (
                          <div key={offer._id} className="p-4 border border-amber-100 rounded-xl bg-amber-50 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                                <Award size={18} />
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-gray-900">{offer.universityName}</h5>
                                <p className="text-xs text-amber-700 font-medium mt-0.5">{offer.offerType} Offer</p>
                              </div>
                            </div>
                            <div>
                              <span className={\`px-2.5 py-1 text-xs font-bold rounded-md border
                                \${offer.acceptanceStatus === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                                  'bg-white text-gray-700 border-gray-200'}\`}>
                                {offer.acceptanceStatus || "PENDING"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              
              {/* Counselling Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <UserCheck className="text-blue-600" size={18} /> Counselling Info
                </h3>
                
                {lead.assignedConsultantId ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                        {lead.assignedConsultantId.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{lead.assignedConsultantId.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{lead.assignedConsultantId.role || "Consultant"}</p>
                      </div>
                    </div>
                    
                    {lead.assignedAt && (
                      <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-50">
                        <span className="text-gray-500 font-medium">Assigned on</span>
                        <span className="font-bold text-gray-900">{new Date(lead.assignedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {lead.assignmentNotes && (
                      <div className="pt-3 border-t border-gray-50">
                        <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Notes</span>
                        <p className="text-sm text-gray-700 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                          {lead.assignmentNotes}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="text-gray-400" size={20} />
                    </div>
                    <p className="text-sm font-bold text-gray-700">Consultant not assigned</p>
                    <p className="text-xs text-gray-500 mt-1">Pending allocation by management</p>
                  </div>
                )}
              </div>
              
              {/* Activity / System Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                  System Info
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Source Type</span>
                    <span className="font-medium text-gray-900">{lead.sourceType || "Organic"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Attribution Status</span>
                    <span className="font-medium text-emerald-600 bg-emerald-50 px-2 rounded">{lead.attributionStatus || "Active"}</span>
                  </div>
                  {lead.consentGiven && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-50">
                      <span className="text-gray-500">Consent Given</span>
                      <span className="font-medium text-gray-900">Yes, Verified</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </PartnerGuard>
  );
}
`;

fs.writeFileSync(file, newContent);
console.log('updated file successfully');

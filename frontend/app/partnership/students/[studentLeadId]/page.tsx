"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { getToken, getUser } from "@/app/lib/token";
import PartnerGuard from "../../../../components/partnership/common/PartnerGuard";

interface StudentLeadDetail {
  _id: string;
  studentLeadId: string;
  fullName: string;
  mobile: string;
  email?: string;
  course?: string;
  graduationYear?: string;
  preferredCountry?: string;
  preferredProgram?: string;
  studyAbroadTimeline?: string;
  collegeId?: { name?: string };
  sourceSeminarId?: string;
  seminarId?: string;
  registrationSource?: string;
  consentGiven?: boolean;
  otpVerified?: boolean;
  createdAt?: string;
  pipelineStage?: string;
  leadStatus?: string;
  shortlists?: Shortlist[];
}

interface Shortlist {
  _id: string;
  university: string;
  course: string;
  intake: string;
}

interface StudentApplication {
  _id: string;
  applicationId?: string;
  universityName: string;
  course?: string;
  country?: string;
  intake?: string;
  status?: string;
  visaStatus?: string;
  isEnrolled?: boolean;
}

interface StudentOffer {
  _id: string;
  universityName: string;
  offerType: string;
  acceptanceStatus: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
    return error.response?.data?.error || error.response?.data?.message || fallback;
  }
  return fallback;
}

export default function StudentDetail() {
  const params = useParams<{ studentLeadId: string }>();
  const [lead, setLead] = useState<StudentLeadDetail | null>(null);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [offers, setOffers] = useState<StudentOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = getUser();
  const isEduLeader = user?.partnerProfile?.partnerType === "edu_leader";
  const canWrite = !isEduLeader;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
      const headers = { Authorization: `Bearer ${getToken()}` };
      
      const leadsRes = await axios.get<{ leads: StudentLeadDetail[] }>(`${BACKEND_URL}/api/partnership/student-leads`, { headers });
      const currentLead = leadsRes.data.leads.find((item) => item.studentLeadId === params.studentLeadId);
      
      if (!currentLead) {
        setError("Student not found");
        setLoading(false);
        return;
      }
      setLead(currentLead);

      const appsRes = await axios.get<{ applications: StudentApplication[] }>(`${BACKEND_URL}/api/partnership-applications/${params.studentLeadId}/applications`, { headers });
      setApplications(appsRes.data.applications || []);

      const offersRes = await axios.get<{ offers: StudentOffer[] }>(`${BACKEND_URL}/api/partnership-applications/${params.studentLeadId}/offers`, { headers });
      setOffers(offersRes.data.offers || []);

    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, "Unable to load data."));
    } finally {
      setLoading(false);
    }
  }, [params.studentLeadId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleAddShortlist = async () => {
    if (!canWrite) return;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
    try {
      await axios.post(`${BACKEND_URL}/api/partnership-leads/${params.studentLeadId}/shortlists`, {
        university: "Test University", course: "Test Course", intake: "Fall 2026"
      }, { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchData();
    } catch (requestError: unknown) {
      alert(getErrorMessage(requestError, "Error adding shortlist"));
    }
  };

  const handleCreateApplication = async () => {
    if (!canWrite) return;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
    try {
      await axios.post(`${BACKEND_URL}/api/partnership-applications/${params.studentLeadId}/applications`, {
        universityName: "Test University", course: "Test Course", country: "USA", intake: "Fall 2026"
      }, { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchData();
    } catch (requestError: unknown) {
      alert(getErrorMessage(requestError, "Error creating application"));
    }
  };

  const handleRecordOffer = async (appId: string) => {
    if (!canWrite) return;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
    try {
      await axios.post(`${BACKEND_URL}/api/partnership-applications/${params.studentLeadId}/offers`, {
        applicationId: appId, offerType: "CONDITIONAL", offerDate: new Date()
      }, { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchData();
    } catch (requestError: unknown) {
      alert(getErrorMessage(requestError, "Error recording offer"));
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    if (!canWrite) return;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
    try {
      await axios.put(`${BACKEND_URL}/api/partnership-applications/${params.studentLeadId}/offers/${offerId}/accept`, {
        depositAmount: 1000, currency: "USD"
      }, { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchData();
    } catch (requestError: unknown) {
      alert(getErrorMessage(requestError, "Error accepting offer"));
    }
  };

  if (loading) return <div className="p-8">Loading student details...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!lead) return <div className="p-8">No student found.</div>;

  return (
    <PartnerGuard>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-2">{lead.fullName}</h1>
        <p className="text-gray-600 mb-6">ID: {lead.studentLeadId} | Stage: {lead.pipelineStage || lead.leadStatus}</p>

        <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-xl font-bold text-gray-900">Student Registration Details</h2>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Email", value: lead.email },
              { label: "Mobile", value: lead.mobile },
              { label: "College", value: lead.collegeId?.name },
              { label: "Course / Stream", value: lead.course },
              { label: "Graduation Year", value: lead.graduationYear },
              { label: "Preferred Program", value: lead.preferredProgram },
              { label: "Preferred Country", value: lead.preferredCountry },
              { label: "Study Abroad Timeline", value: lead.studyAbroadTimeline },
              { label: "Seminar ID", value: lead.sourceSeminarId || lead.seminarId },
              { label: "Registration Source", value: lead.registrationSource },
              { label: "Consent", value: lead.consentGiven ? "Given" : "Not recorded" },
              { label: "Phone Verification", value: lead.otpVerified ? "Verified" : "Not verified" },
              {
                label: "Registered On",
                value: lead.createdAt ? new Date(lead.createdAt).toLocaleString() : undefined,
              },
            ].map(({ label, value }) => (
              <div key={label} className="min-w-0 border-b border-gray-100 pb-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
                <dd className="mt-1 break-words text-sm font-medium text-gray-900">{value || "-"}</dd>
              </div>
            ))}
          </dl>
        </section>
        
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Shortlisted Universities</h2>
          {lead.shortlists?.length === 0 ? <p>No universities shortlisted yet.</p> : (
            <ul className="mb-4">
              {lead.shortlists?.map((s) => (
                <li key={s._id} className="border-b py-2">{s.university} - {s.course} ({s.intake})</li>
              ))}
            </ul>
          )}
          {canWrite && <button onClick={handleAddShortlist} className="px-4 py-2 bg-blue-600 text-white rounded">Add Shortlist (Test)</button>}
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Applications</h2>
          {applications.length === 0 ? <p>No applications yet.</p> : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="border p-4 rounded">
                  <p className="font-bold">{app.applicationId} - {app.universityName}</p>
                  <p>Status: {app.status}</p>
                  {canWrite && <button onClick={() => handleRecordOffer(app._id)} className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm">Record Offer (Test)</button>}
                </div>
              ))}
            </div>
          )}
          {canWrite && <button onClick={handleCreateApplication} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Create Application (Test)</button>}
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Offers</h2>
          {offers.length === 0 ? <p>No offers yet.</p> : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer._id} className="border p-4 rounded">
                  <p className="font-bold">{offer.universityName} ({offer.offerType})</p>
                  <p>Status: {offer.acceptanceStatus}</p>
                  {canWrite && offer.acceptanceStatus !== "ACCEPTED" && (
                    <button onClick={() => handleAcceptOffer(offer._id)} className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-sm">Accept Offer (Test)</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- LEVEL 3 --- */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Level 3: Financial & Admissions Tracker</h2>
          <p className="text-sm text-gray-500 mb-4">Visa, Enrolment, and Commission records are tied to accepted applications.</p>
          
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="border p-4 rounded bg-gray-50">
                <h3 className="font-bold text-lg">{app.universityName} ({app.applicationId})</h3>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-blue-800">Visa Details</h4>
                    <p>Status: {app.visaStatus || 'PENDING'}</p>
                    {canWrite && <button onClick={async () => {
                      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
                      await axios.put(`${BACKEND_URL}/api/partnership-finance/applications/${app._id}/visa`, { visaStatus: "APPROVED" }, { headers: { Authorization: `Bearer ${getToken()}` } });
                      fetchData();
                    }} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm">Mark Visa Approved</button>}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-800">Enrolment Details</h4>
                    <p>Status: {app.isEnrolled ? "ENROLLED" : "PENDING"}</p>
                    {canWrite && !app.isEnrolled && <button onClick={async () => {
                      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
                      await axios.put(`${BACKEND_URL}/api/partnership-finance/applications/${app._id}/enrolment`, { isEnrolled: true, enrolmentDate: new Date() }, { headers: { Authorization: `Bearer ${getToken()}` } });
                      fetchData();
                    }} className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded text-sm">Mark Enrolled</button>}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-green-800">Commission Controls</h4>
                  {canWrite && (
                    <div className="space-x-2 mt-2">
                      <button onClick={async () => {
                        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
                        await axios.post(`${BACKEND_URL}/api/partnership-finance/commissions`, {
                          studentLeadId: params.studentLeadId, applicationId: app._id, university: app.universityName, intake: app.intake, expectedCommission: 1000
                        }, { headers: { Authorization: `Bearer ${getToken()}` } });
                        fetchData();
                        alert("Commission Expected record created!");
                      }} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Create Expected Commission</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PartnerGuard>
  );
}

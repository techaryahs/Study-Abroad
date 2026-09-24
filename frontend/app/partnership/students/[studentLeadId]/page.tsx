"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken, getUser } from "@/app/lib/token";
import PartnerGuard from "../../../../components/partnership/common/PartnerGuard";

export default function StudentDetail({ params }: { params: { studentLeadId: string } }) {
  const [lead, setLead] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = getUser();
  const isEduLeader = user?.partnerProfile?.partnerType === "edu_leader";
  const canWrite = !isEduLeader;

  const fetchData = async () => {
    try {
      setLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
      const headers = { Authorization: `Bearer ${getToken()}` };
      
      const leadsRes = await axios.get(`${BACKEND_URL}/api/partnership/student-leads`, { headers });
      const currentLead = leadsRes.data.leads.find((l: any) => l.studentLeadId === params.studentLeadId);
      
      if (!currentLead) {
        setError("Student not found");
        setLoading(false);
        return;
      }
      setLead(currentLead);

      const appsRes = await axios.get(`${BACKEND_URL}/api/partnership-applications/${params.studentLeadId}/applications`, { headers });
      setApplications(appsRes.data.applications || []);

      const offersRes = await axios.get(`${BACKEND_URL}/api/partnership-applications/${params.studentLeadId}/offers`, { headers });
      setOffers(offersRes.data.offers || []);

    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.studentLeadId]);

  const handleAddShortlist = async () => {
    if (!canWrite) return;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
    try {
      await axios.post(`${BACKEND_URL}/api/partnership-leads/${params.studentLeadId}/shortlists`, {
        university: "Test University", course: "Test Course", intake: "Fall 2026"
      }, { headers: { Authorization: `Bearer ${getToken()}` } });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Error adding shortlist");
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
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || "Error creating application");
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
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || "Error recording offer");
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
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || "Error accepting offer");
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
        
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Shortlisted Universities</h2>
          {lead.shortlists?.length === 0 ? <p>No universities shortlisted yet.</p> : (
            <ul className="mb-4">
              {lead.shortlists?.map((s: any) => (
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
              {applications.map((app: any) => (
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
              {offers.map((offer: any) => (
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
            {applications.map((app: any) => (
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

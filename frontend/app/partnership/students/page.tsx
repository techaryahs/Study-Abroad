"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import axios from "axios";
import { getToken, getUser } from "@/app/lib/token";
import { UserCheck, UserPlus, X, Check, AlertCircle } from "lucide-react";

interface AssignedConsultantInfo {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

interface StudentLead {
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
  collegeName?: string;
  sourceSeminarId?: string;
  leadStatus?: string;
  attributionStartDate?: string;
  assignedConsultantId?: AssignedConsultantInfo | null;
  assignedAt?: string | null;
  assignmentNotes?: string;
}

interface ConsultantOption {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function Students() {
  const [students, setStudents] = useState<StudentLead[]>([]);
  const [consultants, setConsultants] = useState<ConsultantOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Assign Modal
  const [selectedLead, setSelectedLead] = useState<StudentLead | null>(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>("");
  const [assignmentNotes, setAssignmentNotes] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  const user = getUser();
  const isEduMitraOrAdmin =
    user?.role === "admin" || user?.partnerProfile?.partnerType === "edu_mitra";

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";

  const fetchStudents = useCallback(() => {
    axios
      .get<{ leads: StudentLead[] }>(
        `${BACKEND_URL}/api/partnership/student-leads`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((res) => setStudents(res.data.leads || []))
      .catch(() => {
        setError(
          "Unable to load partnership data. Please check that the backend server is running."
        );
      });
  }, [BACKEND_URL]);

  const fetchConsultants = useCallback(() => {
    if (!isEduMitraOrAdmin) return;
    axios
      .get<{ consultants: ConsultantOption[] }>(
        `${BACKEND_URL}/api/partnership/consultants`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((res) => {
        const activeOnly = (res.data.consultants || []).filter(
          (c) => c.status === "ACTIVE"
        );
        setConsultants(activeOnly);
      })
      .catch(() => {
        // Silently fail if not permitted
      });
  }, [BACKEND_URL, isEduMitraOrAdmin]);

  useEffect(() => {
    fetchStudents();
    fetchConsultants();
  }, [fetchStudents, fetchConsultants]);

  const openAssignModal = (lead: StudentLead) => {
    setSelectedLead(lead);
    setSelectedConsultantId(lead.assignedConsultantId?._id || "");
    setAssignmentNotes(lead.assignmentNotes || "");
    setAssignError(null);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    setIsAssigning(true);
    setAssignError(null);

    try {
      const payload = {
        consultantId: selectedConsultantId || null,
        notes: assignmentNotes.trim(),
      };

      const res = await axios.put(
        `${BACKEND_URL}/api/partnership-leads/${selectedLead.studentLeadId}/assign-consultant`,
        payload,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setSuccessMsg(res.data.message || "Assignment updated successfully.");
      setSelectedLead(null);
      fetchStudents();
    } catch (err: any) {
      setAssignError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update assignment."
      );
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <PartnerGuard>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Leads</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Review seminar attendee leads and assign them to your counseling staff.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-between text-sm">
            <span>{successMsg}</span>
            <button
              onClick={() => setSuccessMsg(null)}
              className="text-emerald-700 font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!error && students.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-gray-500 text-lg">No students found.</h3>
            <p className="text-gray-400 mt-2">
              Registrations from seminars will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="min-w-[1200px] divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Lead ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Course / Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Preferred Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Assigned Consultant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Attribution Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50/70">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {s.studentLeadId}
                      </td>
                      <td className="px-6 py-4">{s.fullName}</td>
                      <td className="px-6 py-4 text-gray-600">{s.email || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {s.collegeId?.name || s.collegeName || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{s.mobile}</td>
                      <td className="px-6 py-4">
                        {s.preferredProgram || s.course || "-"}
                        {s.graduationYear ? ` (${s.graduationYear})` : ""}
                      </td>
                      <td className="px-6 py-4">{s.preferredCountry || "-"}</td>
                      <td className="px-6 py-4">
                        {s.assignedConsultantId ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <UserCheck size={12} />
                              {s.assignedConsultantId.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {s.leadStatus || "REGISTERED"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {s.attributionStartDate
                          ? new Date(s.attributionStartDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        {isEduMitraOrAdmin && (
                          <button
                            onClick={() => openAssignModal(s)}
                            className="font-semibold text-xs text-blue-700 hover:text-blue-900 hover:underline"
                          >
                            {s.assignedConsultantId ? "Reassign" : "Assign"}
                          </button>
                        )}
                        <Link
                          href={`/partnership/students/${encodeURIComponent(
                            s.studentLeadId
                          )}`}
                          className="font-medium text-xs text-gray-600 hover:text-gray-900 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Assign Consultant */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Assign Counselor to Student
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Lead: {selectedLead.fullName} ({selectedLead.studentLeadId})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              {assignError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{assignError}</span>
                </div>
              )}

              <form onSubmit={handleSaveAssignment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Active Consultant
                  </label>
                  <select
                    value={selectedConsultantId}
                    onChange={(e) => setSelectedConsultantId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="">-- Unassigned (No Consultant) --</option>
                    {consultants.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.role}) - {c.email}
                      </option>
                    ))}
                  </select>
                  {consultants.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      No active consultants found. Please add consultants in the{" "}
                      <Link
                        href="/partnership/consultants"
                        className="underline font-bold"
                      >
                        Consultants section
                      </Link>
                      .
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Assignment Instructions / Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Interested in UK Masters in CS. Initial counseling call pending."
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isAssigning}
                    type="submit"
                    className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50"
                  >
                    {isAssigning ? "Saving..." : "Confirm Assignment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PartnerGuard>
  );
}

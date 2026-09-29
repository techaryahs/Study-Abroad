"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import axios from "axios";
import { getToken } from "@/app/lib/token";

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
  sourceSeminarId?: string;
  leadStatus?: string;
  attributionStartDate?: string;
}

export default function Students() {
  const [students, setStudents] = useState<StudentLead[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<{ leads: StudentLead[] }>(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/partnership/student-leads`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => setStudents(res.data.leads || []))
    .catch(() => {
      setError("Unable to load partnership data. Please check that the backend server is running.");
    });
  }, []);

  return (
    <PartnerGuard>
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Student Leads</h1>

        {error && <div className="p-4 bg-red-100 text-red-700 mb-6 rounded">{error}</div>}

        {!error && students.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-gray-500 text-lg">No students found.</h3>
            <p className="text-gray-400 mt-2">Registrations from seminars will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden border">
            <div className="overflow-x-auto">
            <table className="min-w-[1120px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course / Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preferred Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Study Timeline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seminar Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attribution Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((s) => (
                  <tr key={s._id}>
                    <td className="px-6 py-4 font-medium">{s.studentLeadId}</td>
                    <td className="px-6 py-4">{s.fullName}</td>
                    <td className="px-6 py-4">{s.email || "-"}</td>
                    <td className="px-6 py-4">{s.collegeId?.name || "-"}</td>
                    <td className="px-6 py-4">{s.mobile}</td>
                    <td className="px-6 py-4">{s.preferredProgram || s.course || "-"}{s.graduationYear ? ` (${s.graduationYear})` : ""}</td>
                    <td className="px-6 py-4">{s.preferredCountry || "-"}</td>
                    <td className="px-6 py-4">{s.studyAbroadTimeline || "-"}</td>
                    <td className="px-6 py-4">{s.sourceSeminarId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{s.leadStatus || "REGISTERED"}</span>
                    </td>
                    <td className="px-6 py-4">{s.attributionStartDate ? new Date(s.attributionStartDate).toLocaleDateString() : "-"}</td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/partnership/students/${encodeURIComponent(s.studentLeadId)}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
      </div>
    </PartnerGuard>
  );
}


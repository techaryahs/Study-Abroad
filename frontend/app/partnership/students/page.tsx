"use client";
import React, { useEffect, useState } from "react";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import axios from "axios";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/partnership/student-leads", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => setStudents(res.data.leads || []))
    .catch(err => {
      setError("Unable to load partnership data. Please check that the backend server is running.");
    });
  }, []);

  return (
    <PartnerGuard>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Student Leads</h1>

        {error && <div className="p-4 bg-red-100 text-red-700 mb-6 rounded">{error}</div>}

        {!error && students.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-gray-500 text-lg">No students found.</h3>
            <p className="text-gray-400 mt-2">Registrations from seminars will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seminar Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attribution Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((s: any) => (
                  <tr key={s._id}>
                    <td className="px-6 py-4 font-medium">{s.studentLeadId}</td>
                    <td className="px-6 py-4">{s.fullName}</td>
                    <td className="px-6 py-4">{s.collegeId?.name || "-"}</td>
                    <td className="px-6 py-4">{s.mobile}</td>
                    <td className="px-6 py-4">{s.sourceSeminarId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{s.leadStatus}</span>
                    </td>
                    <td className="px-6 py-4">{new Date(s.attributionStartDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-blue-600 cursor-pointer">View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PartnerGuard>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import axios from "axios";
import { getToken } from "@/app/lib/token";
import SeminarQRModal from "../../../components/partnership/seminar/SeminarQRModal";

export default function Seminars() {
  const router = useRouter();
  const [seminars, setSeminars] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [qrSeminar, setQrSeminar] = useState<any>(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/partnership/seminars`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => setSeminars(res.data.seminars || []))
    .catch(err => {
      setError("Unable to load partnership data. Please check that the backend server is running.");
    });
  }, []);

  return (
    <PartnerGuard>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Seminars</h1>
          <button 
            onClick={() => router.push("/partnership/seminars/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Seminar
          </button>
        </div>

        {error && <div className="p-4 bg-red-100 text-red-700 mb-6 rounded">{error}</div>}

        {!error && seminars.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-gray-500 text-lg">No seminars found.</h3>
            <p className="text-gray-400 mt-2">Schedule your first seminar to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seminar ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">EduMitra Counsellor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seminars.map((s: any) => (
                  <tr key={s._id}>
                    <td className="px-6 py-4 font-medium">{s.seminarId}</td>
                    <td className="px-6 py-4">{s.collegeName || (s.collegeId && s.collegeId.name) || "-"}</td>
                    <td className="px-6 py-4">{new Date(s.date).toLocaleDateString()} {s.startTime}</td>
                    <td className="px-6 py-4">{s.venue || "-"}</td>
                    <td className="px-6 py-4">{s.expectedStudentStrength || 0}</td>
                    <td className="px-6 py-4">{s.eduMitraCounsellor || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        s.status === "APPROVED" ? "bg-green-100 text-green-800" :
                        s.status === "REJECTED" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-600 space-x-3">
                      <button className="hover:underline">View</button>
                      <button className="hover:underline text-gray-400 cursor-not-allowed">Edit</button>
                      {s.status === "APPROVED" && (
                        <button onClick={() => setQrSeminar(s)} className="hover:underline text-purple-600 font-bold">QR</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {qrSeminar && (
        <SeminarQRModal seminar={qrSeminar} onClose={() => setQrSeminar(null)} />
      )}
    </PartnerGuard>
  );
}


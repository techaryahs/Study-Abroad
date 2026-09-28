"use client";
import React, { useEffect, useState } from "react";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import axios from "axios";
import { getToken } from "@/app/lib/token";

export default function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/partnership/colleges`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => setColleges(res.data.colleges || []))
    .catch(err => {
      setError("Unable to load partnership data. Please check that the backend server is running.");
    });
  }, []);

  return (
    <PartnerGuard>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Partner Colleges</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add College</button>
        </div>

        {error && <div className="p-4 bg-red-100 text-red-700 mb-6 rounded">{error}</div>}

        {!error && colleges.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
            <h3 className="text-gray-500 text-lg">No colleges found.</h3>
            <p className="text-gray-400 mt-2">Get started by creating your first partner college.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City/Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordinator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seminars</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {colleges.map((c: any) => (
                  <tr key={c._id}>
                    <td className="px-6 py-4">{c.name}</td>
                    <td className="px-6 py-4">{c.city}</td>
                    <td className="px-6 py-4">{c.coordinatorName}</td>
                    <td className="px-6 py-4">0</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{c.status}</span>
                    </td>
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


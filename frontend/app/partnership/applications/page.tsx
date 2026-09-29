"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/app/lib/token";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import Link from "next/link";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
    axios.get(`${BACKEND_URL}/api/partnership-applications/all-applications`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => {
      setApplications(res.data.applications || []);
      setLoading(false);
    })
    .catch(err => {
      setError("Unable to load applications.");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading applications...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <PartnerGuard>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Applications</h1>
        {applications.length === 0 ? <p>No applications yet.</p> : (
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">App ID</th>
                <th className="py-2 px-4 text-left">Lead ID</th>
                <th className="py-2 px-4 text-left">University</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} className="border-t">
                  <td className="py-2 px-4"><Link href={`/partnership/students/${app.studentLeadId}`} className="text-blue-600 hover:underline">{app.applicationId}</Link></td>
                  <td className="py-2 px-4">{app.studentLeadId}</td>
                  <td className="py-2 px-4">{app.universityName}</td>
                  <td className="py-2 px-4">{app.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PartnerGuard>
  );
}

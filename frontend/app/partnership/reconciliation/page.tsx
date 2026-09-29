"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/app/lib/token";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import Link from "next/link";

export default function ReconciliationPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
    axios.get(`${BACKEND_URL}/api/partnership-reconciliation`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => {
      setRecords(res.data.reconciliation || []);
      setLoading(false);
    })
    .catch(err => {
      setError("Unable to load reconciliation data.");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading reconciliation...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <PartnerGuard>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Reconciliation Dashboard</h1>
        {records.length === 0 ? <p>All clear! No issues found.</p> : (
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Lead ID</th>
                <th className="py-2 px-4 text-left">University</th>
                <th className="py-2 px-4 text-left">Status/Issue</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i} className={`border-t ${r.reconciliationStatus !== 'OK' ? 'bg-red-50' : ''}`}>
                  <td className="py-2 px-4">{r.type}</td>
                  <td className="py-2 px-4"><Link href={`/partnership/students/${r.studentLeadId}`} className="text-blue-600 hover:underline">{r.studentLeadId}</Link></td>
                  <td className="py-2 px-4">{r.university}</td>
                  <td className="py-2 px-4 font-bold text-red-600">{r.reconciliationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PartnerGuard>
  );
}

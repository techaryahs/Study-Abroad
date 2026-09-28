"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/app/lib/token";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import Link from "next/link";

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
    axios.get(`${BACKEND_URL}/api/partnership-finance/commissions`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => {
      setCommissions(res.data.commissions || []);
      setLoading(false);
    })
    .catch(err => {
      setError("Unable to load commissions.");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading commissions...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <PartnerGuard>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Commissions</h1>
        {commissions.length === 0 ? <p>No commissions yet.</p> : (
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Lead ID</th>
                <th className="py-2 px-4 text-left">University</th>
                <th className="py-2 px-4 text-left">Intake</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Expected</th>
                <th className="py-2 px-4 text-left">Received</th>
                <th className="py-2 px-4 text-left">Share (50%)</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map(c => (
                <tr key={c._id} className="border-t">
                  <td className="py-2 px-4"><Link href={`/partnership/students/${c.studentLeadId}`} className="text-blue-600 hover:underline">{c.studentLeadId}</Link></td>
                  <td className="py-2 px-4">{c.university}</td>
                  <td className="py-2 px-4">{c.intake}</td>
                  <td className="py-2 px-4">{c.status}</td>
                  <td className="py-2 px-4">{c.expectedCommission}</td>
                  <td className="py-2 px-4">{c.commissionReceivedAmount}</td>
                  <td className="py-2 px-4">{c.eduLeaderShare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PartnerGuard>
  );
}

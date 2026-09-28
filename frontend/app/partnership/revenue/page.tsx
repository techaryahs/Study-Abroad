"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/app/lib/token";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";

export default function RevenuePage() {
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
      setError("Unable to load revenue data.");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading revenue...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  const totalReceived = commissions.reduce((sum, c) => sum + (c.commissionReceivedAmount || 0), 0);
  const totalShareDue = commissions.reduce((sum, c) => sum + (c.eduLeaderShare || 0), 0);
  const totalSharePaid = commissions.reduce((sum, c) => sum + (c.sharePaidAmount || 0), 0);
  const totalOutstanding = totalShareDue - totalSharePaid;

  return (
    <PartnerGuard>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Revenue Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 shadow rounded border-t-4 border-blue-500">
            <h2 className="text-gray-500 text-sm uppercase tracking-wide">Total Commission Received</h2>
            <p className="text-3xl font-bold mt-2">{totalReceived}</p>
          </div>
          
          <div className="bg-white p-6 shadow rounded border-t-4 border-purple-500">
            <h2 className="text-gray-500 text-sm uppercase tracking-wide">Edu Leader Share (50%)</h2>
            <p className="text-3xl font-bold mt-2">{totalShareDue}</p>
          </div>
          
          <div className="bg-white p-6 shadow rounded border-t-4 border-green-500">
            <h2 className="text-gray-500 text-sm uppercase tracking-wide">Share Paid</h2>
            <p className="text-3xl font-bold mt-2">{totalSharePaid}</p>
          </div>
          
          <div className="bg-white p-6 shadow rounded border-t-4 border-red-500">
            <h2 className="text-gray-500 text-sm uppercase tracking-wide">Outstanding Balance</h2>
            <p className="text-3xl font-bold mt-2">{totalOutstanding}</p>
          </div>
        </div>
      </div>
    </PartnerGuard>
  );
}

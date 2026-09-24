"use client";
import React, { useEffect, useState } from "react";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import axios from "axios";
import { getToken } from "@/app/lib/token";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Attempt fetch
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/partnership/dashboard`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => setData(res.data))
    .catch(err => {
      setError("Unable to load partnership data. Please check that the backend server is running.");
    });
  }, []);

  return (
    <PartnerGuard>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Partnership Dashboard</h1>
        {error && <div className="p-4 bg-red-100 text-red-700 mb-6 rounded">{error}</div>}
        
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow rounded-lg border">
            <h3 className="text-gray-500 font-medium">Total Colleges</h3>
            <p className="text-3xl font-bold">{data?.totalColleges || 0}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg border">
            <h3 className="text-gray-500 font-medium">Total Seminars</h3>
            <p className="text-3xl font-bold">{data?.totalSeminars || 0}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg border">
            <h3 className="text-gray-500 font-medium">Registered Students</h3>
            <p className="text-3xl font-bold">{data?.registeredStudents || 0}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg border">
            <h3 className="text-gray-500 font-medium">Active Leads</h3>
            <p className="text-3xl font-bold">{data?.activeLeads || 0}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg border">
            <h3 className="text-gray-500 font-medium">Applications</h3>
            <p className="text-3xl font-bold">{data?.applications || 0}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg border">
            <h3 className="text-gray-500 font-medium">Admissions</h3>
            <p className="text-3xl font-bold">{data?.admissions || 0}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg border">
            <h3 className="text-gray-500 font-medium">Expected Commission</h3>
            <p className="text-3xl font-bold">${data?.expectedCommission || "0.00"}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg border">
            <h3 className="text-gray-500 font-medium">Received Commission</h3>
            <p className="text-3xl font-bold">${data?.receivedCommission || "0.00"}</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg border">
            <h3 className="text-gray-500 font-medium">Outstanding Edu Leader share</h3>
            <p className="text-3xl font-bold">${data?.outstandingShare || "0.00"}</p>
          </div>
        </div>
      </div>
    </PartnerGuard>
  );
}


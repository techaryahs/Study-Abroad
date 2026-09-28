"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "@/app/lib/token";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import Link from "next/link";

export default function OffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
    axios.get(`${BACKEND_URL}/api/partnership-applications/all-offers`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => {
      setOffers(res.data.offers || []);
      setLoading(false);
    })
    .catch(err => {
      setError("Unable to load offers.");
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Loading offers...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <PartnerGuard>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Offers</h1>
        {offers.length === 0 ? <p>No offers yet.</p> : (
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">University</th>
                <th className="py-2 px-4 text-left">Lead ID</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Acceptance Status</th>
              </tr>
            </thead>
            <tbody>
              {offers.map(offer => (
                <tr key={offer._id} className="border-t">
                  <td className="py-2 px-4"><Link href={`/partnership/students/${offer.studentLeadId}`} className="text-blue-600 hover:underline">{offer.universityName}</Link></td>
                  <td className="py-2 px-4">{offer.studentLeadId}</td>
                  <td className="py-2 px-4">{offer.offerType}</td>
                  <td className="py-2 px-4">{offer.acceptanceStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PartnerGuard>
  );
}

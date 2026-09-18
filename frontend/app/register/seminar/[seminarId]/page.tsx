"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RegisterSeminar({ params }: { params: { seminarId: string } }) {
  const [seminar, setSeminar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    course: "",
    graduationYear: "",
    preferredCountry: "",
    preferredProgram: "",
    studyAbroadTimeline: "",
    consentGiven: false
  });

  useEffect(() => {
    axios.get(`/api/public/seminars/${params.seminarId}`)
      .then(res => {
        setSeminar(res.data.seminar);
        setLoading(false);
      })
      .catch(err => {
        setError("Seminar not found.");
        setLoading(false);
      });
  }, [params.seminarId]);

  if (loading) return <div className="p-12 text-center text-gray-600">Loading seminar details...</div>;

  if (error || !seminar) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Seminar not found</h2>
      <p className="text-gray-500 mt-4">The seminar you are looking for does not exist or has expired.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">EduLeader Global</h1>
          <h2 className="text-xl font-semibold text-gray-800">{seminar.title}</h2>
          <p className="text-gray-600">{seminar.collegeName} &bull; {new Date(seminar.date).toLocaleDateString()}</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input type="text" className="mt-1 w-full border border-gray-300 rounded-md p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
              <input type="tel" className="mt-1 w-full border border-gray-300 rounded-md p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address *</label>
              <input type="email" className="mt-1 w-full border border-gray-300 rounded-md p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course / Department</label>
              <input type="text" className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
              <input type="text" className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Country</label>
              <input type="text" className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Course/Program</label>
              <input type="text" className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Timeline</label>
              <input type="text" className="mt-1 w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>
          
          <div className="flex items-start mt-6">
            <input type="checkbox" className="mt-1" required />
            <span className="ml-2 text-sm text-gray-600">
              I consent to sharing my information with EduLeader Global for the purposes of Study Abroad guidance.
            </span>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            Request OTP
          </button>
        </form>
      </div>
    </div>
  );
}

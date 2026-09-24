"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PartnerGuard from "../../../../components/partnership/common/PartnerGuard";
import axios from "axios";
import { getToken } from "@/app/lib/token";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateSeminar() {
  const router = useRouter();
  const [colleges, setColleges] = useState([]);
  const [partners, setPartners] = useState([]);
  const [collegeCoordinators, setCollegeCoordinators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    course: "",
    academicYear: new Date().getFullYear().toString(),
    collegeId: "",
    collegeName: "",
    collegeCoordinator: "",
    eduLeaderRep: "",
    eduMitraCounsellor: "",
    expectedStudentStrength: 0,
    description: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${getToken()}` };
        const [collegesRes, partnersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/partnership/colleges`, { headers }),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/partnership/partners`, { headers })
        ]);
        setColleges(collegesRes.data.colleges || []);
        setPartners(partnersRes.data.partners || []);
      } catch (err) {
        console.error("Error loading form data", err);
      }
    };
    fetchData();
  }, []);

  const handleCollegeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const collegeId = e.target.value;
    const selected = colleges.find((c: any) => c._id === collegeId) as any;
    
    setFormData({ ...formData, collegeId, collegeName: selected ? selected.name : "", collegeCoordinator: "" });
    
    if (collegeId) {
      try {
        const headers = { Authorization: `Bearer ${getToken()}` };
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/partnership/colleges/${collegeId}/coordinators`, { headers });
        setCollegeCoordinators(res.data.coordinators || []);
        
        // Auto-select if only 1 coordinator
        if (res.data.coordinators && res.data.coordinators.length === 1) {
          setFormData(prev => ({ ...prev, collegeCoordinator: res.data.coordinators[0].name }));
        }
      } catch (err) {
        console.error("Error fetching coordinators", err);
        setCollegeCoordinators([]);
      }
    } else {
      setCollegeCoordinators([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/partnership/seminars`,
        formData,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/partnership/seminars");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create seminar. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PartnerGuard>
        <div className="p-8 h-screen flex flex-col items-center justify-center">
          <div className="bg-green-100 text-green-800 p-8 rounded-lg shadow max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Success!</h2>
            <p>Seminar submitted successfully for admin approval.</p>
            <p className="mt-4 text-sm text-green-600">Redirecting to seminars list...</p>
          </div>
        </div>
      </PartnerGuard>
    );
  }

  return (
    <PartnerGuard>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/partnership/seminars" className="text-gray-500 hover:text-black">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Create New Seminar</h1>
        </div>

        {error && <div className="p-4 bg-red-100 text-red-700 mb-6 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border p-6 space-y-8">
          
          {/* SEMINAR DETAILS */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Seminar Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seminar Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200" placeholder="e.g. Study Abroad 2026" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seminar ID</label>
                <input disabled type="text" value="System Generated" className="w-full border rounded p-2 bg-gray-100 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200" placeholder="e.g. Main Auditorium" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course / Department</label>
                <input type="text" name="course" value={formData.course} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200" placeholder="e.g. Computer Science" />
              </div>
            </div>
          </div>

          {/* COLLEGE DETAILS */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">College & Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select College *</label>
                <select required name="collegeId" value={formData.collegeId} onChange={handleCollegeChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200 bg-white">
                  <option value="">-- Select College --</option>
                  {colleges.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College Coordinator</label>
                <select name="collegeCoordinator" value={formData.collegeCoordinator} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200 bg-white" disabled={!formData.collegeId}>
                  <option value="">-- Select Coordinator --</option>
                  {collegeCoordinators.map((c: any) => (
                    <option key={c._id} value={c.name}>{c.name} {c.partnerProfile?.designation ? `(${c.partnerProfile.designation})` : ""}</option>
                  ))}
                </select>
                {collegeCoordinators.length === 0 && formData.collegeId && (
                  <p className="text-xs text-orange-500 mt-1">No coordinators found for this college.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Student Strength</label>
                <input type="number" name="expectedStudentStrength" value={formData.expectedStudentStrength} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200" />
              </div>
            </div>
          </div>

          {/* TEAM */}
          <div>
            <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">Team Allocation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EduLeader Representative</label>
                <select name="eduLeaderRep" value={formData.eduLeaderRep} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200 bg-white">
                  <option value="">-- Select Representative --</option>
                  {partners.filter((p: any) => p.partnerProfile?.partnerType === "edu_leader" || p.role === "admin").map((p: any) => (
                    <option key={p._id} value={p.name}>{p.name} ({p.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edu Mitra Counsellor / Partner</label>
                <select name="eduMitraCounsellor" value={formData.eduMitraCounsellor} onChange={handleChange} className="w-full border rounded p-2 focus:ring focus:ring-blue-200 bg-white">
                  <option value="">-- Select Counsellor --</option>
                  {partners.filter((p: any) => p.partnerProfile?.partnerType === "edu_mitra").map((p: any) => (
                    <option key={p._id} value={p.name}>{p.name} ({p.email})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t flex justify-end gap-4">
            <Link href="/partnership/seminars" className="px-6 py-2 border rounded text-gray-600 hover:bg-gray-50 font-medium">
              Cancel
            </Link>
            <button disabled={loading} type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium disabled:opacity-50 transition">
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>
        </form>
      </div>
    </PartnerGuard>
  );
}

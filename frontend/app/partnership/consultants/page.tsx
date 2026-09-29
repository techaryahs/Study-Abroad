"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getToken, getUser } from "@/app/lib/token";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import {
  UserPlus,
  Users,
  Briefcase,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";

interface Slot {
  day: string;
  startTime: string;
  endTime: string;
}

interface ConsultantItem {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  expertise?: string;
  experience?: string;
  bio?: string;
  image?: string;
  status: "ACTIVE" | "INACTIVE";
  assignedStudentsCount?: number;
  createdAt?: string;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function PartnerConsultantsPage() {
  const [consultants, setConsultants] = useState<ConsultantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "Study Abroad Counselor",
    expertise: "University Shortlisting, Visa Guidance",
    experience: "3+ Years",
    bio: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";

  const fetchConsultants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<{ success: boolean; consultants: ConsultantItem[] }>(
        `${BACKEND_URL}/api/partnership/consultants`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setConsultants(res.data.consultants || []);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load consultants."
      );
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchConsultants();
  }, [fetchConsultants]);

  const handleAddSlot = () => {
    if (!startTime || !endTime) return;
    setSlots((prev) => [...prev, { day: selectedDay, startTime, endTime }]);
  };

  const handleRemoveSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateConsultant = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const normEmail = formData.email.trim().toLowerCase();
    if (!formData.name.trim() || !normEmail || !formData.password.trim() || !formData.role.trim()) {
      setFormError("Please fill out all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("email", normEmail);
      data.append("password", formData.password.trim());
      data.append("mobile", formData.mobile.trim());
      data.append("role", formData.role.trim());
      data.append("expertise", formData.expertise.trim());
      data.append("experience", formData.experience.trim());
      data.append("bio", formData.bio.trim());
      data.append("availability", JSON.stringify(slots));

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.post(`${BACKEND_URL}/api/partnership/consultants`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setActionSuccess(`Consultant ${formData.name} added successfully.`);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        mobile: "",
        role: "Study Abroad Counselor",
        expertise: "University Shortlisting, Visa Guidance",
        experience: "3+ Years",
        bio: "",
      });
      setImageFile(null);
      setSlots([]);
      fetchConsultants();
    } catch (err: any) {
      setFormError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create consultant."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (consultant: ConsultantItem) => {
    const nextStatus = consultant.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const confirmMsg =
      nextStatus === "INACTIVE"
        ? `Are you sure you want to deactivate ${consultant.name}? They will not be able to log in or receive new students.`
        : `Activate ${consultant.name}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.patch(
        `${BACKEND_URL}/api/partnership/consultants/${consultant._id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setActionSuccess(`${consultant.name} status updated to ${nextStatus}.`);
      setConsultants((prev) =>
        prev.map((c) => (c._id === consultant._id ? { ...c, status: nextStatus } : c))
      );
    } catch (err: any) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update status."
      );
    }
  };

  return (
    <PartnerGuard>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-700" size={26} />
              Organization Consultants
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add and manage your team of counselors, view availability, and track assigned students.
            </p>
          </div>
          <button
            onClick={() => {
              setFormError(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-sm shadow transition-all active:scale-95"
          >
            <UserPlus size={18} />
            Add Consultant
          </button>
        </div>

        {/* Action feedback */}
        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-between text-sm">
            <span>{actionSuccess}</span>
            <button
              onClick={() => setActionSuccess(null)}
              className="text-emerald-600 hover:text-emerald-900 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Content Table */}
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading consultants...</div>
        ) : consultants.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-gray-300 rounded-xl bg-white space-y-3">
            <Users className="mx-auto text-gray-400" size={40} />
            <h3 className="text-gray-700 font-bold text-base">No consultants added yet.</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Add your counseling staff here. Once created, you can assign seminar student leads to them and track their progress.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800"
            >
              <UserPlus size={16} />
              Add First Consultant
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Consultant</th>
                    <th className="px-6 py-3.5">Role / Title</th>
                    <th className="px-6 py-3.5">Contact</th>
                    <th className="px-6 py-3.5">Assigned Leads</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {consultants.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center overflow-hidden border">
                            {c.image && c.image !== "/avatar-default.png" ? (
                              <img
                                src={
                                  c.image.startsWith("http")
                                    ? c.image
                                    : `${BACKEND_URL}${c.image}`
                                }
                                alt={c.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{c.name.slice(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.expertise}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {c.role}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-gray-400" />
                          <span>{c.email}</span>
                        </div>
                        {c.mobile && c.mobile !== "0000000000" && (
                          <div className="flex items-center gap-1.5">
                            <Phone size={12} className="text-gray-400" />
                            <span>{c.mobile}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                          {c.assignedStudentsCount || 0} Students
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {c.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded border transition-all ${
                            c.status === "ACTIVE"
                              ? "text-amber-700 border-amber-300 hover:bg-amber-50"
                              : "text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          {c.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add Consultant */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <UserPlus size={20} className="text-blue-700" />
                    Add Team Consultant
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    This account will belong strictly to your Edu Mitra organization.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateConsultant} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="counselor@edumitra.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Temporary Password *
                    </label>
                    <input
                      required
                      type="password"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Role / Designation *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Senior Study Abroad Counselor"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5+ Years"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Areas of Expertise
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. US Admissions, Ivy League Applications, Scholarships"
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Short Bio / Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief background and mentoring philosophy..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Profile Photo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Availability Scheduler */}
                <div className="border rounded-lg p-3 bg-gray-50 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                    <Clock size={14} className="text-blue-700" />
                    Availability Slots (Optional)
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="px-2 py-1.5 border rounded text-xs bg-white outline-none"
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="px-2 py-1 border rounded text-xs bg-white outline-none"
                    />
                    <span className="text-xs text-gray-400">to</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="px-2 py-1 border rounded text-xs bg-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSlot}
                      className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Slot
                    </button>
                  </div>

                  {slots.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {slots.map((s, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-700 shadow-sm"
                        >
                          <span className="font-semibold">{s.day}:</span> {s.startTime} - {s.endTime}
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating..." : "Save Consultant"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PartnerGuard>
  );
}

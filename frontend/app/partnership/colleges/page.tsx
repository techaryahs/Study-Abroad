"use client";
import React, { useEffect, useState } from "react";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import axios from "axios";
import { getToken } from "@/app/lib/token";
import { X } from "lucide-react";

interface College {
  _id: string;
  collegeId?: string;
  name: string;
  city: string;
  coordinatorName?: string;
  status?: string;
  createdAt?: string;
}

interface CollegeForm {
  name: string;
  city: string;
  coordinatorName: string;
}

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";
const emptyForm: CollegeForm = { name: "", city: "", coordinatorName: "" };

export default function Colleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CollegeForm>(emptyForm);

  useEffect(() => {
    axios.get<{ colleges: College[] }>(`${API_BASE}/api/partnership/colleges`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => setColleges(res.data.colleges || []))
    .catch(() => {
      setError("Unable to load partnership data. Please check that the backend server is running.");
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post<{ college: College }>(
        `${API_BASE}/api/partnership/colleges`,
        form,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      setColleges((current) => [response.data.college, ...current]);
      setForm(emptyForm);
      setShowForm(false);
      setSuccess("College submitted for admin approval.");
    } catch (requestError: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(requestError)
        ? requestError.response?.data?.message
        : null;
      setError(message || "Unable to add college. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PartnerGuard>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Partner Colleges</h1>
          <button
            type="button"
            onClick={() => { setShowForm((visible) => !visible); setError(null); }}
            className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 sm:w-auto"
          >
            {showForm ? "Close Form" : "Add College"}
          </button>
        </div>

        {error && <div className="p-4 bg-red-100 text-red-700 mb-6 rounded">{error}</div>}
        {success && <div className="p-4 bg-green-100 text-green-800 mb-6 rounded">{success}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 gap-4 rounded-lg border bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-medium text-gray-700">
              College name *
              <input
                required
                maxLength={160}
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                placeholder="College name"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              City *
              <input
                required
                maxLength={100}
                value={form.city}
                onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                placeholder="City"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Coordinator name
              <input
                maxLength={120}
                value={form.coordinatorName}
                onChange={(event) => setForm((current) => ({ ...current, coordinatorName: event.target.value }))}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                placeholder="Optional"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Submit for Approval"}
              </button>
            </div>
          </form>
        )}

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
                {colleges.map((c) => (
                  <tr key={c._id}>
                    <td className="px-6 py-4">{c.name}</td>
                    <td className="px-6 py-4">{c.city}</td>
                    <td className="px-6 py-4">{c.coordinatorName}</td>
                    <td className="px-6 py-4">0</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        (c.status || "PENDING").toUpperCase() === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : c.status?.toUpperCase() === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                      }`}>
                        {(c.status || "PENDING").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCollege(c)}
                        aria-label={`View ${c.name} details`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedCollege && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="college-details-title"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedCollege(null);
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          >
            <section className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 id="college-details-title" className="text-xl font-bold text-gray-900">
                    College Details
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{selectedCollege.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCollege(null)}
                  aria-label="Close college details"
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X size={18} />
                </button>
              </div>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">College name</dt>
                  <dd className="mt-1 break-words font-medium text-gray-900">{selectedCollege.name}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">City / Location</dt>
                  <dd className="mt-1 break-words font-medium text-gray-900">{selectedCollege.city || "-"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Coordinator</dt>
                  <dd className="mt-1 break-words font-medium text-gray-900">{selectedCollege.coordinatorName || "-"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</dt>
                  <dd className="mt-1 font-medium text-gray-900">{selectedCollege.status || "ACTIVE"}</dd>
                </div>
                {selectedCollege.collegeId && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">College ID</dt>
                    <dd className="mt-1 break-all font-medium text-gray-900">{selectedCollege.collegeId}</dd>
                  </div>
                )}
                {selectedCollege.createdAt && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Created</dt>
                    <dd className="mt-1 font-medium text-gray-900">
                      {new Date(selectedCollege.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          </div>
        )}
      </div>
    </PartnerGuard>
  );
}


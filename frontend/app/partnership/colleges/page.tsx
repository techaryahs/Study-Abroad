"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import PartnerGuard from "../../../components/partnership/common/PartnerGuard";
import axios from "axios";
import { getToken } from "@/app/lib/token";

interface College {
  _id: string;
  collegeId?: string;
  name: string;
  city: string;
  coordinatorName?: string;
  status: string;
}

interface CollegeResponse {
  colleges: College[];
}

interface CollegeForm {
  name: string;
  city: string;
  coordinatorName: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011";

const emptyForm: CollegeForm = {
  name: "",
  city: "",
  coordinatorName: "",
};

export default function Colleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CollegeForm>(emptyForm);

  const [selectedCollege, setSelectedCollege] = useState<College | null>(
    null
  );

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<CollegeResponse>(
        `${API_BASE}/api/partnership/colleges`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setColleges(response.data.colleges || []);
    } catch (requestError: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(
        requestError
      )
        ? requestError.response?.data?.message
        : null;

      setError(
        message ||
          "Unable to load colleges. Please check your access and backend connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchColleges();
  }, [fetchColleges]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post<{ college: College }>(
        `${API_BASE}/api/partnership/colleges`,
        form,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      setColleges((current) => [
        response.data.college,
        ...current,
      ]);

      setForm(emptyForm);
      setShowForm(false);
      setSuccess("College added successfully.");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (requestError: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(
        requestError
      )
        ? requestError.response?.data?.message
        : null;

      setError(message || "Unable to add college. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setError(null);
  };

  return (
    <PartnerGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Partner Colleges
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your partner colleges
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm((visible) => !visible);
                setError(null);
                setSuccess(null);
              }}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
            >
              {showForm ? "Close Form" : "+ Add College"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              {success}
            </div>
          )}

          {/* Add College Form */}
          {showForm && (
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Add New College
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter the college details below.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
              >
                {/* College Name */}
                <label className="text-sm font-medium text-gray-700">
                  College Name *
                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter college name"
                  />
                </label>

                {/* City */}
                <label className="text-sm font-medium text-gray-700">
                  City *
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.city}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        city: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter city"
                  />
                </label>

                {/* Coordinator */}
                <label className="text-sm font-medium text-gray-700">
                  Coordinator Name
                  <input
                    type="text"
                    maxLength={120}
                    value={form.coordinatorName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        coordinatorName: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Optional"
                  />
                </label>

                {/* Save */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save College"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* College List */}
          {loading ? (
            <div className="rounded-xl border bg-white p-10 text-center text-gray-500 shadow-sm">
              Loading colleges...
            </div>
          ) : colleges.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-10 text-center sm:p-12">
              <h3 className="text-lg font-semibold text-gray-600">
                No colleges found
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Get started by creating your first partner college.
              </p>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                + Add College
              </button>
            </div>
          ) : (
            <>
              {/* Desktop / Tablet Table */}
              <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          College Name
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          City / Location
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Coordinator
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Seminars
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Status
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {colleges.map((college) => (
                        <tr
                          key={college._id}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">
                            {college.name}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {college.city}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {college.coordinatorName || "—"}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            0
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              {college.status || "ACTIVE"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedCollege(college)
                              }
                              className="font-semibold text-blue-600 hover:text-blue-800"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-4 md:hidden">
                {colleges.map((college) => (
                  <div
                    key={college._id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {college.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {college.city}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        {college.status || "ACTIVE"}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 border-t pt-3 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">
                          Coordinator
                        </span>

                        <span className="text-right font-medium text-gray-800">
                          {college.coordinatorName || "—"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Seminars
                        </span>

                        <span className="font-medium text-gray-800">
                          0
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCollege(college)}
                      className="mt-4 w-full rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      View College
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View College Modal */}
        {selectedCollege && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    College Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Partner college information
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCollege(null)}
                  className="rounded-lg px-2 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    College Name
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {selectedCollege.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    City / Location
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {selectedCollege.city}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    Coordinator
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {selectedCollege.coordinatorName || "Not assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-gray-400">
                    Status
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {selectedCollege.status || "ACTIVE"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCollege(null)}
                className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </PartnerGuard>
  );
}
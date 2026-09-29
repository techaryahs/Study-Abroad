"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Check,
  User,
  Video,
  ArrowRight,
  Clock,
  AlertCircle,
  GraduationCap,
  Calendar,
  Search,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  MapPin,
  ExternalLink,
  BookOpen,
  Filter,
  Sparkles,
  Users,
} from "lucide-react";
import { getUser, getToken } from "@/app/lib/token";

interface Booking {
  _id: string;
  userEmail: string;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "booked"
    | "completed"
    | "cancelled";
  date: string;
  time: string;
  consultantVideoEnabled?: boolean;
}

interface ConsultantUser {
  _id?: string;
  email?: string;
  name?: string;
}

interface CollegeInfo {
  name?: string;
  city?: string;
  state?: string;
}

interface AssignedStudentLead {
  _id: string;
  studentLeadId: string;
  fullName: string;
  email: string;
  mobile: string;
  course?: string;
  graduationYear?: number;
  preferredCountry?: string[];
  preferredProgram?: string;
  studyAbroadTimeline?: string;
  leadStatus?: string;
  pipelineStage?: string;
  assignedAt?: string;
  assignmentNotes?: string;
  collegeId?: CollegeInfo;
  collegeName?: string;
  createdAt?: string;
}

function isBooking(value: unknown): value is Booking {
  if (typeof value !== "object" || value === null) return false;

  const booking = value as Record<string, unknown>;
  const validStatuses: Booking["status"][] = [
    "pending",
    "accepted",
    "rejected",
    "booked",
    "completed",
    "cancelled",
  ];

  return (
    typeof booking._id === "string" &&
    typeof booking.userEmail === "string" &&
    typeof booking.date === "string" &&
    typeof booking.time === "string" &&
    validStatuses.includes(booking.status as Booking["status"])
  );
}

const ConsultantDashboard = () => {
  const router = useRouter();

  const [user, setUser] = useState<ConsultantUser | null>(null);
  const [activeTab, setActiveTab] = useState<"bookings" | "assigned_students">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Filters for assigned students
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();

    if (!token || !storedUser) {
      router.push("/auth/login");
      return;
    }

    setUser(storedUser);
    fetchBookings(storedUser);
    fetchAssignedStudents();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBookings = async (currentUser: ConsultantUser) => {
    if (!currentUser?._id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/bookings/consultant/${currentUser._id}?email=${currentUser.email}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.ok) {
        const data: unknown = await response.json();
        setBookings(Array.isArray(data) ? data.filter(isBooking) : []);
      } else {
        console.error("Failed to fetch bookings:", response.status);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignedStudents = async () => {
    setStudentsLoading(true);
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `${BACKEND_URL}/api/consultant/assigned-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.students)) {
          setAssignedStudents(data.students);
        }
      } else {
        console.error("Failed to fetch assigned students:", response.status);
      }
    } catch (err) {
      console.error("Error fetching assigned students:", err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const bookingSummary = useMemo(() => {
    const pendingCount = bookings.filter(
      (b) => b.status === "pending"
    ).length;

    const acceptedCount = bookings.filter(
      (b) => b.status === "accepted" || b.status === "booked"
    ).length;

    const rejectedCount = bookings.filter(
      (b) => b.status === "rejected"
    ).length;

    const totalBookings = bookings.length;

    return {
      totalBookings,
      pendingCount,
      acceptedCount,
      rejectedCount,
    };
  }, [bookings]);

  const studentSummary = useMemo(() => {
    const total = assignedStudents.length;
    const inProgress = assignedStudents.filter((s) =>
      [
        "shortlisted",
        "application_submitted",
        "visa_process",
        "in_progress",
      ].includes((s.pipelineStage || s.leadStatus || "").toLowerCase())
    ).length;

    const contacted = assignedStudents.filter((s) =>
      ["contacted", "interested", "counselled"].includes(
        (s.leadStatus || "").toLowerCase()
      )
    ).length;

    return {
      total,
      inProgress,
      contacted,
    };
  }, [assignedStudents]);

  const filteredStudents = useMemo(() => {
    return assignedStudents.filter((s) => {
      const matchesSearch =
        !searchTerm ||
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mobile?.includes(searchTerm) ||
        s.collegeId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentLeadId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.course?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStage =
        filterStage === "all" ||
        s.pipelineStage === filterStage ||
        s.leadStatus === filterStage;

      return matchesSearch && matchesStage;
    });
  }, [assignedStudents, searchTerm, filterStage]);

  const updateBookingStatus = async (
    id: string,
    action: "accept" | "reject"
  ) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/bookings/${id}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data: { booking: Booking } = await response.json();

        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === id
              ? { ...booking, status: data.booking.status }
              : booking
          )
        );
      } else {
        console.error("Failed to update booking:", response.status);
      }
    } catch (err) {
      console.error("Error updating booking:", err);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!window.confirm("Permanently remove this booking record?")) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.ok) {
        setBookings((prev) => prev.filter((booking) => booking._id !== id));
      } else {
        console.error("Failed to delete booking:", response.status);
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-10 h-10 border-2 border-[#c2a878] border-t-transparent rounded-full animate-spin" />

        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#c2a878]/50 text-center">
          Synchronizing Manager...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7 lg:gap-10">

            {/* Title */}
            <div className="space-y-4 min-w-0">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-1.5 sm:w-2 h-8 sm:h-10 bg-[#c2a878] rounded-full shrink-0" />

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase italic font-serif tracking-tight sm:tracking-tighter leading-tight">
                  Counsellor Portal
                </h1>
              </div>

              <p className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-[0.22em] sm:tracking-[0.3em] lg:tracking-[0.4em] leading-relaxed break-words">
                Authenticated Node:{" "}
                <span className="text-[#c2a878]">
                  {user?.name || "Premium Member"}
                </span>{" "}
                <span className="hidden sm:inline">• Global Advisory Access</span>
              </p>
            </div>

            {/* Edit Profile */}
            <button
              type="button"
              onClick={() =>
                router.push("/consultant-dashboard/edit-profile")
              }
              className="group w-full lg:w-auto flex items-center justify-center lg:justify-start gap-3 sm:gap-4 px-5 sm:px-7 lg:px-8 py-3.5 sm:py-4 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-[#c2a878]/40 transition-all hover:bg-[#c2a878]/5 active:scale-[0.98]"
            >
              <div className="p-2 rounded-xl bg-[#c2a878]/10 text-[#c2a878] group-hover:scale-110 transition-transform shrink-0">
                <User size={18} />
              </div>

              <span className="text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] font-black uppercase tracking-[0.12em] sm:tracking-[0.16em] lg:tracking-[0.2em] text-gray-300">
                Edit Professional Profile
              </span>

              <ArrowRight
                size={14}
                className="text-gray-700 group-hover:translate-x-1 transition-transform shrink-0"
              />
            </button>
          </div>
        </div>

        {/* =========================================================
            TAB SWITCHER
        ========================================================= */}
        <div className="flex items-center gap-3 p-1.5 bg-white/[0.02] border border-white/10 rounded-2xl mb-8 w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === "bookings"
                ? "bg-[#c2a878] text-black shadow-lg shadow-[#c2a878]/20"
                : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Clock size={15} />
            <span>Session Bookings</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "bookings"
                  ? "bg-black/20 text-black"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              {bookingSummary.totalBookings}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("assigned_students")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === "assigned_students"
                ? "bg-[#c2a878] text-black shadow-lg shadow-[#c2a878]/20"
                : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <GraduationCap size={16} />
            <span>Assigned Students</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === "assigned_students"
                  ? "bg-black/20 text-black"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              {assignedStudents.length}
            </span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: SESSION BOOKINGS
        ========================================================= */}
        {activeTab === "bookings" && (
          <>
            {/* VITAL STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-14 sm:mb-16 lg:mb-20">
              {[
                {
                  label: "Total Volume",
                  value: bookingSummary.totalBookings,
                  color: "text-white",
                },
                {
                  label: "Action Required",
                  value: bookingSummary.pendingCount,
                  color: "text-amber-500",
                },
                {
                  label: "Confirmed Sessions",
                  value: bookingSummary.acceptedCount,
                  color: "text-[#c2a878]",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden p-5 sm:p-6 lg:p-8 bg-white/[0.01] border border-white/[0.05] rounded-2xl sm:rounded-3xl group hover:border-[#c2a878]/20 transition-colors"
                >
                  <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-[#c2a878]/5 blur-[50px] sm:blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />

                  <p className="relative text-[10px] sm:text-[11px] lg:text-[13px] font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-gray-600 mb-2 leading-relaxed">
                    {stat.label}
                  </p>

                  <p
                    className={`relative text-3xl sm:text-4xl font-black ${stat.color}`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* BOOKINGS SECTIONS */}
            <div className="grid grid-cols-1 gap-12 sm:gap-14 lg:gap-16">
              {/* PENDING APPROVALS */}
              <section>
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                  <AlertCircle size={18} className="text-amber-500 shrink-0" />

                  <h2 className="text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-white/90 whitespace-nowrap">
                    Incoming Requests
                  </h2>

                  <div className="flex-1 min-w-0 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {bookings.filter((b) => b.status === "pending").length > 0 ? (
                    bookings
                      .filter((b) => b.status === "pending")
                      .map((booking) => (
                        <div
                          key={booking._id}
                          className="group flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6 p-5 sm:p-6 lg:p-8 bg-white/[0.01] border border-white/[0.05] rounded-2xl sm:rounded-[2rem] hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex flex-col gap-2 min-w-0 w-full lg:w-auto text-left">
                            <span className="text-sm sm:text-[15px] font-bold text-white tracking-tight break-all">
                              {booking.userEmail}
                            </span>

                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px] font-black uppercase tracking-[0.12em] sm:tracking-widest text-gray-600">
                              <Clock size={12} className="text-amber-500 shrink-0" />
                              <span>{booking.date}</span>
                              <span className="w-1 h-1 bg-gray-800 rounded-full shrink-0" />
                              <span className="text-[#c2a878]">{booking.time}</span>
                            </div>
                          </div>

                          <div className="w-full lg:w-auto grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2.5 sm:flex sm:items-center sm:gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                updateBookingStatus(booking._id, "accept")
                              }
                              className="w-full sm:w-auto min-w-0 sm:min-w-[110px] px-2 sm:px-6 py-3 bg-[#c2a878] text-black rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-[0.08em] sm:tracking-widest hover:bg-yellow-100 transition-colors active:scale-[0.98]"
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateBookingStatus(booking._id, "reject")
                              }
                              className="w-full sm:w-auto min-w-0 sm:min-w-[110px] px-2 sm:px-6 py-3 bg-white/5 border border-white/5 text-white/60 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-[0.08em] sm:tracking-widest hover:bg-white/10 transition-colors active:scale-[0.98]"
                            >
                              Decline
                            </button>

                            <button
                              type="button"
                              aria-label="Delete booking"
                              onClick={() => deleteBooking(booking._id)}
                              className="h-12 w-12 sm:h-auto sm:w-auto flex items-center justify-center p-3 sm:p-2.5 text-gray-700 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-500/5"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="py-14 sm:py-16 lg:py-20 px-4 text-center rounded-2xl sm:rounded-[2rem] border border-dashed border-white/5">
                      <p className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px] font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-gray-700">
                        No pending approvals detected
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* CONFIRMED SESSIONS */}
              <section>
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                  <Check size={18} className="text-[#c2a878] shrink-0" />

                  <h2 className="text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-white/90 whitespace-nowrap">
                    Active Admissions List
                  </h2>

                  <div className="flex-1 min-w-0 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {bookings.filter(
                    (b) => b.status === "accepted" || b.status === "booked"
                  ).length > 0 ? (
                    bookings
                      .filter(
                        (b) =>
                          b.status === "accepted" || b.status === "booked"
                      )
                      .map((booking) => (
                        <div
                          key={booking._id}
                          className="group flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6 p-5 sm:p-6 lg:p-8 bg-[#c2a878]/[0.02] border border-[#c2a878]/10 rounded-2xl sm:rounded-[2rem] hover:bg-[#c2a878]/[0.04] transition-colors"
                        >
                          <div className="flex flex-col gap-2 min-w-0 w-full lg:w-auto text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <span className="text-sm sm:text-[15px] font-bold text-white tracking-tight break-all">
                                {booking.userEmail}
                              </span>

                              <span className="w-fit text-[9px] sm:text-[10px] md:text-[12px] font-black px-2.5 py-1 bg-[#c2a878] text-black uppercase rounded-full">
                                Active
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px] font-black uppercase tracking-[0.12em] sm:tracking-widest text-gray-600">
                              <Clock size={12} className="text-[#c2a878] shrink-0" />
                              <span>{booking.date}</span>
                              <span className="w-1 h-1 bg-gray-800 rounded-full shrink-0" />
                              <span className="text-[#c2a878]">{booking.time}</span>
                            </div>
                          </div>

                          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                            {booking.consultantVideoEnabled ? (
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(`/video-call/${booking._id}`)
                                }
                                className="w-full sm:w-auto flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3 bg-[#c2a878] text-black rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:bg-yellow-100 transition-all active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(194,168,120,0.3)]"
                              >
                                <Video size={14} />
                                <span>Start Call</span>
                              </button>
                            ) : (
                              <div className="w-full sm:w-auto flex items-center justify-center px-5 sm:px-8 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-gray-600 text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.2em] text-center">
                                <span>No Video Call Available</span>
                              </div>
                            )}

                            <button
                              type="button"
                              aria-label="Delete booking"
                              onClick={() => deleteBooking(booking._id)}
                              className="w-full sm:w-auto flex items-center justify-center p-3 sm:p-2.5 text-gray-700 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-500/5"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="py-14 sm:py-16 lg:py-20 px-4 text-center rounded-2xl sm:rounded-[2rem] border border-dashed border-white/5">
                      <p className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px] font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-gray-700">
                        No active admissions scheduled
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* COMPLETED BOOKINGS */}
              {bookings.filter((b) => b.status === "completed").length > 0 && (
                <section>
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                    <Check size={18} className="text-emerald-500 shrink-0" />

                    <h2 className="text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-white/90 whitespace-nowrap">
                      Completed Bookings
                    </h2>

                    <div className="flex-1 min-w-0 h-px bg-gradient-to-r from-white/10 to-transparent" />
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {bookings
                      .filter((b) => b.status === "completed")
                      .map((booking) => (
                        <div
                          key={booking._id}
                          className="group flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 sm:gap-6 p-5 sm:p-6 lg:p-8 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-2xl sm:rounded-[2rem] opacity-60"
                        >
                          <div className="flex flex-col gap-2 min-w-0 w-full lg:w-auto">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <span className="text-sm sm:text-[15px] font-bold text-white tracking-tight break-all">
                                {booking.userEmail}
                              </span>

                              <span className="w-fit text-[9px] sm:text-[10px] md:text-[12px] font-black px-2.5 py-1 bg-emerald-500/20 text-emerald-400 uppercase rounded-full">
                                Completed
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[14px] font-black uppercase tracking-[0.12em] sm:tracking-widest text-gray-600">
                              <Clock size={12} className="text-emerald-500 shrink-0" />
                              <span>{booking.date}</span>
                              <span className="w-1 h-1 bg-gray-800 rounded-full shrink-0" />
                              <span className="text-emerald-500">{booking.time}</span>
                            </div>
                          </div>

                          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                            <div className="w-full sm:w-auto flex items-center justify-center px-5 sm:px-8 py-3 bg-emerald-500/5 border border-emerald-500/10 text-emerald-500/50 rounded-xl text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-[0.12em] sm:tracking-[0.2em] text-center">
                              Session Complete
                            </div>

                            <button
                              type="button"
                              aria-label="Delete booking"
                              onClick={() => deleteBooking(booking._id)}
                              className="w-full sm:w-auto flex items-center justify-center p-3 sm:p-2.5 text-gray-700 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-500/5"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* ARCHIVES */}
              {bookings.filter((b) => b.status === "rejected").length > 0 && (
                <section className="opacity-30 hover:opacity-60 transition-opacity duration-500">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
                    <h2 className="text-[10px] sm:text-[11px] md:text-[14px] font-black uppercase tracking-[0.25em] sm:tracking-[0.35em] lg:tracking-[0.4em] text-gray-500 whitespace-nowrap">
                      Archive
                    </h2>

                    <div className="flex-1 min-w-0 h-px bg-gray-900" />
                  </div>

                  <div className="space-y-2">
                    {bookings
                      .filter((b) => b.status === "rejected")
                      .map((booking) => (
                        <div
                          key={booking._id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-5 bg-white/[0.01] border border-white/[0.05] rounded-xl sm:rounded-2xl"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-sm text-gray-400 break-all">
                              {booking.userEmail}
                            </span>

                            <span className="text-[10px] sm:text-[11px] md:text-[13px] font-black uppercase text-gray-700 mt-1">
                              {booking.date} • Declined
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteBooking(booking._id)}
                            className="w-full sm:w-auto px-4 py-2.5 sm:px-0 sm:py-0 text-[10px] sm:text-[11px] md:text-[13px] font-black uppercase tracking-[0.15em] sm:tracking-widest text-gray-600 hover:text-white transition-colors text-center sm:text-right"
                          >
                            Clear Records
                          </button>
                        </div>
                      ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}

        {/* =========================================================
            TAB 2: ASSIGNED STUDENTS
        ========================================================= */}
        {activeTab === "assigned_students" && (
          <div className="space-y-8">
            {/* VITAL STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {[
                {
                  label: "Total Assigned Students",
                  value: studentSummary.total,
                  color: "text-white",
                },
                {
                  label: "Active In Pipeline",
                  value: studentSummary.inProgress,
                  color: "text-[#c2a878]",
                },
                {
                  label: "Contacted / In Discussion",
                  value: studentSummary.contacted,
                  color: "text-emerald-400",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden p-5 sm:p-6 lg:p-8 bg-white/[0.01] border border-white/[0.05] rounded-2xl sm:rounded-3xl group hover:border-[#c2a878]/20 transition-colors"
                >
                  <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-[#c2a878]/5 blur-[50px] sm:blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />

                  <p className="relative text-[10px] sm:text-[11px] lg:text-[13px] font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] lg:tracking-[0.3em] text-gray-600 mb-2 leading-relaxed">
                    {stat.label}
                  </p>

                  <p
                    className={`relative text-3xl sm:text-4xl font-black ${stat.color}`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search students by name, email, phone, or college..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c2a878]"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <Filter size={14} className="text-[#c2a878]" />
                  <span>Stage:</span>
                </div>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="px-3.5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 focus:outline-none focus:border-[#c2a878]"
                >
                  <option value="all">All Stages</option>
                  <option value="lead_captured">Lead Captured</option>
                  <option value="contacted">Contacted</option>
                  <option value="profile_building">Profile Building</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="application_submitted">Application Submitted</option>
                  <option value="visa_process">Visa Process</option>
                  <option value="enrolled">Enrolled</option>
                </select>
              </div>
            </div>

            {/* STUDENTS LIST */}
            {studentsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-[#c2a878] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Retrieving assigned students...
                </p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-20 px-6 text-center rounded-3xl border border-dashed border-white/5 bg-white/[0.005]">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#c2a878]/10 text-[#c2a878] flex items-center justify-center">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {assignedStudents.length === 0
                    ? "No Students Assigned Yet"
                    : "No Students Matching Filters"}
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  {assignedStudents.length === 0
                    ? "When your partner institution assigns students to you for overseas counselling, their profiles and contact details will appear here."
                    : "Try adjusting your search query or stage filter to find the student you are looking for."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredStudents.map((student) => {
                  const cleanedMobile = (student.mobile || "").replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${cleanedMobile}?text=${encodeURIComponent(
                    `Hello ${student.fullName}, I am your overseas education counselor from Study Abroad. I am reaching out to assist you with your academic plans.`
                  )}`;

                  return (
                    <div
                      key={student._id}
                      className="p-6 bg-white/[0.015] border border-white/10 hover:border-[#c2a878]/30 rounded-2xl transition-all space-y-4"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="w-9 h-9 rounded-xl bg-[#c2a878]/10 text-[#c2a878] flex items-center justify-center font-bold text-sm shrink-0">
                            {student.fullName ? student.fullName.charAt(0).toUpperCase() : "S"}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white tracking-tight">
                              {student.fullName}
                            </h3>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                              ID: {student.studentLeadId}
                            </span>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {student.leadStatus && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10">
                              {student.leadStatus.replace(/_/g, " ")}
                            </span>
                          )}
                          {student.pipelineStage && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#c2a878]/10 text-[#c2a878] border border-[#c2a878]/20">
                              Stage: {student.pipelineStage.replace(/_/g, " ")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                        {/* College Info */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-400 font-semibold">
                            <Building2 size={13} className="text-[#c2a878]" />
                            <span>Institution / College:</span>
                          </div>
                          <p className="text-gray-200 font-medium pl-5">
                            {student.collegeId?.name || student.collegeName || "Institution not specified"}
                          </p>
                          {(student.collegeId?.city || student.collegeId?.state) && (
                            <p className="text-gray-500 text-[11px] pl-5 flex items-center gap-1">
                              <MapPin size={10} />
                              {[student.collegeId.city, student.collegeId.state]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>

                        {/* Academic Background */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-400 font-semibold">
                            <BookOpen size={13} className="text-[#c2a878]" />
                            <span>Course & Graduation:</span>
                          </div>
                          <p className="text-gray-200 font-medium pl-5">
                            {student.course || "General"}
                            {student.graduationYear && ` • Class of ${student.graduationYear}`}
                          </p>
                          {student.studyAbroadTimeline && (
                            <p className="text-gray-500 text-[11px] pl-5 flex items-center gap-1">
                              <Calendar size={10} />
                              Target Intake: {student.studyAbroadTimeline}
                            </p>
                          )}
                        </div>

                        {/* Preferred Countries & Program */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-400 font-semibold">
                            <Sparkles size={13} className="text-[#c2a878]" />
                            <span>Study Abroad Target:</span>
                          </div>
                          <p className="text-gray-200 font-medium pl-5">
                            {Array.isArray(student.preferredCountry) && student.preferredCountry.length > 0
                              ? student.preferredCountry.join(", ")
                              : "Countries open"}
                          </p>
                          {student.preferredProgram && (
                            <p className="text-gray-500 text-[11px] pl-5">
                              Program: {student.preferredProgram}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Counselor Notes (if partner left notes) */}
                      {student.assignmentNotes && (
                        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 space-y-1">
                          <span className="font-bold text-[10px] uppercase tracking-wider text-amber-400">
                            Partner Assignment Notes:
                          </span>
                          <p className="italic text-gray-300">{student.assignmentNotes}</p>
                        </div>
                      )}

                      {/* Bottom Action Footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <Clock size={12} />
                          <span>
                            Assigned on:{" "}
                            {student.assignedAt
                              ? new Date(student.assignedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>

                        {/* Contact Action Buttons */}
                        <div className="flex items-center gap-2">
                          {student.mobile && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-600/20 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <MessageCircle size={13} />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          {student.email && (
                            <a
                              href={`mailto:${student.email}?subject=Study Abroad Counselling Guidance`}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <Mail size={13} />
                              <span>Email</span>
                            </a>
                          )}

                          {student.mobile && (
                            <a
                              href={`tel:${student.mobile}`}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg text-xs font-semibold transition-colors"
                            >
                              <Phone size={13} />
                              <span>Call</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantDashboard;
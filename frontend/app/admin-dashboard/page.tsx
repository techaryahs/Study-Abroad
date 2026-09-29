"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/app/lib/token";
import {
  CalendarCheck,
  Users,
  Briefcase,
  GraduationCap,
  CheckSquare,
  Clock,
  Tag,
  FileText,
  Video,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building2,
  Plus,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface OverviewMetrics {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  totalConsultants: number;
  activeConsultants: number;
  totalPartners: number;
  pendingPartners: number;
  approvedPartners: number;
  totalLeads: number;
  totalSeminars: number;
  pendingSeminars: number;
}

interface UpcomingSession {
  _id: string;
  sessionId: string;
  meetingId: string;
  date: string;
  time: string;
  endTime: string;
  userName: string;
  userEmail: string;
  consultantName: string;
  status: string;
}

interface RecentPartner {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  partnerProfile?: {
    organizationName?: string;
    partnerType?: string;
    onboardingStatus?: string;
  };
  createdAt?: string;
}

function OverviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Backward compatibility redirect for old tabs
  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "active" || tab === "past") {
      router.replace(`/admin-dashboard/sessions?status=${tab}`);
    } else if (tab === "coupons") {
      router.replace("/admin-dashboard/coupons");
    } else if (tab === "profile") {
      router.replace("/admin-dashboard/profile");
    }
  }, [searchParams, router]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<OverviewMetrics>({
    totalSessions: 0,
    activeSessions: 0,
    completedSessions: 0,
    cancelledSessions: 0,
    totalConsultants: 0,
    activeConsultants: 0,
    totalPartners: 0,
    pendingPartners: 0,
    approvedPartners: 0,
    totalLeads: 0,
    totalSeminars: 0,
    pendingSeminars: 0,
  });

  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [recentPartners, setRecentPartners] = useState<RecentPartner[]>([]);

  const isSessionPast = (s: UpcomingSession) => {
    try {
      const [day, month, year] = s.date.split("/");
      const dt = new Date(`${year}-${month}-${day} ${s.endTime}`);
      return dt < new Date();
    } catch {
      return false;
    }
  };

  const loadDashboardData = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Parallel fetch from all actual backend APIs
      const [sessionsRes, consultantsRes, partnersRes, leadsRes, seminarsRes] =
        await Promise.allSettled([
          fetch(`${BACKEND_URL}/api/bookings?bookingType=counselling`, { headers }),
          fetch(`${BACKEND_URL}/api/admin/consultants`, { headers }),
          fetch(`${BACKEND_URL}/api/admin/partners`, { headers }),
          fetch(`${BACKEND_URL}/api/partnership/student-leads`, { headers }),
          fetch(`${BACKEND_URL}/api/admin/seminars`, { headers }),
        ]);

      // 1. Process Sessions
      let allSessions: UpcomingSession[] = [];
      let activeSessionsCount = 0;
      let completedSessionsCount = 0;
      let cancelledSessionsCount = 0;

      if (sessionsRes.status === "fulfilled" && sessionsRes.value.ok) {
        const data = await sessionsRes.value.json();
        allSessions = data.bookings || data || [];

        const activeList = allSessions.filter(
          (s) => s.status?.toLowerCase() === "booked" && !isSessionPast(s)
        );
        activeSessionsCount = activeList.length;
        completedSessionsCount = allSessions.filter(
          (s) => s.status?.toLowerCase() === "completed"
        ).length;
        cancelledSessionsCount = allSessions.filter(
          (s) => s.status?.toLowerCase() === "cancelled"
        ).length;

        // Upcoming sorted for the widget
        setUpcomingSessions(activeList.slice(0, 5));
      }

      // 2. Process Consultants
      let totalConsultantsCount = 0;
      let activeConsultantsCount = 0;
      if (consultantsRes.status === "fulfilled" && consultantsRes.value.ok) {
        const data = await consultantsRes.value.json();
        const consultants = data.consultants || [];
        totalConsultantsCount = consultants.length;
        activeConsultantsCount = consultants.filter((c: any) => c.videoCallEnabled).length;
      }

      // 3. Process Partners
      let totalPartnersCount = 0;
      let pendingPartnersCount = 0;
      let approvedPartnersCount = 0;
      if (partnersRes.status === "fulfilled" && partnersRes.value.ok) {
        const data = await partnersRes.value.json();
        const partners: RecentPartner[] = data.partners || [];
        totalPartnersCount = partners.length;
        pendingPartnersCount = partners.filter(
          (p) => p.partnerProfile?.onboardingStatus === "pending"
        ).length;
        approvedPartnersCount = partners.filter(
          (p) => p.partnerProfile?.onboardingStatus === "approved"
        ).length;

        setRecentPartners(partners.slice(0, 4));
      }

      // 4. Process Student Leads
      let totalLeadsCount = 0;
      if (leadsRes.status === "fulfilled" && leadsRes.value.ok) {
        const data = await leadsRes.value.json();
        totalLeadsCount = (data.leads || []).length;
      }

      // 5. Process Seminars
      let totalSeminarsCount = 0;
      let pendingSeminarsCount = 0;
      if (seminarsRes.status === "fulfilled" && seminarsRes.value.ok) {
        const data = await seminarsRes.value.json();
        const seminars = data.seminars || [];
        totalSeminarsCount = seminars.length;
        pendingSeminarsCount = seminars.filter((s: any) => s.status === "PENDING").length;
      }

      setMetrics({
        totalSessions: allSessions.length,
        activeSessions: activeSessionsCount,
        completedSessions: completedSessionsCount,
        cancelledSessions: cancelledSessionsCount,
        totalConsultants: totalConsultantsCount,
        activeConsultants: activeConsultantsCount,
        totalPartners: totalPartnersCount,
        pendingPartners: pendingPartnersCount,
        approvedPartners: approvedPartnersCount,
        totalLeads: totalLeadsCount,
        totalSeminars: totalSeminarsCount,
        pendingSeminars: pendingSeminarsCount,
      });
    } catch (err: any) {
      console.error("Dashboard overview error:", err);
      setError("Failed to load some dashboard metrics. Check server connectivity.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();

    // Listen for header refresh event
    const handleGlobalRefresh = () => loadDashboardData();
    window.addEventListener("admin-refresh-data", handleGlobalRefresh);
    return () => window.removeEventListener("admin-refresh-data", handleGlobalRefresh);
  }, [loadDashboardData]);

  const totalPendingAction = metrics.pendingPartners + metrics.pendingSeminars;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/[0.08]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            EduLeader Administrative Console
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Overview of student bookings, partner onboarding, and network operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => loadDashboardData()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#c2a878]" : ""} />
            <span>Reload Metrics</span>
          </button>
          <Link
            href="/admin-dashboard/sessions"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c2a878] hover:bg-[#d4ba8a] text-black text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>View Sessions</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Active Sessions */}
        <div className="p-5 rounded-2xl bg-[#0d0f12] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Active Sessions
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Video size={16} />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-black text-white">{metrics.activeSessions}</div>
          )}
          <div className="mt-2 text-[11px] text-white/40">
            {metrics.completedSessions} completed sessions
          </div>
        </div>

        {/* Total Bookings */}
        <div className="p-5 rounded-2xl bg-[#0d0f12] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Total Bookings
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#c2a878]/10 text-[#c2a878] flex items-center justify-center">
              <CalendarCheck size={16} />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-black text-white">{metrics.totalSessions}</div>
          )}
          <div className="mt-2 text-[11px] text-white/40">
            {metrics.cancelledSessions} cancelled
          </div>
        </div>

        {/* Active Counsellors */}
        <div className="p-5 rounded-2xl bg-[#0d0f12] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Counsellors
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-black text-white">{metrics.activeConsultants}</div>
          )}
          <div className="mt-2 text-[11px] text-white/40">
            of {metrics.totalConsultants} video-enabled
          </div>
        </div>

        {/* Approved Partners */}
        <div className="p-5 rounded-2xl bg-[#0d0f12] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Partners
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Briefcase size={16} />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-black text-white">{metrics.approvedPartners}</div>
          )}
          <div className="mt-2 text-[11px] text-white/40">
            {metrics.pendingPartners} pending review
          </div>
        </div>

        {/* Student Leads */}
        <div className="p-5 rounded-2xl bg-[#0d0f12] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Student Leads
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <GraduationCap size={16} />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
          ) : (
            <div className="text-2xl font-black text-white">{metrics.totalLeads}</div>
          )}
          <div className="mt-2 text-[11px] text-white/40">
            Institutional registrations
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="p-5 rounded-2xl bg-[#0d0f12] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              Pending Actions
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                totalPendingAction > 0
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <AlertCircle size={16} />
            </div>
          </div>
          {loading ? (
            <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
          ) : (
            <div
              className={`text-2xl font-black ${
                totalPendingAction > 0 ? "text-amber-300" : "text-white"
              }`}
            >
              {totalPendingAction}
            </div>
          )}
          <div className="mt-2 text-[11px] text-white/40">
            {metrics.pendingSeminars} seminars, {metrics.pendingPartners} partners
          </div>
        </div>
      </div>

      {/* Operational Attention Required Section */}
      {totalPendingAction > 0 && (
        <div className="p-6 rounded-2xl bg-amber-500/[0.03] border border-amber-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Administrative Review Required ({totalPendingAction})
                </h3>
                <p className="text-xs text-white/50">
                  New partner onboarding applications and college seminars are awaiting approval.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {metrics.pendingPartners > 0 && (
                <Link
                  href="/admin-dashboard/partners"
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Review Partners ({metrics.pendingPartners})
                </Link>
              )}
              {metrics.pendingSeminars > 0 && (
                <Link
                  href="/admin-dashboard/seminars"
                  className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Review Seminars ({metrics.pendingSeminars})
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Split Section: Upcoming Sessions & Recent Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Upcoming Sessions */}
        <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Upcoming Sessions
              </h3>
              <p className="text-xs text-white/40">Next scheduled counselling appointments</p>
            </div>
            <Link
              href="/admin-dashboard/sessions"
              className="text-xs font-bold text-[#c2a878] hover:text-[#d4ba8a] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {loading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div
                  key={session._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {session.userName || session.userEmail}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-white/50">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-[#c2a878]" />
                        {session.date}
                      </span>
                      <span>
                        {session.time} - {session.endTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/meeting/${session.sessionId}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg bg-[#c2a878]/15 hover:bg-[#c2a878]/25 text-[#c2a878] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <Video size={12} />
                      <span>Join</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-white/40 space-y-2">
                <CheckCircle2 size={28} className="mx-auto text-white/20 mb-2" />
                <p className="text-xs font-bold text-white/70">No Scheduled Sessions</p>
                <p className="text-[11px] text-white/40">
                  New student bookings will appear here immediately.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Partner Onboarding */}
        <div className="bg-[#0d0f12] border border-white/[0.08] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Partner Network
              </h3>
              <p className="text-xs text-white/40">Latest institutional and counsellor partners</p>
            </div>
            <Link
              href="/admin-dashboard/partners"
              className="text-xs font-bold text-[#c2a878] hover:text-[#d4ba8a] flex items-center gap-1 transition-colors"
            >
              <span>Manage Partners</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {loading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentPartners.length > 0 ? (
              recentPartners.map((partner) => {
                const status = partner.partnerProfile?.onboardingStatus || "unknown";
                const isApproved = status === "approved";
                const isPending = status === "pending";

                return (
                  <div
                    key={partner._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{partner.name}</p>
                      <p className="text-[11px] text-white/50 truncate">
                        {partner.partnerProfile?.organizationName || partner.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white/5 text-white/60">
                        {partner.partnerProfile?.partnerType || "Partner"}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          isApproved
                            ? "bg-emerald-500/15 text-emerald-400"
                            : isPending
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-white/40 space-y-2">
                <Briefcase size={28} className="mx-auto text-white/20 mb-2" />
                <p className="text-xs font-bold text-white/70">No Partners Found</p>
                <p className="text-[11px] text-white/40">Partner applications will be listed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Operational Shortcuts */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
          Operational Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin-dashboard/slots"
            className="group flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#c2a878]/30 hover:bg-white/[0.04] transition-all"
          >
            <Clock size={20} className="text-[#c2a878] mb-3 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white">Manage Slots</span>
            <span className="text-[11px] text-white/40 mt-0.5">Availability calendar</span>
          </Link>

          <Link
            href="/admin-dashboard/coupons"
            className="group flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#c2a878]/30 hover:bg-white/[0.04] transition-all"
          >
            <Tag size={20} className="text-[#c2a878] mb-3 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white">Coupon Codes</span>
            <span className="text-[11px] text-white/40 mt-0.5">Promotions & discounts</span>
          </Link>

          <Link
            href="/admin-dashboard/colleges"
            className="group flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#c2a878]/30 hover:bg-white/[0.04] transition-all"
          >
            <Building2 size={20} className="text-[#c2a878] mb-3 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white">Colleges Master</span>
            <span className="text-[11px] text-white/40 mt-0.5">Institution directory</span>
          </Link>

          <Link
            href="/admin-dashboard/articles"
            className="group flex flex-col p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#c2a878]/30 hover:bg-white/[0.04] transition-all"
          >
            <FileText size={20} className="text-[#c2a878] mb-3 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white">Articles & Guides</span>
            <span className="text-[11px] text-white/40 mt-0.5">Content management</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#c2a878]/30 border-t-[#c2a878] rounded-full animate-spin" />
          <span className="text-xs text-white/50">Loading Admin Overview...</span>
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
}
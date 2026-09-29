'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getToken, getUser, clearAuth, setUser } from "@/app/lib/token";
import { HighSchoolModal, SuccessModal } from "./profile/HighSchool";
import { UnderGradModal } from "./profile/UnderGrad";
import { MastersModal } from "./profile/Masters";
import { TargetUniversityModal } from "./profile/TargetUniversity";
import { TestScoresModal } from "./profile/TestScores";
import WorkExpModal from "./profile/WorkExp";
import ResearchModal from "./profile/research";
import { AnimatePresence, motion } from "framer-motion";
import ProjectFormModal from "./profile/Add-Projects";
import AddVolunteer from "./profile/Volunteering";
import { AchievementsModal } from "./profile/AchievementsModal";
import { BioModal } from "./profile/BioModal";
import { LinkedInModal } from "./profile/LinkedInModal";
import {
  MapPin,
  Edit2,
  Camera,
  User,
  Briefcase,
  Heart,
  Plus,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  GraduationCap,
  Star,
  Trash2,
  Trophy,
  School,
  Target
} from "lucide-react";
import { EntitlementGuard } from "@/components/shared/EntitlementGuard";
import { useMembership } from "@/app/lib/membership/MembershipContext";
import { MembershipStatusChip } from "@/components/shared/MembershipUI/MembershipStatusChip";
import { UsageProgress } from "@/components/shared/MembershipUI/UsageProgress";
import { MembershipCTA } from "@/components/shared/MembershipUI/MembershipCTA";
import { RefreshCcw, CreditCard, History, Zap } from "lucide-react";

interface ProfileCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  section: ProfileSection | "bio";
}

type ProfileSection =
  | "highSchool"
  | "underGrad"
  | "masters"
  | "testScores"
  | "workExperience"
  | "research"
  | "projects"
  | "volunteering"
  | "targetUniversities"
  | "achievements";

type PortfolioSection = "workExperience" | "projects" | "research" | "volunteering" | "achievements";

interface ProfileEntry {
  _id: string;
  schoolName?: string;
  uniName?: string;
  degreeName?: string;
  cgpa?: string | number;
  outOf?: string | number;
  major?: string;
  term?: string;
  year?: string | number;
  role?: string;
  title?: string;
  organization?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
  description?: string;
  documentUrl?: string;
  documentName?: string;
  degree?: string;
  university?: string;
  targetCountry?: string;
  tuitionBudget?: string;
  scholarshipRequired?: boolean;
}

interface TestScoreEntry {
  testType: string;
  score: string | number;
  sectionScores?: Record<string, string | number>;
}

interface SessionEntry {
  _id: string;
  sessionId?: string;
  meetingId?: string;
  date: string;
  time?: string;
  consultantName?: string;
  status?: string;
}

interface StudentProfile {
  profileImage?: string;
  isPublic?: boolean;
  location?: string;
  linkedin?: string;
  bio?: string;
  highSchool?: ProfileEntry[];
  underGrad?: ProfileEntry[];
  masters?: ProfileEntry[];
  testScores?: TestScoreEntry[];
  workExperience?: ProfileEntry[];
  research?: ProfileEntry[];
  projects?: ProfileEntry[];
  volunteering?: ProfileEntry[];
  targetUniversities?: ProfileEntry[];
  achievements?: ProfileEntry[];
  mySessions?: SessionEntry[];
}

interface StudentRecord {
  _id?: string;
  id?: string;
  name?: string;
  gender?: string;
  dob?: string;
  country?: string;
  profile?: StudentProfile;
}

interface ReceiptItem {
  title: string;
}

interface ReceiptEntry {
  _id: string;
  createdAt: string;
  orderId: string;
  currency: string;
  total: number;
  items: ReceiptItem[];
}

interface ProfileTabEntry {
  id: string;
  label: string;
  hasData: boolean;
}

const initialCards: ProfileCard[] = [
  { id: 1, title: "Target University", description: "Define your global academic destination.", icon: "🏛️", section: "targetUniversities" },
  { id: 2, title: "High School", description: "Record your foundational achievements.", icon: "🏫", section: "highSchool" },
  { id: 3, title: "Undergraduate", description: "Document your core academic degree.", icon: "🎓", section: "underGrad" },
  { id: 4, title: "Master's Degree", description: "Log your advanced postgraduate study.", icon: "📜", section: "masters" },
  { id: 5, title: "Standardized Tests", description: "Sync GRE, TOEFL, or IELTS protocols.", icon: "📊", section: "testScores" },
  { id: 6, title: "Work Experience", description: "Catalogue your professional trajectory.", icon: "💼", section: "workExperience" },
  { id: 7, title: "Research Work", description: "Incorporate your academic discoveries.", icon: "🔬", section: "research" },
  { id: 8, title: "Projects", description: "Showcase your practical engineering.", icon: "🚀", section: "projects" },
  { id: 9, title: "Volunteering", description: "Record altruistic community impact.", icon: "🤝", section: "volunteering" }
];

export default function DashboardPage() {
  const [userData, setUserData] = useState<StudentRecord | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState('about');
  const [mainTab, setMainTab] = useState<'profile' | 'membership' | 'bookings' | 'sessions'>('profile');
  const [sessionFilter, setSessionFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<{ section: ProfileSection; data: ProfileEntry } | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const [receipts, setReceipts] = useState<ReceiptEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { membership, currentPlan } = useMembership();

  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  const getUserId = useCallback(() => {
    const user = getUser();
    return user?._id || user?.id || null;
  }, []);

  const fetchProfile = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/profile/${userId}`);
      if (response.ok) {
        const data: StudentRecord = await response.json();
        setUserData(data);
      } else if (response.status === 401 || response.status === 404) {
        console.warn("Auth token invalid on dashboard. Redirecting to login.");
        clearAuth();
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL, getUserId, router]);

  const fetchReceipts = useCallback(async () => {
    const user = getUser();
    if (!user?.email) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/payment/user/${user.email}`);
      if (response.ok) {
        const data: ReceiptEntry[] = await response.json();
        setReceipts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      clearAuth();
      router.push("/auth/login");
      return;
    }
    fetchProfile();
    fetchReceipts();
  }, [fetchProfile, fetchReceipts, router]);

  const handleImageUpload = async (file: File) => {
    const userId = getUserId();
    if (!userId) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      setSavingImage(true);
      const response = await fetch(`${BACKEND_URL}/api/user/profile/${userId}`, {
        method: "PUT",
        body: formData
      });
      if (response.ok) {
        const data = await response.json();
        const updatedUser = data.user;
        setUserData(updatedUser);
        setUser(updatedUser);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Dashboard Image upload failed:", error);
    } finally {
      setSavingImage(false);
    }
  };

  const addProfileItem = async (section: ProfileSection, data: unknown) => {
    const userId = getUserId();
    if (!userId) {
      const error = "❌ Error: Session node not found. Please re-authenticate.";
      console.error(error);
      throw new Error(error);
    }

    const endpoint = editingItem
      ? `${BACKEND_URL}/api/user/profile/${userId}/update-item`
      : `${BACKEND_URL}/api/user/profile/${userId}/add-item`;

    const body = editingItem
      ? { section, itemId: editingItem.data._id, data }
      : { section, data };

    const method = editingItem ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        setOpenModal(null);
        setEditingItem(null);
        fetchProfile();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        return true;
      } else {
        const err = await response.json();
        const detail = err.error || err.message || "Failed to save information";
        throw new Error(detail);
      }
    } catch (error: unknown) {
      console.error("❌ Update failed:", error);
      throw error;
    }
  };

  const updateCoreProfile = async (field: string, value: unknown, silent = false) => {
    const userId = getUserId();
    if (!userId) {
      alert("Session Expired. Please login.");
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
      if (response.ok) {
        setOpenModal(null);
        fetchProfile();
        if (!silent) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }
      }
    } catch (error) {
      console.error("Failed to update core profile:", error);
    }
  };

  const deleteItem = async (section: string, itemId: string) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/profile/${userId}/delete-item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, itemId })
      });
      if (response.ok) fetchProfile();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const filteredCards = initialCards.filter(card => {
    if (!userData || !userData.profile) return true;
    if (card.section === 'bio') return !userData.profile.bio || userData.profile.bio.length < 10;
    const sectionData = userData.profile[card.section];
    return !sectionData || sectionData.length === 0;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left') setCurrentIndex(prev => Math.max(0, prev - 1));
    else setCurrentIndex(prev => Math.min(Math.max(0, filteredCards.length - 3), prev + 1));
  };

  const completedSteps = [
    Boolean(userData?.profile?.highSchool?.length),
    Boolean(userData?.profile?.underGrad?.length),
    Boolean(userData?.profile?.masters?.length),
    Boolean(userData?.profile?.testScores?.length),
    Boolean(userData?.profile?.workExperience?.length),
    Boolean(userData?.profile?.research?.length),
    Boolean(userData?.profile?.projects?.length),
    Boolean(userData?.profile?.volunteering?.length),
    Boolean(userData?.profile?.targetUniversities?.length),
    (userData?.profile?.bio?.length ?? 0) > 10
  ].filter(Boolean).length;

  const totalSteps = 10;
  const safeCardIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 3));
  const visibleCards = filteredCards.slice(safeCardIndex, safeCardIndex + 3);
  const profileTabs: ProfileTabEntry[] = [
    { id: 'about', label: 'About', hasData: true },
    { id: 'insights', label: 'Insights', hasData: true },
    { id: 'highSchool', label: 'High School', hasData: Boolean(userData?.profile?.highSchool?.length) },
    { id: 'undergrad', label: "Bachelor's", hasData: Boolean(userData?.profile?.underGrad?.length) },
    { id: 'masters', label: "Master's", hasData: Boolean(userData?.profile?.masters?.length) },
    { id: 'target', label: 'Target', hasData: Boolean(userData?.profile?.targetUniversities?.length) },
    ...(userData?.profile?.testScores || []).map((score) => ({
      id: `score-${score.testType.toLowerCase()}`,
      label: score.testType.toUpperCase(),
      hasData: true,
    })),
  ];
  const portfolioSections: { id: PortfolioSection; label: string; icon: React.ReactNode }[] = [
    { id: 'workExperience', label: "Work Experience", icon: <Briefcase size={18} /> },
    { id: 'projects', label: "Projects", icon: <Star size={18} /> },
    { id: 'research', label: "Research Papers", icon: <FileText size={18} /> },
    { id: 'volunteering', label: "Volunteering", icon: <Heart size={18} /> },
    { id: 'achievements', label: "Achievements & Awards", icon: <Trophy size={18} /> },
  ];
  const getPortfolioEntries = (section: PortfolioSection) =>
    userData?.profile?.[section] ?? [];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#3C2A21] pb-32 font-base selection:bg-[#C5A059]/20">

      {/* ── PREMIUM HEADER ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6 py-4 sm:py-6 border-b border-[#F1EDEA]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4 sm:gap-6 min-w-0">
            <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#C5A059]/20 to-transparent border border-[#F1EDEA] p-1 shadow-sm">
                <div className="w-full h-full rounded-[14px] sm:rounded-[20px] bg-white overflow-hidden relative">
                  {savingImage ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                      <div className="w-5 h-5 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : null}
                  <Image
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 80px, 96px"
                    src={userData?.profile?.profileImage ? (
                      userData.profile.profileImage.startsWith('http') ? userData.profile.profileImage :
                        userData.profile.profileImage.startsWith('data:image') ? userData.profile.profileImage :
                          userData.profile.profileImage.startsWith('//') ? `https:${userData.profile.profileImage}` :
                            `${BACKEND_URL}${userData.profile.profileImage.startsWith('/') ? '' : '/'}${userData.profile.profileImage.replace(/\\/g, '/')}`
                    ) : `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=c2a878&color=000&bold=true`}
                    className="object-cover group-hover:scale-105 transition-all duration-500"
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#C5A059] rounded-xl flex items-center justify-center text-white shadow-md border-2 border-[#FDFBF7] group-hover:scale-110 transition-all">
                <Camera size={14} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </div>

            <div className="flex min-w-0 flex-col gap-2 text-center sm:text-left">
              <div className="flex flex-col md:flex-row items-center sm:items-start md:items-center gap-2 sm:gap-3">
                <h1 className="max-w-full break-words text-xl sm:text-2xl md:text-3xl font-bold text-[#3C2A21] tracking-wide font-serif italic">{userData?.name || "Student Member"}</h1>

                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${userData?.profile?.isPublic ? 'text-green-600' : 'text-[#6B5E51]'}`}>
                    {userData?.profile?.isPublic ? "Public" : "Private"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      updateCoreProfile("isPublic", !userData?.profile?.isPublic, true);
                    }}
                    className={`relative w-10 h-5 rounded-full transition-all duration-500 flex items-center px-0.5 border cursor-pointer z-10 ${userData?.profile?.isPublic ? 'bg-green-500/20 border-green-500/30' : 'bg-[#6B5E51]/10 border-[#F1EDEA]'}`}
                  >
                    <motion.div
                      animate={{ x: userData?.profile?.isPublic ? 18 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`w-3.5 h-3.5 rounded-full shadow pointer-events-none ${userData?.profile?.isPublic ? 'bg-green-500' : 'bg-[#6B5E51]'}`}
                    />
                  </button>
                </div>
              </div>
              {userData?.profile?.bio && (
                <p className="text-xs font-semibold text-[#6B5E51] max-w-md tracking-wide leading-relaxed italic">
                  &quot;{userData.profile.bio}&quot;
                </p>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 sm:gap-6 mt-0.5">
                <div className="flex items-center gap-2 text-[#6B5E51]">
                  <MapPin size={14} className="text-[#C5A059]" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{userData?.profile?.location || userData?.country || "Global Citizen"}</span>
                </div>
                <button
                  onClick={() => userData?.profile?.linkedin ? window.open(userData.profile.linkedin.startsWith('http') ? userData.profile.linkedin : `https://${userData.profile.linkedin}`, '_blank') : setOpenModal('linkedin')}
                  className="flex items-center gap-2 text-[#6B5E51] hover:text-[#C5A059] transition-all group"
                >
                  <LinkIcon size={14} className="text-[#C5A059] group-hover:rotate-12 transition-transform" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{userData?.profile?.linkedin ? "View LinkedIn" : "Add LinkedIn"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-2.5 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
            <button
              onClick={() => setOpenModal("bio")}
              className="h-10 sm:h-11 w-full sm:w-auto px-4 sm:px-6 bg-white border border-[#F1EDEA] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#FDFBF7] hover:border-[#C5A059]/30 transition-all flex items-center justify-center gap-2 active:scale-95 group shadow-sm"
            >
              <Plus size={16} className="text-[#C5A059] group-hover:rotate-90 transition-transform duration-500" />
              {userData?.profile?.bio ? "Update Bio" : "Add Short Bio"}
            </button>
            <button
              onClick={() => router.push('/User/edit-profile')}
              className="h-10 sm:h-11 w-full sm:w-auto px-5 sm:px-7 bg-[#C5A059] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#3C2A21] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2.5"
            >
              <Edit2 size={15} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN TABS ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 border-b border-[#F1EDEA] pb-3 overflow-x-auto no-scrollbar">
        {(['profile', 'membership', 'bookings', 'sessions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMainTab(tab)}
            className={`flex-1 sm:flex-none h-10 sm:h-11 px-4 sm:px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${mainTab === tab ? 'bg-[#C5A059] text-white shadow-md' : 'bg-white border border-[#F1EDEA] text-[#6B5E51] hover:bg-[#FDFBF7]'}`}
          >
            {tab === 'profile' ? 'Profile' : tab === 'membership' ? 'Membership Center' : tab === 'bookings' ? 'My Bookings' : 'My Sessions'}
          </button>
        ))}
      </div>

      {mainTab === 'profile' && (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        {/* ── IDENTITY MODULE ── */}
        <div className="bg-white border border-[#F1EDEA] rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-auto transition-all hover:border-[#C5A059]/20">
          <div className="w-full md:w-48 bg-[#FDFBF7] border-b md:border-b-0 md:border-r border-[#F1EDEA] p-2.5 flex flex-row md:flex-col gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'about', label: 'About' },
              { id: 'insights', label: 'Insights' },
              { id: 'highSchool', label: 'High School' },
              { id: 'undergrad', label: "Bachelor's" },
              { id: 'masters', label: "Master's" },
              { id: 'target', label: 'Target' },
              { id: 'documents', label: 'Documents' },
              ...((userData?.profile?.testScores || []).map((score: any) => ({
                id: `score-${score.testType.toLowerCase()}`,
                label: score.testType.toUpperCase()
              })))
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveProfileTab(tab.id)} className={`whitespace-nowrap md:whitespace-normal px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${activeProfileTab === tab.id ? 'bg-[#C5A059] text-white shadow-sm' : 'text-[#6B5E51] hover:bg-white'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="min-w-0 flex-1 p-4 sm:p-6 md:p-8 bg-white">
            <AnimatePresence mode="wait">
              {activeProfileTab === 'about' && (
                <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FDFBF7] border border-[#F1EDEA]"><div className="w-9 h-9 rounded-xl bg-white border border-[#F1EDEA] flex items-center justify-center text-[#6B5E51] shadow-xs shrink-0"><User size={16} /></div><div><p className="text-[11px] font-bold text-[#6B5E51] uppercase tracking-wider">Full Name</p><h3 className="text-sm font-bold text-[#3C2A21] uppercase tracking-tight">{userData?.name || "Member"}</h3></div></div>
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FDFBF7] border border-[#F1EDEA]"><div className="w-9 h-9 rounded-xl bg-white border border-[#F1EDEA] flex items-center justify-center text-[#6B5E51] shadow-xs shrink-0"><span className="text-base font-bold">♀</span></div><div><p className="text-[11px] font-bold text-[#6B5E51] uppercase tracking-wider">Gender</p><h3 className="text-sm font-bold text-[#3C2A21] uppercase tracking-tight">{userData?.gender || "Female"}</h3></div></div>
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FDFBF7] border border-[#F1EDEA]"><div className="w-9 h-9 rounded-xl bg-white border border-[#F1EDEA] flex items-center justify-center text-[#6B5E51] shadow-xs shrink-0"><MapPin size={16} /></div><div><p className="text-[11px] font-bold text-[#6B5E51] uppercase tracking-wider">Location</p><h3 className="text-sm font-bold text-[#3C2A21] uppercase tracking-tight">{userData?.country || userData?.profile?.location || "India"}</h3></div></div>
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#FDFBF7] border border-[#F1EDEA]"><div className="w-9 h-9 rounded-xl bg-white border border-[#F1EDEA] flex items-center justify-center text-[#6B5E51] shadow-xs shrink-0"><Calendar size={16} /></div><div><p className="text-[11px] font-bold text-[#6B5E51] uppercase tracking-wider">Birth Date</p><h3 className="text-sm font-bold text-[#3C2A21] uppercase tracking-tight">{userData?.dob || "Sep 03, 2005"}</h3></div></div>
                </motion.div>
              )}
              {activeProfileTab === 'insights' && (
                <motion.div key="insights" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B5E51] pb-3 border-b border-[#F1EDEA]">Advanced Profile Analytics</h2>
                  <EntitlementGuard featureId="dashboard_insights" fallbackTitle="Unlock Admission Insights" fallbackDescription="Get AI-powered admission predictions, profile gap analysis, and tailored university recommendations based on your unique profile.">
                    <div className="space-y-4">
                      <div className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                            <Target size={18} />
                          </div>
                          <div>
                            <h4 className="text-[#3C2A21] font-bold text-xs uppercase tracking-wider">Admission Probability</h4>
                            <p className="text-xs text-[#6B5E51] mt-0.5">Based on global acceptance trends</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600 italic">74%</p>
                        </div>
                      </div>
                      
                      <div className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0">
                            <Star size={18} />
                          </div>
                          <div>
                            <h4 className="text-[#3C2A21] font-bold text-xs uppercase tracking-wider">Profile Percentile</h4>
                            <p className="text-xs text-[#6B5E51] mt-0.5">Compared to other applicants</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#C5A059] italic">Top 15%</p>
                        </div>
                      </div>

                      <div className="bg-red-50/70 border border-red-100 rounded-xl p-4 sm:p-5">
                        <h4 className="text-red-800 font-bold text-xs uppercase tracking-wider mb-2">Critical Gaps Identified</h4>
                        <ul className="list-disc pl-4 text-xs font-semibold text-red-700/80 space-y-1">
                          <li>Lack of international research exposure</li>
                          <li>Quant score is slightly below the median for your target universities</li>
                        </ul>
                      </div>
                    </div>
                  </EntitlementGuard>
                </motion.div>
              )}
              {activeProfileTab === 'highSchool' && (
                <motion.div key="hs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1EDEA]">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B5E51]">High School Education</h2>
                    <button onClick={() => { setEditingItem(null); setOpenModal('highSchool'); }} className="px-3 py-1 rounded-lg bg-[#3C2A21] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-all">
                      + Add High School
                    </button>
                  </div>
                  {userData?.profile?.highSchool?.map((hs, idx) => (
                    <div key={idx} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-4 flex justify-between items-center group/card hover:border-[#C5A059]/30 transition-all shadow-xs">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0">
                          <School size={18} />
                        </div>
                        <div>
                          <h4 className="text-[#3C2A21] font-bold text-xs uppercase tracking-wider">{hs.schoolName}</h4>
                          <p className="text-xs text-[#6B5E51] uppercase tracking-wider mt-0.5">High School Credentials</p>
                          {hs.documentName && (
                            <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                              <FileText size={12} /> Attached: {hs.documentName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right"><p className="text-xl font-bold text-[#3C2A21] italic">{hs.cgpa}<span className="text-xs text-[#6B5E51]"> / {hs.outOf}</span></p></div>
                    </div>
                  ))}
                  {(!userData?.profile?.highSchool || userData.profile.highSchool.length === 0) && (
                    <div className="text-center py-10 space-y-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-6">
                      <School size={28} className="mx-auto text-[#C5A059]/60" />
                      <p className="text-xs font-semibold uppercase text-[#6B5E51] tracking-wider">No high school records added yet.</p>
                      <button onClick={() => { setEditingItem(null); setOpenModal('highSchool'); }} className="px-4 py-2 bg-[#C5A059] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3C2A21] transition-all">
                        + Add High School Details
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
              {activeProfileTab === 'undergrad' && (
                <motion.div key="ug" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1EDEA]">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B5E51]">Bachelor&apos;s Credentials</h2>
                    <button onClick={() => { setEditingItem(null); setOpenModal('underGrad'); }} className="px-3 py-1 rounded-lg bg-[#3C2A21] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-all">
                      + Add Bachelor&apos;s
                    </button>
                  </div>
                  {userData?.profile?.underGrad?.map((ug, idx) => (
                    <div key={idx} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-4 flex justify-between items-center hover:border-[#C5A059]/30 transition-all shadow-xs">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0">
                          <GraduationCap size={18} />
                        </div>
                        <div>
                          <h4 className="text-[#3C2A21] font-bold text-xs uppercase tracking-wider">{ug.uniName}</h4>
                          <p className="text-xs text-[#6B5E51] uppercase tracking-wider mt-0.5">{ug.degreeName || "Undergraduate Degree"}</p>
                          {ug.documentName && (
                            <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                              <FileText size={12} /> Attached: {ug.documentName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right"><p className="text-xl font-bold text-[#3C2A21] italic">{ug.cgpa}<span className="text-xs text-[#6B5E51]"> / {ug.outOf}</span></p></div>
                    </div>
                  ))}
                  {(!userData?.profile?.underGrad || userData.profile.underGrad.length === 0) && (
                    <div className="text-center py-10 space-y-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-6">
                      <GraduationCap size={28} className="mx-auto text-[#C5A059]/60" />
                      <p className="text-xs font-semibold uppercase text-[#6B5E51] tracking-wider">No Bachelor&apos;s degree records added yet.</p>
                      <button onClick={() => { setEditingItem(null); setOpenModal('underGrad'); }} className="px-4 py-2 bg-[#C5A059] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3C2A21] transition-all">
                        + Add Bachelor&apos;s Degree
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
              {activeProfileTab === 'masters' && (
                <motion.div key="ms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1EDEA]">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B5E51]">Postgraduate Credentials</h2>
                    <button onClick={() => { setEditingItem(null); setOpenModal('masters'); }} className="px-3 py-1 rounded-lg bg-[#3C2A21] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-all">
                      + Add Master&apos;s
                    </button>
                  </div>
                  {userData?.profile?.masters?.map((ms, idx) => (
                    <div key={idx} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-4 flex justify-between items-center hover:border-[#C5A059]/30 transition-all shadow-xs">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0">
                          <Trophy size={18} />
                        </div>
                        <div>
                          <h4 className="text-[#3C2A21] font-bold text-xs uppercase tracking-wider">{ms.uniName}</h4>
                          <p className="text-xs text-[#6B5E51] uppercase tracking-wider mt-0.5">{ms.degreeName || "Master's Degree"}</p>
                          {ms.documentName && (
                            <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                              <FileText size={12} /> Attached: {ms.documentName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right"><p className="text-xl font-bold text-[#3C2A21] italic">{ms.cgpa}<span className="text-xs text-[#6B5E51]"> / {ms.outOf}</span></p></div>
                    </div>
                  ))}
                  {(!userData?.profile?.masters || userData.profile.masters.length === 0) && (
                    <div className="text-center py-10 space-y-3 bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-6">
                      <Trophy size={28} className="mx-auto text-[#C5A059]/60" />
                      <p className="text-xs font-semibold uppercase text-[#6B5E51] tracking-wider">No Master&apos;s degree records added yet.</p>
                      <button onClick={() => { setEditingItem(null); setOpenModal('masters'); }} className="px-4 py-2 bg-[#C5A059] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3C2A21] transition-all">
                        + Add Master&apos;s Degree
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
              {activeProfileTab === 'target' && (
                <motion.div key="target" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1EDEA]">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B5E51]">Global Strategy & Goals</h2>
                    <button onClick={() => { setEditingItem(null); setOpenModal('targetUniversities'); }} className="px-3 py-1 rounded-lg bg-[#3C2A21] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-all">
                      + Add Target Goal
                    </button>
                  </div>
                  {userData?.profile?.targetUniversities?.map((uni, idx) => (
                    <div key={idx} className="p-4 sm:p-5 rounded-xl bg-[#FDFBF7] border border-[#F1EDEA] hover:border-[#C5A059]/30 transition-all shadow-xs space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-bold text-xs shrink-0">
                            <Target size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-[#3C2A21] uppercase tracking-wider">
                              {uni.uniName || uni.university || "Target Institution"}
                            </h4>
                            <p className="text-xs font-semibold text-[#6B5E51] mt-0.5">
                              {uni.degree ? `${uni.degree} in ` : ''}{uni.major || "Selected Program"}
                            </p>
                          </div>
                        </div>
                        {uni.targetCountry && (
                          <span className="text-[10px] font-bold bg-[#C5A059]/10 text-[#C5A059] px-2.5 py-1 rounded-full border border-[#C5A059]/20 uppercase tracking-wider">
                            {uni.targetCountry}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 border-t border-[#F1EDEA] text-xs font-medium text-[#6B5E51]">
                        {(uni.term || uni.year) && (
                          <span className="font-bold text-[#3C2A21] uppercase">Intake: {uni.term || ''} {uni.year || ''}</span>
                        )}
                        {uni.tuitionBudget && (
                          <span>Budget: <strong className="text-[#3C2A21]">{uni.tuitionBudget}</strong></span>
                        )}
                        {uni.scholarshipRequired && (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200">Scholarship Required</span>
                        )}
                      </div>
                      {uni.documentName && (
                        <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                          <FileText size={13} /> Attached: {uni.documentName}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!userData?.profile?.targetUniversities || userData.profile.targetUniversities.length === 0) && (
                    <div className="text-center py-10 space-y-3">
                      <p className="text-xs font-semibold uppercase text-[#6B5E51] tracking-wider">No target study-abroad goals defined yet.</p>
                      <button onClick={() => { setEditingItem(null); setOpenModal('targetUniversities'); }} className="px-4 py-2 bg-[#C5A059] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3C2A21] transition-all">
                        Define Target Goal
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeProfileTab === 'documents' && (
                <motion.div key="documents" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1EDEA]">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B5E51]">Study Abroad Document Vault</h2>
                    <span className="text-[11px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-1 rounded-full border border-[#C5A059]/20 uppercase">
                      Centralized Documents
                    </span>
                  </div>
                  {(() => {
                    const allDocs: { title: string; section: string; fileName: string; fileUrl: string }[] = [];
                    const p = userData?.profile;
                    if (p) {
                      const addDoc = (items: any[] | undefined, sec: string, fallback: string) => {
                        (items || []).forEach(item => {
                          if (item.documentName || item.documentUrl) {
                            allDocs.push({
                              title: item.title || item.role || item.schoolName || item.uniName || item.organization || item.testType || fallback,
                              section: sec,
                              fileName: item.documentName || "Attached Document File",
                              fileUrl: item.documentUrl || ""
                            });
                          }
                        });
                      };
                      addDoc(p.highSchool, "High School", "High School Marksheet");
                      addDoc(p.underGrad, "Bachelor's", "Degree Transcript");
                      addDoc(p.masters, "Master's", "Postgraduate Transcript");
                      addDoc(p.targetUniversities, "Target Strategy", "Target Goal Document");
                      addDoc(p.workExperience, "Work Experience", "Experience Certificate");
                      addDoc(p.projects, "Projects", "Project Report / Document");
                      addDoc(p.research, "Research", "Publication PDF");
                      addDoc(p.volunteering, "Volunteering", "Volunteering Certificate");
                      addDoc(p.achievements, "Achievements", "Award / Certification");
                    }

                    if (allDocs.length === 0) {
                      return (
                        <div className="text-center py-12 space-y-2 bg-[#FDFBF7] rounded-xl border border-[#F1EDEA] p-6">
                          <FileText size={28} className="mx-auto text-[#C5A059]/60" />
                          <p className="text-xs font-bold text-[#3C2A21] uppercase tracking-wider">No supporting documents uploaded yet.</p>
                          <p className="text-xs text-[#6B5E51]">You can upload marksheets, certificates, transcripts, and research PDFs directly within each profile section modal.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {allDocs.map((doc, idx) => (
                          <div key={idx} className="bg-[#FDFBF7] border border-[#F1EDEA] p-4 rounded-xl flex items-start justify-between gap-3 hover:border-[#C5A059]/30 transition-all shadow-xs">
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded uppercase border border-[#C5A059]/20">
                                  {doc.section}
                                </span>
                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded uppercase border border-emerald-200">
                                  Uploaded
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-[#3C2A21] uppercase tracking-wider truncate">{doc.title}</h4>
                              <p className="text-[11px] text-[#6B5E51] font-semibold truncate flex items-center gap-1">
                                <FileText size={12} className="text-[#C5A059] shrink-0" /> {doc.fileName}
                              </p>
                            </div>
                            {doc.fileUrl && (
                              <a
                                href={doc.fileUrl.startsWith('http') ? doc.fileUrl : `${BACKEND_URL}${doc.fileUrl.startsWith('/') ? '' : '/'}${doc.fileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-[#3C2A21] text-white rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-colors shrink-0 self-center"
                              >
                                View
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </motion.div>
              )}

              {(userData?.profile?.testScores || []).map((score) => (
                activeProfileTab === `score-${score.testType.toLowerCase()}` && (
                  <motion.div key={score.testType} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="relative group/score">
                      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#F1EDEA]">
                        <div className="w-9 h-9 rounded-xl bg-[#FDFBF7] border border-[#F1EDEA] flex items-center justify-center text-[#6B5E51] group-hover/score:text-[#C5A059] transition-colors shrink-0">
                          <Trophy size={16} />
                        </div>
                        <h3 className="text-xs font-bold text-[#3C2A21] uppercase tracking-wider">{score.testType} Results</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        {score.sectionScores && Object.entries(score.sectionScores).map(([k, v]) => (
                          <div key={k} className="flex justify-between items-center border-b border-[#F1EDEA] pb-2">
                            <span className="text-xs font-semibold text-[#6B5E51] uppercase tracking-wider">{k}:</span>
                            <span className="text-xs font-bold text-[#3C2A21] uppercase">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-[#F1EDEA] flex justify-between items-center">
                        <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">Total Score:</span>
                        <span className="text-2xl sm:text-3xl font-bold text-[#3C2A21] italic tracking-tight">{score.score}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}

              {activeProfileTab === 'scores' && (!userData?.profile?.testScores || userData.profile.testScores.length === 0) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                  <p className="text-xs font-semibold uppercase text-[#6B5E51] tracking-wider">No scores added yet.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RECOMMENDED CAROUSEL ── */}
        <div className="bg-white border border-[#F1EDEA] rounded-2xl p-4 sm:p-6 shadow-sm transition-all hover:border-[#C5A059]/20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] shadow-xs">
                <Star size={14} />
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-[#3C2A21] uppercase tracking-wider">Recommended For You</h2>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => scroll('left')} className="p-1.5 rounded-lg hover:bg-[#C5A059]/10 text-[#6B5E51] transition-all"><ChevronLeft size={16} /></button>
              <button onClick={() => scroll('right')} className="p-1.5 rounded-lg hover:bg-[#C5A059]/10 text-[#6B5E51] transition-all"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-end">
              <p className="text-xs font-bold text-[#3C2A21] tracking-wider uppercase">Profile completion</p>
              <p className="text-xs font-bold text-[#C5A059]">{completedSteps}/{totalSteps}</p>
            </div>
            <div className="h-1.5 w-full bg-[#FDFBF7] rounded-full border border-[#F1EDEA] overflow-hidden">
              <motion.div animate={{ width: `${(completedSteps / totalSteps) * 100}%` }} className="h-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleCards.map(card => (
              <motion.div key={card.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-4 flex flex-col items-center text-center gap-3 group/c hover:border-[#C5A059]/30 transition-all shadow-xs">
                <div className="text-3xl">{card.icon}</div>
                <h3 className="font-bold text-xs text-[#3C2A21] uppercase tracking-wider">{card.title}</h3>
                <p className="text-xs text-[#6B5E51] leading-relaxed">{card.description}</p>
                <div className="flex gap-2 w-full mt-1">
                  <button className="flex-1 py-1.5 rounded-lg bg-white border border-[#F1EDEA] text-[#6B5E51] text-xs font-bold uppercase hover:text-[#3C2A21] transition-colors shadow-xs">Skip</button>
                  <button onClick={() => setOpenModal(card.section)} className="flex-1 py-1.5 rounded-lg text-white text-xs font-bold uppercase shadow-sm bg-green-600 hover:bg-green-500 transition-all">Submit</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── EXPANDED SYSTEM NODES ── */}
        <div className="space-y-3.5 pb-16">
          {portfolioSections.map((sec) => (
            <div key={sec.id} className="bg-white border border-[#F1EDEA] rounded-xl overflow-hidden shadow-xs group hover:border-[#C5A059]/30 transition-all">
              <div className="p-3 sm:p-3.5 flex items-center justify-between border-b border-[#F1EDEA] bg-[#FDFBF7]">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shadow-xs">
                    {sec.icon}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#3C2A21] uppercase tracking-wider font-sans group-hover:text-[#C5A059] transition-colors">
                    {sec.label}
                  </h3>
                </div>
                <button
                  onClick={() => { setEditingItem(null); setOpenModal(sec.id); }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#3C2A21] hover:bg-[#C5A059] text-white flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title={`Add ${sec.label}`}
                >
                  <Plus size={16} />
                </button>
              </div>
              {getPortfolioEntries(sec.id).length > 0 ? (
                <div className="p-3 space-y-2.5 bg-[#FDFBF7]/40">
                  {getPortfolioEntries(sec.id).map((item: ProfileEntry) => (
                    <div key={item._id} className="bg-white border border-[#F1EDEA] p-3.5 sm:p-4 rounded-xl relative group/item hover:border-[#C5A059]/30 transition-all duration-200 shadow-xs">
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-100 sm:opacity-0 group-hover/item:opacity-100 transition-all duration-200">
                        <button onClick={() => { setEditingItem({ section: sec.id, data: item }); setOpenModal(sec.id); }} className="p-1.5 rounded-lg bg-[#FDFBF7] border border-[#F1EDEA] text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all shadow-xs cursor-pointer"><Edit2 size={13} /></button>
                        <button onClick={() => deleteItem(sec.id, item._id)} className="p-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xs cursor-pointer"><Trash2 size={13} /></button>
                      </div>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0 border border-[#C5A059]/20 shadow-xs">
                          {sec.id === 'workExperience' && <Briefcase size={16} />}
                          {sec.id === 'projects' && <Star size={16} />}
                          {sec.id === 'research' && <FileText size={16} />}
                          {sec.id === 'volunteering' && <Heart size={16} />}
                          {sec.id === 'achievements' && <Trophy size={16} />}
                        </div>
                        <div className="pr-12 md:pr-14">
                          <h4 className="text-xs sm:text-sm font-bold text-[#3C2A21] uppercase tracking-wider leading-snug">
                            {item.title || item.role || item.organization || item.institution || item.schoolName || item.uniName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-0.5 text-xs font-semibold text-[#3C2A21]/80 uppercase tracking-wider">
                            {(item.year || item.startDate) && (
                              <span className="flex items-center gap-1 bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#F1EDEA]">
                                <Calendar size={11} className="text-[#C5A059]" />
                                {item.year || `${item.startDate ? new Date(item.startDate).getFullYear() : '2024'} - ${item.isOngoing ? 'Present' : (item.endDate ? new Date(item.endDate).getFullYear() : '2025')}`}
                              </span>
                            )}
                            {item.organization && <span className="text-[#3C2A21]/70 font-semibold">• {item.organization}</span>}
                          </div>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-xs text-[#3C2A21] font-medium leading-relaxed italic border-l-2 border-[#C5A059]/40 pl-3 py-0.5 line-clamp-3">
                          &quot;{item.description}&quot;
                        </p>
                      )}
                      {item.documentName && (
                        <div className="mt-2 pt-2 border-t border-[#F1EDEA] flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                          <FileText size={12} /> Document Attached: {item.documentName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 text-center bg-[#FDFBF7]/30">
                  <p className="text-xs font-semibold text-[#3C2A21]/70 uppercase tracking-wider">No entries added yet. Click + to add {sec.label.toLowerCase()}.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      )}

      {mainTab === 'membership' && (
        <div className="max-w-6xl mx-auto px-6 mt-12 space-y-8">
          <div className="flex items-center justify-between border-b border-[#F1EDEA] pb-4 mb-8">
            <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-[#3C2A21]">Membership Center</h2>
            <MembershipStatusChip status={membership?.status || 'expired'} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Current Plan Overview */}
            <div className="md:col-span-2 bg-[#FDFBF7] border border-[#F1EDEA] rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap size={120} />
              </div>
              <div className="relative z-10">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E51] mb-2">Current Plan</p>
                <h3 className="text-3xl font-black text-[#3C2A21] uppercase tracking-tight mb-2">
                  {currentPlan?.name || "Free Explorer"}
                </h3>
                {membership?.currentPeriodEnd && (
                  <p className="text-sm font-bold text-[#6B5E51] mb-8">
                    Renews on {new Date(membership.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
                {!membership?.currentPeriodEnd && (
                  <p className="text-sm font-bold text-[#6B5E51] mb-8">
                    No active subscription
                  </p>
                )}

                <div className="space-y-6 max-w-md">
                  {membership?.entitlements && Object.values(membership.entitlements).filter(e => e.limit).map((usage: any, idx) => (
                    <UsageProgress 
                      key={idx} 
                      featureId={usage.featureId}
                      featureName={usage.featureId.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      used={usage.used || 0}
                      limit={usage.limit || 0}
                    />
                  ))}
                  {(!membership?.entitlements || Object.values(membership.entitlements).filter(e => e.limit).length === 0) && (
                    <div className="p-4 bg-white border border-[#F1EDEA] rounded-xl">
                      <p className="text-[13px] font-bold text-[#6B5E51] text-center uppercase tracking-widest">
                        Usage data unavailable
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-[#F1EDEA] flex gap-4">
                  <MembershipCTA 
                    planId="premium" 
                    buttonText="Upgrade Membership" 
                    source="dashboard" 
                  />
                </div>
              </div>
            </div>

            {/* Account Settings / Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white border border-[#F1EDEA] rounded-3xl p-6 shadow-sm hover:border-[#C5A059]/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                    <History size={20} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-[#3C2A21] uppercase tracking-widest">Billing History</h4>
                    <p className="text-[11px] font-bold text-[#6B5E51] uppercase tracking-widest mt-1">View past invoices</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#F1EDEA] rounded-3xl p-6 shadow-sm hover:border-[#C5A059]/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-[#3C2A21] uppercase tracking-widest">Payment Methods</h4>
                    <p className="text-[11px] font-bold text-[#6B5E51] uppercase tracking-widest mt-1">Manage cards</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#F1EDEA] rounded-3xl p-6 shadow-sm hover:border-[#C5A059]/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 transition-transform">
                    <RefreshCcw size={20} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-[#3C2A21] uppercase tracking-widest">Restore Purchases</h4>
                    <p className="text-[11px] font-bold text-[#6B5E51] uppercase tracking-widest mt-1">Sync mobile access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {mainTab === 'bookings' && (
        <div className="max-w-6xl mx-auto px-6 mt-12 space-y-16">
          
          {/* SERVICE PURCHASES */}
          <div>
            <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-[#3C2A21] mb-8 border-b border-[#F1EDEA] pb-4">Service Purchase History</h2>
            <div className="space-y-6">
              {receipts.map((receipt) => (
                <div key={receipt._id} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-[1.5rem] p-6 group/card hover:border-[#C5A059]/20 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[13px] font-bold font-black text-green-600 uppercase tracking-widest mb-1">Paid • {new Date(receipt.createdAt).toLocaleDateString()}</p>
                      <h4 className="text-[#3C2A21] font-black text-xs uppercase tracking-widest">Order ID: {receipt.orderId}</h4>
                    </div>
                    <p className="text-xl font-black text-red-700 italic">{receipt.currency} {receipt.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    {receipt.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 border-t border-black/5">
                        <div className="w-2 h-2 rounded-full bg-[#C5A059]/40" />
                        <span className="text-[11px] font-bold text-[#3C2A21]">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {receipts.length === 0 && <p className="text-center py-20 text-[14px] font-bold uppercase font-black text-[#6B5E51]/70 tracking-[0.5em]">No service purchases found.</p>}
            </div>
          </div>
        </div>
      )}

      {mainTab === 'sessions' && (() => {
        const now = new Date();
        const allSessions = userData?.profile?.mySessions || [];
        const upcomingSessions = allSessions.filter((session) => new Date(`${session.date}T${session.time || '00:00'}:00`) >= now);
        const pastSessions = allSessions.filter((session) => new Date(`${session.date}T${session.time || '00:00'}:00`) < now);
        const displayedSessions = sessionFilter === 'upcoming' ? upcomingSessions : pastSessions;

        return (
        <div className="max-w-6xl mx-auto px-6 mt-12 space-y-6">
          <div className="flex items-center justify-between mb-8 border-b border-[#F1EDEA] pb-4">
            <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-[#3C2A21]">My Sessions</h2>
            <div className="flex gap-2">
              <button onClick={() => setSessionFilter('upcoming')} className={`px-4 py-1.5 rounded-lg text-[13px] font-bold font-black uppercase tracking-widest transition-all ${sessionFilter === 'upcoming' ? 'bg-[#C5A059] text-white shadow-md' : 'bg-[#FDFBF7] text-[#6B5E51] border border-[#F1EDEA] hover:bg-[#F1EDEA]'}`}>Upcoming</button>
              <button onClick={() => setSessionFilter('past')} className={`px-4 py-1.5 rounded-lg text-[13px] font-bold font-black uppercase tracking-widest transition-all ${sessionFilter === 'past' ? 'bg-[#C5A059] text-white shadow-md' : 'bg-[#FDFBF7] text-[#6B5E51] border border-[#F1EDEA] hover:bg-[#F1EDEA]'}`}>Past</button>
            </div>
          </div>
          {displayedSessions.map((s) => (
            <div key={s._id} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-4 shadow-sm hover:border-[#C5A059]/30 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                   <h4 className="text-[#3C2A21] font-black text-xs uppercase tracking-widest leading-none">{s.consultantName === 'Admin' ? 'Counselling Session' : (s.consultantName || "Counselling Session")}</h4>
                   <span className="text-[12px] font-black font-bold bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5 rounded border border-[#C5A059]/20 uppercase">{sessionFilter === 'past' ? 'COMPLETED' : (s.status || "CONFIRMED")}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#3C2A21]">{new Date(s.date).toLocaleDateString()}</span>
                      <span className="text-xs font-black text-[#C5A059] uppercase tracking-tighter">@{s.time}</span>
                    </div>
                    <div className="flex items-center gap-2 border-l border-[#F1EDEA] pl-6">
                       <span className="text-[13px] font-bold font-black text-[#6B5E51]/70 uppercase tracking-widest">Meeting ID:</span>
                       <code className="text-xs font-mono font-bold text-[#3C2A21] tracking-wider">{s.meetingId}</code>
                    </div>
                </div>
              </div>
              {sessionFilter === 'upcoming' && (
                <button 
                  onClick={() => router.push(`/meeting/${s.sessionId || s._id}`)} 
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-[14px] font-bold font-black uppercase tracking-widest shadow-lg shadow-green-600/10 transition-all active:scale-95 shrink-0 text-center"
                >
                  Join Meeting
                </button>
              )}
            </div>
          ))}
          {displayedSessions.length === 0 && <p className="text-center py-20 text-[14px] font-bold uppercase font-black text-[#6B5E51]/70 tracking-[0.5em]">No {sessionFilter} sessions found.</p>}
        </div>
        );
      })()}

      <AnimatePresence>
        {openModal === "highSchool" && <HighSchoolModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (data: unknown) => { await addProfileItem("highSchool", data); }} initialData={editingItem?.data} />}
        {openModal === "underGrad" && <UnderGradModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (data: unknown) => { await addProfileItem("underGrad", data); }} initialData={editingItem?.data} />}
        {openModal === "masters" && <MastersModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (data: unknown) => { await addProfileItem("masters", data); }} initialData={editingItem?.data} />}
        {openModal === "workExperience" && <WorkExpModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (data: unknown) => { await addProfileItem("workExperience", data); }} initialData={editingItem?.data} />}
        {openModal === "research" && <ResearchModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (data: unknown) => { await addProfileItem("research", data); }} initialData={editingItem?.data} />}
        {openModal === "projects" && <ProjectFormModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (data: unknown) => { await addProfileItem("projects", data); }} initialData={editingItem?.data} />}
        {openModal === "volunteering" && <AddVolunteer isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (data: unknown) => { await addProfileItem("volunteering", data); }} initialData={editingItem?.data} />}
        {openModal === "targetUniversities" && <TargetUniversityModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (data: unknown) => { await addProfileItem("targetUniversities", data); }} initialData={editingItem?.data} />}
        {openModal === "testScores" && <TestScoresModal isOpen={true} onClose={() => { setOpenModal(null); }} onSubmit={async (data: unknown) => { await addProfileItem("testScores", data); }} />}
        {openModal === "bio" && <BioModal isOpen={true} onClose={() => { setOpenModal(null); }} onSubmit={async (data: unknown) => { await updateCoreProfile("bio", data); }} initialValue={userData?.profile?.bio} />}
        {openModal === "linkedin" && <LinkedInModal isOpen={true} onClose={() => { setOpenModal(null); }} onSubmit={async (data: unknown) => { await updateCoreProfile("linkedin", data); }} initialData={userData?.profile?.linkedin} />}
        {openModal === "achievements" && <AchievementsModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (data: unknown) => { await addProfileItem("achievements", data); }} initialData={editingItem?.data} />}
        {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>
      <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; }.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }`}</style>
    </main>
  );
}

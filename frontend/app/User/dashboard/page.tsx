'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUser, clearAuth, setUser } from "@/app/lib/token";
import { HighSchoolModal, SuccessModal } from "./profile/HighSchool";
import { UnderGradModal } from "./profile/UnderGrad";
import { MastersModal } from "./profile/Masters";
import { TargetUniversityModal } from "./profile/TargetUniversity";
import TestScores from "./profile/TestScores";
import { TestScoresModal } from "./profile/TestScores";
import WorkExpModal from "./profile/WorkExp";
import ResearchModal from "./profile/research";
import { AnimatePresence, motion } from "framer-motion";
import ProjectFormModal from "./profile/Add-Projects";
import AddVolunteer from "./profile/Volunteering";
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
  Share2,
  GraduationCap,
  Star,
  Trash2,
  Trophy,
  MessageCircle,
  School,
  ClipboardList,
  Target
} from "lucide-react";

interface ProfileCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  section: string;
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
  const [userData, setUserData] = useState<any>(null);
  const [cards, setCards] = useState<ProfileCard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState('about');
  const [mainTab, setMainTab] = useState<'profile' | 'bookings' | 'sessions'>('profile');
  const [sessionFilter, setSessionFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<{ section: string; data: any } | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const [receipts, setReceipts] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    const token = getToken();
    if (!token) {
      clearAuth();
      router.push("/auth/login");
      return;
    }
    fetchProfile();
    fetchReceipts();
  }, []);

  const getUserId = () => {
    const u = getUser();
    return u?._id || u?.id || null;
  };

  const fetchProfile = async () => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/profile/${userId}`);
      if (response.ok) {
        const data = await response.json();
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
  };

  const fetchReceipts = async () => {
    const user = getUser();
    if (!user?.email) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/payment/user/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setReceipts(data);
      }
    } catch (error) {
      console.error("Error fetching receipts:", error);
    }
  };

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

  const addProfileItem = async (section: string, data: any) => {
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
    } catch (error: any) {
      console.error("❌ Update failed:", error);
      throw error;
    }
  };

  const updateCoreProfile = async (field: string, value: any, silent = false) => {
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

  const filteredCards = cards.filter(card => {
    if (!userData || !userData.profile) return true;
    const sectionData = userData.profile[card.section];
    if (card.section === 'bio') return !userData.profile.bio || userData.profile.bio.length < 10;
    return !sectionData || sectionData.length === 0;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left') setCurrentIndex(prev => Math.max(0, prev - 1));
    else setCurrentIndex(prev => Math.min(filteredCards.length - 3, prev + 1));
  };

  const completedSteps = [
    userData?.profile?.highSchool?.length > 0,
    userData?.profile?.underGrad?.length > 0,
    userData?.profile?.masters?.length > 0,
    userData?.profile?.testScores?.length > 0,
    userData?.profile?.workExperience?.length > 0,
    userData?.profile?.research?.length > 0,
    userData?.profile?.projects?.length > 0,
    userData?.profile?.volunteering?.length > 0,
    userData?.profile?.targetUniversities?.length > 0,
    userData?.profile?.bio?.length > 10
  ].filter(Boolean).length;

  const totalSteps = 9;
  const visibleCards = filteredCards.slice(currentIndex, currentIndex + 3);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#3C2A21] pb-32 font-base selection:bg-[#C5A059]/20">

      {/* ── PREMIUM HEADER ── */}
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 border-b border-[#F1EDEA]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-[#C5A059]/20 to-transparent border border-[#F1EDEA] p-1 shadow-sm">
                <div className="w-full h-full rounded-[2.3rem] bg-white overflow-hidden relative">
                  {savingImage ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
                      <div className="w-6 h-6 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : null}
                  <img
                    src={userData?.profile?.profileImage ? (
                      userData.profile.profileImage.startsWith('http') ? userData.profile.profileImage :
                        userData.profile.profileImage.startsWith('data:image') ? userData.profile.profileImage :
                          userData.profile.profileImage.startsWith('//') ? `https:${userData.profile.profileImage}` :
                            `${BACKEND_URL}${userData.profile.profileImage.startsWith('/') ? '' : '/'}${userData.profile.profileImage.replace(/\\/g, '/')}`
                    ) : `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=c2a878&color=000&bold=true`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-[#C5A059] rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-[#FDFBF7] group-hover:scale-110 transition-all">
                <Camera size={16} />
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

            <div className="flex flex-col gap-3 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-3xl font-bold text-[#3C2A21] uppercase tracking-widest font-serif italic">{userData?.name || "Student Member"}</h1>

                <div className="flex items-center gap-3">
                  <span className={`text-[14px] font-bold font-black uppercase tracking-wider transition-colors ${userData?.profile?.isPublic ? 'text-green-600' : 'text-[#6B5E51]'}`}>
                    {userData?.profile?.isPublic ? "Public" : "Private"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      updateCoreProfile("isPublic", !userData?.profile?.isPublic, true);
                    }}
                    className={`relative w-11 h-6 rounded-full transition-all duration-500 flex items-center px-1 border cursor-pointer z-10 ${userData?.profile?.isPublic ? 'bg-green-500/20 border-green-500/30' : 'bg-[#6B5E51]/10 border-[#F1EDEA]'}`}
                  >
                    <motion.div
                      animate={{ x: userData?.profile?.isPublic ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`w-4 h-4 rounded-full shadow-lg pointer-events-none ${userData?.profile?.isPublic ? 'bg-green-500' : 'bg-[#6B5E51]'}`}
                    />
                  </button>
                </div>
              </div>
              {userData?.profile?.bio && (
                <p className="text-[14px] font-bold font-black uppercase text-[#6B5E51] max-w-md tracking-widest leading-relaxed mb-2 italic">
                  "{userData.profile.bio}"
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-8">
                <div className="flex items-center gap-2.5 text-[#6B5E51]">
                  <MapPin size={16} className="text-[#C5A059]" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{userData?.profile?.location || userData?.country || "Global Citizen"}</span>
                </div>
                <button
                  onClick={() => userData?.profile?.linkedin ? window.open(userData.profile.linkedin.startsWith('http') ? userData.profile.linkedin : `https://${userData.profile.linkedin}`, '_blank') : setOpenModal('linkedin')}
                  className="flex items-center gap-2.5 text-[#6B5E51] hover:text-[#C5A059] transition-all group"
                >
                  <LinkIcon size={16} className="text-[#C5A059] group-hover:rotate-12 transition-transform" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{userData?.profile?.linkedin ? "View LinkedIn" : "Add LinkedIn"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setOpenModal("bio")}
              className="h-14 px-8 bg-white border border-[#F1EDEA] rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-[#FDFBF7] hover:border-[#C5A059]/30 transition-all flex items-center gap-3 active:scale-95 group shadow-sm"
            >
              <Plus size={18} className="text-[#C5A059] group-hover:rotate-90 transition-transform duration-500" />
              {userData?.profile?.bio ? "Update Bio" : "Add Short Bio"}
            </button>
            <button
              onClick={() => router.push('/User/edit-profile')}
              className="h-14 px-10 bg-[#C5A059] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-[#3C2A21] transition-all shadow-lg active:scale-95 flex items-center gap-4"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN TABS ── */}
      <div className="max-w-6xl mx-auto px-6 mt-8 flex flex-wrap gap-4 border-b border-[#F1EDEA] pb-4">
        {['profile', 'bookings', 'sessions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setMainTab(tab as any)}
            className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${mainTab === tab ? 'bg-[#3C2A21] text-[#C5A059] shadow-lg' : 'bg-white border border-[#F1EDEA] text-[#6B5E51] hover:bg-[#FDFBF7]'}`}
          >
            {tab === 'profile' ? 'Profile' : tab === 'bookings' ? 'My Bookings' : 'My Sessions'}
          </button>
        ))}
      </div>

      {mainTab === 'profile' && (
      <div className="max-w-6xl mx-auto px-6 mt-12 space-y-12">
        {/* ── IDENTITY MODULE ── */}
        <div className="bg-white border border-[#F1EDEA] rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col md:flex-row h-auto transition-all hover:border-[#C5A059]/20">
          <div className="w-full md:w-56 bg-[#FDFBF7] border-b md:border-b-0 md:border-r border-[#F1EDEA] p-4 md:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'about', label: 'About', hasData: true },
              { id: 'highSchool', label: 'High School', hasData: userData?.profile?.highSchool?.length > 0 },
              { id: 'undergrad', label: "Bachelor's", hasData: userData?.profile?.underGrad?.length > 0 },
              { id: 'masters', label: "Master's", hasData: userData?.profile?.masters?.length > 0 },
              { id: 'target', label: 'Target', hasData: userData?.profile?.targetUniversities?.length > 0 },
              ...((userData?.profile?.testScores || []).map((score: any) => ({
                id: `score-${score.testType.toLowerCase()}`,
                label: score.testType.toUpperCase(),
                hasData: true
              })))
            ].filter(tab => (tab as any).hasData).map(tab => (
              <button key={tab.id} onClick={() => setActiveProfileTab(tab.id)} className={`whitespace-nowrap md:whitespace-normal px-6 py-3 md:py-4 rounded-2xl text-[14px] font-bold font-black uppercase tracking-[0.25em] transition-all text-left ${activeProfileTab === tab.id ? 'bg-[#C5A059] text-white shadow-md' : 'text-[#6B5E51] hover:bg-white'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 md:p-12 bg-white">
            <AnimatePresence mode="wait">
              {activeProfileTab === 'about' && (
                <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-y-12">
                  <div className="flex items-center gap-6"><div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border border-[#F1EDEA] flex items-center justify-center text-[#6B5E51] shadow-inner"><User size={18} /></div><div><p className="text-[13px] font-bold text-[#6B5E51] font-black uppercase tracking-[0.3em] mb-1">Full Name</p><h3 className="text-sm font-black text-[#3C2A21] uppercase tracking-tight">{userData?.name || "Member"}</h3></div></div>
                  <div className="flex items-center gap-6"><div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border border-[#F1EDEA] flex items-center justify-center text-[#6B5E51] shadow-inner"><span className="text-xl">♀</span></div><div><p className="text-[13px] font-bold text-[#6B5E51] font-black uppercase tracking-[0.3em] mb-1">Gender</p><h3 className="text-sm font-black text-[#3C2A21] uppercase tracking-tight">{userData?.gender || "Female"}</h3></div></div>
                  <div className="flex items-center gap-6"><div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border border-[#F1EDEA] flex items-center justify-center text-[#6B5E51] shadow-inner"><MapPin size={18} /></div><div><p className="text-[13px] font-bold text-[#6B5E51] font-black uppercase tracking-[0.3em] mb-1">Location</p><h3 className="text-sm font-black text-[#3C2A21] uppercase tracking-tight">{userData?.country || userData?.profile?.location || "India"}</h3></div></div>
                  <div className="flex items-center gap-6"><div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border border-[#F1EDEA] flex items-center justify-center text-[#6B5E51] shadow-inner"><Calendar size={18} /></div><div><p className="text-[13px] font-bold text-[#6B5E51] font-black uppercase tracking-[0.3em] mb-1">Birth Date</p><h3 className="text-sm font-black text-[#3C2A21] uppercase tracking-tight">{userData?.dob || "Sep 03, 2005"}</h3></div></div>
                </motion.div>
              )}
              {activeProfileTab === 'highSchool' && (
                <motion.div key="hs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E51] mb-8 border-b border-[#F1EDEA] pb-4">Education History</h2>
                  {userData?.profile?.highSchool?.map((hs: any, idx: number) => (
                    <div key={idx} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-[1.5rem] p-6 flex justify-between items-center group/card hover:border-[#C5A059]/20 transition-all shadow-sm">
                      <div className="flex items-center gap-5"><div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]"><School size={20} /></div><div><h4 className="text-[#3C2A21] font-black text-xs uppercase tracking-widest">{hs.schoolName}</h4><p className="text-[13px] font-bold text-[#6B5E51] font-bold uppercase tracking-widest mt-1">School Details</p></div></div>
                      <div className="text-right"><p className="text-2xl font-black text-[#3C2A21] italic">{hs.cgpa}<span className="text-sm text-[#6B5E51]"> / {hs.outOf}</span></p></div>
                    </div>
                  ))}
                  {(!userData?.profile?.highSchool || userData.profile.highSchool.length === 0) && <p className="text-center py-20 text-[14px] font-bold uppercase font-black text-[#6B5E51]/70 tracking-[0.5em]">No education records found.</p>}
                </motion.div>
              )}
              {activeProfileTab === 'undergrad' && (
                <motion.div key="ug" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E51] mb-8 border-b border-[#F1EDEA] pb-4">Bachelor's Credentials</h2>
                  {userData?.profile?.underGrad?.map((ug: any, idx: number) => (
                    <div key={idx} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-[1.5rem] p-6 flex justify-between items-center hover:border-[#C5A059]/20 transition-all shadow-sm">
                      <div className="flex items-center gap-5"><div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]"><GraduationCap size={20} /></div><div><h4 className="text-[#3C2A21] font-black text-xs uppercase tracking-widest">{ug.uniName}</h4><p className="text-[13px] font-bold text-[#6B5E51] font-bold uppercase tracking-widest mt-1">{ug.degreeName || "Undergraduate Degree"}</p></div></div>
                      <div className="text-right"><p className="text-2xl font-black text-[#3C2A21] italic">{ug.cgpa}<span className="text-sm text-[#6B5E51]"> / {ug.outOf}</span></p></div>
                    </div>
                  ))}
                  {(!userData?.profile?.underGrad || userData.profile.underGrad.length === 0) && <p className="text-center py-20 text-[14px] font-bold uppercase font-black text-[#6B5E51]/70 tracking-[0.5em]">No Degree protocols detected.</p>}
                </motion.div>
              )}
              {activeProfileTab === 'masters' && (
                <motion.div key="ms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E51] mb-8 border-b border-[#F1EDEA] pb-4">Postgraduate Credentials</h2>
                  {userData?.profile?.masters?.map((ms: any, idx: number) => (
                    <div key={idx} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-[1.5rem] p-6 flex justify-between items-center hover:border-[#C5A059]/20 transition-all shadow-sm">
                      <div className="flex items-center gap-5"><div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]"><Trophy size={20} /></div><div><h4 className="text-[#3C2A21] font-black text-xs uppercase tracking-widest">{ms.uniName}</h4><p className="text-[13px] font-bold text-[#6B5E51] font-bold uppercase tracking-widest mt-1">{ms.degreeName || "Master's Degree"}</p></div></div>
                      <div className="text-right"><p className="text-2xl font-black text-[#3C2A21] italic">{ms.cgpa}<span className="text-sm text-[#6B5E51]"> / {ms.outOf}</span></p></div>
                    </div>
                  ))}
                  {(!userData?.profile?.masters || userData.profile.masters.length === 0) && <p className="text-center py-20 text-[14px] font-bold uppercase font-black text-[#6B5E51]/70 tracking-[0.5em]">No Masters degree added.</p>}
                </motion.div>
              )}
              {activeProfileTab === 'target' && (
                <motion.div key="target" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#6B5E51] mb-8 border-b border-[#F1EDEA] pb-4">Global Strategy</h2>
                  {userData?.profile?.targetUniversities?.map((uni: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-[#FDFBF7] border border-[#F1EDEA] hover:border-[#C5A059]/20 transition-all shadow-sm"><div className="flex items-center gap-6"><div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-black text-xs"><Target size={20} /></div><div><p className="text-[#3C2A21] font-black text-[12px] uppercase tracking-widest">{uni.uniName}</p><p className="text-[13px] font-bold text-[#6B5E51] font-bold uppercase tracking-widest">{uni.major} • {uni.term} {uni.year}</p></div></div></div>
                  ))}
                  {(!userData?.profile?.targetUniversities || userData.profile.targetUniversities.length === 0) && <p className="text-center py-20 text-[14px] font-bold uppercase font-black text-[#6B5E51]/70 tracking-[0.5em]">No target vectors locked.</p>}
                </motion.div>
              )}

              {(userData?.profile?.testScores || []).map((score: any) => (
                activeProfileTab === `score-${score.testType.toLowerCase()}` && (
                  <motion.div key={score.testType} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div className="relative group/score">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] flex items-center justify-center text-[#6B5E51] group-hover/score:text-[#C5A059] transition-colors shadow-inner">
                          <Trophy size={20} />
                        </div>
                        <h3 className="text-[12px] font-black text-[#3C2A21] uppercase tracking-[0.2em]">{score.testType} Results</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
                        {score.sectionScores && Object.entries(score.sectionScores).map(([k, v]: any) => (
                          <div key={k} className="flex justify-between items-center border-b border-[#F1EDEA] pb-4">
                            <span className="text-[11px] font-black text-[#6B5E51] uppercase tracking-widest">{k}:</span>
                            <span className="text-[11px] font-black text-[#3C2A21] uppercase">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-12 pt-8 border-t border-[#F1EDEA] flex justify-between items-center">
                        <div className="relative pb-2">
                          <span className="text-[13px] font-black text-[#C5A059] uppercase tracking-[0.3em]">Total Score:</span>
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059]/50 rounded-full" />
                        </div>
                        <span className="text-4xl font-black text-[#3C2A21] italic tracking-tighter tabular-nums drop-shadow-2xl">{score.score}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              ))}

              {activeProfileTab === 'scores' && (!userData?.profile?.testScores || userData.profile.testScores.length === 0) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 pb-12">
                  <p className="text-[14px] font-bold uppercase font-black text-[#6B5E51]/70 tracking-widest">No scores added yet.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RECOMMENDED CAROUSEL ── */}
        <div className="bg-white border border-[#F1EDEA] rounded-[1.25rem] p-5 md:p-8 shadow-sm transition-all hover:border-[#C5A059]/20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center text-[#C5A059] shadow-sm"><Star size={16} /></div><h2 className="text-md font-black text-[#6B5E51] italic tracking-wide lowercase">Recommended for you</h2></div>
            <div className="flex gap-2"><button onClick={() => scroll('left')} className="p-2 rounded-full hover:bg-[#C5A059]/10 text-[#6B5E51] transition-all"><ChevronLeft size={16} /></button><button onClick={() => scroll('right')} className="p-2 rounded-full hover:bg-[#C5A059]/10 text-[#6B5E51] transition-all"><ChevronRight size={16} /></button></div>
          </div>
          <div className="space-y-4 mb-10"><div className="flex justify-between items-end"><p className="text-[12px] font-black text-[#3C2A21] tracking-widest uppercase">Profile strength</p><p className="text-[14px] font-bold font-black text-[#C5A059]">{completedSteps}/{totalSteps}</p></div><div className="h-1 w-full bg-[#FDFBF7] rounded-full border border-[#F1EDEA] overflow-hidden"><motion.div animate={{ width: `${(completedSteps / totalSteps) * 100}%` }} className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" /></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleCards.map(card => (
              <motion.div key={card.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-[1.5rem] p-4 md:p-6 flex flex-col items-center text-center gap-3 md:gap-5 group/c hover:border-[#C5A059]/20 transition-all shadow-sm">
                <div className="text-4xl">{card.icon}</div><h3 className="font-black text-[13px] text-[#3C2A21] uppercase tracking-[0.2em]">{card.title}</h3><p className="text-[14px] font-bold text-[#6B5E51] font-bold leading-relaxed">{card.description}</p>
                <div className="flex gap-3 w-full mt-2"><button className="flex-1 py-1.5 rounded-xl bg-white border border-[#F1EDEA] text-[#6B5E51] text-[13px] font-bold font-black uppercase hover:text-[#3C2A21] transition-colors shadow-sm">Skip</button><button onClick={() => setOpenModal(card.section)} className="flex-1 py-1.5 rounded-xl text-white text-[13px] font-bold font-black uppercase shadow-lg bg-green-600 hover:bg-green-500 transition-all">Submit</button></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── EXPANDED SYSTEM NODES ── */}
        <div className="space-y-4 pb-20">
          {[{ id: 'workExperience', label: "Work Experience", icon: <Briefcase size={18} /> }, { id: 'projects', label: "Projects", icon: <Star size={18} /> }, { id: 'research', label: "Research Papers", icon: <FileText size={18} /> }, { id: 'volunteering', label: "Volunteering", icon: <Heart size={18} /> }].map((sec) => (
            <div key={sec.id} className="bg-white border border-[#F1EDEA] rounded-2xl overflow-hidden shadow-sm group">
              <div className="p-4 flex items-center justify-between border-b border-[#F1EDEA] bg-[#FDFBF7]">
                <div className="flex items-center gap-4"><div className="text-[#6B5E51] group-hover:text-[#C5A059] transition-colors uppercase font-black text-[13px] font-bold tracking-widest">{sec.icon}</div><h3 className="text-[11px] font-black text-[#6B5E51]/60 uppercase tracking-[0.2em]">{sec.label}</h3></div>
                <button onClick={() => { setEditingItem(null); setOpenModal(sec.id); }} className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all cursor-pointer"><Plus size={18} /></button>
              </div>
              {userData?.profile?.[sec.id]?.length > 0 && (
                <div className="p-3 space-y-3 no-scrollbar bg-[#FDFBF7]/50">
                  {userData.profile[sec.id].map((item: any) => (
                    <div key={item._id} className="bg-white border border-[#F1EDEA] p-4 md:p-6 rounded-2xl relative group/item hover:border-[#C5A059]/40 transition-all duration-500 shadow-sm hover:shadow-md">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                        <button onClick={() => { setEditingItem({ section: sec.id, data: item }); setOpenModal(sec.id); }} className="p-2.5 rounded-xl bg-[#FDFBF7] border border-[#F1EDEA] text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all shadow-sm cursor-pointer"><Edit2 size={14} /></button>
                        <button onClick={() => deleteItem(sec.id, item._id)} className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shrink-0 border border-[#C5A059]/20 shadow-inner">
                          {sec.id === 'workExperience' && <Briefcase size={sec.id === 'workExperience' ? 20 : 18} />}
                          {sec.id === 'projects' && <Star size={20} />}
                          {sec.id === 'research' && <FileText size={20} />}
                          {sec.id === 'volunteering' && <Heart size={20} />}
                        </div>
                        <div className="pr-12 md:pr-16">
                          <h4 className="text-xs md:text-sm font-black text-[#3C2A21] uppercase tracking-widest leading-tight">{item.role || item.title || item.organization || item.institution}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[13px] font-bold text-[#6B5E51] font-black uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-2 py-0.5 rounded-md border border-[#F1EDEA]"><Calendar size={10} className="text-[#C5A059]" /> {item.startDate ? new Date(item.startDate).getFullYear() : '2024'} - {item.isOngoing ? "Present" : (item.endDate ? new Date(item.endDate).getFullYear() : '2025')}</span>
                            {item.organization && <span className="opacity-60">• {item.organization}</span>}
                          </div>
                        </div>
                      </div>
                      <p className="text-[14px] font-bold md:text-[11px] text-[#6B5E51] font-bold leading-relaxed italic border-l-2 border-[#C5A059]/20 pl-4 py-1 line-clamp-3">"{item.description || "Incorporate narrative details to highlight your impact..."}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      )}

      {mainTab === 'bookings' && (
        <div className="max-w-6xl mx-auto px-6 mt-12 space-y-16">
          
          {/* SERVICE PURCHASES */}
          <div>
            <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-[#3C2A21] mb-8 border-b border-[#F1EDEA] pb-4">Service Purchase History</h2>
            <div className="space-y-6">
              {receipts.map((receipt: any) => (
                <div key={receipt._id} className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-[1.5rem] p-6 group/card hover:border-[#C5A059]/20 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[13px] font-bold font-black text-green-600 uppercase tracking-widest mb-1">Paid • {new Date(receipt.createdAt).toLocaleDateString()}</p>
                      <h4 className="text-[#3C2A21] font-black text-xs uppercase tracking-widest">Order ID: {receipt.orderId}</h4>
                    </div>
                    <p className="text-xl font-black text-red-700 italic">{receipt.currency} {receipt.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    {receipt.items.map((item: any, idx: number) => (
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
        const upcomingSessions = allSessions.filter((s:any) => new Date(`${s.date}T${s.time || '00:00'}:00`) >= now);
        const pastSessions = allSessions.filter((s:any) => new Date(`${s.date}T${s.time || '00:00'}:00`) < now);
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
          {displayedSessions.map((s: any) => (
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
        {openModal === "highSchool" && <HighSchoolModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (d: any) => { await addProfileItem("highSchool", d); }} initialData={editingItem?.data} />}
        {openModal === "underGrad" && <UnderGradModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (d: any) => { await addProfileItem("underGrad", d); }} initialData={editingItem?.data} />}
        {openModal === "masters" && <MastersModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (d: any) => { await addProfileItem("masters", d); }} initialData={editingItem?.data} />}
        {openModal === "workExperience" && <WorkExpModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (d: any) => { await addProfileItem("workExperience", d); }} initialData={editingItem?.data} />}
        {openModal === "research" && <ResearchModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (d: any) => { await addProfileItem("research", d); }} initialData={editingItem?.data} />}
        {openModal === "projects" && <ProjectFormModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (d: any) => { await addProfileItem("projects", d); }} initialData={editingItem?.data} />}
        {openModal === "volunteering" && <AddVolunteer isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (d: any) => { await addProfileItem("volunteering", d); }} initialData={editingItem?.data} />}
        {openModal === "targetUniversities" && <TargetUniversityModal isOpen={true} onClose={() => { setOpenModal(null); setEditingItem(null); }} onSubmit={async (d: any) => { await addProfileItem("targetUniversities", d); }} initialData={editingItem?.data} />}
        {openModal === "testScores" && <TestScoresModal isOpen={true} onClose={() => { setOpenModal(null); }} onSubmit={async (data: any) => { await addProfileItem("testScores", data); }} />}
        {openModal === "bio" && <BioModal isOpen={true} onClose={() => { setOpenModal(null); }} onSubmit={async (d: any) => { await updateCoreProfile("bio", d); }} initialValue={userData?.profile?.bio} />}
        {openModal === "linkedin" && <LinkedInModal isOpen={true} onClose={() => { setOpenModal(null); }} onSubmit={async (d: any) => { await updateCoreProfile("linkedin", d); }} initialData={userData?.profile?.linkedin} />}
        {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>
      <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; }.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }`}</style>
    </main>
  );
}
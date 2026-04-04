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
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<{ section: string; data: any } | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    const token = getToken();
    if (!token) {
      clearAuth(); // Explicitly clear any partial/corrupt data
      router.push("/auth/login");
      return;
    }
    fetchProfile();
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
        
        // Update local storage so navbar updates immediately
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
        throw new Error(err.message || "Failed to save information");
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

  const totalSteps = 10;
  const visibleCards = filteredCards.slice(currentIndex, currentIndex + 3);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-dark-950 text-white pb-32 font-base selection:bg-gold-500/20">
      
      {/* ── PREMIUM HEADER ── */}
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 border-b border-white/5">
           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                 <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-gold-500/20 to-transparent border border-white/10 p-1">
                    <div className="w-full h-full rounded-[2.3rem] bg-dark-900 overflow-hidden relative">
                       {savingImage ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                             <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                       ) : null}
                       <img 
                          src={userData?.profile?.profileImage ? (
                             userData.profile.profileImage.startsWith('http') ? userData.profile.profileImage : 
                             userData.profile.profileImage.startsWith('data:image') ? userData.profile.profileImage :
                             userData.profile.profileImage.startsWith('//') ? `https:${userData.profile.profileImage}` :
                             `${BACKEND_URL}${userData.profile.profileImage.startsWith('/') ? '' : '/'}${userData.profile.profileImage.replace(/\\/g, '/')}`
                          ) : `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=c2a878&color=000&bold=true`} 
                          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                          alt="Profile"
                       />
                    </div>
                 </div>
                 <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-gold-500 rounded-2xl flex items-center justify-center text-black shadow-lg border-4 border-dark-950 group-hover:scale-110 transition-all">
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
                    <h1 className="text-3xl font-black text-white uppercase tracking-widest font-serif italic">{userData?.name || "Student Member"}</h1>
                    
                    {/* VISIBILITY TOGGLE - PREMIUM SWITCH */}
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${userData?.profile?.isPublic ? 'text-green-500' : 'text-gray-600'}`}>
                            {userData?.profile?.isPublic ? "Public" : "Private"}
                        </span>
                        <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                updateCoreProfile("isPublic", !userData?.profile?.isPublic, true);
                            }}
                            className={`relative w-11 h-6 rounded-full transition-all duration-500 flex items-center px-1 border cursor-pointer z-10 ${userData?.profile?.isPublic ? 'bg-green-500/20 border-green-500/30' : 'bg-white/5 border-white/10'}`}
                        >
                            <motion.div 
                                animate={{ x: userData?.profile?.isPublic ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className={`w-4 h-4 rounded-full shadow-lg pointer-events-none ${userData?.profile?.isPublic ? 'bg-green-500' : 'bg-gray-600'}`}
                            />
                        </button>
                    </div>
                 </div>
                 {userData?.profile?.bio && (
                    <p className="text-[10px] font-black uppercase text-gray-500 max-w-md tracking-widest leading-relaxed mb-2 italic">
                       "{userData.profile.bio}"
                    </p>
                 )}
                 <div className="flex flex-wrap justify-center md:justify-start items-center gap-8">
                    <div className="flex items-center gap-2.5 text-gray-500">
                       <MapPin size={16} className="text-gold-500/60" />
                       <span className="text-[11px] font-black uppercase tracking-[0.2em]">{userData?.profile?.location || userData?.country || "Global Citizen"}</span>
                    </div>
                     <button 
                        onClick={() => userData?.profile?.linkedin ? window.open(userData.profile.linkedin.startsWith('http') ? userData.profile.linkedin : `https://${userData.profile.linkedin}`, '_blank') : setOpenModal('linkedin')} 
                        className="flex items-center gap-2.5 text-gray-400 hover:text-gold-500 transition-all group"
                     >
                        <LinkIcon size={16} className="text-gold-500/60 group-hover:rotate-12 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{userData?.profile?.linkedin ? "View LinkedIn" : "Add LinkedIn"}</span>
                     </button>
                 </div>
              </div>
           </div>

           <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setOpenModal("bio")}
                className="h-14 px-8 bg-white/5 border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-white/10 hover:border-gold-500/30 transition-all flex items-center gap-3 active:scale-95 group"
              >
                <Plus size={18} className="text-gold-500 group-hover:rotate-90 transition-transform duration-500" />
                {userData?.profile?.bio ? "Update Bio" : "Add Short Bio"}
              </button>
              <button 
                onClick={() => router.push('/User/edit-profile')} 
                className="h-14 px-10 bg-gold-500 text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-gold-400 transition-all shadow-[0_20px_40px_rgba(194,168,120,0.3)] active:scale-95 flex items-center gap-4"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 space-y-12">
        {/* ── IDENTITY MODULE ── */}
        <div className="bg-dark-900 border border-white/10 rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row h-auto transition-all hover:border-gold-500/20">
           <div className="w-full md:w-56 bg-white/[0.02] border-r border-white/5 p-6 flex flex-col gap-2">
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
                 <button key={tab.id} onClick={() => setActiveProfileTab(tab.id)} className={`w-full px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all text-left ${activeProfileTab === tab.id ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20 shadow-lg' : 'text-gray-600 hover:text-white'}`}>
                   {tab.label}
                 </button>
               ))}
            </div>
            
            <div className="flex-1 p-12 bg-dark-900/50">
               <AnimatePresence mode="wait">
                  {activeProfileTab === 'about' && (
                     <motion.div key="about" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-y-12">
                       <div className="flex items-center gap-6"><div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400"><User size={18} /></div><div><p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mb-1">Full Name</p><h3 className="text-sm font-black text-white uppercase tracking-tight">{userData?.name || "Member"}</h3></div></div>
                       <div className="flex items-center gap-6"><div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400"><span className="text-xl">♀</span></div><div><p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mb-1">Gender</p><h3 className="text-sm font-black text-white uppercase tracking-tight">{userData?.gender || "Female"}</h3></div></div>
                       <div className="flex items-center gap-6"><div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400"><MapPin size={18} /></div><div><p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mb-1">Location</p><h3 className="text-sm font-black text-white uppercase tracking-tight">{userData?.country || userData?.profile?.location || "India"}</h3></div></div>
                       <div className="flex items-center gap-6"><div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400"><Calendar size={18} /></div><div><p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mb-1">Birth Date</p><h3 className="text-sm font-black text-white uppercase tracking-tight">{userData?.dob || "Sep 03, 2005"}</h3></div></div>
                    </motion.div>
                 )}
                 {activeProfileTab === 'highSchool' && (
                    <motion.div key="hs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                       <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8 border-b border-white/5 pb-4">Education History</h2>
                       {userData?.profile?.highSchool?.map((hs: any, idx: number) => (
                           <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-6 flex justify-between items-center group/card hover:border-gold-500/20 transition-all">
                              <div className="flex items-center gap-5"><div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500"><School size={20} /></div><div><h4 className="text-white font-black text-xs uppercase tracking-widest">{hs.schoolName}</h4><p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">School Details</p></div></div>
                              <div className="text-right"><p className="text-2xl font-black text-white italic">{hs.cgpa}<span className="text-sm text-gray-700"> / {hs.outOf}</span></p></div>
                           </div>
                       ))}
                       {(!userData?.profile?.highSchool || userData.profile.highSchool.length === 0) && <p className="text-center py-20 text-[10px] uppercase font-black text-white/10 tracking-[0.5em]">No education records found.</p>}
                    </motion.div>
                 )}
                 {activeProfileTab === 'undergrad' && (
                    <motion.div key="ug" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                       <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8 border-b border-white/5 pb-4">Bachelor's Credentials</h2>
                       {userData?.profile?.underGrad?.map((ug: any, idx: number) => (
                           <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-6 flex justify-between items-center hover:border-gold-500/20 transition-all">
                              <div className="flex items-center gap-5"><div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500"><GraduationCap size={20} /></div><div><h4 className="text-white font-black text-xs uppercase tracking-widest">{ug.uniName}</h4><p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">{ug.degreeName || "Undergraduate Degree"}</p></div></div>
                              <div className="text-right"><p className="text-2xl font-black text-white italic">{ug.cgpa}<span className="text-sm text-gray-700"> / {ug.outOf}</span></p></div>
                           </div>
                       ))}
                       {(!userData?.profile?.underGrad || userData.profile.underGrad.length === 0) && <p className="text-center py-20 text-[10px] uppercase font-black text-white/10 tracking-[0.5em]">No Degree protocols detected.</p>}
                    </motion.div>
                 )}
                 {activeProfileTab === 'masters' && (
                    <motion.div key="ms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                       <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8 border-b border-white/5 pb-4">Postgraduate Credentials</h2>
                       {userData?.profile?.masters?.map((ms: any, idx: number) => (
                           <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-6 flex justify-between items-center hover:border-gold-500/20 transition-all">
                              <div className="flex items-center gap-5"><div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500"><Trophy size={20} /></div><div><h4 className="text-white font-black text-xs uppercase tracking-widest">{ms.uniName}</h4><p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">{ms.degreeName || "Master's Degree"}</p></div></div>
                              <div className="text-right"><p className="text-2xl font-black text-white italic">{ms.cgpa}<span className="text-sm text-gray-700"> / {ms.outOf}</span></p></div>
                           </div>
                       ))}
                       {(!userData?.profile?.masters || userData.profile.masters.length === 0) && <p className="text-center py-20 text-[10px] uppercase font-black text-white/10 tracking-[0.5em]">No Masters degree added.</p>}
                    </motion.div>
                 )}
                 {activeProfileTab === 'target' && (
                     <motion.div key="target" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-8 border-b border-white/5 pb-4">Global Strategy</h2>
                        {userData?.profile?.targetUniversities?.map((uni: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-gold-500/20 transition-all"><div className="flex items-center gap-6"><div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 font-black text-xs"><Target size={20} /></div><div><p className="text-white font-black text-[12px] uppercase tracking-widest">{uni.uniName}</p><p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{uni.major} • {uni.term} {uni.year}</p></div></div></div>
                        ))}
                        {(!userData?.profile?.targetUniversities || userData.profile.targetUniversities.length === 0) && <p className="text-center py-20 text-[10px] uppercase font-black text-white/10 tracking-[0.5em]">No target vectors locked.</p>}
                     </motion.div>
                  )}

                  {(userData?.profile?.testScores || []).map((score: any) => (
                         activeProfileTab === `score-${score.testType.toLowerCase()}` && (
                           <motion.div key={score.testType} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                             <div className="relative group/score">
                               <div className="flex items-center gap-4 mb-10">
                                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover/score:text-gold-500 transition-colors">
                                   <Trophy size={20} />
                                 </div>
                                 <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">{score.testType} Results</h3>
                               </div>
                               <div className="grid grid-cols-2 gap-x-16 gap-y-8">
                                 {score.sectionScores && Object.entries(score.sectionScores).map(([k, v]: any) => (
                                   <div key={k} className="flex justify-between items-center border-b border-white/5 pb-4">
                                     <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">{k}:</span>
                                     <span className="text-[11px] font-black text-white uppercase">{v}</span>
                                   </div>
                                 ))}
                               </div>
                               <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                                 <div className="relative pb-2">
                                    <span className="text-[13px] font-black text-gold-500 uppercase tracking-[0.3em]">Total Score:</span>
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500/50 rounded-full" />
                                 </div>
                                 <span className="text-4xl font-black text-white italic tracking-tighter tabular-nums drop-shadow-2xl">{score.score}</span>
                               </div>
                             </div>
                           </motion.div>
                         )
                  ))}
                  
                  {activeProfileTab === 'scores' && (!userData?.profile?.testScores || userData.profile.testScores.length === 0) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 pb-12">
                       <p className="text-[10px] uppercase font-black text-white/20 tracking-widest">No scores added yet.</p>
                    </motion.div>
                  )}
              </AnimatePresence>
           </div>
        </div>

        {/* ── RECOMMENDED CAROUSEL ── */}
        <div className="bg-dark-900 border border-white/10 rounded-[1.25rem] p-8 shadow-2xl transition-all hover:border-gold-500/20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500"><Star size={16} /></div><h2 className="text-md font-black text-white/50 italic tracking-wide lowercase">Recommended for you</h2></div>
                <div className="flex gap-2"><button onClick={() => scroll("left")} className="p-2 rounded-full hover:bg-gold-500/10 text-gray-500 transition-all"><ChevronLeft size={16} /></button><button onClick={() => scroll("right")} className="p-2 rounded-full hover:bg-gold-500/10 text-gray-500 transition-all"><ChevronRight size={16} /></button></div>
            </div>
            <div className="space-y-4 mb-10"><div className="flex justify-between items-end"><p className="text-[12px] font-black text-white tracking-widest uppercase">Profile strength</p><p className="text-[10px] font-black text-gold-500">{completedSteps}/{totalSteps}</p></div><div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><motion.div animate={{ width: `${(completedSteps/totalSteps)*100}%` }} className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" /></div></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {visibleCards.map(card => (
                    <motion.div key={card.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.02] border border-white/5 rounded-[1.5rem] p-6 flex flex-col items-center text-center gap-5 group/c hover:bg-white/[0.04] transition-all">
                        <div className="text-4xl">{card.icon}</div><h3 className="font-black text-[13px] text-white uppercase tracking-[0.2em]">{card.title}</h3><p className="text-[10px] text-gray-500 font-bold leading-relaxed">{card.description}</p>
                        <div className="flex gap-3 w-full mt-2"><button className="flex-1 py-1.5 rounded-xl bg-dark-800 text-gray-600 text-[9px] font-black uppercase hover:text-white transition-colors">Skip</button><button onClick={() => setOpenModal(card.section)} className="flex-1 py-1.5 rounded-xl text-white text-[9px] font-black uppercase shadow-lg bg-green-600 hover:bg-green-500 transition-all">Submit</button></div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* ── EXPANDED SYSTEM NODES ── */}
        <div className="space-y-4 pb-20">
            {[{ id: 'workExperience', label: "Work Experience", icon: <Briefcase size={18} /> }, { id: 'projects', label: "Projects", icon: <Star size={18} /> }, { id: 'research', label: "Research Papers", icon: <FileText size={18} /> }, { id: 'volunteering', label: "Volunteering", icon: <Heart size={18} /> }].map((sec) => (
                <div key={sec.id} className="bg-dark-900 border border-white/5 rounded-2xl overflow-hidden shadow-3xl group">
                    <div className="p-4 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-4"><div className="text-gray-600 group-hover:text-gold-500 transition-colors uppercase font-black text-[9px] tracking-widest">{sec.icon}</div><h3 className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">{sec.label}</h3></div>
                        <button onClick={() => { setEditingItem(null); setOpenModal(sec.id); }} className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all cursor-pointer"><Plus size={18} /></button>
                    </div>
                    {userData?.profile?.[sec.id]?.length > 0 && (
                        <div className="p-2 space-y-2 no-scrollbar bg-black/20">
                            {userData.profile[sec.id].map((item: any) => (
                                <div key={item._id} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 relative group/item hover:border-gold-500/20 transition-all">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingItem({ section: sec.id, data: item }); setOpenModal(sec.id); }} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"><Edit2 size={12} /></button>
                                        <button onClick={() => deleteItem(sec.id, item._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={12} /></button>
                                    </div>
                                    <h4 className="text-[13px] font-black text-white uppercase tracking-wider mb-1">{item.role || item.title || item.organization}</h4>
                                    <div className="flex items-center gap-4 text-[9px] text-gray-500 font-black uppercase tracking-widest mb-3"><span><Calendar size={10} className="inline mr-1" /> {item.startDate ? new Date(item.startDate).getFullYear() : '2024'} - {item.isOngoing ? "Present" : '2025'}</span></div>
                                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed italic line-clamp-3">"{item.description || "No description added yet..."}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

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
      <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; }.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }`}</style>
    </main>
  );
}
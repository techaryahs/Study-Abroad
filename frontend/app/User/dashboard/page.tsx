"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/app/lib/token";
import { HighSchoolModal, SuccessModal } from "./profile/HighSchool";
import { UnderGradModal } from "./profile/UnderGrad";
import { MastersModal } from "./profile/Masters";
import { TargetUniversityModal } from "./profile/TargetUniversity";
import TestScoresModal from "./profile/TestScores";
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
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Share2,
  GraduationCap,
  Star
} from "lucide-react";
import Image from "next/image";

interface ProfileCard {
  id: number;
  section: string;
  icon: string;
  title: string;
  description: string;
  skipped: boolean;
  added: boolean;
}

const initialCards: ProfileCard[] = [
  { id: 1, section: "targetUniversities", icon: "🏫", title: "Target University", description: "Where do you wish to pursue higher education?", skipped: false, added: false },
  { id: 2, section: "highSchool", icon: "🎓", title: "High School", description: "Where did you spend the final years of school life?", skipped: false, added: false },
  { id: 3, section: "underGrad", icon: "📘", title: "Undergrad Degree", description: "Enter your bachelor's degree details.", skipped: false, added: false },
  { id: 4, section: "masters", icon: "🎓", title: "Master's Degree", description: "Do you hold a master's degree? Submit the details here.", skipped: false, added: false },
  { id: 5, section: "testScores", icon: "📝", title: "Test Scores", description: "Enter your standardized test scores.", skipped: false, added: false },
  { id: 6, section: "workExperience", icon: "💼", title: "Work Experience", description: "Submit work experience details here.", skipped: false, added: false },
  { id: 7, section: "research", icon: "🔬", title: "Research", description: "Add your research papers and publications.", skipped: false, added: false },
  { id: 8, section: "projects", icon: "💻", title: "Projects", description: "Showcase your professional or academic projects.", skipped: false, added: false },
  { id: 9, section: "volunteering", icon: "🤝", title: "Volunteering", description: "List your volunteering activities and contributions.", skipped: false, added: false },
];

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [cards, setCards] = useState<ProfileCard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  const BACKEND_URL = "http://localhost:5000";
  const visibleCount = 3;

  useEffect(() => {
    fetchProfile();
  }, []);

  const getUserId = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          return JSON.parse(user)._id;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  const fetchProfile = async () => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/profile/profile/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        updateCardStatus(data.profile);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCardStatus = (profile: any) => {
    if (!profile) return;
    setCards(prev => prev.map(card => ({
      ...card,
      added: (profile[card.section] && profile[card.section].length > 0) || false
    })));
  };

  const saveProfileField = async (field: string, value: string) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/profile/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
      if (response.ok) {
        setShowSuccess(true);
        fetchProfile();
      }
    } catch (error) {
      console.error(`Failed to save ${field}:`, error);
    }
  };

  const addProfileItem = async (section: string, data: any) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/profile/profile/${userId}/add-item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data })
      });
      if (response.ok) {
        setOpenModal(null);
        setShowSuccess(true);
        fetchProfile();
      }
    } catch (error) {
      console.error(`Failed to add item to ${section}:`, error);
    }
  };

  const addedCount = cards.filter((c) => c.added).length;
  const total = cards.length + 1;
  const completedCount = addedCount + (userData?.profile?.bio ? 1 : 0);

  const scroll = (direction: "left" | "right") => {
    const next =
      direction === "right"
        ? Math.min(currentIndex + 1, initialCards.length - visibleCount)
        : Math.max(currentIndex - 1, 0);
    setCurrentIndex(next);
  };

  const visibleCards = cards.slice(currentIndex, currentIndex + visibleCount);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-12 h-12 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white pb-24 font-sans selection:bg-[#c9a84c]/30">

      {/* ─── HEADER SECTION (BANNER) ─── */}
      <div className="relative w-full h-[320px] bg-[#0a0a0a]">
        <Image
          src="/hero-bg.png"
          alt="Banner"
          fill
          className="object-cover opacity-50 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black"></div>

        <div className="absolute top-8 right-10 flex gap-4 z-20">
          <button className="px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white hover:bg-white/10 transition-all border border-white/10 text-[11px] font-bold flex items-center gap-2 group shadow-xl">
            <Share2 size={14} className="group-hover:rotate-12 transition-transform" /> Share
          </button>
          <button
            onClick={() => window.location.href = '/User/edit-profile'}
            className="px-5 py-2.5 bg-[#c9a84c] text-[#0a0a0a] rounded-xl hover:bg-[#d4a843] transition-all shadow-lg text-[11px] font-bold flex items-center gap-2 group"
          >
            <Edit2 size={14} className="group-hover:scale-110 transition-transform" /> Edit Profile
          </button>
        </div>
      </div>

      {/* ─── PROFILE IDENTITY AREA ─── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 -mt-32 relative z-10">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-12 border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">

            {/* Left-Aligned Profile Image */}
            <div className="relative">
              <div className="w-56 h-56 rounded-[2.5rem] border-[10px] border-black/50 bg-white/5 shadow-2xl overflow-hidden relative group/img">
                {userData?.profile?.profileImage ? (
                  <Image src={`${BACKEND_URL}${userData.profile.profileImage}`} alt="Profile" fill className="object-cover transition-transform duration-700 group-hover/img:scale-110" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-white/10">
                    <User size={100} strokeWidth={1} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all duration-500 flex items-center justify-center cursor-pointer">
                  <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-500">
                    <Camera size={28} className="text-[#c9a84c]" />
                    <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">Change Photo</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#c9a84c] rounded-2xl flex items-center justify-center shadow-xl border-4 border-black group/badge cursor-help" title="Premium Identity">
                <Star size={20} className="text-[#0a0a0a] group-hover:rotate-45 transition-transform" />
              </div>
            </div>

            {/* User Info (Left Aligned) */}
            <div className="flex-1 mt-8 md:mt-4 space-y-7">
              <div className="flex flex-wrap items-center gap-6">
                <h1 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">{userData?.name || "Premium User"}</h1>
                <div className="flex gap-4">
                  <button
                    onClick={() => setOpenModal("linkedin")}
                    className="text-[#c9a84c] hover:scale-110 transition-all bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/10 group"
                  >
                    <svg className="w-7 h-7 group-hover:drop-shadow-[0_0_8px_rgba(201,168,76,0.5)] transition-all" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-12 text-white/50 text-[14px]">
                <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-xl border border-white/5">
                  <MapPin size={20} className="text-[#c9a84c]" />
                  <span className="font-black uppercase tracking-[0.1em]">{userData?.profile?.location || "Global Citizen"}</span>
                </div>
                <button
                  onClick={() => setOpenModal("bio")}
                  className="bg-[#c9a84c] text-[#0a0a0a] px-8 py-3 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#d4a843] transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(201,168,76,0.2)] active:scale-95"
                >
                  <Plus size={16} />
                  {userData?.profile?.bio ? "Update Bio" : "Add Bio"}
                </button>
              </div>

              {userData?.profile?.bio && (
                <div className="max-w-3xl bg-white/5 border-l-[6px] border-[#c9a84c] p-6 rounded-r-3xl backdrop-blur-md">
                  <p className="text-[15px] text-white/70 leading-relaxed font-bold italic tracking-wide">
                    "{userData.profile.bio}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Bar - Dark Cinematic */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl mb-12">
          <div className="flex px-10">
            <button className="px-10 py-5 border-b-[3px] border-[#c9a84c] text-white font-bold text-[13px] uppercase tracking-wider">
              Profile Overview
            </button>
          </div>
        </div>

        {/* ─── MAIN CONTENT LOADER ─── */}
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Section 1: Dashboard Identity */}
          <section className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl">
            <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-[#c9a84c] rounded-full"></div>
                <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">Personal Information</h2>
              </div>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {[
                { icon: <User size={24} className="text-[#c9a84c]" />, label: "Alias", value: userData?.name || "User" },
                { icon: <Briefcase size={24} className="text-[#c9a84c]" />, label: "Status", value: userData?.profile?.isPremium ? "Premium Member" : "Standard Member" },
                { icon: <MapPin size={24} className="text-[#c9a84c]" />, label: "Base", value: userData?.profile?.location || "Not Set" },
                { icon: <Calendar size={24} className="text-[#c9a84c]" />, label: "Joined", value: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Recently" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-6 group/item">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover/item:border-[#c9a84c]/20 transition-all font-bold">{item.icon}</div>
                  <div className="pt-1">
                    <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-[16px] font-bold text-white tracking-tight">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Achievement Journey (Carousel) */}
          <section className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl">
            <div className="px-10 py-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
              <div className="w-1.5 h-8 bg-[#c9a84c] rounded-full"></div>
              <h2 className="text-[15px] font-bold text-white uppercase tracking-wider">Profile Progress</h2>
            </div>
            <div className="p-10">
              <div className="mb-12 flex items-center gap-12">
                <div className="flex-1">
                  <div className="flex justify-between mb-4">
                    <span className="text-[12px] font-bold text-white/30 uppercase tracking-widest">Completion Status</span>
                    <span className="text-[16px] font-bold text-[#c9a84c]">{completedCount}/{total}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedCount / total) * 100}%` }}
                      transition={{ duration: 1.5 }}
                      className="h-full bg-[#c9a84c] rounded-full"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => scroll("left")} disabled={currentIndex === 0} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 transition-all disabled:opacity-5"><ChevronLeft size={20} /></button>
                  <button onClick={() => scroll("right")} disabled={currentIndex >= initialCards.length - visibleCount} className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 transition-all disabled:opacity-5"><ChevronRight size={20} /></button>
                </div>
              </div>

              <div className="flex gap-8 overflow-hidden">
                {visibleCards.map((card) => (
                  <div key={card.id} className="flex-1 min-w-[300px] bg-white/[0.02] rounded-3xl border border-white/5 p-8 flex flex-col gap-6 hover:border-[#c9a84c]/30 transition-all group">
                    <span className="text-4xl">{card.icon}</span>
                    <div>
                      <h3 className="font-bold text-white text-[14px] mb-2 uppercase tracking-wide">{card.title}</h3>
                      <p className="text-[12px] text-white/40 leading-relaxed font-medium">{card.description}</p>
                    </div>
                    <button
                      onClick={() => setOpenModal(card.section)}
                      className={`mt-4 w-full py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${card.added ? 'bg-white/5 text-white/20' : 'bg-[#c9a84c] text-[#0a0a0a] hover:bg-[#d4a843]'}`}
                    >
                      {card.added ? "Added" : "Add Now"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Professional Experience Cards */}
          <div className="space-y-6">
            {[
              { id: 'workExperience', title: "Work Experience", icon: <Briefcase size={24} className="text-[#c9a84c]" />, desc: "Document your career milestones" },
              { id: 'underGrad', title: "Education", icon: <GraduationCap size={24} className="text-[#c9a84c]" />, desc: "Showcase your academic credentials" },
              { id: 'projects', title: "Projects", icon: <FileText size={24} className="text-[#c9a84c]" />, desc: "Highlight your technical contributions" },
              { id: 'volunteering', title: "Volunteering", icon: <Heart size={24} className="text-[#c9a84c]" />, desc: "Share your social contributions" }
            ].map((sec) => (
              <section key={sec.id} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#c9a84c]/30 transition-all group cursor-pointer shadow-lg" onClick={() => setOpenModal(sec.id)}>
                <div className="px-10 py-8 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#c9a84c]/20 transition-all font-bold">
                      {sec.icon}
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-white uppercase tracking-wider mb-2 group-hover:text-[#c9a84c] transition-colors">{sec.title}</h2>
                      <p className="text-[12px] text-white/30 font-bold uppercase tracking-widest">{sec.desc}</p>
                    </div>
                  </div>
                  <button className="w-12 h-12 rounded-xl bg-[#c9a84c] text-[#0a0a0a] flex items-center justify-center hover:bg-[#d4a843] transition-all group-hover:scale-105 active:scale-95">
                    <Plus size={24} />
                  </button>
                </div>
              </section>
            ))}
          </div>

        </div>
      </div>

      {/* ─── MODALS ─── */}
      <AnimatePresence>
        {openModal === "bio" && <BioModal isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(v) => saveProfileField("bio", v)} initialValue={userData?.profile?.bio} />}
        {openModal === "linkedin" && <LinkedInModal isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(v) => saveProfileField("linkedin", v)} initialValue={userData?.profile?.linkedin} />}

        {openModal === "targetUniversities" && <TargetUniversityModal isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(d: any) => { addProfileItem("targetUniversities", d); }} />}
        {openModal === "highSchool" && <HighSchoolModal isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(d: any) => { addProfileItem("highSchool", d); }} />}
        {openModal === "underGrad" && <UnderGradModal isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(d: any) => { addProfileItem("underGrad", d); }} />}
        {openModal === "masters" && <MastersModal isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(d: any) => { addProfileItem("masters", d); }} />}
        {openModal === "testScores" && <TestScoresModal isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(d: any) => { addProfileItem("testScores", d); }} />}
        {openModal === "workExperience" && <WorkExpModal isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(d: any) => { addProfileItem("workExperience", d); }} />}
        {openModal === "research" && <ResearchModal isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(d: any) => { addProfileItem("research", d); }} />}
        {openModal === "projects" && <ProjectFormModal isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(d: any) => { addProfileItem("projects", d); }} />}
        {openModal === "volunteering" && <AddVolunteer isOpen={true} onClose={() => setOpenModal(null)} onSubmit={(d: any) => { addProfileItem("volunteering", d); }} />}

        {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 4s ease-in-out infinite;
        }
      `}</style>

    </main>
  );
}
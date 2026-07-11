"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Users,
  UserCircle,
  Info,
  PlusCircle,
  Search,
  Bell,
  ChevronRight,
  Mail,
  ArrowRight
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import AvailableGroups, { groups } from "../AvailableGroups";
import YourGroups from "../YourGroups";
import KnowMore from "../KnowMore";
import CreateGroupModal from "../CreateGroup";
import GroupDetailsModal from "../GroupDetailsModal";
import { getToken } from "@/app/lib/token";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

type Tab = "available" | "your" | "know";

const sidebarItems = [
  { id: "available", label: "Research Hub", icon: <Users className="w-4 h-4" /> },
  { id: "your", label: "Active Collaborations", icon: <UserCircle className="w-4 h-4" /> },
  { id: "know", label: "Institutional Guidelines", icon: <Info className="w-4 h-4" /> },
];

export default function ResearchGroupsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStep, setModalInitialStep] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    // Check search params first
    const groupIdParam = searchParams.get("group");

    // Check path segments (e.g. /.../Title/ID/)
    const pathSegments = pathname.split('/').filter(Boolean);
    const groupIdFromPath = pathSegments[pathSegments.length - 1];

    const finalGroupId = groupIdParam || groupIdFromPath;

    if (finalGroupId) {
      const id = parseInt(finalGroupId);
      if (!isNaN(id)) {
        const group = groups.find(g => g.id === id);
        if (group) {
          setSelectedGroup(group);
          setIsDetailsOpen(true);
        }
      }
    }
  }, [searchParams, pathname]);

  const openModal = (step: number = 1) => {
    if (!getToken()) {
      alert("Please login to continue");
      router.push("/auth/login");
      return;
    }
    setModalInitialStep(step);
    setIsModalOpen(true);
  };

  const handleCardClick = (group: any) => {
    setSelectedGroup(group);
    setIsDetailsOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "available":
        return (
          <AvailableGroups
            key="available"
            searchQuery={searchQuery}
            onJoinClick={() => openModal(2)}
            onCardClick={handleCardClick}
          />
        );
      case "your":
        return <YourGroups key="your" onCreateClick={() => openModal(1)} />;
      case "know":
        return <KnowMore key="know" onBookingClick={() => setIsBookingOpen(true)} />;
      default:
        return (
          <AvailableGroups
            key="available"
            searchQuery={searchQuery}
            onJoinClick={() => openModal(2)}
            onCardClick={handleCardClick}
          />
        );
    }
  };

  return (
    <main className="min-h-screen pb-32" style={{ background: "#FDFBF7", color: "#2D2926", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .fd { font-family: 'Cormorant Garamond', serif; }
        
        .gold-shimmer {
          background: linear-gradient(90deg, #C5A059, #E6D5B8, #C5A059, #D4AF37, #C5A059);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .sidebar-card {
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.15);
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .nav-item {
          transition: all 0.3s ease;
          border-radius: 12px;
          padding: 12px 16px;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .nav-item-active {
          background: #2D2926;
          color: #FFFFFF;
        }

        .nav-item-inactive {
          color: #6B5E51;
        }
        .nav-item-inactive:hover {
          background: rgba(197,160,89, 0.05);
          color: #C5A059;
        }

        .newsletter-dark {
          background: #2D2926;
          border-radius: 24px;
          padding: 30px;
          color: #FFFFFF;
        }

        .search-field {
          background: #FFFFFF;
          border: 1px solid rgba(197,160,89, 0.2);
          border-radius: 16px;
          padding: 12px 16px 12px 48px;
          font-size: 13px;
          width: 100%;
          outline: none;
          transition: all 0.3s;
        }
        .search-field:focus {
          border-color: #C5A059;
          box-shadow: 0 0 0 4px rgba(197,160,89, 0.08);
        }
      `}</style>

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialStep={modalInitialStep}
      />

      <GroupDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        group={selectedGroup}
        onJoinClick={() => openModal(2)}
      />

      <BookCounsellingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* ── HEADER ─────────────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-20 overflow-hidden text-center" style={{ background: "linear-gradient(180deg, rgba(197,160,89, 0.06) 0%, transparent 100%)" }}>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full border border-[rgba(197,160,89,0.3)] text-[#C5A059] font-bold text-[14px] font-bold tracking-[0.2em] uppercase mb-6">
              Global Collaboration Framework
            </span>
            <h1 className="fd text-4xl md:text-6xl lg:text-7xl font-bold text-[#2D2926] tracking-tight mb-6 leading-tight">
              Scholarly <span className="gold-shimmer">Research Clusters</span>
            </h1>
            <p className="text-[#6B5E51] text-lg font-medium px-4 max-w-2xl mx-auto">
              Architecting the next generation of academic breakthrough through cross-institutional collaboration and data synthesis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8 sticky top-32">
            <div className="sidebar-card p-4 space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`nav-item ${activeTab === item.id ? "nav-item-active shadow-lg" : "nav-item-inactive"}`}
                >
                  <span className={activeTab === item.id ? "text-[#C5A059]" : ""}>
                    {item.icon}
                  </span>
                  {item.label}
                  {activeTab === item.id && <ArrowRight className="ml-auto w-3 h-3 opacity-60" />}
                </button>
              ))}

              <div className="pt-4 mt-4 border-t border-[#F1EDEA]">
                <button
                  onClick={() => openModal(1)}
                  className="nav-item nav-item-inactive text-[#C5A059] font-black"
                >
                  <PlusCircle className="w-5 h-5" />
                  Initiate New Group
                </button>
              </div>
            </div>

            {/* Newsletter */}
            <div className="newsletter-dark relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Bell className="w-6 h-6 text-[#C5A059] mb-2" />
                  <h3 className="fd text-xl font-bold leading-tight">Cluster Updates</h3>
                  <p className="text-[11px] text-[#A8A29E] font-bold uppercase tracking-wider">
                    Receive briefings on emerging research opportunities.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E] opacity-50" />
                    <input
                      type="email"
                      placeholder="Academic Email"
                      className="w-full bg-[#1A1817] border border-white/5 rounded-xl pl-11 pr-3 py-3 text-xs text-white focus:outline-none focus:border-[#C5A059]/30 transition-all font-medium"
                    />
                  </div>
                  <button className="bg-[#C5A059] hover:bg-white hover:text-[#2D2926] w-full py-4 rounded-xl text-[14px] font-bold font-bold text-white uppercase tracking-widest transition-all">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-10">

            {/* Banner/Helper text */}
            {activeTab === "available" && (
              <div className="flex items-center gap-3 bg-white border border-[rgba(197,160,89,0.15)] rounded-2xl px-6 py-3.5 text-xs text-[#6B5E51] font-bold shadow-sm">
                <Info className="w-4 h-4 text-[#C5A059]" />
                <span>Publishing without co-authors? <Link href="/services/research-papers" className="text-[#C5A059] hover:underline">Explore Paper Services</Link></span>
              </div>
            )}

            {/* Search and Quick Action */}
            {activeTab === "available" && (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Locate clusters by field, topic, or investigator..."
                    className="search-field font-medium shadow-sm"
                  />
                </div>
                <button
                  onClick={() => openModal(1)}
                  className="bg-[#2D2926] text-white hover:bg-[#C5A059] font-bold px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all shadow-xl active:scale-95 shrink-0 uppercase text-[11px] tracking-widest"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Cluster
                </button>
              </div>
            )}

            {/* Dynamic Content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Banner */}
            {activeTab === "available" && (
              <div className="sidebar-dark p-12 lg:p-16 rounded-[40px] mt-16 bg-[#2D2926] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, #C5A059 1px, transparent 1px)", backgroundSize: '40px 40px' }}></div>
                <div className="flex flex-col gap-4 text-center md:text-left relative z-10">
                  <h3 className="fd text-3xl font-bold text-white leading-tight">Liaison Support</h3>
                  <p className="text-[#A8A29E] text-sm font-medium max-w-md uppercase tracking-wide">Our academic advisors can bridge the gap to your next collaboration.</p>
                </div>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-[#C5A059] text-white hover:bg-white hover:text-[#2D2926] font-bold px-10 py-4 rounded-xl flex items-center gap-3 transition-all shadow-2xl active:scale-95 shrink-0 uppercase text-[10px] tracking-widest relative z-10"
                >
                  Secure Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookCounsellingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </main>
  );
}

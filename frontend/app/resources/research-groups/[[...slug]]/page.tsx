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

type Tab = "available" | "your" | "know";

const sidebarItems = [
  { id: "available", label: "Available Groups", icon: <Users className="w-4 h-4" /> },
  { id: "your", label: "Your Groups", icon: <UserCircle className="w-4 h-4" /> },
  { id: "know", label: "Know More", icon: <Info className="w-4 h-4" /> },
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
        return <KnowMore key="know" />;
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
    <main className="min-h-screen bg-[#05070a] text-white overflow-x-hidden pb-20">
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

      {/* ── HEADER ─────────────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-6 overflow-hidden text-center border-b border-white/5 bg-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,204,0,0.04)_0%,transparent_70%)] pointer-events-none" 
        />
        <motion.h1 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-4xl font-black text-white/90 tracking-tight uppercase"
        >
          Create or join a research group
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-white/30 text-sm font-medium px-4 mt-1"
        >
          Collaborate with students and researchers all over the world!
        </motion.p>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6 sticky top-24">
            <div className="glass-card !p-3 flex flex-col gap-1.5 border border-white/5 bg-white/[0.01]">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all duration-300 group
                    ${activeTab === item.id 
                      ? "bg-[#1a1c23] text-white shadow-xl border border-white/10" 
                      : "text-white/35 hover:text-white hover:bg-white/5"}`}
                >
                  <span className={`${activeTab === item.id ? "text-[#ffcc00]" : "text-white/40 group-hover:text-white transition-colors"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                  {activeTab === item.id && <ChevronRight className="ml-auto w-3 h-3 opacity-40" />}
                </button>
              ))}
              
              {/* Sidebar Create Button - Standardized Yellow Button Style */}
              <button
                onClick={() => openModal(1)}
                className="flex items-center gap-2 mt-4 px-4 py-3 text-xs font-black text-white/40 hover:text-white group transition-all"
              >
                <PlusCircle className="w-5 h-5 text-white/30 group-hover:text-[#ffcc00]" />
                Create Group
              </button>
            </div>

            {/* Newsletter... */}
            <div className="glass-card !p-6 flex flex-col gap-5 bg-gradient-to-br from-[#c2a878]/5 to-transparent border-[#c2a878]/10">
              <div className="flex flex-col gap-1.5">
                <Bell className="w-6 h-6 text-[#c2a878] mb-1" />
                <h3 className="text-base font-black tracking-tight">Subscribe to Research Groups</h3>
                <p className="text-[11px] text-white/30 leading-relaxed uppercase tracking-tighter">
                  Join our community and stay updated.
                </p>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                  <input 
                    type="email" 
                    placeholder="Enter your Email" 
                    className="w-full bg-black/40 border border-white/5 rounded-lg pl-10 pr-3 py-2.5 text-[11px] text-white placeholder-white/10 focus:outline-none focus:border-[#c2a878]/20 transition-colors"
                  />
                </div>
                <button className="bg-[#c2a878] hover:bg-[#d4af37] !py-3 w-full rounded-xl text-[11px] font-black text-black flex items-center justify-center gap-2 uppercase tracking-tight transition-all">
                  Subscribe Now! <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Banner/Helper text */}
            {activeTab === "available" && (
              <div className="flex items-center gap-2 bg-white/[0.01] border border-white/5 rounded-lg px-4 py-2 text-[11px] text-white/30 font-medium">
                <Info className="w-3.5 h-3.5 text-white/20" />
                <span>Publishing without co-authors? <Link href="/services/research-paper" className="text-[#c2a878]/60 font-bold hover:underline">Click here</Link></span>
              </div>
            )}

            {/* Search and Quick Action */}
            {activeTab === "available" && (
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics, fields, or groups..." 
                    className="w-full bg-[#05070a] border border-white/5 rounded-xl pl-11 pr-3 py-3 text-[11px] text-white focus:outline-none focus:border-[#c2a878]/20 transition-shadow focus:shadow-[0_0_15px_rgba(194,168,120,0.05)]"
                  />
                </div>
                <button 
                  onClick={() => openModal(1)}
                  className="bg-[#c2a878] hover:bg-[#d4af37] text-black font-black px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(194,168,120,0.2)] active:scale-95 shrink-0 uppercase text-[11px] tracking-tight"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Group <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Dynamic Content */}
            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Banner */}
            {activeTab === "available" && (
              <div className="glass-card !p-10 !rounded-[2.5rem] mt-10 bg-gradient-to-r from-black/20 via-[#c2a878]/5 to-black/40 flex flex-col md:flex-row items-center justify-between gap-8 py-10">
                <div className="flex flex-col gap-1.5 text-center md:text-left">
                  <h3 className="text-lg font-black leading-tight">Need help joining a group?</h3>
                  <p className="text-white/30 text-[11px] max-w-md font-medium uppercase tracking-tighter">Our team is ready to assist you in finding the perfect research collaboration.</p>
                </div>
                <button className="bg-[#c2a878] hover:bg-[#d4af37] text-black font-black px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-xl active:scale-95 shrink-0 uppercase text-[11px] tracking-tight">
                  Chat Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

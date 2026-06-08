'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Camera,
  User,
  MapPin,
  Link as LinkIcon,
  FileText,
  CheckCircle,
  Loader2,
  Briefcase,
  Award,
  Edit2,
  ChevronRight,
  ChevronLeft,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  Plus,
  GraduationCap,
  Target,
  ClipboardList,
  Trash2,
  Trophy,
  Star,
  Check,
  Search,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getToken, getUser, setUser, clearAuth } from "@/app/lib/token";

export default function EditProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [activeEditTest, setActiveEditTest] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    gender: '',
    dob: '',
    country: '',
    state: '',
    location: '',
    bio: '',
    linkedin: '',
    website: '',
    education: {
      highSchool: { schoolName: '', cgpa: '', outOf: '' },
      bachelors: { uniName: '', degreeName: '', cgpa: '', outOf: '', backlogs: '' },
      masters: { uniName: '', degreeName: '', cgpa: '', outOf: '', backlogs: '' }
    },
    target: { uniName: '', major: '', term: '', year: '' },
    testScores: {
      toefl: { reading: '', speaking: '', listening: '', writing: '' },
      ielts: { reading: '', speaking: '', listening: '', writing: '', overall: '' },
      duolingo: { literacy: '', comprehension: '', conversation: '', production: '', overall: '' },
      gre: { verbal: '', quantitative: '', awa: '', total: '' },
      gmat: { quantitative: '', verbal: '', ir: '', awa: '', total: '' },
      mcat: { cpbs: '', cars: '', bbls: '', psbb: '', total: '' }
    },
    resume: null as File | null,
    resumeName: '',
    profileImage: null as string | null
  });

  useEffect(() => {
    const token = getToken();
    if (!token) router.push("/auth/login");
    fetchProfile();
  }, []);

  const getUserId = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("auth_user") || localStorage.getItem("user");
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
      const response = await fetch(`${BACKEND_URL}/api/user/profile/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setUser(data); // Sync with navbar
        setProfileImage(data.profile?.profileImage || null);

        const getTest = (type: string) => data.profile?.testScores?.find((t: any) => t.testType === type);
        const toeflDoc = getTest('TOEFL');
        const ieltsDoc = getTest('IELTS');
        const duolingoDoc = getTest('DUOLINGO');
        const greDoc = getTest('GRE');
        const gmatDoc = getTest('GMAT');
        const mcatDoc = getTest('MCAT');

        setFormData({
          name: data.name || '',
          email: data.email || '',
          mobile: data.mobile || '',
          gender: data.gender || '',
          dob: data.dob || '',
          country: data.country || '',
          state: data.state || '',
          location: data.profile?.location || '',
          bio: data.profile?.bio || '',
          linkedin: data.profile?.linkedin || '',
          website: data.profile?.website || '',
          education: {
            highSchool: data.profile?.highSchool?.[0] || { schoolName: '', cgpa: '', outOf: '' },
            bachelors: data.profile?.underGrad?.[0] || { uniName: '', degreeName: '', cgpa: '', outOf: '', backlogs: '' },
            masters: data.profile?.masters?.[0] || { uniName: '', degreeName: '', cgpa: '', outOf: '', backlogs: '' }
          },
          target: data.profile?.targetUniversities?.[0] || { uniName: '', major: '', term: '', year: '' },
          testScores: {
            toefl: toeflDoc?.sectionScores || { reading: '', speaking: '', listening: '', writing: '' },
            ielts: ieltsDoc ? { ...ieltsDoc.sectionScores, overall: ieltsDoc.score } : { reading: '', speaking: '', listening: '', writing: '', overall: '' },
            duolingo: duolingoDoc?.sectionScores || { literacy: '', comprehension: '', conversation: '', production: '', overall: '' },
            gre: greDoc ? { ...greDoc.sectionScores, total: greDoc.score } : { verbal: '', quantitative: '', awa: '', total: '' },
            gmat: gmatDoc ? { ...gmatDoc.sectionScores, total: gmatDoc.score } : { quantitative: '', verbal: '', ir: '', awa: '', total: '' },
            mcat: mcatDoc ? { ...mcatDoc.sectionScores, total: mcatDoc.score } : { cpbs: '', cars: '', bbls: '', psbb: '', total: '' }
          },
          resume: null,
          resumeName: data.profile?.resume || '',
          profileImage: data.profile?.profileImage || null
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    const userId = getUserId();
    if (!userId) return;

    try {
      const payload = {
        ...formData,
        profile: {
          location: formData.location,
          bio: formData.bio,
          linkedin: formData.linkedin,
          website: formData.website,
          highSchool: [formData.education.highSchool],
          underGrad: [formData.education.bachelors],
          masters: [formData.education.masters],
          targetUniversities: [formData.target],
          testScores: Object.keys(formData.testScores).map(key => {
            const scores = (formData.testScores as any)[key];
            const isToefl = key === 'toefl';
            const sum = Object.values(scores).reduce((acc: number, v: any) => acc + (Number(v) || 0), 0);
            const mainScore = isToefl ? sum.toString() : (scores.overall || scores.total || '');

            return {
              testType: key.toUpperCase(),
              score: mainScore,
              sectionScores: scores
            };
          }).filter(t => {
            const scores = t.sectionScores;
            return Object.values(scores).some(v => v !== '' && v !== '0');
          })
        }
      };

      const response = await fetch(`${BACKEND_URL}/api/user/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchProfile();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const userId = getUserId();
    if (!userId) return;

    const formDataUpload = new FormData();
    formDataUpload.append('profileImage', file);

    try {
      setSaving(true);
      const response = await fetch(`${BACKEND_URL}/api/user/profile/${userId}`, {
        method: "PUT",
        body: formDataUpload
      });
      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.user?.profile?.profileImage || null);
        setUser(data.user); // Update navbar
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="w-10 h-10 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={16} /> },
    { id: 'settings', label: 'Profile Settings', icon: <Settings size={16} /> },
    { id: 'education', label: 'Education Details', icon: <GraduationCap size={16} /> },
    { id: 'target', label: 'Target Universities', icon: <Target size={16} /> },
    { id: 'test', label: 'Tests Scores', icon: <ClipboardList size={16} /> },
    { id: 'resume', label: 'Resume', icon: <FileText size={16} /> },
  ];

  return (
    <main className="min-h-screen text-[#3C2A21] pb-32 font-base selection:bg-[#C5A059]/30 overflow-x-hidden" style={{ background: "#FDFBF7", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
          .fd { font-family: 'Cormorant Garamond', serif; }
          .glass-panel {
            background: #FFFFFF;
            border: 1px solid rgba(197,160,89, 0.15);
            border-radius: 32px;
            box-shadow: 0 40px 100px rgba(197,160,89, 0.05);
          }
      `}</style>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-10 md:pt-16 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-8 md:mb-12">
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <button
              onClick={() => router.push('/User/dashboard')}
              className="w-10 h-10 rounded-xl bg-white border border-[#C5A059]/10 flex items-center justify-center text-[#6B5E51] hover:text-[#C5A059] hover:bg-white transition-all active:scale-90 shadow-sm group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold font-black uppercase text-[#C5A059]/60 tracking-[0.3em] ml-1 mb-1">Your Profile</span>
              <h1 className="fd text-2xl md:text-4xl font-bold text-[#3C2A21] uppercase tracking-tighter leading-none">Edit Profile</h1>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="w-full md:w-auto h-14 px-10 bg-[#C5A059] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-[#3C2A21] transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Settings size={16} />}
          {saving ? "Updating..." : "Save Changes"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

        <aside className="lg:col-span-3">
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                  ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20 shadow-sm'
                  : 'text-[#6B5E51] hover:text-[#3C2A21] hover:bg-white'
                  }`}
              >
                {tab.icon}
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="lg:col-span-9">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {activeTab === 'personal' && (
              <div className="space-y-8">
                <section className="glass-panel p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                  <h2 className="text-[14px] font-bold font-black uppercase text-[#C5A059]/80 tracking-[0.4em] mb-8 md:mb-12 border-b border-[#F1EDEA] pb-6 relative z-10">Identity Core</h2>

                  <div className="flex flex-col md:flex-row items-center gap-10 mb-12 relative z-10">
                    <div className="relative group/avatar">
                      <div
                        className="w-28 h-28 rounded-[2.5rem] bg-[#FDFBF7] border-4 border-white overflow-hidden relative group shadow-lg cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {profileImage ? (
                          <img
                            src={profileImage.startsWith('http') || profileImage.startsWith('data:image') ? profileImage : `${BACKEND_URL}${profileImage.startsWith('/') ? '' : '/'}${profileImage}`}
                            className="w-full h-full object-cover"
                            alt="Avatar"
                          />
                        ) : userData?.image || userData?.profileImage ? (
                          <img
                            src={userData.image || userData.profileImage}
                            className="w-full h-full object-cover"
                            alt="Avatar Fallback"
                          />
                        ) : (
                          <img
                            src={`https://ui-avatars.com/api/?name=${formData.name || 'User'}&background=c2a878&color=000&bold=true&rounded=true`}
                            className="w-full h-full grayscale opacity-80"
                            alt="Placeholder"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <Camera size={24} className="text-white" />
                        </div>
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
                    <div className="flex flex-col gap-2 text-center md:text-left">
                      <h3 className="fd text-2xl font-bold text-[#3C2A21] italic tracking-tight">{formData.name || "Scholar Instance"}</h3>
                      <p className="text-[13px] font-bold font-bold text-[#6B5E51] uppercase tracking-[0.2em]">{formData.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4 max-w-2xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                      <div className="flex items-center justify-between py-4 border-b border-[#F1EDEA] px-4 rounded-xl cursor-default group hover:bg-[#FDFBF7] transition-all">
                        <span className="text-[14px] font-bold font-black text-[#6B5E51] uppercase tracking-widest">Gender Expression</span>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="bg-transparent text-xs font-black text-[#3C2A21] focus:outline-none text-right cursor-pointer"
                        >
                          <option value="" className="bg-white text-[#3C2A21]">Select Gender</option>
                          <option value="Male" className="bg-white text-[#3C2A21]">Male</option>
                          <option value="Female" className="bg-white text-[#3C2A21]">Female</option>
                          <option value="Other" className="bg-white text-[#3C2A21]">Other</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-[#F1EDEA] px-4 rounded-xl cursor-default group hover:bg-[#FDFBF7] transition-all">
                        <span className="text-[14px] font-bold font-black text-[#6B5E51] uppercase tracking-widest">Origin Date</span>
                        <input
                          type="date"
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          className="bg-transparent text-xs font-black text-[#3C2A21] focus:outline-none text-right cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[14px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-4">Personal Narrative (Bio)</label>
                      <textarea
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Craft your scholarship narrative..."
                        className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl px-6 py-6 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059]/30 outline-none transition-all resize-none shadow-sm"
                      />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <h2 className="fd text-3xl font-bold text-[#3C2A21] italic tracking-tighter uppercase px-4">Profile Settings</h2>
                <section className="glass-panel p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {[
                      { label: 'First Name', val: formData.name.split(' ')[0], type: 'first' },
                      { label: 'Last Name', val: formData.name.split(' ').slice(1).join(' '), type: 'last' },
                      { label: 'Mobile Frequency', val: formData.mobile, field: 'mobile' },
                      { label: 'Location Hub', val: formData.location, field: 'location' },
                      { label: 'LinkedIn Node', val: formData.linkedin, field: 'linkedin' },
                    ].map((item) => (
                      <div key={item.label} className="space-y-3">
                        <label className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">{item.label}</label>
                        <input
                          type="text"
                          value={item.val}
                          onChange={(e) => {
                            if (item.type) {
                              const names = formData.name.split(' ');
                              if (item.type === 'first') names[0] = e.target.value;
                              else names[1] = e.target.value;
                              setFormData({ ...formData, name: names.join(' ').trim() });
                            } else {
                              setFormData({ ...formData, [item.field as string]: e.target.value });
                            }
                          }}
                          className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-5 py-4 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059]/50 outline-none transition-all shadow-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t border-[#F1EDEA] flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setShowPasswordModal(true)} className="w-full sm:w-auto px-8 py-3 bg-white border border-[#C5A059]/10 rounded-xl text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest hover:text-[#C5A059] transition-colors shadow-sm">Access Logic Reset</button>
                    <button onClick={() => handleSave()} disabled={saving} className="w-full sm:w-auto sm:ml-auto px-12 py-3.5 bg-[#C5A059] text-white rounded-xl text-[14px] font-bold font-black uppercase tracking-widest hover:bg-[#3C2A21] transition-all shadow-lg active:scale-95 disabled:opacity-50">
                      {saving ? "Updating..." : "Synchronize Profile"}
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-10">
                <h2 className="fd text-3xl font-bold text-[#3C2A21] italic tracking-tighter uppercase px-4">Education History</h2>
                {[
                  { id: 'highSchool', label: 'High School' },
                  { id: 'bachelors', label: "Bachelor's Degree" },
                  { id: 'masters', label: "Master's Degree" }
                ].map((sec) => (
                  <section key={sec.id} className="glass-panel p-8">
                    <div className="flex items-center gap-4 mb-8 border-b border-[#F1EDEA] pb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] shadow-inner">
                        <GraduationCap size={16} />
                      </div>
                      <h3 className="text-[14px] font-bold font-black text-[#3C2A21] uppercase tracking-[0.2em]">{sec.label}</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-1 space-y-2">
                          <label className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">{sec.id === 'highSchool' ? 'School Name' : 'University Name'}</label>
                          <input
                            type="text"
                            value={(formData.education as any)[sec.id][sec.id === 'highSchool' ? 'schoolName' : 'uniName'] || ''}
                            onChange={(e) => {
                              const edu = { ...formData.education };
                              (edu as any)[sec.id][sec.id === 'highSchool' ? 'schoolName' : 'uniName'] = e.target.value;
                              setFormData({ ...formData, education: edu });
                            }}
                            placeholder="Enter Institution Name"
                            className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-5 py-3.5 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059]/50 outline-none transition-all shadow-sm"
                          />
                        </div>
                        {sec.id !== 'highSchool' && (
                          <div className="flex-1 space-y-2">
                            <label className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">Degree Title</label>
                            <input
                              type="text"
                              value={(formData.education as any)[sec.id].degreeName || ''}
                              onChange={(e) => {
                                const edu = { ...formData.education };
                                (edu as any)[sec.id].degreeName = e.target.value;
                                setFormData({ ...formData, education: edu });
                              }}
                              placeholder="e.g. Computer Science"
                              className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-5 py-3.5 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059]/50 outline-none transition-all shadow-sm"
                            />
                          </div>
                        )}
                        <div className="w-full md:w-auto space-y-2">
                          <label className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">Result (CGPA)</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={(formData.education as any)[sec.id].cgpa || ''}
                              placeholder="Score"
                              onChange={(e) => {
                                const edu = { ...formData.education };
                                (edu as any)[sec.id].cgpa = e.target.value;
                                setFormData({ ...formData, education: edu });
                              }}
                              className="w-24 bg-white border border-[#F1EDEA] rounded-xl px-4 py-3.5 text-center text-xs font-black text-[#3C2A21] shadow-sm"
                            />
                            <span className="text-[#6B5E51] text-[14px] font-bold font-black uppercase">/</span>
                            <input
                              type="text"
                              value={(formData.education as any)[sec.id].outOf || ''}
                              placeholder="Max"
                              onChange={(e) => {
                                const edu = { ...formData.education };
                                (edu as any)[sec.id].outOf = e.target.value;
                                setFormData({ ...formData, education: edu });
                              }}
                              className="w-20 bg-white border border-[#F1EDEA] rounded-xl px-4 py-3.5 text-center text-xs font-black text-[#3C2A21] shadow-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            )}

            {activeTab === 'target' && (
              <div className="space-y-10">
                <h2 className="fd text-3xl font-bold text-[#3C2A21] italic tracking-tighter uppercase px-4">Future Aspirations</h2>
                <section className="glass-panel p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { label: 'University Name', field: 'uniName', icon: <LayoutDashboard size={14} /> },
                      { label: 'Target Major', field: 'major', icon: <Target size={14} /> },
                      { label: 'Admission Term', field: 'term', placeholder: 'e.g. Fall / Spring', icon: <Settings size={14} /> },
                      { label: 'Target Year', field: 'year', placeholder: 'e.g. 2025', icon: <Settings size={14} /> },
                    ].map((item) => (
                      <div key={item.field} className="space-y-2">
                        <label className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1 flex items-center gap-2">
                          {item.icon}
                          {item.label}
                        </label>
                        <input
                          type="text"
                          value={(formData.target as any)[item.field] || ''}
                          onChange={(e) => {
                            const t = { ...formData.target };
                            (t as any)[item.field] = e.target.value;
                            setFormData({ ...formData, target: t });
                          }}
                          placeholder={item.placeholder}
                          className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-5 py-3.5 text-xs font-bold text-[#3C2A21] focus:border-[#C5A059]/50 outline-none transition-all shadow-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-[#F1EDEA] flex">
                    <button onClick={() => handleSave()} disabled={saving} className="ml-auto px-12 py-3.5 bg-[#C5A059] text-white rounded-xl text-[14px] font-bold font-black uppercase tracking-widest hover:bg-[#3C2A21] transition-all shadow-lg active:scale-95 disabled:opacity-50">
                      {saving ? "Syncing..." : "Update Trajectory"}
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                  <h2 className="fd text-4xl font-bold text-[#3C2A21] italic tracking-tighter uppercase">Standardized Tests</h2>
                  <p className="text-[#6B5E51] text-[14px] font-bold font-bold uppercase tracking-[0.4em] max-w-sm leading-relaxed italic">
                    Quantify your academic excellence with global benchmarks.
                  </p>
                  <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-4">
                  {Object.keys(testDefinitions).map((testId) => {
                    const test = testDefinitions[testId];
                    const scores = (formData.testScores as any)[testId];
                    const hasData = !Object.values(scores).every(v => !v);
                    const mainScore = scores.overall || scores.total || '';

                    return (
                      <motion.div
                        key={testId}
                        whileHover={{ y: -5, scale: 1.02 }}
                        onClick={() => {
                          setActiveEditTest(testId);
                          setShowUpdateModal(true);
                        }}
                        className={`relative group cursor-pointer aspect-[4/3] rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${hasData
                          ? 'bg-white border-[#C5A059]/30 shadow-xl'
                          : 'bg-[#FDFBF7] border-[#F1EDEA] hover:border-[#C5A059]/30 shadow-sm'
                          }`}
                      >
                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full transition-opacity duration-500 ${hasData ? 'bg-[#C5A059]/10 opacity-100' : 'bg-white/5 opacity-0 group-hover:opacity-40'}`} />

                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                          <div className="flex items-center justify-between">
                            <span className={`text-[14px] font-bold font-black uppercase tracking-widest ${hasData ? 'text-[#C5A059]' : 'text-[#6B5E51] group-hover:text-[#3C2A21]'}`}>
                              {test.name}
                            </span>
                            {hasData ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle size={12} className="text-[#C5A059]" />
                                <div className="p-1.5 bg-[#C5A059]/10 rounded-lg text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all shadow-inner" onClick={(e) => {
                                  e.stopPropagation();
                                  const tests = { ...formData.testScores };
                                  (tests as any)[testId] = Object.keys((tests as any)[testId]).reduce((acc, k) => ({ ...acc, [k]: '' }), {});
                                  setFormData({ ...formData, testScores: tests });
                                }}>
                                  <Trash2 size={10} />
                                </div>
                              </div>
                            ) : (
                              <Plus size={14} className="text-[#6B5E51] group-hover:text-[#C5A059] transition-colors" />
                            )}
                          </div>

                          <div className="space-y-1">
                            {hasData ? (
                              <>
                                <div className="fd text-2xl font-bold text-[#3C2A21] italic tracking-tighter">
                                  {mainScore || "Active"}
                                </div>
                                <div className="text-[12px] font-black font-black text-[#6B5E51] uppercase tracking-widest opacity-40 italic">
                                  Score Recorded
                                </div>
                              </>
                            ) : (
                              <div className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest group-hover:text-[#3C2A21] transition-colors opacity-40">
                                Add Details
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#C5A059] opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500" />
                      </motion.div>
                    );
                  })}
                </div>

                <div className="pt-8 flex items-center justify-center">
                  <button
                    onClick={() => handleSave()}
                    disabled={saving}
                    className="group relative px-12 py-4 bg-[#3C2A21] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden hover:bg-[#C5A059] transition-all shadow-xl active:scale-95 disabled:opacity-50"
                  >
                    <span className="relative z-10">{saving ? "Syncing Universe..." : "Lock in Scores"}</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'resume' && (
              <section className="glass-panel p-10 md:p-20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#C5A059]/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#FDFBF7] rounded-[2.5rem] border border-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mx-auto mb-8 shadow-inner relative z-10">
                  <FileText size={40} className="opacity-80 md:hidden" />
                  <FileText size={48} className="opacity-80 hidden md:block" />
                </div>
                <h2 className="fd text-xl md:text-2xl font-bold text-[#3C2A21] uppercase tracking-widest mb-4 italic relative z-10">My Resume</h2>
                <p className="text-[#6B5E51] text-[13px] font-bold md:text-[14px] font-bold font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed mb-10 md:mb-12 italic relative z-10 opacity-60">
                  {formData.resumeName ? `Instance Active: ${formData.resumeName}` : "No resume protocol detected."}
                </p>
                <div className="max-w-md mx-auto p-8 md:p-12 border-2 border-dashed border-[#F1EDEA] rounded-[2rem] group hover:border-[#C5A059]/40 transition-all cursor-pointer relative z-10 bg-[#FDFBF7]">
                  <Plus size={24} className="text-[#6B5E51] opacity-20 mx-auto mb-4 group-hover:text-[#C5A059] group-hover:opacity-100 transition-all" />
                  <span className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest block group-hover:text-[#3C2A21] transition-colors opacity-40">Upload New Document</span>
                </div>
              </section>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <ResetPasswordModal 
            email={formData.email} 
            onClose={() => setShowPasswordModal(false)} 
            BACKEND_URL={BACKEND_URL} 
            isBasicAccount={userData?.profile?.isBasicAccount === true}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-12 right-12 bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center gap-4 z-[200]"
          >
            <CheckCircle size={14} /> Profile Updated Successfully
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUpdateModal && activeEditTest && (
          <TestUpdateModal
            testId={activeEditTest}
            testDef={testDefinitions[activeEditTest]}
            scores={(formData.testScores as any)[activeEditTest]}
            onChange={(field: string, value: string) => {
              const tests = { ...formData.testScores };
              (tests as any)[activeEditTest][field] = value;
              setFormData({ ...formData, testScores: tests });
            }}
            onClose={() => setShowUpdateModal(false)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </main>
  );
}

const testDefinitions: any = {
  toefl: { name: 'TOEFL', sections: ['reading', 'speaking', 'listening', 'writing'] },
  ielts: { name: 'IELTS', sections: ['reading', 'speaking', 'listening', 'writing', 'overall'] },
  duolingo: { name: 'Duolingo', sections: ['literacy', 'comprehension', 'conversation', 'production', 'overall'] },
  gre: { name: 'GRE', sections: ['verbal', 'quantitative', 'awa', 'total'] },
  gmat: { name: 'GMAT', sections: ['quantitative', 'verbal', 'ir', 'awa', 'total'] },
  mcat: { name: 'MCAT', sections: ['cpbs', 'cars', 'bbls', 'psbb', 'total'] }
};

function TestUpdateModal({ testId, testDef, scores, onChange, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#3C2A21]/40 backdrop-blur-md" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl bg-white border border-[#C5A059]/20 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

        <div className="p-6 md:p-12 space-y-8 md:space-y-10 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="fd text-3xl font-bold text-[#3C2A21] italic tracking-tighter uppercase">{testDef.name}</h3>
              <p className="text-[14px] font-bold font-black text-[#6B5E51] uppercase tracking-widest opacity-40 italic">Update Sectional Benchmarks</p>
            </div>
            <button onClick={onClose} className="p-2 md:p-3 bg-white border border-[#C5A059]/10 rounded-2xl text-[#6B5E51]/70 hover:text-[#C5A059] transition-all">
              <Plus size={20} className="rotate-45" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
            {testDef.sections.map((section: string) => (
              <div key={section} className="space-y-3">
                <label className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">{section}</label>
                <input
                  type="text"
                  value={scores[section] || ''}
                  onChange={(e) => onChange(section, e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl px-6 py-4 text-sm font-black text-[#3C2A21] focus:border-[#C5A059]/50 outline-none transition-all placeholder:text-[#3C2A21]/10 shadow-inner"
                />
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-5 bg-[#3C2A21] text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all shadow-xl active:scale-95"
          >
            Confirm Scores
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ResetPasswordModal({ email, onClose, BACKEND_URL, isBasicAccount }: { email: string, onClose: () => void, BACKEND_URL: string, isBasicAccount?: boolean }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    setMessage({ text: '', type: '' });

    if ((!isBasicAccount && !currentPassword) || !newPassword || !confirmPassword) {
      setMessage({ text: 'All fields are required', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage({ 
        text: 'Password must be 8+ characters with uppercase, lowercase & numbers', 
        type: 'error' 
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const response = await fetch(`${BACKEND_URL}/api/user/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...(isBasicAccount ? {} : { currentPassword }),
          newPassword, 
          confirmPassword 
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ text: 'Password set successfully! Logging you out...', type: 'success' });
        setTimeout(() => {
          clearAuth();
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        setMessage({ text: data.message || 'Failed to change password', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Server connection error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#3C2A21]/40 backdrop-blur-md" />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        className="relative w-full max-w-sm bg-white border border-[#C5A059]/20 rounded-[2rem] md:rounded-[2rem] p-6 md:p-8 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="fd text-xl font-bold text-[#3C2A21] uppercase italic tracking-tight">{isBasicAccount ? 'Create Password' : 'Change Password'}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 md:p-3 bg-white border border-[#C5A059]/10 rounded-2xl text-[#6B5E51]/70 hover:text-[#C5A059] transition-all"
          >
            <Plus size={20} className="rotate-45" />
          </button>
        </div>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-[14px] font-bold font-black uppercase mb-6 p-4 rounded-xl border flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-600' 
                : 'bg-red-500/10 border-red-500/20 text-red-600'
            }`}
          >
            {message.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {message.text}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Current Password */}
          {!isBasicAccount && (
            <div className="space-y-2">
              <label className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">Current Password</label>
              <div className="relative">
                <input 
                  type={showPasswords.current ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl px-6 py-4 text-[#3C2A21] font-bold shadow-inner focus:border-[#C5A059]/50 outline-none transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E51]/80 hover:text-[#C5A059] transition-colors"
                >
                  {showPasswords.current ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">New Password</label>
            <div className="relative">
              <input 
                type={showPasswords.new ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, uppercase, lowercase & number"
                className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl px-6 py-4 text-[#3C2A21] font-bold shadow-inner focus:border-[#C5A059]/50 outline-none transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E51]/80 hover:text-[#C5A059] transition-colors"
              >
                {showPasswords.new ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold font-black text-[#6B5E51] uppercase tracking-widest ml-1">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showPasswords.confirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl px-6 py-4 text-[#3C2A21] font-bold shadow-inner focus:border-[#C5A059]/50 outline-none transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E51]/80 hover:text-[#C5A059] transition-colors"
              >
                {showPasswords.confirm ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl p-4 space-y-2">
            <p className="text-[12px] font-black font-black text-[#6B5E51] uppercase tracking-widest">Password Requirements:</p>
            <div className="space-y-1 text-[13px] font-bold font-bold text-[#6B5E51]/70">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-[#C5A059]/20'}`} />
                At least 8 characters
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-[#C5A059]/20'}`} />
                One uppercase letter
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-[#C5A059]/20'}`} />
                One lowercase letter
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${/\d/.test(newPassword) ? 'bg-green-500' : 'bg-[#C5A059]/20'}`} />
                One number
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4 bg-white border border-[#C5A059]/20 text-[#6B5E51] rounded-xl font-black text-[14px] font-bold uppercase tracking-widest hover:bg-[#FDFBF7] transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleChangePassword}
              disabled={loading}
              className="flex-1 py-4 bg-[#C5A059] text-white rounded-xl font-black text-[14px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#3C2A21] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  Change Password
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

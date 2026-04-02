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
  Search
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getToken, getUser, setUser } from "@/app/lib/token";

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
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
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
    <main className="min-h-screen bg-dark-950 text-white pb-32 font-base selection:bg-gold-500/30 overflow-x-hidden">

      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/User/dashboard')}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-90 group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-gold-500/60 tracking-[0.3em] ml-1 mb-1">Your Profile</span>
              <h1 className="text-4xl font-extrabold text-white uppercase tracking-tighter leading-none">Edit Profile</h1>
            </div>
          </div>
        </div>
        <button 
          onClick={() => handleSave()}
          disabled={saving}
          className="h-14 px-10 bg-gold-500 text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:bg-gold-400 transition-all shadow-[0_20px_40px_rgba(194,168,120,0.2)] active:scale-95 disabled:opacity-50 flex items-center gap-3"
        >
          {saving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Settings size={16} />}
          {saving ? "Updating..." : "Save Changes"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">

        <aside className="lg:col-span-3 space-y-4">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                    ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab.icon}
                {tab.label}
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
                <section className="bg-dark-900 border border-white/5 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                  <h2 className="text-[10px] font-black uppercase text-gold-500/80 tracking-[0.4em] mb-12 border-b border-white/5 pb-6 relative z-10">Identity Core</h2>
                  
                  <div className="flex flex-col md:flex-row items-center gap-10 mb-12 relative z-10">
                    <div className="relative group/avatar">
                      <div 
                        className="w-28 h-28 rounded-[2.5rem] bg-dark-800 border-4 border-dark-950 overflow-hidden relative group shadow-2xl cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {profileImage ? (
                          <img 
                            src={profileImage.startsWith('http') ? profileImage : `${BACKEND_URL}${profileImage}`} 
                            className="w-full h-full object-cover" 
                            alt="Avatar"
                          />
                        ) : (
                          <img 
                            src={`https://ui-avatars.com/api/?name=${formData.name || 'User'}&background=c2a878&color=000&bold=true&rounded=true`} 
                            className="w-full h-full grayscale opacity-80" 
                            alt="Placeholder"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <Camera size={24} className="text-gold-500" />
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
                       <h3 className="text-2xl font-black text-white italic tracking-tight">{formData.name || "Scholar Instance"}</h3>
                       <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">{formData.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4 max-w-2xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                      <div className="flex items-center justify-between py-4 border-b border-white/5 px-4 rounded-xl cursor-default group hover:bg-white/[0.01] transition-all">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Gender Expression</span>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="bg-transparent text-xs font-black text-white focus:outline-none text-right cursor-pointer"
                        >
                          <option value="" className="bg-dark-900">Select Gender</option>
                          <option value="Male" className="bg-dark-900">Male</option>
                          <option value="Female" className="bg-dark-900">Female</option>
                          <option value="Other" className="bg-dark-900">Other</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-white/5 px-4 rounded-xl cursor-default group hover:bg-white/[0.01] transition-all">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Origin Date</span>
                        <input
                          type="date"
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          className="bg-transparent text-xs font-black text-white focus:outline-none text-right cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-4">Personal Narrative (Bio)</label>
                       <textarea 
                          rows={4} 
                          value={formData.bio} 
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                          placeholder="Craft your scholarship narrative..."
                          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-6 text-xs font-bold text-white focus:border-gold-500/30 outline-none transition-all resize-none"
                       />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase px-4">Profile Settings</h2>
                <section className="bg-dark-900/50 border border-white/5 rounded-[2rem] p-10 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {[
                      { label: 'First Name', val: formData.name.split(' ')[0], type: 'first' },
                      { label: 'Last Name', val: formData.name.split(' ').slice(1).join(' '), type: 'last' },
                      { label: 'Mobile Frequency', val: formData.mobile, field: 'mobile' },
                      { label: 'Location Hub', val: formData.location, field: 'location' },
                      { label: 'LinkedIn Node', val: formData.linkedin, field: 'linkedin' },
                    ].map((item) => (
                      <div key={item.label} className="space-y-3">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">{item.label}</label>
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
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-xs font-bold text-white focus:border-gold-500/50 outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5 flex gap-4">
                     <button onClick={() => setShowPasswordModal(true)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Access Logic Reset</button>
                     <button onClick={() => handleSave()} disabled={saving} className="ml-auto px-12 py-3.5 bg-gold-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-400 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                        {saving ? "Updating..." : "Synchronize Profile"}
                     </button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-10">
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase px-4">Education History</h2>
                {[
                  { id: 'highSchool', label: 'High School' },
                  { id: 'bachelors', label: "Bachelor's Degree" },
                  { id: 'masters', label: "Master's Degree" }
                ].map((sec) => (
                  <section key={sec.id} className="bg-dark-900/50 border border-white/5 rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-4">
                       <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-500">
                          <GraduationCap size={16} />
                       </div>
                       <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{sec.label}</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-1 space-y-2">
                           <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">{sec.id === 'highSchool' ? 'School Name' : 'University Name'}</label>
                           <input
                              type="text"
                              value={(formData.education as any)[sec.id][sec.id === 'highSchool' ? 'schoolName' : 'uniName'] || ''}
                              onChange={(e) => {
                                 const edu = { ...formData.education };
                                 (edu as any)[sec.id][sec.id === 'highSchool' ? 'schoolName' : 'uniName'] = e.target.value;
                                 setFormData({ ...formData, education: edu });
                              }}
                              placeholder="Enter Institution Name"
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-xs font-bold text-white focus:border-gold-500/50 outline-none transition-all"
                           />
                        </div>
                        {sec.id !== 'highSchool' && (
                           <div className="flex-1 space-y-2">
                              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Degree Title</label>
                              <input
                                 type="text"
                                 value={(formData.education as any)[sec.id].degreeName || ''}
                                 onChange={(e) => {
                                    const edu = { ...formData.education };
                                    (edu as any)[sec.id].degreeName = e.target.value;
                                    setFormData({ ...formData, education: edu });
                                 }}
                                 placeholder="e.g. Computer Science"
                                 className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-xs font-bold text-white focus:border-gold-500/50 outline-none transition-all"
                              />
                           </div>
                        )}
                        <div className="w-full md:w-auto space-y-2">
                           <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Result (CGPA)</label>
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
                                 className="w-24 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-center text-xs font-black text-white" 
                              />
                              <span className="text-gray-700 text-[10px] font-black uppercase">/</span>
                              <input 
                                 type="text" 
                                 value={(formData.education as any)[sec.id].outOf || ''} 
                                 placeholder="Max"
                                 onChange={(e) => {
                                    const edu = { ...formData.education };
                                    (edu as any)[sec.id].outOf = e.target.value;
                                    setFormData({ ...formData, education: edu });
                                 }} 
                                 className="w-20 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-center text-xs font-black text-white" 
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
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase px-4">Future Aspirations</h2>
                <section className="bg-dark-900/50 border border-white/5 rounded-2xl p-8 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { label: 'University Name', field: 'uniName', icon: <LayoutDashboard size={14} /> },
                      { label: 'Target Major', field: 'major', icon: <Target size={14} /> },
                      { label: 'Admission Term', field: 'term', placeholder: 'e.g. Fall / Spring', icon: <Settings size={14} /> },
                      { label: 'Target Year', field: 'year', placeholder: 'e.g. 2025', icon: <Settings size={14} /> },
                    ].map((item) => (
                      <div key={item.field} className="space-y-2">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 flex items-center gap-2">
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
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-xs font-bold text-white focus:border-gold-500/50 outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-10 pt-8 border-t border-white/5 flex">
                    <button onClick={() => handleSave()} disabled={saving} className="ml-auto px-12 py-3.5 bg-gold-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-400 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                      {saving ? "Syncing..." : "Update Trajectory"}
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="space-y-12">
                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                  <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Standardized Tests</h2>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] max-w-sm leading-relaxed">
                    Quantify your academic excellence with global benchmarks.
                  </p>
                  <div className="h-1 w-24 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent rounded-full" />
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
                        className={`relative group cursor-pointer aspect-[4/3] rounded-3xl border transition-all duration-500 overflow-hidden ${
                          hasData 
                          ? 'bg-dark-900/50 border-gold-500/30 shadow-[0_10px_40px_rgba(194,168,120,0.05)]' 
                          : 'bg-white/[0.02] border-white/5 hover:border-gold-500/20'
                        }`}
                      >
                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full transition-opacity duration-500 ${hasData ? 'bg-gold-500/10 opacity-100' : 'bg-white/5 opacity-0 group-hover:opacity-40'}`} />
                        
                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${hasData ? 'text-gold-500' : 'text-gray-600 group-hover:text-gray-400'}`}>
                              {test.name}
                            </span>
                            {hasData ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle size={12} className="text-gold-500" />
                                <div className="p-1.5 bg-gold-500/10 rounded-lg text-gold-500 hover:bg-gold-500 hover:text-black transition-all" onClick={(e) => {
                                   e.stopPropagation();
                                   const tests = { ...formData.testScores };
                                   (tests as any)[testId] = Object.keys((tests as any)[testId]).reduce((acc, k) => ({ ...acc, [k]: '' }), {});
                                   setFormData({...formData, testScores: tests});
                                }}>
                                  <Trash2 size={10} />
                                </div>
                              </div>
                            ) : (
                              <Plus size={14} className="text-gray-700 group-hover:text-gold-500 transition-colors" />
                            )}
                          </div>

                          <div className="space-y-1">
                            {hasData ? (
                              <>
                                <div className="text-2xl font-black text-white italic tracking-tighter">
                                  {mainScore || "Active"}
                                </div>
                                <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                  Score Recorded
                                </div>
                              </>
                            ) : (
                              <div className="text-[9px] font-black text-gray-700 uppercase tracking-widest group-hover:text-gray-500 transition-colors">
                                Add Details
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gold-500 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500" />
                      </motion.div>
                    );
                  })}
                </div>

                <div className="pt-8 flex items-center justify-center">
                  <button 
                    onClick={() => handleSave()} 
                    disabled={saving}
                    className="group relative px-12 py-4 bg-gold-500 text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden hover:bg-gold-400 transition-all shadow-[0_20px_40px_rgba(194,168,120,0.3)] active:scale-95 disabled:opacity-50"
                  >
                    <span className="relative z-10">{saving ? "Syncing Universe..." : "Lock in Scores"}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'resume' && (
              <section className="bg-dark-900 border border-white/5 rounded-[2rem] p-20 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full -ml-32 -mt-32" />
                <div className="w-24 h-24 bg-gold-500/5 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-gold-500 mx-auto mb-10 shadow-3xl relative z-10">
                  <FileText size={48} className="opacity-80" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4 italic relative z-10">My Resume</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest max-w-xs mx-auto leading-relaxed mb-12 italic relative z-10">
                  {formData.resumeName ? `Instance Active: ${formData.resumeName}` : "No resume protocol detected."}
                </p>
                <div className="max-w-md mx-auto p-12 border-2 border-dashed border-white/10 rounded-3xl group hover:border-gold-500/20 transition-all cursor-pointer relative z-10">
                  <Plus size={24} className="text-gray-700 mx-auto mb-4 group-hover:text-gold-500 transition-colors" />
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block group-hover:text-white transition-colors">Upload New Document</span>
                </div>
              </section>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showPasswordModal && (
          <ResetPasswordModal email={formData.email} onClose={() => setShowPasswordModal(false)} BACKEND_URL={BACKEND_URL} />
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl bg-dark-900 border border-white/5 rounded-[3rem] overflow-hidden shadow-3xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        
        <div className="p-12 space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{testDef.name}</h3>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Update Sectional Benchmarks</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors">
              <Plus size={20} className="rotate-45" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {testDef.sections.map((section: string) => (
              <div key={section} className="space-y-3">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">{section}</label>
                <input 
                  type="text"
                  value={scores[section] || ''}
                  onChange={(e) => onChange(section, e.target.value)}
                  placeholder="0"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white focus:border-gold-500/50 outline-none transition-all placeholder:text-white/5"
                />
              </div>
            ))}
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-gold-500 text-black rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gold-400 transition-all shadow-xl active:scale-95"
          >
            Confirm Scores
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function TestSelectionModal({ selectedTests, onToggle, onClose }: { selectedTests: any, onToggle: (id: string) => void, onClose: () => void }) {
  const tests = [
    { id: 'toefl', name: 'TOEFL' },
    { id: 'ielts', name: 'IELTS' },
    { id: 'duolingo', name: 'Duolingo' },
    { id: 'gre', name: 'GRE' },
    { id: 'gmat', name: 'GMAT' },
    { id: 'mcat', name: 'MCAT' },
  ];

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        className="relative w-full max-w-4xl bg-dark-900 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row h-[600px] shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
      >
        {/* Left Banner */}
        <div className="w-full md:w-80 bg-gold-500 p-12 flex flex-col items-center justify-center text-center gap-8">
           <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center">
              <ClipboardList size={40} className="text-white" />
           </div>
           <div className="space-y-4">
              <h3 className="text-2xl font-black text-black uppercase leading-tight">Add Test Details</h3>
              <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Please list any standardized tests you've taken in the past.</p>
           </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white p-12 overflow-y-auto relative">
           <button onClick={onClose} className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors">
              <Plus size={24} className="rotate-45" />
           </button>

           <div className="max-w-md mx-auto space-y-10">
              <div className="space-y-2">
                 <h4 className="text-sm font-black text-black uppercase tracking-widest">Select tests you have appeared for</h4>
                 <div className="h-1 w-20 bg-gold-500 rounded-full" />
              </div>

              <div className="space-y-3">
                 {tests.map(test => (
                    <div 
                      key={test.id} 
                      onClick={() => onToggle(test.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer group ${selectedTests[test.id] ? 'border-gold-500 bg-gold-50/50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                       <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTests[test.id] ? 'text-gold-600' : 'text-gray-400 group-hover:text-gray-600'}`}>{test.name}</span>
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedTests[test.id] ? 'bg-gold-500 border-gold-500' : 'border-gray-200'}`}>
                          {selectedTests[test.id] && <Check size={14} className="text-white" />}
                       </div>
                    </div>
                 ))}
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-900 transition-all shadow-xl active:scale-95"
              >
                Proceed to Scores
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function ResetPasswordModal({ email, onClose, BACKEND_URL }: { email: string, onClose: () => void, BACKEND_URL: string }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleTriggerOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        setStep(2);
        setMessage({ text: 'Check your email for the code.', type: 'success' });
      } else {
        const error = await response.json();
        setMessage({ text: error.error || 'Failed to send code.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to connect to server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      setMessage({ text: 'Please fill all fields.', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      if (response.ok) {
        setMessage({ text: 'Password Updated Successfully.', type: 'success' });
        setTimeout(onClose, 2000);
      } else {
        const error = await response.json();
        setMessage({ text: error.error || 'Failed to update password.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to connect to server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-dark-900 border border-white/5 rounded-[2rem] p-12 overflow-hidden">
        <h3 className="text-2xl font-black text-white uppercase mb-8">Reset Password</h3>
        {message.text && (
          <div className={`text-[10px] font-black uppercase mb-8 p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {message.text}
          </div>
        )}
        {step === 1 ? (
          <div className="space-y-8">
            <p className="text-gray-500 text-[11px] font-black uppercase tracking-widest">Click below to send a code to {email}</p>
            <button disabled={loading} onClick={handleTriggerOTP} className="w-full py-4 bg-gold-500 text-black rounded-xl font-black text-[10px] uppercase">{loading ? 'Sending...' : 'Send OTP'}</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Enter Code</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-black" placeholder="000000" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white" placeholder="Min 6 characters" />
            </div>
            <button disabled={loading} onClick={handleResetPassword} className="w-full py-4 bg-gold-500 text-black rounded-xl font-black text-[10px] uppercase">{loading ? 'Saving...' : 'Reset Password'}</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

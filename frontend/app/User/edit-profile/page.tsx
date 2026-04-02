'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  ChevronRight 
} from 'lucide-react';
import Image from 'next/image';

export default function EditProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    linkedin: '',
  });

  const BACKEND_URL = "http://localhost:5000";

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
        setFormData({
          name: data.name || '',
          location: data.profile?.location || '',
          bio: data.profile?.bio || '',
          linkedin: data.profile?.linkedin || '',
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/profile/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'settings', label: 'Profile Settings', icon: <Briefcase size={18} /> },
    { id: 'scores', label: 'Tests Scores', icon: <Award size={18} /> },
    { id: 'resume', label: 'Upload Resume', icon: <FileText size={18} /> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <Loader2 className="w-8 h-8 text-[#fbc02d] animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#2d3748] font-sans">
      
      {/* Top Navbar Placeholder (to match height) */}
      <div className="h-16 bg-white border-b border-gray-200"></div>

      <div className="max-w-7xl mx-auto flex py-10 px-6 gap-10">
        
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#e7f1ff] text-[#007bff] border-l-4 border-[#007bff]' 
                  : 'text-[#718096] hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* Main Card: Basic Info */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-3xl font-medium text-gray-400">Basic info</h2>
                <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full">
                  <Edit2 size={16} />
                </button>
             </div>
             
             <div className="flex flex-col items-center py-10 border-b border-gray-100">
                <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center relative overflow-hidden group mb-4">
                  {userData?.profile?.profileImage ? (
                    <Image src={`${BACKEND_URL}${userData.profile.profileImage}`} alt="Profile" fill className="object-cover" />
                  ) : (
                    <User size={40} className="text-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#2d3748]">{userData?.name || "User Name"}</h3>
             </div>

             <div className="p-2">
                <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-all group cursor-pointer border-b border-gray-100/50">
                  <span className="text-[#718096] font-medium w-1/3">Full Name</span>
                  <div className="flex-1 flex items-center justify-between">
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-[#f1f3f5] border-none rounded-xl px-6 py-3 w-full max-w-md font-medium text-[#2d3748] outline-none"
                    />
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-all group cursor-pointer">
                  <span className="text-[#718096] font-medium w-1/3">Location</span>
                  <div className="flex-1 flex items-center justify-between">
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="bg-[#f1f3f5] border-none rounded-xl px-6 py-3 w-full max-w-md font-medium text-[#2d3748] outline-none"
                    />
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500" />
                  </div>
                </div>
             </div>
          </section>

          {/* Contact Info Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-8 border-b border-gray-100">
                <h2 className="text-3xl font-medium text-gray-400">Contact info</h2>
             </div>
             <div className="p-2">
                <div className="flex items-center justify-between p-6 hover:bg-gray-50 transition-all group cursor-pointer">
                  <span className="text-[#718096] font-medium w-1/3">LinkedIn</span>
                  <div className="flex-1 flex items-center justify-between">
                    <input 
                      type="url" 
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                      className="bg-[#f1f3f5] border-none rounded-xl px-6 py-3 w-full max-w-md font-medium text-[#2d3748] outline-none"
                      placeholder="https://linkedin.com/in/..."
                    />
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500" />
                  </div>
                </div>
             </div>
          </section>

          {/* Account Settings / Bio Card */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-8 border-b border-gray-100">
                <h2 className="text-3xl font-medium text-gray-400">Account settings</h2>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[#718096] font-medium block">Professional Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-[#f1f3f5] border-none rounded-2xl p-6 font-medium text-[#2d3748] outline-none resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
             </div>
          </section>

          {/* Action Button */}
          <div className="flex justify-center pt-6">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-12 py-4 bg-[#fbc02d] text-white rounded-xl font-bold hover:bg-[#f9a825] transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-3"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
            </button>
          </div>

        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-10 right-10 bg-[#20C997] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl z-50"
        >
          <CheckCircle size={20} /> Settings saved successfully
        </motion.div>
      )}

    </main>
  );
}

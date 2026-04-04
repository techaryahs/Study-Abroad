"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Award, 
  BookOpen, 
  FileText, 
  Camera, 
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle
} from "lucide-react";
import { getUser, getToken, setUser as setLocalUser } from "@/app/lib/token";

const ConsultantEditProfile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    expertise: "",
    experience: "",
    bio: "",
    price: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token || !user) {
      router.push("/auth/login");
      return;
    }
    const userId = user._id || user.id;
    if (userId) fetchProfile(userId);
    else console.warn("No valid user ID found in session");
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/consultant/profile/${userId}`);
      if (res.ok) {
        const data = await res.json();
        const u = data.user;
        
        if (!u) {
          console.warn("⚠️ User data was found but the user object is null. Check backend logging.");
          return;
        }

        setFormData({
          name: u.name || "",
          email: u.email || "",
          mobile: u.mobile || "",
          role: u.role || "",
          expertise: u.expertise || "",
          experience: u.experience || "",
          bio: u.bio || "",
          price: u.price || 0
        });
        
        const imageUrl = u.image || u.profileImage;
        if (imageUrl) {
          setPreviewUrl(imageUrl.startsWith('http') ? imageUrl : `${BACKEND_URL}${imageUrl}`);
        }
      } else {
        console.error("❌ Failed to fetch backend profile. Status:", res.status);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    
    const user = getUser();
    const userId = user?._id || user?.id;
    if (!userId) {
      setStatus({ type: 'error', message: 'No valid session. Please re-login.' });
      setSaving(false);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });
    if (imageFile) {
      data.append("profileImage", imageFile);
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/consultant/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`
        },
        body: data
      });

      if (res.ok) {
        const result = await res.json();
        setStatus({ type: 'success', message: 'Profile saved successfully!' });
        
        // Ensure we update everything locally
        const updatedUser = { 
          ...user, 
          ...result.user, 
          _id: result.user._id, // Consistency check
          profileImage: result.user.image || result.user.profileImage
        };
        setLocalUser(updatedUser);
        
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus({ type: 'error', message: 'Failed to save changes.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection failure during save.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4">
         <div className="w-10 h-10 border-2 border-[#c2a878] border-t-transparent rounded-full animate-spin"></div>
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878]/50">Synchronizing Profile...</p>
      </div>
    );
  }

  const initials = (formData.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Navigation */}
        <button 
          onClick={() => router.push("/consultant-dashboard")}
          className="flex items-center gap-2 text-gray-700 hover:text-[#c2a878] transition-colors font-black text-[9px] uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={12} /> Return to Manager
        </button>

        <div className="relative">
           {/* Decorative Background Glow */}
           <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#c2a878]/5 rounded-full blur-[80px] pointer-events-none" />
           <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#c2a878]/5 rounded-full blur-[80px] pointer-events-none" />

           <div className="relative bg-white/[0.01] border border-white/[0.05] rounded-[2.5rem] p-8 md:p-14 overflow-hidden shadow-2xl">
              
              <div className="mb-10 text-center md:text-left">
                 <h1 className="text-3xl font-black text-white uppercase italic font-serif tracking-tighter mb-2">Edit Profile</h1>
                 <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] leading-relaxed max-w-lg">
                   Securely manage your professional credentials within the <span className="text-[#c2a878]">Elite Network</span>.
                 </p>
              </div>

              {/* Status Display */}
              {status && (
                <div className={`mb-12 p-5 rounded-2xl flex items-center gap-4 border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'} animate-in fade-in slide-in-from-top-4 duration-500`}>
                   {status.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">{status.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-16">
                 
                 {/* Image Upload Area */}
                 <div className="flex flex-col items-center justify-center gap-8">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                       <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-[#c2a878]/20 to-transparent p-1 transition-transform duration-500 group-hover:scale-105">
                          <div className="w-full h-full rounded-[2.9rem] bg-[#0a0a0a] overflow-hidden relative border border-white/10 flex items-center justify-center">
                             {previewUrl ? (
                                <img 
                                  src={previewUrl} 
                                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" 
                                  alt="Preview" 
                                  onError={(e) => {
                                    (e.target as any).style.display = 'none';
                                    (e.target as any).parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-[#c2a878] text-black font-black text-4xl uppercase">${initials}</div>`;
                                  }}
                                />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#c2a878] text-black font-black text-4xl uppercase">{initials}</div>
                             )}
                          </div>
                       </div>
                       <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#c2a878] rounded-2xl flex items-center justify-center text-black shadow-2xl border-4 border-[#05070a] transition-transform hover:scale-110">
                          <Camera size={18} />
                       </div>
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700">Digital Signature / Profile Portrait</p>
                 </div>

                 {/* Information Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878]/80">Full Name</label>
                       <div className="relative">
                          <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-4 pl-8 pr-4 text-sm focus:border-[#c2a878] outline-none transition-all placeholder:text-gray-800" placeholder="Full Name" />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878]/80">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-4 pl-8 pr-4 text-sm focus:border-[#c2a878] outline-none transition-all placeholder:text-gray-800" placeholder="Email" />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878]/80">Job Role</label>
                       <div className="relative">
                          <Briefcase className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                          <input type="text" name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-4 pl-8 pr-4 text-sm focus:border-[#c2a878] outline-none transition-all placeholder:text-gray-900" placeholder="e.g. Senior Career Pathologist" />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878]/80">Expertise Area</label>
                       <div className="relative">
                          <Award className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                          <input type="text" name="expertise" value={formData.expertise} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-4 pl-8 pr-4 text-sm focus:border-[#c2a878] outline-none transition-all placeholder:text-gray-900" placeholder="Expertise" />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878]/80">Experience</label>
                       <div className="relative">
                          <BookOpen className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                          <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-4 pl-8 pr-4 text-sm focus:border-[#c2a878] outline-none transition-all placeholder:text-gray-900" placeholder="Years Experience" />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878]/80">Consultation Price (INR)</label>
                       <div className="relative text-[#c2a878]">
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 font-bold text-sm">₹</span>
                          <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-transparent border-b border-white/10 py-4 pl-8 pr-4 text-sm text-white focus:border-[#c2a878] outline-none transition-all" />
                       </div>
                    </div>
                 </div>

                 {/* Professional Bio */}
                 <div className="space-y-4 pt-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c2a878]/80">Professional Narrative</label>
                    <div className="relative">
                       <FileText className="absolute left-0 top-1 w-4 h-4 text-gray-800" />
                       <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={6} className="w-full bg-white/[0.02] border-b border-white/10 py-1 pl-8 pr-4 text-sm focus:border-[#c2a878] outline-none transition-all resize-none italic leading-relaxed" placeholder="Tell students about your journey and mentorship style..." />
                    </div>
                 </div>

                 <div className="flex justify-center md:justify-end pt-10">
                   <button 
                    type="submit" 
                    disabled={saving}
                    className="group relative px-16 py-5 bg-[#c2a878] text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#d4af37] transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 overflow-hidden shadow-[0_20px_60px_-15px_rgba(194,168,120,0.3)]"
                   >
                      {saving ? "SAVING IDENTITY..." : <><Save size={16} /> SAVE CHANGES</>}
                      <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
                   </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantEditProfile;

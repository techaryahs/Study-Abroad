"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Building,
  Briefcase,
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function PartnerRegistration() {
  const router = useRouter();
  
  const [partnerType, setPartnerType] = useState<"edu_leader" | "edu_mitra" | "">("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationEmail: "",
    organizationPhone: "",
    designation: "",
  });
  const [consent, setConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NEXT_PUBLIC_BACKEND_URL !== 'undefined')
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : 'http://localhost:5001';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!partnerType) {
      setErrorMsg("Please select a Partner Type");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }

    if (!consent) {
      setErrorMsg("You must agree to the partner onboarding terms");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register-partner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
          password: formData.password.trim(),
          partnerType,
          organizationName: formData.organizationName.trim(),
          organizationEmail: formData.organizationEmail.trim(),
          organizationPhone: formData.organizationPhone.trim(),
          designation: formData.designation.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push("/register/partner/status");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FDFBF7]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-[#C5A059]/15 rounded-[2rem] shadow-xl w-full max-w-xl p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-[#3C2A21] mb-4 uppercase italic">Partner Registration Submitted</h1>
          <p className="text-[#6B5E51] mb-2 font-bold text-[14px] leading-relaxed">
            Your partner application has been submitted successfully and is currently under review.
          </p>
          <p className="text-[#6B5E51] mb-8 font-bold text-[14px] leading-relaxed">
            Your account will be available after administrator approval.
          </p>
          <button
            onClick={() => router.push("/register/partner/status")}
            className="mx-auto flex items-center justify-center gap-2 py-4 px-8 bg-[#3C2A21] text-white font-black rounded-xl shadow-lg transition-all hover:bg-[#C5A059] uppercase tracking-widest text-[11px]"
          >
            View Application Status
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7]">
      <div className="bg-white border border-[#C5A059]/15 rounded-[2rem] md:rounded-[2.5rem] shadow-3xl w-full max-w-4xl flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
        
        <div className="p-8 md:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-black text-[#3C2A21] mb-4 uppercase tracking-tighter italic" style={{ fontFamily: "Georgia, serif" }}>
              Partner Registration
            </h1>
            <p className="text-[#6B5E51] font-bold text-[14px] max-w-xl mx-auto uppercase tracking-widest">
              Join Edu Leader Global as an authorized education partner.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Partner Type */}
            <div>
              <h2 className="text-[12px] font-black text-[#3C2A21] uppercase tracking-widest mb-4">1. Select Partner Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setPartnerType("edu_leader")}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${partnerType === "edu_leader" ? "border-[#C5A059] bg-[#C5A059]/5 shadow-md" : "border-[#F1EDEA] bg-[#FDFBF7] hover:border-[#C5A059]/50"}`}
                >
                  <h3 className="text-[14px] font-black text-[#3C2A21] uppercase tracking-widest mb-2">Edu Leader</h3>
                  <p className="text-[#6B5E51] text-[11px] font-bold">College outreach, seminars, student lead generation and partnership tracking.</p>
                </div>
                <div
                  onClick={() => setPartnerType("edu_mitra")}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${partnerType === "edu_mitra" ? "border-[#C5A059] bg-[#C5A059]/5 shadow-md" : "border-[#F1EDEA] bg-[#FDFBF7] hover:border-[#C5A059]/50"}`}
                >
                  <h3 className="text-[14px] font-black text-[#3C2A21] uppercase tracking-widest mb-2">Edu Mitra</h3>
                  <p className="text-[#6B5E51] text-[11px] font-bold">Student counselling, applications, admissions and university commission processing.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Step 2: Basic Details */}
              <div className="space-y-4">
                <h2 className="text-[12px] font-black text-[#3C2A21] uppercase tracking-widest mb-4 border-b border-[#F1EDEA] pb-2">2. Basic Details</h2>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Full Name *</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/70 group-focus-within:text-[#C5A059] transition-all" />
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="w-full pl-12 pr-4 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Email *</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/70 group-focus-within:text-[#C5A059] transition-all" />
                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full pl-12 pr-4 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Mobile Number *</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/70 group-focus-within:text-[#C5A059] transition-all" />
                    <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="+91 9876543210" className="w-full pl-12 pr-4 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Password *</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/70 group-focus-within:text-[#C5A059] transition-all" />
                    <input required type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="w-full pl-12 pr-12 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E51]/70 hover:text-[#C5A059] outline-none">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Confirm Password *</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/70 group-focus-within:text-[#C5A059] transition-all" />
                    <input required type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className="w-full pl-12 pr-12 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B5E51]/70 hover:text-[#C5A059] outline-none">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Organization Details */}
              <div className="space-y-4">
                <h2 className="text-[12px] font-black text-[#3C2A21] uppercase tracking-widest mb-4 border-b border-[#F1EDEA] pb-2">3. Organization Details</h2>
                
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Organization Name *</label>
                  <div className="relative group">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/70 group-focus-within:text-[#C5A059] transition-all" />
                    <input required type="text" name="organizationName" value={formData.organizationName} onChange={handleInputChange} placeholder="EduCorp Ltd." className="w-full pl-12 pr-4 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Organization Email *</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/70 group-focus-within:text-[#C5A059] transition-all" />
                    <input required type="email" name="organizationEmail" value={formData.organizationEmail} onChange={handleInputChange} placeholder="contact@educorp.com" className="w-full pl-12 pr-4 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Organization Phone *</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/70 group-focus-within:text-[#C5A059] transition-all" />
                    <input required type="tel" name="organizationPhone" value={formData.organizationPhone} onChange={handleInputChange} placeholder="+91 1234567890" className="w-full pl-12 pr-4 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-black font-bold uppercase tracking-widest ml-1">Designation *</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5E51]/70 group-focus-within:text-[#C5A059] transition-all" />
                    <input required type="text" name="designation" value={formData.designation} onChange={handleInputChange} placeholder="Director / Principal" className="w-full pl-12 pr-4 py-4 bg-[#FDFBF7] border border-[#F1EDEA] rounded-2xl text-xs text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none transition-all shadow-inner" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Consent & Submit */}
            <div className="pt-6 border-t border-[#F1EDEA]">
              <label className="flex items-start gap-3 cursor-pointer group mb-6">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="peer appearance-none w-5 h-5 rounded-md border-2 border-[#C5A059]/50 bg-white checked:bg-[#C5A059] checked:border-[#C5A059] transition-all cursor-pointer" />
                  <CheckCircle2 className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-[11px] font-bold text-[#6B5E51] group-hover:text-[#3C2A21] transition-colors leading-relaxed">
                  I confirm that the information provided is accurate and I agree to the Edu Leader Global partner onboarding terms.
                </span>
              </label>

              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl flex items-center gap-3 text-[12px] font-bold uppercase tracking-wider mb-6">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{errorMsg}</p>
                </motion.div>
              )}

              <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-[#3C2A21] text-white font-black rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 group uppercase tracking-widest text-[12px] active:scale-95 hover:bg-[#C5A059]">
                {isSubmitting ? "Submitting..." : "Submit Partner Registration"}
                {!isSubmitting && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
            
            <div className="mt-8 flex flex-col gap-4 items-center border-t border-[#F1EDEA] pt-6">
              <p className="text-[10px] font-black text-black font-bold uppercase tracking-widest cursor-pointer hover:text-[#C5A059] transition-colors" onClick={() => router.push("/auth/login")}>Already registered? Login</p>
              <p className="text-[10px] font-black text-black font-bold uppercase tracking-widest cursor-pointer hover:text-[#C5A059] transition-colors" onClick={() => router.push("/auth/RegisterStudent")}>Looking to register as a student? Student Registration</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

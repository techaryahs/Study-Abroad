"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SeminarRegistration() {
  const { id: seminarId } = useParams();
  const router = useRouter();

  const [seminar, setSeminar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    course: "",
    graduationYear: "",
    preferredCountry: "",
    preferredProgram: "",
    studyAbroadTimeline: "Within 1 Year",
    consentGiven: false
  });

  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/public/seminars/${seminarId}`);
        setSeminar(res.data.seminar);
      } catch (err: any) {
        setError(err.response?.data?.message || "Seminar not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };
    if (seminarId) fetchSeminar();
  }, [seminarId]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      alert("Please agree to the terms to proceed.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/public/seminars/${seminarId}/register`, formData);
      if (res.data.isDuplicate) {
        setIsDuplicate(true);
        setSuccessMessage(res.data.message);
        setSuccess(true);
      } else {
        setOtpStep(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5011"}/api/public/seminars/${seminarId}/verify-otp`, {
        mobile: formData.mobile,
        otp
      });
      setSuccessMessage(res.data.message || "Registration successful!");
      setSuccess(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-[#c2a878]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-grow max-w-2xl w-full mx-auto px-4 py-12 md:py-20">
        
        <div className="text-center mb-10">
          <h2 className="text-[#c2a878] text-xs font-black uppercase tracking-[0.3em] mb-2">EduLeader Global</h2>
          <h1 className="text-3xl md:text-4xl font-black text-[#3C2A21] uppercase italic tracking-tighter">Seminar Registration</h1>
          <div className="h-1 w-12 bg-[#c2a878] mx-auto mt-4 rounded-full" />
        </div>

        {error ? (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center">
            <AlertCircle className="text-red-400 mb-4" size={48} />
            <h3 className="text-red-800 font-bold mb-2">Seminar Unavailable</h3>
            <p className="text-red-600/70 text-sm">{error}</p>
          </div>
        ) : success ? (
          <div className="bg-white p-8 rounded-[2rem] border border-[#c2a878]/20 shadow-2xl flex flex-col items-center justify-center text-center">
            <CheckCircle className="text-green-500 mb-6" size={64} />
            <h3 className="text-[#3C2A21] text-2xl font-black uppercase italic mb-4">Registration Complete!</h3>
            <p className="text-[#6B5E51] font-medium leading-relaxed max-w-md">
              {successMessage}
            </p>
            <button 
              onClick={() => router.push("/")}
              className="mt-8 px-8 py-4 bg-[#c2a878] text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg hover:bg-[#b09665]"
            >
              Return Home
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-[#c2a878]/20 shadow-2xl relative overflow-hidden">
            
            {/* Event Details */}
            <div className="bg-[#3C2A21] text-white -m-6 md:-m-10 mb-8 md:mb-10 p-8 rounded-b-[2rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-black uppercase italic mb-2">{seminar.title || "Study Abroad Seminar"}</h3>
                <p className="text-[#c2a878] font-bold text-sm tracking-wider uppercase">{seminar.collegeName}</p>
                <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-medium text-white/70">
                  <span className="bg-white/10 px-3 py-1.5 rounded-full">{new Date(seminar.date).toLocaleDateString()}</span>
                  <span className="bg-white/10 px-3 py-1.5 rounded-full">{seminar.venue}</span>
                </div>
              </div>
            </div>

            {!otpStep ? (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2">Full Name *</label>
                    <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-4 py-3 text-sm text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2">Mobile Number *</label>
                    <input required type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-4 py-3 text-sm text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none" placeholder="+91" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2">Email Address *</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-4 py-3 text-sm text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2">Course / Stream</label>
                    <input type="text" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-4 py-3 text-sm text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2">Graduation Year</label>
                    <input type="text" value={formData.graduationYear} onChange={e => setFormData({...formData, graduationYear: e.target.value})} className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-4 py-3 text-sm text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2">Preferred Country</label>
                    <input type="text" value={formData.preferredCountry} onChange={e => setFormData({...formData, preferredCountry: e.target.value})} className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-4 py-3 text-sm text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none" placeholder="e.g. USA, UK" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-black uppercase tracking-widest ml-1 mb-2">Timeline</label>
                    <select value={formData.studyAbroadTimeline} onChange={e => setFormData({...formData, studyAbroadTimeline: e.target.value})} className="w-full bg-[#FDFBF7] border border-[#F1EDEA] rounded-xl px-4 py-3 text-sm text-[#3C2A21] font-bold focus:border-[#C5A059] outline-none">
                      <option value="Within 6 Months">Within 6 Months</option>
                      <option value="Within 1 Year">Within 1 Year</option>
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="Not Sure">Not Sure</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 pb-2 border-t border-[#F1EDEA] mt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.consentGiven} onChange={e => setFormData({...formData, consentGiven: e.target.checked})} className="mt-1 w-4 h-4 text-[#C5A059] border-gray-300 rounded focus:ring-[#C5A059]" />
                    <span className="text-xs text-[#6B5E51] font-medium leading-relaxed">
                      I consent to EduLeader Global contacting me regarding study abroad opportunities and recording my attendance at this seminar.
                    </span>
                  </label>
                </div>

                <button disabled={submitting || !formData.consentGiven} type="submit" className="w-full py-4 bg-[#3C2A21] text-white font-black rounded-xl shadow-xl transition-all uppercase tracking-widest text-[11px] hover:bg-[#C5A059] disabled:opacity-50">
                  {submitting ? "Processing..." : "Register Now"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6 text-center py-6">
                <h3 className="text-xl font-black text-[#3C2A21] uppercase italic">Verify Phone Number</h3>
                <p className="text-sm text-[#6B5E51]">We sent a 6-digit code to <span className="font-bold">{formData.mobile}</span>.</p>
                
                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full max-w-[200px] mx-auto bg-[#FDFBF7] border border-[#C5A059] rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] text-[#3C2A21] font-mono focus:outline-none shadow-inner"
                    placeholder="000000"
                  />
                </div>
                
                <button disabled={submitting || otp.length !== 6} type="submit" className="w-full py-4 bg-[#3C2A21] text-white font-black rounded-xl shadow-xl transition-all uppercase tracking-widest text-[11px] hover:bg-[#C5A059] disabled:opacity-50">
                  {submitting ? "Verifying..." : "Confirm Registration"}
                </button>
                
                <button type="button" onClick={() => setOtpStep(false)} className="text-xs text-[#C5A059] font-bold uppercase hover:underline">
                  Change Phone Number
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

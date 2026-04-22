"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getUser } from "@/app/lib/token";
import { 
  Phone as PhoneIcon, 
  Mail as MailIcon, 
  MapPin as MapPinIcon,
  MessageCircle as ChatIcon,
  Send as SendIcon
} from "lucide-react";

function ContactContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const contactPhone = (process.env.NEXT_PUBLIC_WTSP_PHONE || "+918657869659").replace(/\D/g, '');

  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "failed">("idle");

  useEffect(() => {
    const user = getUser();
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        mobile: user.mobile || prev.mobile || "",
      }));
    }
    
    if (serviceParam) {
      setForm(prev => ({
        ...prev,
        message: `I am interested in the ${serviceParam.replace(/-/g, " ")} service. Specifically, I would like to discuss...`
      }));
    }
  }, [serviceParam]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
        setStatus("success");
        setForm({ name: "", email: "", mobile: "", message: "" });
      } else {
        setStatus("failed");
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to send request.");
        setTimeout(() => {
          setStatus("idle");
          setErrorMessage("");
        }, 5000);
      }
    } catch (error) {
      console.error("Enquiry error:", error);
      setStatus("failed");
      setErrorMessage("Service currently unavailable. Please try again later.");
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#362B25] font-base selection:bg-[#D4A848]/20 overflow-x-hidden flex flex-col items-center justify-center py-12 px-4 sm:px-8">
      
      {/* ── BACKGROUND ACCENT ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,197,24,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT: INFO & CONTACT DETAILS (4 cols) */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 bg-[#D4A848]/[0.08] border border-[#D4A848]/25 rounded-full px-4 py-1">
              <span className="w-2 h-2 rounded-full bg-[#D4A848] animate-pulse" />
              <span className="text-[#D4A848] text-[10px] font-black tracking-widest uppercase">Contact Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#362B25] tracking-tight uppercase leading-[1.0]">
              Craft Your <br />
              <span className="text-[#D4A848]">Global Future</span>
            </h1>
            <p className="text-[#362B25]/80 text-sm font-semibold italic border-l-2 border-[#D4A848] pl-6 py-1 max-w-sm">
              Strategic mentorship for Ivy League and Tier-1 excellence.
            </p>
          </motion.div>

          {/* CONTACT MENTIONS (Compact) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 pt-4 border-t border-[#D4A848]/10"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4A848]/10 flex items-center justify-center text-[#D4A848] shrink-0 border border-[#D4A848]/10">
                <MapPinIcon size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B3985E]/60">Location</span>
                <p className="text-xs font-bold text-[#362B25] leading-snug uppercase">
                  Gauri Complex, 601, Sector 11, Belapur, Navi Mumbai
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4A848]/10 flex items-center justify-center text-[#D4A848] shrink-0 border border-[#D4A848]/10">
                <PhoneIcon size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B3985E]">Direct Dial</span>
                <p className="text-sm font-black text-[#362B25] tracking-widest leading-none">+91 86578 69659</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-nowrap">
              <div className="w-10 h-10 rounded-xl bg-[#D4A848]/10 flex items-center justify-center text-[#D4A848] shrink-0 border border-[#D4A848]/10">
                <MailIcon size={18} />
              </div>
              <div className="space-y-1 overflow-hidden">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B3985E]/60">Email Portal</span>
                <p className="text-sm font-black text-[#362B25] truncate hover:text-[#D4A848] transition-colors cursor-pointer uppercase">TECH.ARYAHS@GMAIL.COM</p>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-4">
               <a
                href={`https://wa.me/${contactPhone}`}
                target="_blank"
                className="inline-flex items-center gap-3 bg-[#40332D] text-[#D4A848] font-black text-[10px] px-6 py-3 rounded-xl hover:bg-[#D4A848] hover:text-[#40332D] transition-all shadow-xl shadow-[#D4A848]/10 uppercase tracking-widest"
              >
                <ChatIcon size={14} />
                Chat on Whatsapp
              </a>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: INQUIRY FORM (7 cols) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7"
        >
          <div className="bg-white border border-[#D4A848]/20 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
            
            <div className="mb-6">
              <h2 className="text-2xl font-black text-[#362B25] tracking-tight uppercase leading-none">
                Inquiry <span className="text-[#D4A848]">Portal</span>
              </h2>
            </div>

            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#D4A848]/10 flex items-center justify-center text-3xl border border-[#D4A848]/20 animate-bounce">✨</div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#362B25] uppercase tracking-tight">Request Received</h3>
                  <p className="text-[#675F5B]/70 text-[10px] font-black uppercase tracking-widest">We&apos;ll reach out within 24 hours.</p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-[#D4A848] font-black text-[10px] uppercase tracking-widest border-b border-[#D4A848] pb-0.5 hover:text-[#362B25] hover:border-[#362B25] transition-all"
                >
                  New inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", name: "name", type: "text", placeholder: "e.g. John Doe", colSpan: "sm:col-span-2" },
                      { label: "Email", name: "email", type: "email", placeholder: "john@example.com", colSpan: "sm:col-span-1" },
                      { label: "Phone", name: "mobile", type: "tel", placeholder: "+91 ...", colSpan: "sm:col-span-1" },
                    ].map((field) => (
                      <div key={field.name} className={`space-y-1 ${field.colSpan}`}>
                        <label className="text-[10px] font-black text-[#362B25]/80 uppercase tracking-widest ml-1">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name as keyof typeof form]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required={field.name !== "mobile"}
                          className="w-full bg-[#F8F6F1]/50 border border-[#D4A848]/20 rounded-xl px-4 py-3 text-sm text-[#362B25] placeholder-[#362B25]/40 focus:outline-none focus:border-[#D4A848]/60 focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#362B25]/80 uppercase tracking-widest ml-1">
                      Requirements
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Briefly describe what you're looking for..."
                      required
                      rows={4}
                      className="w-full bg-[#F8F6F1]/50 border border-[#D4A848]/20 rounded-xl px-4 py-3 text-sm text-[#362B25] placeholder-[#362B25]/40 focus:outline-none focus:border-[#D4A848]/60 focus:bg-white transition-all resize-none shadow-sm"
                    />
                  </div>

                {errorMessage && (
                  <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest animate-pulse">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${status === "failed" ? "bg-red-600 shadow-red-500/20" : "bg-[#362B25]"} text-white font-black text-sm py-4 rounded-xl hover:bg-[#D4A848] hover:text-[#362B25] shadow-xl transition-all uppercase tracking-[0.2em] relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-2`}
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Sending..." : status === "failed" ? "Retry" : "Send Request"}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>

    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center font-black text-[#D4A848] tracking-widest uppercase">Loading Portal...</div>}>
      <ContactContent />
    </Suspense>
  );
}

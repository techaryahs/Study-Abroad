"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Phone, Mail, X, Copy, Check } from "lucide-react";

interface DiscussionSectionProps {
  serviceId: string;
}

const CoreNodes = [
  {
    type: "video",
    icon: <Video size={18} fill="currentColor" strokeWidth={0} />,
    color: "#EA4335",
    label: "Video Call"
  },
  {
    type: "audio",
    icon: <Phone size={18} fill="currentColor" strokeWidth={0} />,
    color: "#4285F4",
    label: "Audio Call"
  },
  {
    type: "text",
    icon: (
      <svg viewBox="0 0 448 512" fill="currentColor" className="w-[16px] h-[16px]">
        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.7 69.4 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.3-16.3-14.5-27.3-32.3-30.5-37.9-3.2-5.5-.4-8.6 2.4-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.3 4.6-13 4.6-24.1 3.2-26.3-1.4-2.2-5.1-3.3-10.6-6.3z" />
      </svg>
    ),
    color: "#25D366",
    label: "Text Support"
  }
];

export default function DiscussionSection({ serviceId }: DiscussionSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAudioPopup, setShowAudioPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const predefinedMessage = `I am interested in your Study Abroad services.`;
  const encodedMessage = encodeURIComponent(predefinedMessage);
  const contactEmail = process.env.NEXT_PUBLIC_EMAIL || "[EMAIL_ADDRESS]";
  const rawPhone = process.env.NEXT_PUBLIC_WTSP_PHONE || "+918657869659";
  const contactPhone = rawPhone.replace(/\D/g, '');

  const handleEmailAction = () => {
    const subject = encodeURIComponent(`Consultation: ${serviceId.replace(/-/g, " ").toUpperCase()}`);
    const mailtoUrl = `mailto:${contactEmail}?subject=${subject}&body=${encodedMessage}`;

    window.location.href = mailtoUrl;

    // Fallback logic from contact page
    setTimeout(() => {
      if (document.hasFocus()) {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}&su=${subject}&body=${encodedMessage}`, '_blank');
      }
    }, 600);
  };

  const handleWhatsAppAction = () => {
    const waUrl = `https://wa.me/${contactPhone}?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
  };

  const handleNodeClick = (type: string) => {
    if (type === "video") {
      window.open(`https://wa.me/${contactPhone}?text=I%20want%20to%20discuss%20my%20case%20via%20video`, "_blank");
    } else if (type === "audio") {
      setShowAudioPopup(true);
    } else if (type === "text") {
      handleWhatsAppAction();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(contactPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 md:space-y-10 pt-4">
      {/* Core Nodes Header */}
      <div className="space-y-3 md:space-y-4">
        <p className="text-[13px] font-bold md:text-[14px] font-bold font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#D4A848] italic">
          Includes Core Nodes:
        </p>
        <div className="flex flex-wrap gap-6 md:gap-10">
          {CoreNodes.map((item, i) => (
            <button 
              key={i} 
              onClick={() => handleNodeClick(item.type)}
              className="flex flex-col items-center gap-2 md:gap-3 group"
            >
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#D4A848]/5 border border-[#D4A848]/20 flex items-center justify-center group-hover:border-[#D4A848]/50 transition-all shadow-sm"
                style={{ color: item.color }}
              >
                <div className="scale-90 md:scale-100">
                  {item.icon}
                </div>
              </div>
              <p className="text-[12px] font-black md:text-[13px] font-bold font-black uppercase tracking-widest text-[#D4A848]/40 group-hover:text-[#D4A848] transition-colors">
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-1 md:pt-2 items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#D4A848] text-[#40332D] shadow-xl hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(212,168,72,0.4)] transition-all px-6 py-3 md:px-10 md:py-4 text-[14px] font-bold md:text-[11px] font-black tracking-[0.15em] md:tracking-[0.2em] w-full sm:w-auto text-center !rounded-xl md:!rounded-[1.5rem] uppercase"
        >
          Discuss Your Case
        </button>
      </div>

      {mounted && createPortal(
        <>
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  key="modal-bg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-[6px] pointer-events-auto"
                />
                <motion.div
                  key="modal-content"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="w-[92vw] max-w-[320px] sm:max-w-[360px] bg-[#40332D] shadow-2xl border border-[#D4A848]/20 p-5 sm:p-6 text-center space-y-4 sm:space-y-6 rounded-[1.5rem] sm:rounded-3xl pointer-events-auto relative z-10"
                >
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full border border-[#D4A848]/20 flex items-center justify-center text-[#D4A848]/40 hover:text-[#D4A848] hover:border-[#D4A848] bg-black/20 hover:bg-black/40 transition-all"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>

                  <div className="space-y-1">
                    <span className="text-[#D4A848]/50 uppercase tracking-[0.5em] font-black text-[11px] font-black sm:text-[12px] font-black">Connect With Node</span>
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-none">Choose Channel</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:gap-3">
                    <button
                      onClick={handleEmailAction}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-black/20 border border-[#D4A848]/10 hover:border-[#D4A848]/40 hover:bg-black/40 transition-all group text-left w-full"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#D4A848]/10 flex items-center justify-center text-[#D4A848] group-hover:scale-110 transition-transform flex-shrink-0">
                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold sm:text-[11px] font-black uppercase tracking-widest text-white mb-0.5">Send via Email</p>
                        <p className="text-[13px] font-bold sm:text-[14px] font-bold font-medium text-white/40 group-hover:text-white/70 transition-colors leading-tight">We're just an email away.</p>
                      </div>
                    </button>

                    <button
                      onClick={handleWhatsAppAction}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-black/20 border border-[#D4A848]/10 hover:border-[#D4A848]/40 hover:bg-black/40 transition-all group text-left w-full"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#D4A848]/10 flex items-center justify-center text-[#D4A848] group-hover:scale-110 transition-transform flex-shrink-0">
                        <svg viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.7 69.4 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.3-16.3-14.5-27.3-32.3-30.5-37.9-3.2-5.5-.4-8.6 2.4-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.3 4.6-13 4.6-24.1 3.2-26.3-1.4-2.2-5.1-3.3-10.6-6.3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[14px] font-bold sm:text-[11px] font-black uppercase tracking-widest text-white mb-0.5">Chat on WhatsApp</p>
                        <p className="text-[13px] font-bold sm:text-[14px] font-bold font-medium text-white/40 group-hover:text-white/70 transition-colors leading-tight">Instant message with our team.</p>
                      </div>
                    </button>
                  </div>

                  <p className="text-[6px] sm:text-[11px] font-black font-black uppercase tracking-[0.4em] text-[#D4A848]/20 border-t border-white/5 pt-3 sm:pt-4">Secure Node Connector</p>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAudioPopup && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowAudioPopup(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                  className="bg-white p-10 rounded-[32px] shadow-2xl relative z-[10000] max-w-sm w-full text-center space-y-6 pointer-events-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-[#4285F4]/10 flex items-center justify-center text-[#4285F4] mx-auto">
                    <Phone size={32} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="fd text-2xl font-bold text-[#3C2A21]">Expert Audio Line</h4>
                    <p className="text-xs text-[#6B5E51] font-medium">Connect with a senior advisor.</p>
                  </div>
                  
                  <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#C5A059]/10 flex items-center justify-between gap-4">
                    <span className="text-lg font-bold text-[#3C2A21] tracking-tight">{rawPhone}</span>
                    <button 
                      onClick={handleCopy}
                      className="p-2 hover:bg-[#C5A059]/10 rounded-lg transition-colors text-[#C5A059]"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => setShowAudioPopup(false)}
                      className="text-[14px] font-bold font-bold uppercase tracking-widest text-[#C5A059]"
                    >
                      Close Window
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
}

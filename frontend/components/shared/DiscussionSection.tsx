"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Phone, Mail, X } from "lucide-react";

interface DiscussionSectionProps {
  serviceId: string;
}

const CoreNodes = [
  {
    icon: <Video size={18} fill="currentColor" strokeWidth={0} />,
    color: "#EA4335",
    label: "Video Call"
  },
  {
    icon: <Phone size={18} fill="currentColor" strokeWidth={0} />,
    color: "#4285F4",
    label: "Audio Call"
  },
  {
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

  const predefinedMessage = `I am interested in your Study Abroad services.`;
  const encodedMessage = encodeURIComponent(predefinedMessage);
  const contactEmail = process.env.NEXT_PUBLIC_EMAIL || "[EMAIL_ADDRESS]";
  const contactPhone = process.env.NEXT_PUBLIC_WTSP_PHONE || "";

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

  return (
    <div className="space-y-10 pt-4">
      {/* Core Nodes Header */}
      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500/40 italic">
          Includes Core Nodes:
        </p>
        <div className="flex flex-wrap gap-10">
          {CoreNodes.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group">
              <div
                className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-gold-500/50 transition-all shadow-sm"
                style={{ color: item.color }}
              >
                {item.icon}
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-gold-500 transition-colors uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-6 pt-2 items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-gold px-10 py-4 text-[11px] font-black tracking-[0.2em] w-full sm:w-auto text-center !rounded-[1.5rem] uppercase"
        >
          Discuss Your Case
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[200] flex items-center justify-center p-6"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 inset-y-auto m-auto sm:inset-0 w-auto sm:max-w-xs h-fit glass-card p-6 z-[201] border-gold-500/20 text-center space-y-6 shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
              >
                <X size={16} strokeWidth={3} />
              </button>

              <div className="space-y-1">
                <span className="text-gold-500 uppercase tracking-[0.5em] font-black text-[7px]">Connect With Node</span>
                <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none">Choose Channel</h2>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={handleEmailAction}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-gold-500/30 hover:bg-white/[0.05] transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#EA4335]/10 flex items-center justify-center text-[#EA4335] group-hover:scale-110 transition-transform flex-shrink-0">
                    <Mail className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#EA4335] mb-0.5">Send via Email</p>
                    <p className="text-[10px] font-medium text-white/40 group-hover:text-white/70 transition-colors leading-tight">We’re just an email away.</p>
                  </div>
                </button>

                <button
                  onClick={handleWhatsAppAction}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#25D366]/30 hover:bg-white/[0.05] transition-all group text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.7 69.4 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.3-16.3-14.5-27.3-32.3-30.5-37.9-3.2-5.5-.4-8.6 2.4-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.3 4.6-13 4.6-24.1 3.2-26.3-1.4-2.2-5.1-3.3-10.6-6.3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#25D366] mb-0.5">Chat on WhatsApp</p>
                    <p className="text-[10px] font-medium text-white/40 group-hover:text-white/70 transition-colors leading-tight">Instant message with our team.</p>
                  </div>
                </button>
              </div>

              <p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/10">Secure Node Connector</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

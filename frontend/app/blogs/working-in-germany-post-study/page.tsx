"use client";

import BlogLayout from "@/components/layout/BlogLayout";
import { motion } from "framer-motion";

export default function GermanyWorkingPage() {
  return (
    <BlogLayout
      category="Career & Visas"
      date="April 10, 2024"
      readTime="10 MIN"
      title="Working in Germany Post-Study: Your Professional Roadmap"
      image="/blog-germany.png"
      content={
        <div className="space-y-12">
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-black gradient-text-gold tracking-tight italic uppercase">Europe's Career Powerhouse</h2>
            <div className="prose prose-invert prose-lg">
              <p className="text-white/50 leading-relaxed font-medium italic">
                Germany is a global economic leader with a massive demand for skilled international talent. From the automotive giants of Stuttgart to the tech startups of Berlin, the "Made in Germany" brand is built on precision.
              </p>
              <p className="text-white/50 leading-relaxed font-medium pt-4 italic">
                The German government has established clear, legal pathways (such as the 18-month jobseeker period) specifically designed to retain global talent like you.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ rotateX: 2, rotateY: -2, scale: 1.02 }}
              style={{ perspective: 1000 }}
              className="glass-card p-10 bg-white/[0.01] border-gold-500/10 space-y-6 flex flex-col justify-between transform-gpu transition-all duration-700"
            >
              <div>
                <h3 className="text-xl font-black text-gold-500 uppercase tracking-widest pb-4 border-b border-white/5 mb-6">The 18-Month Window</h3>
                <p className="text-white/30 text-base leading-relaxed font-normal italic">
                  Once your degree is conferred, you can extend your residence permit for up to 18 months. This is a crucial window for field-specific role hunting.
                </p>
              </div>
              <div className="pt-6 italic text-gold-500/40 text-[9px] font-black uppercase tracking-widest">Advisory: Start networking early.</div>
            </motion.div>

            <motion.div
              whileHover={{ rotateX: 2, rotateY: -2, scale: 1.02 }}
              style={{ perspective: 1000 }}
              className="glass-card p-10 bg-white/[0.01] border-gold-500/10 space-y-6 flex flex-col justify-between transform-gpu transition-all duration-700"
            >
              <div>
                <h3 className="text-xl font-black text-gold-500 uppercase tracking-widest pb-4 border-b border-white/5 mb-6">EU Blue Card Advantage</h3>
                <p className="text-white/30 text-base leading-relaxed font-normal italic">
                  The EU Blue Card is the "Gold Standard". If your job offer exceeds the threshold, you gain a direct path to permanent residency in as little as 21 months.
                </p>
              </div>
              <div className="pt-6 italic text-gold-500/40 text-[9px] font-black uppercase tracking-widest">Support: We map Blue Card documentation.</div>
            </motion.div>
          </div>

          <section className="space-y-8 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-black uppercase tracking-tight italic gradient-text-gold">Critical Success Checklist</h2>
            <div className="grid gap-4">
              {[
                { t: "Language Proficiency", d: "While many R&D roles are in English, B1/B2 German is the unlock for long-term career growth." },
                { t: "Degree 'Annerkennung'", d: "Ensuring your degree is officially recognized by German authorities for regulated professions." },
                { t: "Local Networking", d: "Utilizing LinkedIn and Xing to build bridges with German HR teams directly." }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-gold-500/20 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center font-black text-black text-lg shadow-xl">
                    {i + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-base font-black uppercase tracking-widest group-hover:text-gold-500 transition-colors">{item.t}</h4>
                    <p className="text-white/30 text-sm leading-relaxed italic">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-dark-900 p-12 md:p-16 rounded-3xl border border-gold-500/10 relative overflow-hidden shadow-4xl hover:shadow-gold-500/5 transition-all transform-gpu">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-6 italic gradient-text-gold">Expert Take: Hidden Champions</h3>
            <p className="text-white/30 text-lg md:text-xl leading-relaxed italic border-t border-white/5 pt-8">
              "Most students look at Munich or Berlin. Germany's true economic strength lies in its 'Hidden Champions'—world-market-leading companies in student-friendly cities. Mapping your career to these hubs is the Global Counselling Center global strategy."
            </p>
          </section>
        </div>
      }
    />
  );
}

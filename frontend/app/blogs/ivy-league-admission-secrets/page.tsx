"use client";

import BlogLayout from "@/components/layout/BlogLayout";
import Link from "next/link";
import { motion } from "framer-motion";

export default function IvyLeagueSecretsPage() {
  return (
    <BlogLayout
      category="Admissions Strategy"
      date="May 15, 2024"
      readTime="12 MIN"
      title="Ivy League Admissions: The Black Box Strategy"
      image="/blog-ivy.png"
      content={
        <div className="space-y-12">
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-black gradient-text-gold tracking-tight italic uppercase">Beyond the Official Website</h2>
            <div className="prose prose-invert prose-lg">
              <p className="text-white/40 leading-relaxed font-medium italic">
                Applying to Harvard, Yale, or Princeton isn't a checklist; it's an art. The Ivy League schools don't just want the smartest students—they have thousands of those. They want the most "impactful" class.
              </p>
              <p className="text-white/40 leading-relaxed font-medium pt-4 italic">
                At Global Counselling Center Global, we have worked with academics who have sat on these boards. Here is the 'Black Box' strategy we use to decode the admissions process for our elite students.
              </p>
            </div>
          </section>

          <motion.div
            whileHover={{ rotateX: 2, rotateY: -2 }}
            style={{ perspective: 1000 }}
            className="glass-card p-10 md:p-14 bg-white/[0.01] border-gold-500/10 space-y-10 relative overflow-hidden transform-gpu"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <h3 className="text-xl font-black text-gold-500 uppercase tracking-widest leading-tight">Winning Profile Strategies:</h3>

            <div className="grid gap-8">
              {[
                { id: 1, t: "Niche-Driven Brilliance", d: "Don't be a generic high-achiever. Be an expert in ONE very specific area, whether it's robotics for sustainable farming or historical linguistics. We help you find that niche in 12 months." },
                { id: 2, t: "Intellectual Vitality (IV)", d: "Show, don't just tell, your curiosity. Have you written a research paper? Have you started an NGO that solved a real problem in your community? Committees call this Intellectual Vitality." }
              ].map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-8 items-start group">
                  <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center font-black text-black text-xl shadow-xl">{item.id}</div>
                  <div className="space-y-2">
                    <p className="text-lg font-black uppercase text-white group-hover:text-gold-500 tracking-widest transition-colors">{item.t}</p>
                    <p className="text-white/30 text-base leading-relaxed font-normal italic">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <section className="space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tight italic gradient-text-gold">The Story Arc Strategy</h2>
            <p className="text-white/40 leading-relaxed text-lg font-normal italic">
              Your application is a story. The admission officer is the reader. We ensure that your background, your grades, your SOP, and your LORs all follow the same "Hero's Journey" arc that leads perfectly to their university's front door.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {["Elite SOP", "Vetted LORs", "IV Research", "Interview Prep"].map((item, i) => (
                <div key={i} className="glass-card flex flex-col items-center gap-4 !p-6 border-gold-500/5 hover:border-gold-500/20 transition-all transform-gpu hover:scale-105">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/5 border border-gold-500/10 flex items-center justify-center text-gold-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-dark-900 p-12 md:p-16 rounded-3xl border border-gold-500/10 text-center space-y-8 relative z-10 shadow-4xl transform-gpu hover:shadow-gold-500/5 transition-all">
            <h3 className="text-2xl font-black uppercase tracking-widest italic gradient-text-gold">The Global Counselling Center Promise</h3>
            <p className="text-white/30 text-lg max-w-2xl mx-auto leading-relaxed italic border-t border-white/5 pt-8">
              "We don't guarantee admission; we guarantee the most powerful version of yourself. When that version knocks, the Ivy League usually opens the door."
            </p>
            <div className="pt-6">
              <Link href="/contact" className="btn-gold px-12 py-4">Secure My Profile</Link>
            </div>
          </section>
        </div>
      }
    />
  );
}

"use client";

import BlogLayout from "@/components/layout/BlogLayout";
import { motion } from "framer-motion";

export default function ScholarshipsUSAPage() {
  return (
    <BlogLayout
      category="Financial Aid"
      date="June 20, 2024"
      readTime="8 MIN"
      title="Top 10 Scholarships in USA: Your Roadmap to Full Funding"
      image="/blog-usa.png"
      content={
        <div className="space-y-12">
          <section className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-black gradient-text-gold tracking-tighter italic uppercase">The Full Funding Strategy</h2>
            <div className="prose prose-invert prose-lg">
              <p className="text-white/40 leading-relaxed font-medium italic">
                Studying in the USA is a high-return investment, but the ticket price can be daunting. Billion of dollars in dedicated funding are reserved for international students who can articulate an 'Impact Story'.
              </p>
              <p className="text-white/40 leading-relaxed font-medium pt-4 italic">
                At Global Counselling Center Global, we help you build a profile that makes you the most desirable candidate. Here is our curated list of the top scholarships.
              </p>
            </div>
          </section>

          {/* Detailed Scholarship List */}
          <div className="grid gap-10">
            {[
              {
                name: "The Fulbright Program",
                type: "Full Coverage",
                desc: "The gold standard of scholarships. It covers full tuition, airfare, a monthly stipend, and health insurance. It is as much about cultural ambassadorship as academics."
              },
              {
                name: "Humphrey Fellowship",
                type: "Professional",
                desc: "This ten-month non-degree program is for experienced professionals. It provides tuition, living allowance, and a professional development grant."
              }
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ rotateX: 2, rotateY: -2, scale: 1.02 }}
                style={{ perspective: 1000 }}
                className="glass-card p-10 bg-white/[0.01] border-gold-500/10 flex flex-col md:flex-row gap-8 items-start group transform-gpu transition-all duration-700"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center font-black text-black group-hover:bg-black group-hover:text-gold-500 transition-all shadow-xl">
                  {i + 1}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl md:text-2xl font-black tracking-tight uppercase group-hover:text-gold-500 transition-colors">{s.name}</h3>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full border border-white/5 group-hover:bg-black group-hover:text-white">{s.type}</span>
                  </div>
                  <p className="text-white/30 text-base leading-relaxed font-normal italic">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pro Tips Section */}
          <section className="space-y-8 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-black uppercase tracking-tight italic gradient-text-gold">The Global Counselling Center Winning Strategy</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/[0.01] rounded-3xl border border-white/5 space-y-4 hover:border-gold-500/20 transition-colors">
                <h4 className="text-lg font-black uppercase tracking-widest text-gold-500">The Impact Story</h4>
                <p className="text-white/30 text-sm leading-relaxed italic">Don't just list achievements. Tell a story about how your education will solve a specific problem in your home country. This is the 'Impact ROI'.</p>
              </div>
              <div className="p-8 bg-white/[0.01] rounded-3xl border border-white/5 space-y-4 hover:border-gold-500/20 transition-colors">
                <h4 className="text-lg font-black uppercase tracking-widest text-gold-500">The 15m Timeline</h4>
                <p className="text-white/30 text-sm leading-relaxed italic">Winning high-tier university scholarships requires a preparation cycle of at least 15 months. Starting late is the number one reason for rejection.</p>
              </div>
            </div>
          </section>

          {/* Expert Take Section */}
          <section className="bg-dark-900 p-12 md:p-16 rounded-3xl border border-gold-500/10 text-center relative overflow-hidden shadow-4xl hover:shadow-gold-500/5 transition-all transform-gpu">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 blur-[100px] rounded-full pointer-events-none"></div>
            <p className="text-[10px] uppercase font-black tracking-[0.5em] mb-6 opacity-40">Mentorship Perspective</p>
            <p className="text-xl md:text-2xl font-black leading-snug italic border-t border-white/5 pt-8">
              "Scholarships are not rewards for past brilliance; they are investments in future potential. We show the committee that your future is the safest bet they can make."
            </p>
          </section>
        </div>
      }
    />
  );
}

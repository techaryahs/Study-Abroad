"use client";

import BlogLayout from "@/components/layout/BlogLayout";

export default function GermanyWorkingPage() {
  return (
    <BlogLayout
      category="Career & Visas"
      date="April 10, 2024"
      readTime="10 MIN"
      title="Working in Germany Post-Study: Your Professional Roadmap"
      image="/blog-germany.png"
      content={
        <div className="space-y-16">
          <section className="space-y-8">
            <h2 className="text-4xl font-black gradient-text-gold tracking-tight italic">Why Germany is Europe's Career Powerhouse</h2>
            <div className="prose prose-invert prose-xl">
              <p className="text-white/40 leading-relaxed font-medium">
                Germany is not just a destination for high-quality, often tuition-free education; it is a global economic leader with a massive demand for skilled international talent. From the automotive giants of Stuttgart to the tech startups of Berlin, the "Made in Germany" brand is built on a foundation of precision and innovation.
              </p>
              <p className="text-white/40 leading-relaxed font-medium pt-4">
                As an international student, you are uniquely positioned to join this workforce. The German government has established clear, legal pathways (such as the 18-month jobseeker period) specifically designed to retain global talent like you.
              </p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="glass-card p-12 bg-white/[0.01] border-gold-500/20 space-y-6 flex flex-col justify-between">
               <div>
                  <h3 className="text-2xl font-black text-gold-500 uppercase tracking-widest pb-4 border-b border-white/5 mb-6">The 18-Month Extension</h3>
                  <p className="text-white/40 text-lg leading-loose font-normal">
                    Once your degree is conferred, you can extend your residence permit for up to 18 months. This is a crucial window that allows you to work any job to support yourself while you hunt for a field-specific role.
                  </p>
               </div>
               <div className="pt-8 italic text-gold-500/60 text-sm font-black">Pro Tip: Start networking 6 months before graduation.</div>
            </div>
            
            <div className="glass-card p-12 bg-white/[0.01] border-gold-500/20 space-y-6 flex flex-col justify-between">
               <div>
                  <h3 className="text-2xl font-black text-gold-500 uppercase tracking-widest pb-4 border-b border-white/5 mb-6">The EU Blue Card Advantage</h3>
                  <p className="text-white/40 text-lg leading-loose font-normal">
                    The EU Blue Card is the "Gold Standard" for international professionals. If your job offer exceeds the salary threshold, you gain a residence permit with a direct path to permanent residency in as little as 21 months with German language proficiency.
                  </p>
               </div>
               <div className="pt-8 italic text-gold-500/60 text-sm font-black">Advisory: We assist with Blue Card documentation mapping.</div>
            </div>
          </div>

          <section className="space-y-12 pt-16 border-t border-white/5 px-4 md:px-0">
             <h2 className="text-3xl font-black uppercase tracking-tight italic gradient-text-gold">The Critical Success Checklist</h2>
             <div className="grid md:row-cols-1 gap-6">
                {[
                  { t: "Language Proficiency", d: "While many R&D roles are in English, B1/B2 German is the unlock for long-term career growth." },
                  { t: "The 'Annerkennung' Process", d: "Ensuring your degree is officially recognized by German authorities for regulated professions." },
                  { t: "Local Networking", d: "Utilizing LinkedIn (and the local Xing platform) to build bridges with German HR teams." }
                ].map((item, i) => (
                  <div key={i} className="luxury-list-item !p-10 bg-white/[0.01] hover:bg-gold-500 hover:text-black group duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 group-hover:bg-black group-hover:border-black transition-all">
                       <span className="font-black text-xl">{i+1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                       <h4 className="text-xl font-black uppercase tracking-widest">{item.t}</h4>
                       <p className="text-white/40 group-hover:text-black/70 text-base leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
             </div>
          </section>

          <section className="bg-gold-500/5 p-16 rounded-[4rem] border border-gold-500/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 blur-[100px] rounded-full pointer-events-none"></div>
             <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 italic gradient-text-gold">Expert Take: Germany's 'Hidden Champions'</h3>
             <p className="text-white/50 text-xl leading-relaxed italic">
               "Most students only look at Munich or Berlin. Germany's true economic strength lies in its 'Hidden Champions'—world-market-leading companies located in smaller, student-friendly cities. Mapping your career to these hubs is the Dr. Alam global strategy."
             </p>
          </section>
        </div>
      }
    />
  );
}

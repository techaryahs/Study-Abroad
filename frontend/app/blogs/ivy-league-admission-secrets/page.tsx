"use client";

import BlogLayout from "@/components/layout/BlogLayout";
import Link from "next/link";

export default function IvyLeagueSecretsPage() {
  return (
    <BlogLayout
      category="Admissions Strategy"
      date="May 15, 2024"
      readTime="12 MIN"
      title="Ivy League Admissions: The Black Box Strategy"
      image="/blog-ivy.png"
      content={
        <div className="space-y-20">
          <section className="space-y-10">
            <h2 className="text-4xl font-black gradient-text-gold tracking-tight italic uppercase">What They Don't Tell You on the Official Website</h2>
            <div className="prose prose-invert prose-xl">
              <p className="text-white/40 leading-relaxed font-medium">
                Applying to Harvard, Yale, or Princeton isn't a checklist; it's an art. The Ivy League schools don't just want the smartest students—they have thousands of those. They want the most "impactful" class. They are looking for a cohesive class of experts, leaders, and unique voices.
              </p>
              <p className="text-white/40 leading-relaxed font-medium pt-4">
                At Dr. Alam Global, we have worked with academics who have sat on these boards. Here is the 'Black Box' strategy we use to decode the admissions process for our elite students.
              </p>
            </div>
          </section>

          <div className="glass-card p-16 md:p-24 bg-white/[0.01] border-gold-500/20 space-y-16 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none"></div>
             <h3 className="text-4xl font-black text-gold-500 uppercase tracking-widest leading-tight">Winning Profile Strategies:</h3>
             
             <div className="grid md:row-cols-1 gap-12">
                <div className="luxury-list-item !p-12 bg-white/[0.02] border border-white/10 rounded-[3rem] hover:bg-gold-500 hover:text-black duration-700 transition-all flex flex-col md:flex-row gap-12 items-start group">
                   <div className="w-20 h-20 rounded-full bg-gold-500 group-hover:bg-black group-hover:block transition-all flex items-center justify-center font-black group-hover:text-gold-500 text-3xl">1</div>
                   <div className="space-y-4">
                     <p className="text-2xl font-black uppercase text-white group-hover:text-black tracking-widest">Niche-Driven Brilliance</p>
                     <p className="text-white/40 group-hover:text-black/70 text-lg leading-relaxed font-medium">Don't be a generic high-achiever. Be an expert in ONE very specific area, whether it's robotics for sustainable farming or historical linguistics. We help you find that niche in 12 months.</p>
                   </div>
                </div>

                <div className="luxury-list-item !p-12 bg-white/[0.02] border border-white/10 rounded-[3rem] hover:bg-gold-500 hover:text-black duration-700 transition-all flex flex-col md:flex-row gap-12 items-start group">
                   <div className="w-20 h-20 rounded-full bg-gold-500 group-hover:bg-black group-hover:block transition-all flex items-center justify-center font-black group-hover:text-gold-500 text-3xl">2</div>
                   <div className="space-y-4">
                     <p className="text-2xl font-black uppercase text-white group-hover:text-black tracking-widest">Intellectual Vitality (IV)</p>
                     <p className="text-white/40 group-hover:text-black/70 text-lg leading-relaxed font-medium">Show, don't just tell, your curiosity. Have you written a research paper? Have you started an NGO that solved a real problem in your community? Official committees call this Intellectual Vitality.</p>
                   </div>
                </div>
             </div>
          </div>

          <section className="space-y-12">
             <h2 className="text-3xl font-black uppercase tracking-tight italic gradient-text-gold">The Story Arc Strategy</h2>
             <p className="text-white/40 leading-loose text-xl font-medium">
               Your application is a story. The admission officer is the reader. We ensure that your background, your grades, your SOP, and your LORs all follow the same "Hero's Journey" arc that leads perfectly to their university's front door.
             </p>
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
                {["Elite SOP", "Vetted LORs", "IV Research", "Interview Prep"].map((item, i) => (
                  <div key={i} className="glass-card flex flex-col items-center gap-6 !p-8 border-gold-500/10">
                     <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                     </div>
                     <span className="text-xs font-black uppercase tracking-[0.2em]">{item}</span>
                  </div>
                ))}
             </div>
          </section>

          <section className="bg-dark-900 p-20 rounded-[4rem] border border-gold-500/10 text-center space-y-10 relative z-10 shadow-[0_0_120px_rgba(194,168,120,0.1)]">
             <h3 className="text-4xl font-black uppercase tracking-widest italic gradient-text-gold">The Dr. Alam Promise</h3>
             <p className="text-white/40 text-xl max-w-3xl mx-auto leading-relaxed italic">
               "We don't guarantee admission; we guarantee the most powerful version of yourself. When that version knocks, the Ivy League usually opens the door."
             </p>
             <div className="pt-8">
                <Link href="/contact" className="btn-gold !px-20">Secure My Profile</Link>
             </div>
          </section>
        </div>
      }
    />
  );
}

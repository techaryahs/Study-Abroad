"use client";

import BlogLayout from "@/components/layout/BlogLayout";

export default function ScholarshipsUSAPage() {
  return (
    <BlogLayout
      category="Financial Aid"
      date="June 20, 2024"
      readTime="8 MIN"
      title="Top 10 Scholarships in USA: Your Roadmap to Full Funding"
      image="/blog-usa.png"
      content={
        <div className="space-y-16">
          <section className="space-y-8">
            <h2 className="text-4xl font-black gradient-text-gold tracking-tighter italic uppercase">Beyond Tuition: The Full Funding Strategy</h2>
            <div className="prose prose-invert prose-xl">
              <p className="text-white/40 leading-relaxed font-medium">
                Studying in the USA is a high-return investment, but the ticket price can be daunting. What most consultancy firms don't tell you is that there are billions of dollars in dedicated funding reserved specifically for international students. The key is in the timing, the "Impact Story," and the selection of the right program.
              </p>
              <p className="text-white/40 leading-relaxed font-medium pt-4">
                At Dr. Alam Global, we don't just find you a scholarship; we help you build a profile that makes you the most desirable candidate for the donors. Here is our curated list of the top 10 scholarships for global students.
              </p>
            </div>
          </section>

          {/* Detailed Scholarship List */}
          <div className="grid md:row-cols-1 gap-12">
            {[
              { 
                name: "The Fulbright Foreign Student Program", 
                type: "Full Coverage", 
                desc: "The gold standard of scholarships. It covers full tuition, airfare, a monthly stipend, and health insurance for graduates and professionals. It is as much about cultural ambassadorship as it is about academics." 
              },
              { 
                name: "Hubert H. Humphrey Fellowship", 
                type: "Professional Excellence", 
                desc: "This ten-month non-degree program is for experienced professionals. It provides tuition, living allowance, and a professional development grant, allowing you to reach the zenith of your field in the USA." 
              },
              { 
                name: "Civil Society Leadership Awards", 
                type: "Impact-Based", 
                desc: "Fully funded master’s degree programs for individuals who demonstrate academic and professional excellence and a deep commitment to leading positive social change in their communities." 
              }
            ].map((s, i) => (
              <div key={i} className="glass-card p-12 bg-white/[0.01] border-gold-500/10 flex flex-col md:flex-row gap-12 items-start group hover:bg-gold-500 hover:text-black duration-700 transition-all">
                 <div className="w-24 h-24 rounded-3xl bg-gold-500 flex items-center justify-center font-black text-black group-hover:bg-black group-hover:text-gold-500 transition-all shadow-2xl">
                    {i + 1}
                 </div>
                 <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                       <h3 className="text-3xl font-black tracking-tight uppercase">{s.name}</h3>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full border border-white/5 group-hover:bg-black group-hover:text-white group-hover:border-black">{s.type}</span>
                    </div>
                    <p className="text-white/30 text-lg leading-relaxed group-hover:text-black/70 font-normal">{s.desc}</p>
                 </div>
              </div>
            ))}
          </div>

          {/* Pro Tips Section */}
          <section className="space-y-12 pt-16 border-t border-white/5">
             <h2 className="text-3xl font-black uppercase tracking-tight italic gradient-text-gold">The Dr. Alam Strategy for Winning Scholarships</h2>
             <div className="grid md:grid-cols-2 gap-10">
                <div className="p-10 bg-white/[0.01] rounded-[3rem] border border-white/5 space-y-6">
                   <h4 className="text-xl font-black uppercase tracking-widest text-gold-500">The Impact Story</h4>
                   <p className="text-white/40 text-base leading-relaxed">Don't just list achievements. Tell a story about how your education will solve a specific problem in your home country. This is the 'Impact ROI' donors look for.</p>
                </div>
                <div className="p-10 bg-white/[0.01] rounded-[3rem] border border-white/5 space-y-6">
                   <h4 className="text-xl font-black uppercase tracking-widest text-gold-500">The Timeline (12-18m)</h4>
                   <p className="text-white/40 text-base leading-relaxed">Winning a Fulbright or a high-tier university scholarship requires a preparation cycle of at least 15 months. Starting late is the number one reason for rejection.</p>
                </div>
             </div>
          </section>

          {/* Expert Take Section */}
          <section className="bg-gold-500 p-16 rounded-[4rem] text-black shadow-[0_0_80px_rgba(194,168,120,0.3)]">
             <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Exclusive Insider Knowledge</h3>
             <p className="text-[10px] uppercase font-black tracking-[0.5em] mb-4 opacity-70">Mentorship Perspective</p>
             <p className="text-2xl font-black leading-snug italic">
               "Scholarships are not rewards for past brilliance; they are investments in future potential. Our job is to show the committee that your future is the safest bet they can make."
             </p>
          </section>
        </div>
      }
    />
  );
}

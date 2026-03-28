import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { label: "Partner Universities", value: "360+" },
    { label: "Successful Admissions", value: "500+" },
    { label: "Years of Expertise", value: "15+" },
    { label: "Student Success Rate", value: "98%" }
  ];

  const expertises = [
    {
      title: "Academic Pedigree",
      desc: "Our guidance is led by established academic principals with first-hand experience in global education systems.",
      icon: "🎓"
    },
    {
      title: "Strategic Mentorship",
      desc: "We don't just process applications; we mentor students to build profiles that elite universities crave.",
      icon: "🤝"
    },
    {
      title: "Global Reach",
      desc: "Our deep-rooted networks span across the USA, UK, Germany, and other top-tier academic hubs.",
      icon: "🌍"
    }
  ];

  return (
    <main className="bg-black text-white min-h-screen">

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-8 md:px-20 py-24 border-b border-white/5 overflow-hidden">
        {/* BACKGROUND AMBIENT GLOW */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/10 blur-[150px] -z-10 rounded-full animate-pulse"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <span className="text-gold-500 uppercase tracking-widest font-bold text-sm px-4 py-2 border border-gold-500/20 rounded-full bg-gold-500/5">
                About Dr. Alam Admissions
              </span>
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                Architecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600 italic">Global Careers</span>.
              </h1>
              <p className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
                At Dr. Alam Admissions, we believe education is more than a degree – it's a transformative leap. We provide the mentorship you need to land your dream university.
              </p>
            </div>

            <div className="flex gap-6">
              <Link href="/contact" className="btn-gold">Start Your Journey</Link>
              <Link href="/services" className="btn-outline-gold">View Expertise</Link>
            </div>
          </div>

          <div className="md:w-1/2 relative group animate-in fade-in slide-in-from-right duration-1000">
            <div className="absolute -inset-4 bg-gold-500/20 blur-2xl rounded-full scale-95 group-hover:scale-105 transition-transform duration-700"></div>
            <div className="relative w-full aspect-square md:h-[500px] rounded-3xl overflow-hidden border border-white/10 glass-card">
              <Image
                src="/about-hero.png"
                alt="Academic Excellence Symbolic"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-20 px-8 md:px-20 bg-dark-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((item, i) => (
            <div key={i} className="text-center group border-r border-white/5 last:border-0 pr-6">
              <div className="text-4xl md:text-6xl font-black text-gold-500 group-hover:scale-110 transition-transform duration-300">
                {item.value}
              </div>
              <div className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-white/40 pt-2 group-hover:text-gold-500 transition-colors">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section className="py-24 px-8 md:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="space-y-8 glass-card p-12 border border-white/5 relative group">
            <div className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-gold-500"></span> Our Vision
            </div>
            <h2 className="text-3xl font-bold">Unlocking Global Potential</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              We bridge the gap between local talent and world-class opportunities. Our vision is a world where every deserving student has access to top-tier global research and learning hubs, regardless of their location.
            </p>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold-500/5 -z-10 blur-3xl group-hover:bg-gold-500/10 transition-colors duration-500"></div>
          </div>

          <div className="space-y-8 glass-card p-12 border border-white/5 relative group">
            <div className="text-gold-500 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-gold-500"></span> Our Mission
            </div>
            <h2 className="text-3xl font-bold">Precision Admissions Guidance</h2>
            <p className="text-white/60 leading-relaxed text-lg text-justify">
              Our mission is to empower students through personalized admission strategies, AI-driven shortlisting, and meticulous mentorship, ensuring success at Ivy League and prestigious global universities.
            </p>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold-500/5 -z-10 blur-3xl group-hover:bg-gold-500/10 transition-colors duration-500"></div>
          </div>
        </div>
      </section>

      {/* ================= EXPERTISE / WHY DR ALAM ================= */}
      <section className="py-24 px-8 md:px-20 bg-gradient-to-b from-black to-dark-900">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black">Why Strategic Mentorship <br /><span className="text-gold-500 italic">Wins Admissions?</span></h2>
            <p className="text-white/50 text-lg">Consultancy is about paperwork. Mentorship is about finding your place among the best.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {expertises.map((item, i) => (
              <div key={i} className="text-center space-y-6 group p-10 glass-card border border-white/5 hover:border-gold-500/30 transition-all cursor-default">
                <div className="w-20 h-20 rounded-2xl bg-gold-500/10 flex items-center justify-center text-4xl mx-auto group-hover:scale-110 transition-transform group-hover:bg-gold-500 group-hover:shadow-[0_0_50px_rgba(212,160,23,0.3)] duration-500">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-gold-500">{item.title}</h3>
                <p className="text-white/50 text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 px-8 md:px-20 text-center relative overflow-hidden">
        {/* DECORATIVE ELEMENTS */}
        <div className="absolute inset-0 bg-gold-500/[0.02] -z-10"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>

        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom duration-1000">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight italic">READY TO ARCHITECT <br /><span className="text-gold-500">YOUR GLOBAL FUTURE?</span></h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto">Don't leave your dreams to chance. Partner with academics who know the path through original mentorship.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
            <Link href="/contact" className="btn-gold px-12 py-4 text-lg">Book Evaluation</Link>
            <Link href="https://wa.me/918987654321" target="_blank" className="btn-outline-gold px-12 py-4">Talk via WhatsApp</Link>
          </div>
        </div>
      </section>

    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import Flag from "react-world-flags";

export default function Home() {
  const services = [
    {
      title: "Admission Guidance",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm0 0V20"
          />
        </svg>
      ),
    },
    {
      title: "University Shortlisting",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      title: "SOP & LOR Support",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "Scholarship Assistance",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Visa Guidance",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      ),
    },
    {
      title: "Profile Building",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  const preferredCountries = [
    { name: "USA", code: "US" },
    { name: "UK", code: "GB" },
    { name: "Germany", code: "DE" },
    { name: "Australia", code: "AU" },
    { name: "Ireland", code: "IE" },
    { name: "Dubai", code: "AE" },
    { name: "Canada", code: "CA" },
  ];

  return (
    <main className="bg-black text-white relative overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center px-6 md:px-20 pt-16 md:pt-0">
        {/* BACKGROUND IMAGE WITH BLUR */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Hero Background"
            fill
            className="object-cover opacity-40 blur-[2px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        {/* HERO CONTENT */}
        <div className="md:w-3/5 z-10 relative space-y-10 animate-in fade-in slide-in-from-left duration-1000">
          <div className="space-y-2">
            <span className="text-gold-500 uppercase tracking-[0.3em] font-bold text-sm bg-gold-500/10 px-4 py-2 rounded-full border border-gold-500/20">
              Top Ranked Admissions
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] text-white pt-4">
              Dr. Alam's Path to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600 italic">Ivy League</span> & <br />
              Global Success
            </h1>
          </div>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed font-medium">
            Personalized guidance led by academic excellence for USA, UK, Germany,
            Australia, Ireland, and Dubai — powered by expert mentorship.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <Link href="/contact" className="btn-gold group relative overflow-hidden">
              <span className="relative z-10">Evaluate My Profile</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>

            <Link href="/services" className="btn-outline-gold px-10">
              Our Expertise
            </Link>
          </div>
        </div>

        {/* HERO IMAGE CONTAINER */}
        <div className="md:w-2/5 z-10 relative mt-16 md:mt-0 flex justify-center md:justify-end items-center">
          <div className="relative w-72 h-72 md:w-[480px] md:h-[480px] group">
            {/* AMBIENT GLOW */}
            <div className="absolute inset-0 bg-gold-500/20 blur-[120px] rounded-full group-hover:bg-gold-500/30 transition-all duration-700 animate-pulse"></div>

            <Image
              src="/hero-main.png"
              alt="Dr. Alam Global Education"
              fill
              className="object-contain filter drop-shadow-[0_20px_50px_rgba(212,160,23,0.4)] relative z-10 animate-float"
            />
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-24 px-6 md:px-20 relative bg-dark-900 border-t border-white/10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Trust <span className="text-gold-500">Dr. Alam's</span> <br />
            Global Admissions Expertise
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {services.map((item, i) => (
            <div
              key={i}
              className="glass-card flex flex-col items-center gap-6 group hover:border-gold-500 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-black transition-all">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-center leading-tight group-hover:text-gold-500 transition-colors">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/services" className="btn-outline-gold inline-block">
            Explore All Services
          </Link>
        </div>
      </section>

      {/* ================= COUNTRIES ================= */}
      <section className="py-24 px-6 md:px-20 bg-gradient-to-b from-dark-900 to-black">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
          <div className="md:w-1/2 space-y-4">
            <span className="text-gold-500 uppercase tracking-widest font-semibold">Global Reach</span>
            <h2 className="text-4xl md:text-5xl font-bold">Preferred Study Destinations</h2>
          </div>
          <Link href="/countries" className="text-gold-500 hover:text-white transition-colors underline underline-offset-8">
            View All Destinations
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {preferredCountries.map((country, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 px-8 py-10 rounded-2xl text-center hover:bg-gold-500 hover:text-black transition-all group cursor-pointer flex flex-col items-center gap-4"
            >
              <div className="w-12 h-8 relative overflow-hidden rounded shadow-lg border border-white/10 group-hover:border-black/20">
                <Flag code={country.code} className="w-full h-full object-cover" />
              </div>
              <div className="text-xl font-bold uppercase tracking-wider">{country.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-24 px-6 md:px-20 bg-gold-500 text-black">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 text-center items-center">
          <div>
            <h3 className="text-5xl md:text-7xl font-bold mb-2">15+</h3>
            <p className="uppercase tracking-[0.2em] font-semibold text-sm">Countries</p>
          </div>

          <div>
            <h3 className="text-5xl md:text-7xl font-bold mb-2">360+</h3>
            <p className="uppercase tracking-[0.2em] font-semibold text-sm">Universities</p>
          </div>

          <div>
            <h3 className="text-5xl md:text-7xl font-bold mb-2">1k+</h3>
            <p className="uppercase tracking-[0.2em] font-semibold text-sm">Students</p>
          </div>

          <div>
            <h3 className="text-5xl md:text-7xl font-bold mb-2">500+</h3>
            <p className="uppercase tracking-[0.2em] font-semibold text-sm">Admissions</p>
          </div>

          <div className="col-span-2 md:col-span-1 border-t md:border-t-0 md:border-l border-black/20 pt-8 md:pt-0">
            <h3 className="text-5xl md:text-7xl font-bold mb-2">5★</h3>
            <p className="uppercase tracking-[0.2em] font-semibold text-sm">User Rating</p>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-24 px-6 md:px-20 text-center space-y-8 bg-black">
        <h2 className="text-4xl md:text-6xl font-black italic">READY TO START YOUR JOURNEY?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
          <Link href="/contact" className="btn-gold">
            Book Now
          </Link>

          <a href="https://wa.me/918987654321" target="_blank" className="btn-outline-gold flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.12l-.768 2.809 2.894-.759c.797.45 1.708.734 2.618.735 3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.765-5.768-5.765zm3.434 8.165c-.147.412-.733.743-1.025.79-.27.042-.614.074-1.121-.088-.306-.11-1.399-.54-2.646-1.654-1.066-.95-1.785-2.126-1.993-2.484-.209-.357-.022-.551.157-.729.16-.16.357-.411.536-.617.178-.205.237-.35.355-.583.119-.234.059-.438-.03-.617-.089-.178-.733-1.766-1.002-2.417-.263-.637-.534-.551-.733-.561l-.624-.011c-.267 0-.702.1-.1.082 1.059.412.316.516.48.91 1.411 1.742 2.766 2.246 3.42 2.551.654.305.842.261 1.15.22.306-.041 1.059-.441 1.207-1.116.147-.674.147-1.252.103-1.365-.044-.113-.163-.178-.351-.271z" />
            </svg>
            WhatsApp Us
          </a>
        </div>
      </section>
    </main>
  );
}
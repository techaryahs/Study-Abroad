"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-950 text-white border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-24 grid md:grid-cols-4 gap-16 relative z-10">

        {/* BRAND */}
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center font-bold text-black text-2xl group-hover:rotate-6 transition-transform">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-white leading-tight">
                Dr. Alam
              </span>
              <span className="text-[10px] text-gold-500 uppercase tracking-[0.3em] font-black">
                Global Admissions
              </span>
            </div>
          </Link>
          <p className="text-white/30 text-sm leading-relaxed font-normal">
            Your trusted principal-led partner for studying abroad. We guide students 
            to Ivy League and top global universities with personalized, academic-first mentorship.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-black mb-8 text-white uppercase tracking-[0.4em] text-[10px]">
            Navigation
          </h3>
          <ul className="space-y-4 text-white/40 text-sm font-medium">
            <li><Link href="/" className="hover:text-gold-500 transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-gold-500 transition-colors">About Us</Link></li>
            <li><Link href="/services" className="hover:text-gold-500 transition-colors">Our Services</Link></li>
            <li><Link href="/success-stories" className="hover:text-gold-500 transition-colors">Success Stories</Link></li>
            <li><Link href="/blogs" className="hover:text-gold-500 transition-colors">Insights & Blogs</Link></li>
          </ul>
        </div>

        {/* EXPERTISE */}
        <div>
          <h3 className="font-black mb-8 text-white uppercase tracking-[0.4em] text-[10px]">
            Expertise
          </h3>
          <ul className="space-y-4 text-white/40 text-sm font-medium">
            <li><Link href="/services/admission-guidance" className="hover:text-gold-500 transition-colors">Admission Guidance</Link></li>
            <li><Link href="/services/university-shortlisting" className="hover:text-gold-500 transition-colors">University Shortlisting</Link></li>
            <li><Link href="/services/scholarship-assistance" className="hover:text-gold-500 transition-colors">Scholarship Assistance</Link></li>
            <li><Link href="/services/visa-guidance" className="hover:text-gold-500 transition-colors">Visa Guidance</Link></li>
            <li><Link href="/services/profile-building" className="hover:text-gold-500 transition-colors">Profile Building</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-black mb-8 text-white uppercase tracking-[0.4em] text-[10px]">
            Contact
          </h3>
          <div className="space-y-6 text-white/40 text-sm font-medium">
            <p className="flex items-start gap-4">
              <span className="text-gold-500 text-xs">📍</span>
              Excellence Tower, Mumbai, India
            </p>
            <p className="flex items-center gap-4">
              <span className="text-gold-500 text-xs">📞</span>
              +91 89876 54321
            </p>
            <p className="flex items-center gap-4">
              <span className="text-gold-500 text-xs">✉</span>
              admissions@dralam.com
            </p>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/5 text-center py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
        <div className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black">
          © {new Date().getFullYear()} Dr. Alam Global.
        </div>
        <div className="flex gap-8 text-[10px] uppercase tracking-[0.3em] font-black text-white/20">
          <Link href="/privacy" className="hover:text-gold-500 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gold-500 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

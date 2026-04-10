"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export default function Footer() {
  const serviceItems = [
    { name: "Complete Application Help", href: "/services" },
    { name: "Counselling Session", href: "/services" },
    { name: "Profile Evaluation & Shortlisting", href: "/services" },
    { name: "Statement of Purpose Drafting", href: "/services/sop" },
    { name: "US Visa Mock Interview", href: "/ai_services/mock_interview_ai" },
  ];

  const disciplineItems = [
    { name: "Data Science", href: "/universities" },
    { name: "Business", href: "/universities" },
    { name: "Architecture", href: "/universities" },
    { name: "Psychology", href: "/universities" },
  ];

  const countryItems = [
    { name: "Canada", href: "/universities/by-country/canada" },
    { name: "USA", href: "/universities/by-country/usa" },
    { name: "United Kingdom", href: "/universities/by-country/united-kingdom" },
    { name: "Germany", href: "/universities/by-country/germany" },
    { name: "Australia", href: "/universities/by-country/australia" },
  ];

  const companyItems = [
    { name: "Home", href: "/" },
    { name: "Terms of service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const resourceItems = [
    { name: "Scholarship", href: "/resources/scholarships" },
    { name: "Education Loan Support", href: "/resources/education-loans" },
    { name: "Reviews", href: "/resources/reviews" },
  ];

  const toolItems = [
    { name: "RateMyChances", href: "/universities/rate-my-chances" },
    { name: "UniPredict", href: "/universities/unipredict" },
  ];

  return (
    <footer className="bg-[#2D1F1D] text-white border-t border-[#B3985E]/20 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#B3985E]/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* MAIN FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10 transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 items-start">

          {/* COLUMN 1: BRAND & COMPANY */}
          <div className="space-y-12">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-[#B3985E] flex items-center justify-center font-bold text-[#2D1F1D] text-xl transition-transform">
                  G
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg text-white leading-tight">
                    Global Counsellor Centre
                  </span>
                  <span className="text-[9px] text-[#B3985E] uppercase tracking-[0.3em] font-black">
                    Global Admissions
                  </span>
                </div>
              </Link>
              <p className="text-white/30 text-xs leading-relaxed font-normal max-w-xs">
                Your trusted principal-led partner for studying abroad. We guide students
                to Ivy League and top global universities with personalized, academic-first mentorship.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E]">Company</h3>
              <ul className="space-y-3">
                {companyItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-xs text-white/50 hover:text-[#B3985E] transition-colors">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 2: SERVICES & RESOURCES */}
          <div className="space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E] mb-8">Services</h3>
              <ul className="space-y-4">
                {serviceItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-xs text-white/50 hover:text-[#B3985E] transition-colors leading-snug block">{item.name}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" className="text-[10px] text-[#B3985E] font-bold underline decoration-[#B3985E]/30 underline-offset-4 hover:text-white transition-colors">See all services</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E]/50 mb-8">Resources</h3>
              <ul className="space-y-4">
                {resourceItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-xs text-white/50 hover:text-[#B3985E] transition-colors leading-snug block">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 3: DISCIPLINES & COUNTRIES */}
          <div className="space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E] mb-8">Disciplines</h3>
              <ul className="space-y-4">
                {disciplineItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-xs text-white/50 hover:text-[#B3985E] transition-colors leading-snug block">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E]/50 mb-8">Countries</h3>
              <ul className="space-y-4">
                {countryItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-xs text-white/50 hover:text-[#B3985E] transition-colors leading-snug block">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 4: CONTACT & TOOLS */}
          <div className="space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E] mb-8">Contact</h3>
              <div className="space-y-6 text-white/40 text-xs font-medium">
                <div className="flex items-start gap-4">
                  <MapPin size={16} className="text-[#B3985E] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">Gauri Complex, 601, Sector 11, Belapur, Navi Mumbai</p>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={16} className="text-[#B3985E] shrink-0" />
                  <p>+91 96199 01999</p>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={16} className="text-[#B3985E] shrink-0" />
                  <p className="truncate">tech.aryahs@gmail.com</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E]/50 mb-8">Tools</h3>
              <ul className="space-y-4">
                {toolItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-xs text-white/50 hover:text-[#B3985E] transition-colors leading-snug block uppercase tracking-widest font-black text-[9px]">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="border-t border-[#B3985E]/10 bg-black/10 py-8">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/10 text-[8px] uppercase tracking-[0.6em] font-black text-center md:text-left">
            GCC Success Portal — Excellence in Global Admissions
          </div>
          <div className="flex gap-8 text-[8px] uppercase tracking-[0.3em] font-black text-white/20">
            <Link href="/privacy" className="hover:text-[#B3985E] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#B3985E] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

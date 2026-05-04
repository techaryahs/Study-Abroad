"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export default function Footer() {
  const serviceItems = [
    { name: "Complete Application Help", href: "/services/application-help" },
    { name: "Counselling Session", href: "/services" },
    { name: "Profile Evaluation & Shortlisting", href: "/services/shortlisting" },
    { name: "Statement of Purpose Drafting", href: "/services/sop" },
    { name: "US Visa Mock Interview", href: "/ai_services/mock_interview_ai" },
  ];

  const disciplineItems = [
    { name: "Data Science", href: "/universities/byprogram?program=Data%20Science" },
    { name: "Business", href: "/universities/byprogram?program=Business" },
    { name: "Architecture", href: "/universities/byprogram?program=Architecture" },
    { name: "Psychology", href: "/universities/byprogram?program=Psychology" },
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
    { name: "Privacy & Policy", href: "/privacy-policy" },
  ];

  const resourceItems = [
    { name: "Scholarship", href: "/resources/scholarships" },
    { name: "Education Loan Support", href: "/resources/education-loans" },
    { name: "Reviews", href: "/resources/reviews" },
  ];

  const toolItems = [
    { name: "RateMyChances", href: "/universities/RateMyChances" },
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
                  I
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg text-white leading-tight">
                    International Eduleader Council
                  </span>
                  <span className="text-[9px] text-[#B3985E] uppercase tracking-[0.3em] font-black">
                    GLOBAL ADMISSIONS
                  </span>
                </div>
              </Link>
              <p className="text-white/80 text-xs leading-relaxed font-bold max-w-xs">
                Your trusted principal-led partner for studying abroad. We guide students
                to Ivy League and top global universities with personalized, academic-first mentorship.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E]">Company</h3>
              <ul className="space-y-3">
                {companyItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-[#B3985E] transition-colors">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 2: SERVICES & RESOURCES */}
          <div className="space-y-12">
            <div>
              <h3 className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E] mb-8">Services</h3>
              <ul className="space-y-4">
                {serviceItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors leading-snug block">{item.name}</Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" className="text-[10px] text-[#B3985E] font-bold underline decoration-[#B3985E]/30 underline-offset-4 hover:text-white transition-colors">See all services</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E] mb-8">Resources</h3>
              <ul className="space-y-4">
                {resourceItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors leading-snug block">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 3: DISCIPLINES & COUNTRIES */}
          <div className="space-y-12">
            <div>
              <h3 className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E] mb-8">Disciplines</h3>
              <ul className="space-y-4">
                {disciplineItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors leading-snug block">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E] mb-8">Countries</h3>
              <ul className="space-y-4">
                {countryItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors leading-snug block">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* COLUMN 4: CONTACT & TOOLS */}
          <div className="space-y-12">
            <div>
              <h3 className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E] mb-8">Contact</h3>
              <div className="space-y-6 text-white text-[10px] font-bold uppercase tracking-wider">
                <div className="flex items-start gap-4">
                  <MapPin size={16} className="text-[#B3985E] shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-bold">Gauri Complex, 601, Sector 11, Belapur, Navi Mumbai</p>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={16} className="text-[#B3985E] shrink-0" />
                  <p className="font-bold">+91 86578 69659</p>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={16} className="text-[#B3985E] shrink-0" />
                  <p className="truncate font-bold text-white hover:text-[#B3985E] transition-colors cursor-pointer">info.aryahs@gmail.com</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-[#B3985E] mb-8">Tools</h3>
              <ul className="space-y-4">
                {toolItems.map(item => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-[#B3985E] transition-colors leading-snug block">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>



      {/* Bottom Line */}
      <div className="border-t border-[#B3985E]/20 py-4 text-center text-white text-[10px] tracking-[0.3em] uppercase font-bold">
        <span className="text-[#B3985E] mr-1">© 2026</span> Aryahs World Infotech (OPC) Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
}

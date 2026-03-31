"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import {
  Search,
  Globe,
  BarChart2,
  Percent,
  BookOpen,
  DollarSign,
  MapPin,
  Users,
  Briefcase,
  GraduationCap,
  Star,
  Video,
  Wand2,
  PenTool,
  ChevronRight,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type DropdownKey = "universities" | "resources" | "ai-services" | null;

interface DropdownItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: "NEW" | null;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const universityItems: DropdownItem[] = [
  {
    icon: <Globe size={18} />,
    title: "Top Universities By Country",
    description: "Find statistics like acceptance rates, expenses, deadlines, and test scores.",
    href: "/universities/by-country",
  },
  {
    icon: <BarChart2 size={18} />,
    title: "UniPredict",
    description: "Predicts where you can get admits.",
    href: "/universities/unipredict",
  },
  {
    icon: <Percent size={18} />,
    title: "RateMyChances",
    description: "Estimates your admit chances based on your profile.",
    href: "/universities/rate-my-chances",
    badge: "NEW",
  },
  {
    icon: <BookOpen size={18} />,
    title: "Popular Programs",
    description: "Explore the most sought-after academic programs worldwide.",
    href: "/universities/popular-programs",
  },
  {
    icon: <DollarSign size={18} />,
    title: "High Ranked Cheap Universities",
    description: "Top-quality education without breaking the bank.",
    href: "/universities/affordable",
  },
  {
    icon: <MapPin size={18} />,
    title: "Top Universities by State/Province",
    description: "Filter top schools by region across the US and Canada.",
    href: "/universities/by-state",
  },
];

const resourcesItems: DropdownItem[] = [
  {
    icon: <Users size={18} />,
    title: "Research Groups",
    description: "Find and connect with academic research communities.",
    href: "/resources/research-groups",
  },
  {
    icon: <Briefcase size={18} />,
    title: "EB-1A Toolkit",
    description: "Everything you need to build an extraordinary ability case.",
    href: "/resources/eb1a-toolkit",
    badge: "NEW",
  },
  {
    icon: <GraduationCap size={18} />,
    title: "Scholarships",
    description: "Curated database of scholarships for international students.",
    href: "/resources/scholarships",
  },
  {
    icon: <DollarSign size={18} />,
    title: "Education Loan Support",
    description: "Guidance on financing your international education.",
    href: "/resources/education-loans",
  },
  {
    icon: <Star size={18} />,
    title: "Reviews",
    description: "Read authentic student reviews of universities and programs.",
    href: "/resources/reviews",
  },
];

const aiServicesItems: DropdownItem[] = [
  {
    icon: <Video size={18} />,
    title: "US Visa Mock Interview AI",
    description: "Practice your visa interview with our AI interviewer.",
    href: "/ai-services/visa-interview",
  },
  {
    icon: <Wand2 size={18} />,
    title: "AI & Plagiarism Remover Tool",
    description: "Clean and humanize AI-generated content instantly.",
    href: "/ai-services/plagiarism-remover",
  },
  {
    icon: <PenTool size={18} />,
    title: "AI SOP Generator",
    description: "Generate a personalized Statement of Purpose in minutes.",
    href: "/ai-services/sop-generator",
  },
];

// ─── Reusable Dropdown Panel (defined inside same file) ───────────────────────

function DropdownPanel({
  items,
  label,
  browseHref,
  browseLabel,
  align = "left",
  width = "340px",
  onMouseEnter,
  onMouseLeave,
}: {
  items: DropdownItem[];
  label: string;
  browseHref: string;
  browseLabel: string;
  align?: "left" | "center";
  width?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const posClass = align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

  return (
    <div
      className={`absolute top-full mt-1 ${posClass} rounded-xl shadow-2xl z-50 overflow-hidden`}
      style={{
        background: "#1f2937",
        width,
        animation: "dropIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Section label */}
      <div className="px-4 pt-4 pb-2 border-b border-white/10">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-yellow-400">
          {label}
        </p>
      </div>

      {/* Items */}
      <ul className="py-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-150"
            >
              <div className="mt-0.5 flex-shrink-0 text-yellow-400">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors duration-150 leading-snug">
                    {item.title}
                  </span>
                  {item.badge === "NEW" && (
                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <ChevronRight
                size={14}
                className="mt-1 flex-shrink-0 text-gray-600 group-hover:text-yellow-400 group-hover:translate-x-0.5 transition-all duration-150"
              />
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer CTA */}
      <div className="px-4 py-3 border-t border-white/10 bg-white/5">
        <Link
          href={browseHref}
          className="text-xs text-yellow-400 hover:text-yellow-300 font-medium flex items-center gap-1 transition-colors"
        >
          {browseLabel}
          <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = useCallback((key: DropdownKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(key);
  }, []);

  const onLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Universities", path: "/universities", dropdown: "universities" as DropdownKey },
    { name: "Services", path: "/services" },
    { name: "Decisions", path: "/decisions" },
    { name: "Discussions", path: "/discussions" },
    { name: "Articles", path: "/articles" },
    { name: "Resources", path: "/resources", badge: "New", dropdown: "resources" as DropdownKey },
    { name: "AI Services", path: "/ai-services", badge: "New", dropdown: "ai-services" as DropdownKey },
    { name: "Material", path: "/material", badge: "New-green" },
  ];

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="sticky top-0 z-50 w-full">

        {/* ── TOP BAR ── */}
        <div className="bg-black text-white flex items-center justify-between px-6 md:px-16 h-14 border-b border-gray-800">

          <Link href="/" className="text-yellow-400 font-bold text-xl tracking-tight flex-shrink-0">
            Global Counselling Center
          </Link>

          <div className="hidden md:flex items-center bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 w-[480px] focus-within:border-yellow-400/60 transition-colors">
            <Search size={15} className="text-gray-500 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search universities, programs, articles..."
              className="w-full outline-none text-sm text-white bg-transparent placeholder-gray-500"
            />
          </div>

          <div className="hidden md:flex items-center gap-5 text-sm flex-shrink-0">
            <Link href="/login" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-gray-300 hover:text-yellow-400 transition-colors">
              Sign Up
            </Link>
            <Link
              href="/contact"
              className="bg-yellow-400 text-black px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors"
            >
              Book Counseling Session
            </Link>
          </div>

          <button
            className="md:hidden text-2xl leading-none"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        {/* ── SECOND NAV ── */}
        <div className="hidden md:flex items-center justify-between px-6 md:px-16 h-12 bg-black border-b border-gray-800">
          <nav className="flex items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const isOpen = item.dropdown && activeDropdown === item.dropdown;

              return (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => onEnter(item.dropdown ?? null)}
                  onMouseLeave={onLeave}
                >
                  <Link
                    href={item.path}
                    className={`flex items-center gap-1.5 px-3 py-3 text-sm transition-colors duration-150 hover:text-yellow-400 ${isActive || isOpen ? "text-yellow-400" : "text-white"
                      }`}
                  >
                    {item.name}
                    {item.badge === "New" && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                        New
                      </span>
                    )}
                    {item.badge === "New-green" && (
                      <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                        New
                      </span>
                    )}
                  </Link>

                  {/* Active underline */}
                  {(isActive || isOpen) && (
                    <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-yellow-400 rounded-full" />
                  )}

                  {/* Universities dropdown */}
                  {item.dropdown === "universities" && activeDropdown === "universities" && (
                    <DropdownPanel
                      items={universityItems}
                      label="Universities"
                      browseHref="/universities"
                      browseLabel="Browse all universities"
                      align="left"
                      width="340px"
                      onMouseEnter={() => onEnter("universities")}
                      onMouseLeave={onLeave}
                    />
                  )}

                  {/* Resources dropdown */}
                  {item.dropdown === "resources" && activeDropdown === "resources" && (
                    <DropdownPanel
                      items={resourcesItems}
                      label="Resources"
                      browseHref="/resources"
                      browseLabel="Browse all resources"
                      align="center"
                      width="340px"
                      onMouseEnter={() => onEnter("resources")}
                      onMouseLeave={onLeave}
                    />
                  )}

                  {/* AI Services dropdown */}
                  {item.dropdown === "ai-services" && activeDropdown === "ai-services" && (
                    <DropdownPanel
                      items={aiServicesItems}
                      label="AI Services"
                      browseHref="/ai-services"
                      browseLabel="Explore all AI tools"
                      align="center"
                      width="320px"
                      onMouseEnter={() => onEnter("ai-services")}
                      onMouseLeave={onLeave}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="text-white/60 hover:text-yellow-400 cursor-pointer text-sm transition-colors flex items-center gap-1.5">
            <span>📱</span>
            <span>Download app</span>
          </div>
        </div>
      </header>

      {/* ── MOBILE FULL SCREEN MENU ── */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center gap-6 text-lg z-[100]">
          <button
            className="absolute top-6 right-8 text-3xl leading-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 hover:text-yellow-400 transition-colors ${pathname === item.path ? "text-yellow-400" : ""
                }`}
            >
              {item.name}
              {item.badge === "New" && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                  New
                </span>
              )}
              {item.badge === "New-green" && (
                <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                  New
                </span>
              )}
            </Link>
          ))}

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 bg-yellow-400 text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            Book Session
          </Link>

          <div className="mt-2 text-sm text-gray-500">+91 89876 54321</div>
        </div>
      )}
    </>
  );
}
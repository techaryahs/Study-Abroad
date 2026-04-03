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
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";
import { useEffect } from "react";
import { getUser, removeToken, clearAuth } from "@/app/lib/token";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────

type DropdownKey = "universities" | "resources" | "ai-services" | null;

interface DropdownItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: "NEW" | null;
  subItems?: { name: string; href: string }[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const universityItems: DropdownItem[] = [
  {
    icon: <Globe size={18} />,
    title: "Top Universities By Country",
    description: "Find statistics like acceptance rates, expenses, deadlines, and test scores.",
    href: "/universities/by-country",
    subItems: [
      { name: "USA", href: "/universities/by-country/usa" },
      { name: "Canada", href: "/universities/by-country/canada" },
      { name: "United Kingdom", href: "/universities/by-country/united-kingdom" },
      { name: "Germany", href: "/universities/by-country/germany" },
      { name: "Australia", href: "/universities/by-country/australia" },
      { name: "Singapore", href: "/universities/by-country/singapore" },
      { name: "Ireland", href: "/universities/by-country/ireland" },
      { name: "Netherlands", href: "/universities/by-country/netherlands" },
      { name: "France", href: "/universities/by-country/france" },
      { name: "Switzerland", href: "/universities/by-country/switzerland" },
      { name: "New Zealand", href: "/universities/by-country/new-zealand" },
    ]
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
    href: "/ai_services/mock_interview_ai",
  },
  {
    icon: <Wand2 size={18} />,
    title: "AI & Plagiarism Remover Tool",
    description: "Clean and humanize AI-generated content instantly.",
    href: "/ai_services/ai_plagrism_tool",
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`absolute top-full mt-1 ${posClass} rounded-xl shadow-2xl z-50`}
      style={{
        background: "#1f2937",
        width,
        animation: "dropIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Section label */}
      <div className="px-4 pt-4 pb-2 border-b border-[#d4af37]/20">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#d4af37]">
          {label}
        </p>
      </div>

      {/* Items */}
      <ul className="py-2">
        {items.map((item, index) => (
          <li
            key={item.href}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              href={item.href}
              className="group flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-150"
            >
              <div className="mt-0.5 flex-shrink-0 text-[#d4af37]">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white group-hover:text-[#d4af37] transition-colors duration-150 leading-snug">
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
                className="mt-1 flex-shrink-0 text-gray-600 group-hover:text-[#d4af37] group-hover:translate-x-0.5 transition-all duration-150"
              />
            </Link>

            {/* Sub-menu if items present */}
            {item.subItems && hoveredIndex === index && (
              <div
                className="absolute left-full top-0 ml-1 bg-[#1f2937] rounded-xl shadow-2xl border border-white/10 w-48 z-50 flex flex-col"
                style={{ animation: "dropIn 0.15s ease-out both" }}
              >
                <div className="px-4 pt-4 pb-2 border-b border-white/10 flex-shrink-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-yellow-400">
                    Countries
                  </p>
                </div>
                <ul className="py-2 max-h-[280px] overflow-y-auto">
                  {item.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.href}
                        className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Footer CTA */}
      <div className="px-4 py-3 border-t border-[#d4af37]/20 bg-white/5">
        <Link
          href={browseHref}
          className="text-xs text-[#d4af37] hover:text-yellow-300 font-medium flex items-center gap-1 transition-colors"
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
  const [user, setUserState] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const refreshUser = () => {
      const storedUser = getUser();
      if (storedUser && (storedUser._id || storedUser.id)) {
        setUserState(storedUser);
      } else {
        setUserState(null);
      }
    };

    refreshUser();
    window.addEventListener('user-updated', refreshUser);

    const storedUser = getUser();
    if (storedUser && (storedUser._id || storedUser.id)) {
      const fetchFullProfile = async () => {
        const userId = storedUser._id || storedUser.id;
        if (!userId) return;
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/user/profile/${userId}`);
          if (response.ok) {
            const data = await response.json();
            const fullUser = {
              ...storedUser,
              ...data,
              ...(data.profile || {})
            };
            setUserState(fullUser);
          } else if (response.status === 401 || response.status === 404) {
            console.warn("Auth session node stale on navbar hook. Resetting...");
            clearAuth();
            setUserState(null);
          }
        } catch (error) {
          console.error("Failed to fetch full user profile in Navbar:", error);
        }
      };
      fetchFullProfile();
    }

    return () => window.removeEventListener('user-updated', refreshUser);
  }, []);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/";
  };

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

          <Link href="/" className="text-[#d4af37] font-bold text-xl tracking-tight flex-shrink-0">
            Global Counselling Center
          </Link>

          <div className="hidden md:flex items-center bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 w-[480px] focus-within:border-[#d4af37]/60 transition-colors">
            <Search size={15} className="text-gray-500 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search universities, programs, articles..."
              className="w-full outline-none text-sm text-white bg-transparent placeholder-gray-500"
            />
          </div>

          <div className="hidden md:flex items-center gap-5 text-sm flex-shrink-0">
            {!user ? (
              <>
                <Link href="/auth/login" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Sign In
                </Link>

                {/* Multi-role Sign Up Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-1.5 text-gray-300 hover:text-[#d4af37] transition-colors font-semibold">
                    Sign Up
                    <ChevronRight size={14} className="group-hover:rotate-90 transition-transform duration-200" />
                  </button>

                  <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-xl bg-[#1f2937] shadow-3xl ring-1 ring-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden border border-white/5">
                    <div className="px-4 pt-3 pb-1 border-b border-[#d4af37]/20">
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#d4af37]/80">Select Role</p>
                    </div>
                    <div className="py-1">
                      <Link href="/auth/RegisterStudent" className="group/item flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/5 transition-colors">
                        <span className="text-[#d4af37] group-hover/item:scale-125 transition-transform">🎓</span>
                        <span className="group-hover/item:text-[#d4af37] transition-colors">Student</span>
                      </Link>
                      <Link href="/auth/RegisterConsultant" className="group/item flex items-center gap-3 px-4 py-2.5 text-sm text-white border-t border-white/5 hover:bg-white/5 transition-colors">
                        <span className="text-[#d4af37] group-hover/item:scale-125 transition-transform">💼</span>
                        <span className="group-hover/item:text-[#d4af37] transition-colors">Consultant</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    onMouseEnter={() => setProfileDropdownOpen(true)}
                    className="flex items-center gap-2 focus:outline-none transition-transform active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center hover:border-[#d4af37]/50 transition-colors">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage.startsWith('http') ? user.profileImage : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${user.profileImage}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=FFD700&color=000&bold=true&rounded=true`}
                          alt="Profile Placeholder"
                          className="w-full h-full p-0.5"
                        />
                      )}
                    </div>
                    <ChevronRight size={14} className={`text-gray-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {/* Profile Dropdown Card */}
                  {profileDropdownOpen && (
                    <div
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                      className="absolute right-0 mt-4 w-64 origin-top-right rounded-[1.25rem] bg-[#0a0a0a] border border-[#d4af37]/20 shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-50 overflow-hidden p-5 text-center"
                      style={{
                        animation: "dropIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
                      }}
                    >
                      {/* Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent pointer-events-none" />

                      <div className="flex flex-col items-center gap-3 relative z-10">
                        <div className="relative group/avatar">
                          <div className="w-16 h-16 rounded-[1rem] bg-white/5 border border-[#d4af37]/20 overflow-hidden flex items-center justify-center p-1 transition-transform duration-500 group-hover/avatar:rotate-2">
                            <div className="w-full h-full rounded-[0.8rem] overflow-hidden bg-[#1a1a1a] flex items-center justify-center relative">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage.startsWith('http') ? user.profileImage : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${user.profileImage}`}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=FFD700&color=000&bold=true&rounded=true`}
                                  alt="Profile Avatar"
                                  className="w-full h-full p-1"
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <h3 className="text-white font-black text-md tracking-tight truncate max-w-[200px]">
                            {user.name || "Premium User"}
                          </h3>
                          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest truncate max-w-[180px]">
                            {user.email || "user@example.com"}
                          </p>
                        </div>

                        <div className="w-full pt-2 space-y-2">
                          <Link
                            href={user?.role === 'consultant' || user?.role === 'admin' ? '/consultant-dashboard' : '/User/dashboard'}
                            className="flex items-center justify-center gap-2 w-full bg-[#d4af37] text-black py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-yellow-300 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(234,179,8,0.2)]"
                          >
                            <LayoutDashboard size={12} />
                            {user?.role === 'consultant' ? 'Consultant Portal' : 'Dashboard'}
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full py-1.5 text-white/50 hover:text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Small Cart Icon */}
                <div className="relative group/cart cursor-pointer hover:scale-110 transition-transform px-2">
                  <ShoppingCart size={20} className="text-white hover:text-[#d4af37] transition-colors" />
                  <span className="absolute -top-1.5 -right-0 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    0
                  </span>
                </div>
              </div>
            )}

            <Link
              href="/contact"
              className="bg-[#d4af37] text-black px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors"
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
                    className={`flex items-center gap-1.5 px-3 py-3 text-sm transition-colors duration-150 hover:text-[#d4af37] ${isActive || isOpen ? "text-[#d4af37]" : "text-white"
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
                    <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#d4af37] rounded-full" />
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

          <div className="text-white/70 hover:text-[#d4af37] cursor-pointer text-sm transition-colors flex items-center gap-1.5">
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

          {user && (
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center p-1">
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
                  {user.profileImage ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}${user.profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={32} className="text-gray-600" />
                  )}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-white font-black text-lg tracking-tighter">{user.name}</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{user.email}</p>
              </div>
            </div>
          )}

          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 hover:text-[#d4af37] transition-colors ${pathname === item.path ? "text-[#d4af37]" : ""
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

          {user && (
            <Link
              href={user?.role === 'consultant' || user?.role === 'admin' ? '/consultant-dashboard' : '/User/dashboard'}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-[#d4af37] hover:text-yellow-300 font-bold transition-colors"
            >
              <LayoutDashboard size={18} />
              {user?.role === 'consultant' ? 'Consultant Portal' : 'Dashboard'}
            </Link>
          )}

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-2 bg-[#d4af37] text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            Book Session
          </Link>

          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-400/70 hover:text-red-400 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}

          <div className="mt-2 text-sm text-gray-500">+91 89876 54321</div>
        </div>
      )}
    </>
  );
}
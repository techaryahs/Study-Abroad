"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  X,
  Smartphone,
  Menu,
} from "lucide-react";
import { useEffect } from "react";
import { getUser, removeToken, clearAuth } from "@/app/lib/token";
import Image from "next/image";
import BookCounsellingModal from "@/components/shared/BookCounsellingModal";

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
                <ul className="py-2 max-h-[280px] overflow-y-auto no-scrollbar">
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
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null);
  const [user, setUserState] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showCounsellingModal, setShowCounsellingModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [suggestions, setSuggestions] = useState<{ name: string, href: string }[]>([]);
  const searchRef = useRef<HTMLFormElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const countries = [
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
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return;

    const match = countries.find(c =>
      c.name.toLowerCase() === q || c.name.toLowerCase().includes(q)
    );

    if (match) {
      router.push(match.href);
      setSearchQuery("");
      setSuggestions([]);
      setSearchError(false);
    } else {
      setSearchError(true);
      setTimeout(() => setSearchError(false), 500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim().length > 0) {
      const filtered = countries.filter(c =>
        c.name.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    const fetchCartCount = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/user/get-cart`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.cart?.length || 0);
        }
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
    window.addEventListener('cart-updated', fetchCartCount);

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

    return () => {
      window.removeEventListener('user-updated', refreshUser);
      window.removeEventListener('cart-updated', fetchCartCount);
    };
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
    { name: "Decisions", path: "/decisions", badge: "Coming Soon" },
    { name: "Discussions", path: "/discussions", badge: "Coming Soon" },
    { name: "Articles", path: "/articles", badge: "Coming Soon" },
    { name: "Resources", path: "/resources", badge: "New", dropdown: "resources" as DropdownKey },
    { name: "AI Services", path: "/ai-services", badge: "New", dropdown: "ai-services" as DropdownKey },
    { name: "Material", path: "/material", badge: "Coming Soon" },
  ];

  const getInitials = (name: string | undefined | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getProfileImage = (path: string | undefined | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('data:image')) return path;
    if (path.startsWith('//')) return `https:${path}`;
    const normalizedPath = path.replace(/\\/g, '/');
    const leadingSlash = normalizedPath.startsWith('/') ? '' : '/';
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001').replace(/\/$/, '');
    return `${backendUrl}${leadingSlash}${normalizedPath}`;
  };

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .search-glow:focus-within { box-shadow: 0 0 20px rgba(212,175,55,0.1); }
      `}</style>

      <header className="sticky top-0 z-50 w-full bg-black">

        {/* ── ROW 1: PRIMARY PILLARS & ACTIONS ── */}
        <div className="flex items-center justify-between px-6 md:px-16 h-16 border-b border-white/5 relative z-20 bg-black">
          {/* Logo Section - Left 1/4 */}
          <div className="w-1/4 flex items-center">
            <Link href="/" className="group flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-yellow-600 flex items-center justify-center p-[1px] group-hover:scale-105 transition-transform">
                <div className="h-full w-full bg-black rounded-[11px] flex items-center justify-center">
                  <span className="text-[12px] font-black text-[#d4af37] tracking-tighter">GCC</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-[12px] uppercase tracking-[0.25em] leading-none">Global Counselling</span>
                <span className="text-[#d4af37] text-[8px] font-bold uppercase tracking-[0.3em] mt-1 opacity-60">Success Starts Here</span>
              </div>
            </Link>
          </div>

          {/* Primary Navigation - Center Area */}
          <div className="flex-1 flex justify-center h-full">
            <nav className="hidden lg:flex items-center h-full gap-8">
              {/* Universities Dropdown */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => onEnter("universities")}
                onMouseLeave={onLeave}
              >
                <div className={`flex items-center gap-1.5 cursor-pointer text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-[#d4af37] ${activeDropdown === "universities" ? "text-[#d4af37]" : "text-white/70"}`}>
                  Universities
                  <ChevronRight size={10} className={`rotate-90 transition-transform ${activeDropdown === "universities" ? "-rotate-90" : ""}`} />
                </div>
                {activeDropdown === "universities" && (
                  <DropdownPanel
                    items={universityItems}
                    label="Top Global Universities"
                    browseHref="/universities"
                    browseLabel="Browse All Universities"
                    align="center"
                    onMouseEnter={() => onEnter("universities")}
                    onMouseLeave={onLeave}
                  />
                )}
              </div>

              {/* Services (Static Link) */}
              <div className="h-full flex items-center">
                <Link href="/services" className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70 hover:text-[#d4af37] transition-all">
                  Services
                </Link>
              </div>

              {/* Resources Dropdown */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => onEnter("resources")}
                onMouseLeave={onLeave}
              >
                <div className={`flex items-center gap-2 cursor-pointer text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-[#d4af37] ${activeDropdown === "resources" ? "text-[#d4af37]" : "text-white/70"}`}>
                  Resources
                  <div className="w-1 h-1 rounded-full bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,1)]" />
                  <ChevronRight size={10} className={`rotate-90 transition-transform ${activeDropdown === "resources" ? "-rotate-90" : ""}`} />
                </div>
                {activeDropdown === "resources" && (
                  <DropdownPanel
                    items={resourcesItems}
                    label="Student Success Library"
                    browseHref="/resources"
                    browseLabel="Visit Resources Hub"
                    align="center"
                    onMouseEnter={() => onEnter("resources")}
                    onMouseLeave={onLeave}
                  />
                )}
              </div>

              {/* AI Services Dropdown */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => onEnter("ai-services")}
                onMouseLeave={onLeave}
              >
                <div className={`flex items-center gap-2 cursor-default text-[10px] font-black uppercase tracking-[0.25em] transition-all group hover:text-[#d4af37] ${activeDropdown === "ai-services" ? "text-[#d4af37]" : "text-white/70"}`}>
                  AI Services
                  <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />
                  <ChevronRight size={10} className={`rotate-90 transition-transform ${activeDropdown === "ai-services" ? "-rotate-90" : ""}`} />
                </div>
                {activeDropdown === "ai-services" && (
                  <DropdownPanel
                    items={aiServicesItems}
                    label="AI Research Protocols"
                    browseHref="/ai_services/mock_interview_ai"
                    browseLabel="Begin AI Simulation"
                    align="center"
                    onMouseEnter={() => onEnter("ai-services")}
                    onMouseLeave={onLeave}
                  />
                )}
              </div>
            </nav>
          </div>

          {/* Action Set - Right 1/4 */}
          <div className="w-1/4 flex items-center justify-end gap-6">
            {!user ? (
              <div className="flex items-center gap-6">
                <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-[#d4af37] transition-all">Sign In</Link>
                <Link
                  href="/auth/RegisterStudent"
                  className="h-9 px-6 rounded-lg bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95 flex items-center justify-center"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link href="/checkout" className="relative group/checkout p-2">
                  <ShoppingCart size={14} className="text-white opacity-40 group-hover/checkout:opacity-100 group-hover/checkout:text-[#d4af37] transition-all" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 text-white text-[7px] font-black rounded-full flex items-center justify-center shadow-lg border border-black group-hover/checkout:bg-[#d4af37] transition-all">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <button
                  className="px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95"
                  onClick={() => setShowCounsellingModal(true)}
                >
                  Book Session
                </button>

                {/* Profile Avatar */}
                <div className="relative group/profile">
                  <button
                    onMouseEnter={() => setProfileDropdownOpen(true)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-yellow-600 p-[1.5px] transition-transform group-hover/profile:scale-110 shadow-xl"
                  >
                    <div className="w-full h-full rounded-[11px] bg-black overflow-hidden flex items-center justify-center">
                      {getProfileImage(user.profileImage || user.image) ? (
                        <img src={getProfileImage(user.profileImage || user.image) || ''} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#d4af37] text-black text-xs font-black uppercase">{getInitials(user.name)}</div>
                      )}
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                      className="absolute right-0 mt-4 w-60 bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,1)] p-5 z-50 text-center"
                      style={{ animation: "dropIn 0.2s ease-out both" }}
                    >
                      {/* Card Top: Large Avatar */}
                      <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#d4af37] to-yellow-600 p-[1.5px] shadow-2xl shadow-[#d4af37]/10">
                          <div className="w-full h-full rounded-[15px] bg-black overflow-hidden flex items-center justify-center">
                            {getProfileImage(user.profileImage || user.image) ? (
                              <img src={getProfileImage(user.profileImage || user.image) || ''} className="w-full h-full object-cover" alt="Profile Large" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#d4af37] text-black text-xl font-black uppercase">{getInitials(user.name)}</div>
                            )}
                          </div>
                        </div>
                      </div>

                        <div className="w-full pt-2 space-y-2">
                          <Link
                            href={user.role === 'admin' ? '/admin-dashboard' : user.role === 'consultant' ? '/consultant-dashboard' : '/User/dashboard'}
                            className="flex items-center justify-center gap-2 w-full bg-[#d4af37] text-black py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-yellow-300 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(234,179,8,0.2)]"
                          >
                            <LayoutDashboard size={12} />
                            Dashboard
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
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 ml-4"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* ── ROW 2: SEARCH & SECONDARY NAVIGATION ── */}
        <div className="hidden md:flex items-center justify-center px-6 md:px-16 h-12 border-b border-white/5 bg-black relative z-10 gap-10">
          {/* Modern Condensed Search Bar & Items - Unified Group */}
          <div className="flex items-center h-full shrink-0">
            <form
              ref={searchRef}
              onSubmit={handleSearch}
              className={`relative group w-[340px] search-glow transition-all duration-300 ${searchError ? "animate-shake border-red-500/50" : ""}`}
            >
              <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#d4af37] transition-all hover:text-[#d4af37]">
                <Search size={13} />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search your dream country..."
                className={`w-full h-8 bg-white/[0.05] border rounded-full pl-10 pr-4 text-[10px] text-white/90 placeholder:text-white/30 outline-none transition-all tracking-wide ${searchError ? "border-red-500/40" : "border-white/40 focus:bg-white/[0.08] focus:border-[#d4af37]/40"}`}
              />

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-[#0a0a0a] border border-white/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 text-center">
                  <div className="px-3 pt-3 pb-2 border-b border-white/5">
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#d4af37]">Destinations Found</span>
                  </div>
                  <div className="py-1 max-h-[200px] overflow-y-auto no-scrollbar">
                    {suggestions.map((country) => (
                      <button
                        key={country.name}
                        type="button"
                        onClick={() => {
                          router.push(country.href);
                          setSearchQuery("");
                          setSuggestions([]);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 text-left group/item transition-colors"
                      >
                        <span className="text-[10px] font-bold text-white/70 group-hover/item:text-[#d4af37] transition-colors">{country.name}</span>
                        <Globe size={10} className="text-white/20 group-hover/item:text-[#d4af37] transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Secondary Nav Items - Centered alongside Search */}
          <nav className="flex items-center h-full gap-1">
            {[navItems[0], navItems[3], navItems[4], navItems[5], navItems[8]].map((item) => (
              <div key={item.path} className="relative group h-full flex items-center">
                {item.badge === "Coming Soon" ? (
                  <div className={`flex items-center gap-2 px-4 h-full text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap cursor-default text-white/50 group-hover:text-[#d4af37]`}>
                    {item.name}
                  </div>
                ) : (
                  <Link href={item.path} className={`flex items-center gap-2 px-4 h-full text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${pathname === item.path ? "text-[#d4af37]" : "text-white hover:text-[#d4af37]"}`}>
                    {item.name}
                  </Link>
                )}
                {item.badge === "Coming Soon" && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#0a0a0a] border border-white/20 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-90 group-hover:scale-100 -translate-y-1 group-hover:translate-y-0 pointer-events-none z-[60]">
                    <span className="text-[7px] text-[#d4af37] font-black uppercase tracking-[0.2em] whitespace-nowrap">Coming Soon</span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[#0a0a0a]" />
                  </div>
                )}
                <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-[#d4af37] scale-x-0 group-hover:scale-x-100 transition-transform origin-center opacity-50" />
              </div>
            ))}
          </nav>

          {/* App Download CTA */}
          <div className="flex items-center h-full shrink-0 pl-4 border-l border-white/5">
            <div className="relative group/app flex items-center h-full gap-1.5 px-2 cursor-help">
              <Smartphone size={12} className="text-white/40 group-hover/app:text-[#d4af37] transition-all" />
              <span className="text-[8px] font-black text-white/40 group-hover/app:text-[#d4af37] transition-all uppercase tracking-[0.2em] whitespace-nowrap">Download Our App</span>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#0a0a0a] border border-white/20 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover/app:opacity-100 group-hover/app:visible transition-all duration-300 transform scale-90 group-hover/app:scale-100 -translate-y-1 group-hover/app:translate-y-0 pointer-events-none z-[60]">
                <span className="text-[7px] text-[#d4af37] font-black uppercase tracking-[0.2em] whitespace-nowrap">Coming Soon</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[#0a0a0a]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE FULL SCREEN MENU ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 relative z-20 bg-black/50 backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-yellow-600 flex items-center justify-center p-[1px]">
                <div className="h-full w-full bg-black rounded-[7px] flex items-center justify-center">
                  <span className="text-[10px] font-black text-[#d4af37]">GCC</span>
                </div>
              </div>
              <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none">Global Counselling</span>
            </Link>
          ))}

          {user && (
            <Link
              href="/User/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-[#d4af37] hover:text-yellow-300 font-bold transition-colors"
            >
              <LayoutDashboard size={18} />
              Dashboard
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
              <div className="mb-10 p-5 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center gap-4 shadow-2xl relative overflow-hidden group/mprofile">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-yellow-600 p-[1.5px] shadow-lg flex-shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-black overflow-hidden flex items-center justify-center">
                    {getProfileImage(user.profileImage || user.image) ? (
                      <img
                        src={getProfileImage(user.profileImage || user.image) || ''}
                        className="w-full h-full object-cover"
                        alt="User"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#d4af37] text-black text-sm font-black uppercase">{getInitials(user.name)}</div>
                    )}
                  </div>
                </div>
                <div className="relative z-10 min-w-0">
                  <h3 className="text-white font-black text-sm tracking-tight truncate pr-4">{user.name}</h3>
                  <p className="text-[#d4af37] text-[8px] font-black uppercase tracking-[0.2em] mt-1 opacity-70">{user.role || 'Member'}</p>
                </div>
              </div>
            )}

            {/* Mobile Auth Actions */}
            {!user ? (
              <div className="mt-10 space-y-3">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">Sign In</Link>
                <Link href="/auth/RegisterStudent" onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full h-14 rounded-2xl bg-[#d4af37] text-black text-[10px] font-black uppercase tracking-widest">Register</Link>
              </div>
            ) : (
              <div className="mt-10 space-y-3">
                <Link href="/User/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">Dashboard</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center justify-center w-full h-14 rounded-2xl bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-widest">Logout</button>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-white/5 bg-black/80 flex items-center justify-center text-white/10">
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">GCC Success Portal © 2026</span>
          </div>
        </div>
      )}

      {/* ── Book Counselling Modal ── */}
      <BookCounsellingModal
        isOpen={showCounsellingModal}
        onClose={() => setShowCounsellingModal(false)}
      />
    </>
  );
}
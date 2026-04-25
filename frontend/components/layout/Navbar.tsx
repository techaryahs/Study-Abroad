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
  ChevronDown,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShoppingCart,
  X,
  Smartphone,
  Menu,
  Plus,
  Minus
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
  subAccordion?: { name: string; items: { name: string; href: string }[] }[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

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

const universityItems: DropdownItem[] = [
  {
    icon: <Globe size={18} />,
    title: "Top Universities By Country",
    description: "Find statistics like acceptance rates, expenses, deadlines, and test scores.",
    href: "/universities/by-country",
    subItems: countries
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
    href: "/universities/RateMyChances",
    badge: "NEW",
  },
  {
    icon: <BookOpen size={18} />,
    title: "Popular Programs",
    description: "Explore the most sought-after academic programs worldwide.",
    href: "/universities/byprogram",
    subAccordion: [
      {
        name: "Engineering",
        items: [
          { name: "Computer Engineering", href: "/universities/byprogram?program=Computer Engineering" },
          { name: "Mechanical Engineering", href: "/universities/byprogram?program=Mechanical Engineering" },
          { name: "Electrical Engineering", href: "/universities/byprogram?program=Electrical Engineering" },
          { name: "Civil Engineering", href: "/universities/byprogram?program=Civil Engineering" },
          { name: "Industrial Engineering", href: "/universities/byprogram?program=Industrial Engineering" }
        ]
      },
      {
        name: "Business",
        items: [
          { name: "MBA", href: "/universities/byprogram?program=MBA" },
          { name: "Finance", href: "/universities/byprogram?program=Finance" },
          { name: "Marketing", href: "/universities/byprogram?program=Marketing" }
        ]
      },
      {
        name: "Science",
        items: [
          { name: "Data Science", href: "/universities/byprogram?program=Data Science" },
          { name: "Biology", href: "/universities/byprogram?program=Biology" },
          { name: "Psychology", href: "/universities/byprogram?program=Psychology" }
        ]
      }
    ]
  },
  {
    icon: <DollarSign size={18} />,
    title: "High Ranked Cheap Universities",
    description: "Top-quality education without breaking the bank.",
    href: "/universities/affordable",
  },
  {
    icon: <MapPin size={18} />,
    title: "Top Universities by State",
    description: "Filter top schools by region (California, Texas, Ontario, etc).",
    href: "/universities/bystate",
    subAccordion: [
      {
        name: "USA",
        items: [
          { name: "California", href: "/universities/bystate?state=California" },
          { name: "Massachusetts", href: "/universities/bystate?state=Massachusetts" },
          { name: "New York", href: "/universities/bystate?state=New York" },
          { name: "Texas", href: "/universities/bystate?state=Texas" },
          { name: "Illinois", href: "/universities/bystate?state=Illinois" },
          { name: "Pennsylvania", href: "/universities/bystate?state=Pennsylvania" }
        ]
      },
      {
        name: "Canada",
        items: [
          { name: "Ontario", href: "/universities/bystate?state=Ontario" },
          { name: "British Columbia", href: "/universities/bystate?state=British Columbia" },
          { name: "Quebec", href: "/universities/bystate?state=Quebec" }
        ]
      },
      {
        name: "United Kingdom",
        items: [
          { name: "England", href: "/universities/bystate?state=England" },
          { name: "Scotland", href: "/universities/bystate?state=Scotland" },
          { name: "Wales", href: "/universities/bystate?state=Wales" }
        ]
      },
      {
        name: "Germany",
        items: [
          { name: "Bavaria", href: "/universities/bystate?state=Bavaria" },
          { name: "Baden-Württemberg", href: "/universities/bystate?state=Baden-Württemberg" },
          { name: "Berlin", href: "/universities/bystate?state=Berlin" },
          { name: "Hesse", href: "/universities/bystate?state=Hesse" }
        ]
      },
      {
        name: "Australia",
        items: [
          { name: "New South Wales", href: "/universities/bystate?state=New South Wales" },
          { name: "Victoria", href: "/universities/bystate?state=Victoria" },
          { name: "Queensland", href: "/universities/bystate?state=Queensland" }
        ]
      },
      {
        name: "Singapore",
        items: [
          { name: "Singapore", href: "/universities/bystate?state=Singapore" }
        ]
      },
      {
        name: "Ireland",
        items: [
          { name: "Dublin", href: "/universities/bystate?state=Dublin" },
          { name: "Cork", href: "/universities/bystate?state=Cork" },
          { name: "Galway", href: "/universities/bystate?state=Galway" },
          { name: "Limerick", href: "/universities/bystate?state=Limerick" }
        ]
      },
      {
        name: "Netherlands",
        items: [
          { name: "North Holland", href: "/universities/bystate?state=North Holland" },
          { name: "South Holland", href: "/universities/bystate?state=South Holland" },
          { name: "Utrecht", href: "/universities/bystate?state=Utrecht" },
          { name: "Gelderland", href: "/universities/bystate?state=Gelderland" }
        ]
      },
      {
        name: "France",
        items: [
          { name: "Île-de-France", href: "/universities/bystate?state=Île-de-France" },
          { name: "Auvergne-Rhône-Alpes", href: "/universities/bystate?state=Auvergne-Rhône-Alpes" },
          { name: "Occitanie", href: "/universities/bystate?state=Occitanie" },
          { name: "Nouvelle-Aquitaine", href: "/universities/bystate?state=Nouvelle-Aquitaine" }
        ]
      },
      {
        name: "Switzerland",
        items: [
          { name: "Basel-Stadt", href: "/universities/bystate?state=Basel-Stadt" },
          { name: "Bern", href: "/universities/bystate?state=Bern" },
          { name: "Fribourg", href: "/universities/bystate?state=Fribourg" },
          { name: "Geneve", href: "/universities/bystate?state=Geneve" },
          { name: "Neuchatel", href: "/universities/bystate?state=Neuchatel" },
          { name: "Vaud", href: "/universities/bystate?state=Vaud" },
          { name: "Zurich", href: "/universities/bystate?state=Zurich" }
        ]
      },
      {
        name: "New Zealand",
        items: [
          { name: "Auckland", href: "/universities/bystate?state=Auckland" },
          { name: "Wellington", href: "/universities/bystate?state=Wellington" },
          { name: "Canterbury", href: "/universities/bystate?state=Canterbury" },
          { name: "Otago", href: "/universities/bystate?state=Otago" }
        ]
      }
    ]
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

// ─── Sub-Accordion logic ───────────────────────────────────────────────────
function AccordionSubMenu({ accordionItems }: { accordionItems: { name: string; items: { name: string; href: string }[] }[] }) {
  const [openCountry, setOpenCountry] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [openUpwards, setOpenUpwards] = useState(false);

  useEffect(() => {
    // Determine if rendering the dropdown downwards pushes it off-screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.bottom > viewportHeight - 50) {
        setOpenUpwards(true);
      }
    }
  }, []);

  return (
    <div
      ref={menuRef}
      className={`absolute left-[calc(100%+2px)] pl-1 z-[60] flex flex-col transition-all duration-300 ${openUpwards ? "bottom-0" : "top-0"} ${openCountry ? "-translate-y-4" : ""}`}
      style={{ animation: "dropIn 0.15s ease-out both" }}
    >
      <div className="bg-[#2D1F1D] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 w-48 flex flex-col overflow-hidden">
        <div className="px-4 pt-4 pb-2 border-b border-white/10 flex-shrink-0">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[#B3985E] truncate">
            {accordionItems[0]?.items[0]?.href.includes('program') ? 'Academic Categories' : 'Regions & States'}
          </p>
        </div>
        <ul className="py-1 max-h-[400px] overflow-y-auto no-scrollbar overflow-x-hidden">
          {accordionItems.map((group) => (
            <li key={group.name} className="border-b border-white/5 last:border-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setOpenCountry(openCountry === group.name ? null : group.name);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-[13px] font-semibold transition-all duration-200 ${openCountry === group.name ? 'text-[#B3985E] bg-white/5' : 'text-gray-300 hover:text-[#B3985E] hover:bg-white/5'}`}
              >
                <span className="truncate pr-2">{group.name}</span>
                {openCountry === group.name ? <Minus size={10} strokeWidth={3} /> : <Plus size={10} strokeWidth={3} />}
              </button>
              {openCountry === group.name && (
                <ul className="bg-black/40 py-1 transition-all duration-300 shadow-inner">
                  {group.items.map(subItem => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.href}
                        className="block px-6 py-2.5 text-[12px] font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all border-l-2 border-transparent hover:border-[#B3985E]"
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Reusable Dropdown Panel (defined inside same file) ───────────────────────

function DropdownPanel({
  items,
  label,
  browseHref,
  browseLabel,
  align = "left",
  width = "340px",
  compact = false,
  onMouseEnter,
  onMouseLeave,
}: {
  items: DropdownItem[];
  label: string;
  browseHref: string;
  browseLabel: string;
  align?: "left" | "center";
  width?: string;
  compact?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const posClass = align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <div
      className={`absolute top-full mt-1 ${posClass} rounded-xl shadow-2xl z-50`}
      style={{
        background: "#2D1F1D",
        width,
        animation: "dropIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Section label */}
      <div className="px-4 pt-3 pb-1.5 border-b border-[#d4af37]/20">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#d4af37]">
          {label}
        </p>
      </div>

      {/* Items */}
      <ul className="py-1">
        {items.map((item, index) => (
          <li
            key={item.href}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Sub-menu trigger (Items with children) */}
            {(item.subItems || item.subAccordion) ? (
              <div
                className={`group flex items-start gap-3 px-4 ${compact ? "py-1" : "py-2"} hover:bg-white/5 transition-colors duration-150 cursor-default`}
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
              </div>
            ) : (
              <Link
                href={item.href}
                className={`group flex items-start gap-3 px-4 ${compact ? "py-1" : "py-2"} hover:bg-white/5 transition-colors duration-150`}
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
            )}

            {/* COUNTRY LIST SUB-MENU */}
            {item.subItems && hoveredIndex === index && (
              <div
                className="absolute left-[calc(100%+2px)] top-0 pl-1 bg-[#2D1F1D] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10 w-48 z-50 flex flex-col"
                style={{ animation: "dropIn 0.15s ease-out both" }}
              >
                <div className="px-4 pt-4 pb-2 border-b border-white/10 flex-shrink-0">
                  <p className="text-[12px] font-semibold uppercase tracking-widest text-[#B3985E]">
                    Global Reach
                  </p>
                </div>
                <ul className="py-1 max-h-[220px] overflow-y-auto custom-nav-scroll no-scrollbar">
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

            {/* ACCORDION SUB-MENU (for Programs, States) */}
            {item.subAccordion && hoveredIndex === index && (
              <AccordionSubMenu accordionItems={item.subAccordion} />
            )}
          </li>
        ))}
      </ul>

      {/* Footer CTA */}
      <div className="px-4 py-2 border-t border-[#d4af37]/20 bg-white/5">
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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [expandedSubItem, setExpandedSubItem] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [suggestions, setSuggestions] = useState<{ name: string, href: string }[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-close menu and clear search on navigation
  useEffect(() => {
    setMenuOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  }, [pathname]);

  // Handle scroll for transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
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
      setMenuOpen(false); // Close mobile menu if open
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

    const fetchFullProfile = async () => {
      const storedUser = getUser();
      const userId = storedUser?._id || storedUser?.id;
      if (!userId) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'}/api/user/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          // Flatten profile data into the top-level user object for easier access in Navbar
          const fullUser = {
            ...storedUser,
            ...data,
            ...(data.profile || {})
          };
          setUserState(fullUser);
        } else if (response.status === 404) {
          // Only clear if the user definitely doesn't exist anymore
          console.warn("User profile not found. Session may be stale.");
          clearAuth();
          setUserState(null);
        }
      } catch (error) {
        console.error("Failed to fetch full user profile in Navbar:", error);
      }
    };

    const handleUserUpdate = () => {
      refreshUser();
      fetchFullProfile();
    };

    refreshUser();
    fetchFullProfile();

    window.addEventListener('user-updated', handleUserUpdate);
    window.addEventListener('cart-updated', fetchCartCount);

    return () => {
      window.removeEventListener('user-updated', handleUserUpdate);
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
    { name: "Articles", path: "/blogs", badge: "Coming Soon" },
    { name: "Resources", path: "/resources", badge: "New", dropdown: "resources" as DropdownKey },
    { name: "AI Services", path: "/ai-services", badge: "New", dropdown: "ai-services" as DropdownKey },
    { name: "Material", path: "/material", badge: "Coming Soon" },
  ];

  const getProfileImage = (user: any) => {
    if (!user) return 'https://www.gravatar.com/avatar/?d=mp&s=200';
    const path = user.profile?.profileImage || user.profileImage || user.image;
    if (!path) return 'https://www.gravatar.com/avatar/?d=mp&s=200';
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

      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 border-b bg-[#2D1F1D] border-[#B3985E]/40 shadow-xl`}
      >

        {/* ── ROW 1: PRIMARY PILLARS & ACTIONS ── */}
        <div className={`flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 h-16 relative z-20 transition-all duration-200 bg-transparent`}>
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 relative rounded overflow-hidden bg-white/5 flex items-center justify-center p-1">
                <Image
                  src="/assets/logo_iec.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-[11px] sm:text-[13px] uppercase tracking-[0.05em] leading-none">International Eduleader Council</span>
                <span className="text-[#B3985E] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] mt-2 opacity-80">GLOBAL ADMISSIONS</span>
              </div>
            </Link>
          </div>

          {/* Primary Navigation - Center Area (Desktop Only) */}
          <div className="hidden xl:flex flex-1 justify-center h-full">
            <nav className="flex items-center h-full gap-6 xl:gap-8">
              {/* Universities Dropdown */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => onEnter("universities")}
                onMouseLeave={onLeave}
              >
                <div className={`flex items-center gap-1.5 cursor-pointer text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-[#B3985E] ${activeDropdown === "universities" ? "text-[#B3985E]" : "text-white"}`}>
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
                    compact={true}
                    onMouseEnter={() => onEnter("universities")}
                    onMouseLeave={onLeave}
                  />
                )}
              </div>

              <div className="h-full flex items-center">
                <Link href="/services" className="text-[10px] font-black uppercase tracking-[0.25em] text-white hover:text-[#B3985E] transition-all">
                  Services
                </Link>
              </div>

              {/* Resources Dropdown */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => onEnter("resources")}
                onMouseLeave={onLeave}
              >
                <div className={`flex items-center gap-2 cursor-pointer text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-[#B3985E] ${activeDropdown === "resources" ? "text-[#B3985E]" : "text-white"}`}>
                  Resources
                  <div className="w-1 h-1 rounded-full bg-[#B3985E] shadow-[0_0_8px_rgba(179,152,94,1)]" />
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
                <div className={`flex items-center gap-2 cursor-default text-[10px] font-black uppercase tracking-[0.25em] transition-all group hover:text-[#B3985E] ${activeDropdown === "ai-services" ? "text-[#B3985E]" : "text-white"}`}>
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

          {/* Action Set - Right */}
          <div className="flex items-center justify-end gap-3 sm:gap-6">
            <div className="hidden md:flex items-center gap-4 sm:gap-6">
              {!user ? (
                <>
                  <Link href="/auth/login" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-[#B3985E] transition-all">Sign In</Link>
                  <Link
                    href="/auth/RegisterStudent"
                    className="flex h-9 px-6 rounded-lg bg-[#B3985E] text-[#2D1F1D] text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95 items-center justify-center"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3 sm:gap-5">
                  <Link href="/User/cart" className="relative group/checkout p-2">
                    <ShoppingCart size={14} className="text-white opacity-40 group-hover/checkout:opacity-100 group-hover/checkout:text-[#B3985E] transition-all" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 text-white text-[7px] font-black rounded-full flex items-center justify-center shadow-lg border border-[#2D1F1D] group-hover/checkout:bg-[#B3985E] transition-all">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <button
                    className="hidden lg:flex px-4 sm:px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95"
                    onClick={() => setShowCounsellingModal(true)}
                  >
                    Book Session
                  </button>

                  {/* Profile Avatar */}
                  <div className="relative group/profile">
                    <button
                      onMouseEnter={() => setProfileDropdownOpen(true)}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B3985E] to-[#8E7B5B] p-[1.5px] transition-transform group-hover/profile:scale-110 shadow-xl"
                    >
                      <div className="w-full h-full rounded-[11px] bg-[#2D1F1D] overflow-hidden flex items-center justify-center">
                        <img
                          src={getProfileImage(user)}
                          className="w-full h-full object-cover rounded-[11px]"
                          alt="Profile"
                        />
                      </div>
                    </button>

                    {profileDropdownOpen && (
                      <div
                        onMouseLeave={() => setProfileDropdownOpen(false)}
                        className="absolute right-0 mt-4 w-60 bg-[#2D1F1D] border border-white/10 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,1)] p-5 z-50 text-center"
                        style={{ animation: "dropIn 0.2s ease-out both" }}
                      >
                        {/* Card Top: Large Avatar */}
                        <div className="flex justify-center mb-4">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#B3985E] to-[#8E7B5B] p-[1.5px] shadow-2xl">
                            <div className="w-full h-full rounded-[15px] bg-[#2D1F1D] overflow-hidden flex items-center justify-center">
                              <img src={getProfileImage(user)} className="w-full h-full object-cover" alt="Profile Large" />
                            </div>
                          </div>
                        </div>

                        <h4 className="text-white font-bold text-sm truncate uppercase tracking-tight">{user.name}</h4>
                        <span className="inline-block px-2 py-0.5 bg-[#B3985E]/10 text-[#B3985E] text-[8px] font-black uppercase rounded-full mt-1 border border-[#B3985E]/20">{user.role || 'Student'}</span>

                        <div className="mt-6 pt-5 border-t border-white/5 space-y-1.5 text-left">
                          <Link href={user?.role === "consultant" ? "/consultant-dashboard" : "/User/dashboard"} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black text-white hover:bg-white/5 hover:text-[#B3985E] transition-all uppercase tracking-[0.2em] group/link">
                            <LayoutDashboard size={14} className="opacity-40 group-hover/link:opacity-100 transition-opacity" /> {user?.role === "consultant" ? "Consultant Portal" : "Dashboard"}
                          </Link>
                          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[10px] font-black text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-[0.2em] group/out">
                            <LogOut size={14} className="opacity-40 group-hover/out:opacity-100 transition-opacity" /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="xl:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 ml-2"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        <div className={`hidden lg:flex items-center justify-center px-6 md:px-16 h-10 relative z-10 gap-6 xl:gap-10 transition-all duration-200 bg-[#B3985E]/5 backdrop-blur-xl border-t border-[#B3985E]/10`}>
          {/* Modern Condensed Search Bar & Items - Unified Group */}
          <div className="flex items-center h-full shrink-0">
            <form
              ref={searchRef}
              onSubmit={handleSearch}
              className={`relative group w-[340px] search-glow transition-all duration-300 ${searchError ? "animate-shake border-red-500/50" : ""}`}
            >
              <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-[#B3985E] transition-all hover:text-[#B3985E]">
                <Search size={13} />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search your dream country..."
                className={`w-full h-8 bg-white/[0.1] border rounded-full pl-10 pr-4 text-[10px] text-white placeholder:text-white/60 outline-none transition-all tracking-wide ${searchError ? "border-red-500/60" : "border-white/50 focus:bg-white/[0.15] focus:border-[#B3985E]/60"}`}
              />

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-[#2D1F1D] border border-white/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 text-center">
                  <div className="px-3 pt-3 pb-2 border-b border-white/5">
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#B3985E]">Destinations Found</span>
                  </div>
                  <div className="py-1 max-h-[200px] overflow-y-auto no-scrollbar">
                    {suggestions.map((country) => (
                      <div
                        key={country.name}
                        onClick={() => router.push(country.href)}
                        onMouseDown={() => router.push(country.href)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 text-left group/item transition-colors cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-white/70 group-hover/item:text-[#B3985E] transition-colors">{country.name}</span>
                        <Globe size={10} className="text-white/20 group-hover/item:text-[#B3985E] transition-all" />
                      </div>
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
                  <div className={`flex items-center gap-2 px-4 h-full text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap cursor-default text-white group-hover:text-[#B3985E]`}>
                    {item.name}
                  </div>
                ) : (
                  <Link href={item.path} className={`flex items-center gap-2 px-4 h-full text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${pathname === item.path ? "text-[#B3985E]" : "text-white hover:text-[#B3985E]"}`}>
                    {item.name}
                  </Link>
                )}
                {item.badge === "Coming Soon" && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#2D1F1D] border border-[#B3985E]/40 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform scale-90 group-hover:scale-100 -translate-y-1 group-hover:translate-y-0 pointer-events-none z-[60]">
                    <span className="text-[7px] text-[#B3985E] font-black uppercase tracking-[0.2em] whitespace-nowrap">Coming Soon</span>
                    {/* Caret: Simulated Border Triangle */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-[#B3985E]/40" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[#2D1F1D]" />
                  </div>
                )}
                <div className="absolute bottom-2 left-4 right-4 h-[1px] bg-[#B3985E] scale-x-0 group-hover:scale-x-100 transition-transform origin-center opacity-50" />
              </div>
            ))}
          </nav>

          {/* App Download CTA */}
          <div className="flex items-center h-full shrink-0 pl-4 border-l border-white/5">
            <div className="relative group/app flex items-center h-full gap-1.5 px-2 cursor-help">
              <Smartphone size={12} className="text-white group-hover/app:text-[#B3985E] transition-all" />
              <span className="text-[8px] font-black text-white group-hover/app:text-[#B3985E] transition-all uppercase tracking-[0.2em] whitespace-nowrap">Download Our App</span>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#2D1F1D] border border-[#B3985E]/40 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover/app:opacity-100 group-hover/app:visible transition-all duration-300 transform scale-90 group-hover/app:scale-100 -translate-y-1 group-hover/app:translate-y-0 pointer-events-none z-[60]">
                <span className="text-[7px] text-[#B3985E] font-black uppercase tracking-[0.2em] whitespace-nowrap">Coming Soon</span>
                {/* Caret: Simulated Border Triangle */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-[#B3985E]/40" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[#2D1F1D]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE FULL SCREEN MENU ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#2D1F1D] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
          {/* Animated Background decorative elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#B3985E]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#B3985E]/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 relative z-20 bg-[#2D1F1D]/50 backdrop-blur-xl shrink-0">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
              <div className="w-8 h-8 relative rounded overflow-hidden bg-white/5 flex items-center justify-center p-1 shrink-0">
                <Image
                  src="/assets/logo_iec.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none">International Eduleader Council</span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[#d4af37] transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Menu Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar">
            {/* Mobile Search Bar */}
            <div className="mb-8">
              <form
                onSubmit={handleSearch}
                className={`relative group w-full ${searchError ? "animate-shake" : ""}`}
              >
                <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <Search size={16} />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Search countries..."
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white outline-none focus:border-[#B3985E]/50 transition-all font-medium"
                />
              </form>

              {suggestions.length > 0 && (
                <div className="relative mt-2 w-full bg-[#2D1F1D] border border-white/20 rounded-xl shadow-2xl z-[110] overflow-hidden">
                  {suggestions.map((country) => (
                    <div
                      key={country.name}
                      onClick={() => router.push(country.href)}
                      onMouseDown={() => router.push(country.href)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 text-left border-b border-white/5 last:border-0 cursor-pointer"
                    >
                      <span className="text-sm font-bold text-white/70">{country.name}</span>
                      <Globe size={14} className="text-[#B3985E]" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions (Mobile Only) */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => { setShowCounsellingModal(true); setMenuOpen(false); }}
                className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-[#B3985E] text-[#2D1F1D] text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl"
              >
                <Star size={14} />
                Expert Help
              </button>

              <Link
                href="/User/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all relative"
              >
                <ShoppingCart size={14} className="text-[#B3985E]" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-[#2D1F1D]">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4af37]/60 mb-4 ml-2">Navigation</p>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const isExpanded = expandedItem === item.name;
                  const hasDropdown = !!item.dropdown;
                  const subItems = hasDropdown ? (item.dropdown === 'universities' ? universityItems : item.dropdown === 'resources' ? resourcesItems : aiServicesItems) : [];

                  return (
                    <div key={item.name} className="flex flex-col">
                      {item.badge === "Coming Soon" ? (
                        <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white/20 text-[10px] font-black uppercase tracking-widest">
                          {item.name}
                          <span className="text-[7px] border border-white/10 px-2 py-0.5 rounded-full">Soon</span>
                        </div>
                      ) : (
                        <div className={`flex flex-col rounded-2xl transition-all border ${pathname === item.path || isExpanded ? "bg-[#d4af37]/10 border-[#d4af37]/30" : "bg-white/[0.03] border-white/5"} overflow-hidden`}>
                          <div className="flex items-center justify-between px-5 py-4">
                            {hasDropdown ? (
                              <button
                                onClick={() => setExpandedItem(isExpanded ? null : item.name)}
                                className={`text-[10px] font-black uppercase tracking-widest flex-1 text-left ${pathname === item.path ? "text-[#d4af37]" : "text-white/70 hover:text-white"}`}
                              >
                                {item.name}
                              </button>
                            ) : (
                              <Link
                                href={item.path}
                                onClick={() => setMenuOpen(false)}
                                className={`text-[10px] font-black uppercase tracking-widest flex-1 ${pathname === item.path ? "text-[#d4af37]" : "text-white/70 hover:text-white"}`}
                              >
                                {item.name}
                              </Link>
                            )}

                            {hasDropdown && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setExpandedItem(isExpanded ? null : item.name);
                                }}
                                className={`p-2 -mr-2 rounded-lg transition-all ${isExpanded ? "bg-[#B3985E] text-[#2D1F1D]" : "text-white/20 hover:text-[#B3985E]"}`}
                              >
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                            )}

                            {!hasDropdown && (
                              <ChevronRight size={14} className="opacity-10 text-white/20" />
                            )}
                          </div>

                          {/* Mobile Sub-items */}
                          {hasDropdown && isExpanded && (
                            <div className="px-4 pb-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                              <div className="h-[1px] bg-white/5 mb-3 mx-2" />
                              {subItems.map((sub) => {
                                const isSubExpanded = expandedSubItem === sub.title;
                                const hasSubItems = sub.subItems && sub.subItems.length > 0;
                                const hasSubAccordion = sub.subAccordion && sub.subAccordion.length > 0;
                                const hasAnySub = hasSubItems || hasSubAccordion;

                                return (
                                  <div key={sub.title} className="flex flex-col">
                                    {hasAnySub ? (
                                      <div className="flex flex-col w-full">
                                        <div
                                          onClick={() => setExpandedSubItem(isSubExpanded ? null : sub.title)}
                                          className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer group border border-transparent hover:border-white/5 transition-all"
                                        >
                                          <div className="flex items-start gap-3">
                                            <div className="mt-0.5 text-[#d4af37] opacity-60 group-hover:opacity-100 transition-opacity">
                                              {sub.icon}
                                            </div>
                                            <div className="min-w-0">
                                              <p className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-[#d4af37] transition-colors">{sub.title}</p>
                                              <p className="text-[8px] text-white/30 truncate group-hover:text-white/50">{sub.description}</p>
                                            </div>
                                          </div>
                                          <div className={`transition-transform duration-200 ${isSubExpanded ? "rotate-90" : ""}`}>
                                            <ChevronRight size={12} className="text-[#B3985E]" />
                                          </div>
                                        </div>
                                        {isSubExpanded && (
                                          <div className="pl-12 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {hasSubItems && (
                                              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                                {sub.subItems?.map((country) => (
                                                  <Link
                                                    key={country.name}
                                                    href={country.href}
                                                    onClick={() => setMenuOpen(false)}
                                                    className="text-[9px] font-bold text-white/50 hover:text-[#B3985E] uppercase tracking-[0.1em] transition-colors flex items-center gap-2"
                                                  >
                                                    <div className="w-1 h-1 rounded-full bg-[#B3985E]/30 shrink-0" />
                                                    {country.name}
                                                  </Link>
                                                ))}
                                              </div>
                                            )}
                                            {hasSubAccordion && (
                                              <div className="flex flex-col gap-4">
                                                {sub.subAccordion?.map((group) => (
                                                  <div key={group.name} className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#B3985E] mb-2">{group.name}</span>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pl-2 border-l border-white/5">
                                                      {group.items.map((item) => (
                                                        <Link
                                                          key={item.name}
                                                          href={item.href}
                                                          onClick={() => setMenuOpen(false)}
                                                          className="text-[9px] font-bold text-white/50 hover:text-white uppercase tracking-[0.1em] transition-colors flex items-center gap-2"
                                                        >
                                                          <div className="w-1 h-1 bg-white/20 shrink-0 rounded-sm" />
                                                          {item.name}
                                                        </Link>
                                                      ))}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <Link
                                        href={sub.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 group border border-transparent hover:border-white/5 transition-all"
                                      >
                                        <div className="mt-0.5 text-[#d4af37] opacity-60 group-hover:opacity-100 transition-opacity">
                                          {sub.icon}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-[#d4af37] transition-colors">{sub.title}</p>
                                          <p className="text-[8px] text-white/30 truncate group-hover:text-white/50">{sub.description}</p>
                                        </div>
                                      </Link>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* User Profile Section */}
            {user && (
              <div className="mb-8 p-6 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B3985E] to-[#8E7B5B] p-[1.5px] shadow-lg flex-shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-[#2D1F1D] overflow-hidden flex items-center justify-center">
                      <img src={getProfileImage(user)} className="w-full h-full object-cover" alt="User" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-black text-sm tracking-tight truncate uppercase leading-tight">{user.name}</h3>
                    <span className="inline-block px-2 py-0.5 bg-[#d4af37]/10 text-[#d4af37] text-[8px] font-black uppercase tracking-widest rounded-md border border-[#d4af37]/20 mt-1">{user.role || "Global Member"}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href={user?.role === "consultant" ? "/consultant-dashboard" : "/User/dashboard"}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 w-full h-12 px-5 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 transition-all border border-white/10 group"
                  >
                    <LayoutDashboard size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Personal Portal</span>
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="flex items-center gap-3 w-full h-12 px-5 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all border border-red-500/10 group"
                  >
                    <LogOut size={16} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Logout</span>
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <div className="grid grid-cols-2 gap-4 mt-auto pt-10">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-white/10">Sign In</Link>
                <Link href="/auth/RegisterStudent" onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full h-14 rounded-2xl bg-[#B3985E] text-[#2D1F1D] text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-8 border-t border-white/5 bg-[#2D1F1D]/80 flex items-center justify-center text-white/10 shrink-0">
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">IEC Success Portal © 2026</span>
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
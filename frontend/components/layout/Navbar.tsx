"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Scholarships", path: "/scholarships" },
    { name: "Countries", path: "/countries" },
    { name: "Blogs", path: "/blogs" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 md:px-12 py-4 flex justify-between items-center ${
        isScrolled ? "bg-dark-950/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent"
      }`}
    >
      {/* LOGO */}
      <Link href="/" className="group flex items-center gap-2">
        <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center font-bold text-black group-hover:rotate-12 transition-transform duration-300">
          A
        </div>
        <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-gold-500 transition-colors">
          Dr. Alam <span className="text-gold-500">.</span>
        </span>
      </Link>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-10">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-link text-xs uppercase tracking-[0.2em] font-medium transition-colors ${
              pathname === item.path ? "text-gold-500 font-black" : "text-white/70 hover:text-gold-500"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex items-center gap-8">
        <span className="text-white/40 text-sm font-medium">
          +91 89876 54321
        </span>
        <Link href="/contact" className="btn-gold px-5 py-2 text-[11px]">
          Get Evaluation
        </Link>
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-[60]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
        <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
      </button>

      {/* MOBILE FULL SCREEN MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-dark-950/98 backdrop-blur-2xl text-white flex flex-col items-center justify-center gap-10 z-50 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-gold-500 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-gold-500 blur-[100px] rounded-full pointer-events-none"></div>
            </div>

            {navItems.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={item.path}
              >
                <Link
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-3xl font-serif hover:text-gold-500 transition-colors ${
                    pathname === item.path ? "text-gold-500 italic" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              <div className="text-white/40 text-sm tracking-widest uppercase font-black">+91 89876 54321</div>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="btn-gold">
                Get Evaluation
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

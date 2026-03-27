"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Scholarships", path: "/scholarships" },
    { name: "Countries", path: "/countries" },
    { name: "Blogs", path: "/blogs" },
  ];

  return (
    <nav className="w-full px-8 py-4 flex justify-between items-center bg-black text-white sticky top-0 z-50 border-b border-gray-800">

      {/* LOGO */}
      <h1 className="font-bold text-xl text-yellow-400">
        Dr. Alam
      </h1>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex gap-8 font-medium">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`hover:text-yellow-400 transition ${pathname === item.path ? "text-yellow-400" : ""
              }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:block font-semibold">
        +91 89876 54321
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(true)}
      >
        ☰
      </button>

      {/* MOBILE FULL SCREEN MENU */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center gap-8 text-xl z-50">

          <button
            className="absolute top-6 right-8 text-3xl"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className={`hover:text-yellow-400 ${pathname === item.path ? "text-yellow-400" : ""
                }`}
            >
              {item.name}
            </Link>
          ))}

          <div className="mt-6 font-semibold">
            +91 89876 54321
          </div>
        </div>
      )}
    </nav>
  );
}
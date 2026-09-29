"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUser } from "@/app/lib/token";

export default function PartnershipLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const [canManageConsultants, setCanManageConsultants] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) {
      if (user.role === "admin" || user.partnerProfile?.partnerType === "edu_mitra") {
        setCanManageConsultants(true);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-blue-800">Partnership</h2>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/partnership/dashboard"
            className={`block px-4 py-2 rounded hover:bg-blue-50 ${
              pathname === "/partnership/dashboard"
                ? "bg-blue-50 font-bold text-blue-700"
                : "text-gray-700"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/partnership/colleges"
            className={`block px-4 py-2 rounded hover:bg-blue-50 ${
              pathname.startsWith("/partnership/colleges")
                ? "bg-blue-50 font-bold text-blue-700"
                : "text-gray-700"
            }`}
          >
            Colleges
          </Link>
          <Link
            href="/partnership/seminars"
            className={`block px-4 py-2 rounded hover:bg-blue-50 ${
              pathname.startsWith("/partnership/seminars")
                ? "bg-blue-50 font-bold text-blue-700"
                : "text-gray-700"
            }`}
          >
            Seminars
          </Link>
          <Link
            href="/partnership/students"
            className={`block px-4 py-2 rounded hover:bg-blue-50 ${
              pathname.startsWith("/partnership/students")
                ? "bg-blue-50 font-bold text-blue-700"
                : "text-gray-700"
            }`}
          >
            Students
          </Link>
          {canManageConsultants && (
            <Link
              href="/partnership/consultants"
              className={`block px-4 py-2 rounded hover:bg-blue-50 ${
                pathname.startsWith("/partnership/consultants")
                  ? "bg-blue-50 font-bold text-blue-700"
                  : "text-gray-700"
              }`}
            >
              Consultants
            </Link>
          )}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

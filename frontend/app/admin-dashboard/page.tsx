"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/consultants");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#c2a878] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

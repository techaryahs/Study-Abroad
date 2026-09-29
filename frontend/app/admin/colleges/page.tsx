"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyCollegesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin-dashboard/colleges");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#c2a878]/30 border-t-[#c2a878] rounded-full animate-spin" />
    </div>
  );
}

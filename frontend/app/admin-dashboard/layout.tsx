import React from "react";
import AdminShell from "@/components/admin/AdminShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console | EduLeader Global",
  description: "Administrative console and operations management.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}

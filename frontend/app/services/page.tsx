import type { Metadata } from "next";
import { Suspense } from "react";
import ServicesClientPage from "./ServicesClientPage";

export const metadata: Metadata = {
  title:
    "EduLeaderGlobal Services | Study Abroad Admissions, Visa & Career Guidance",

  description:
    "Explore EduLeaderGlobal – EduLeaderGlobal services including university admissions, student visa assistance, SOP & LOR guidance, scholarships, career counselling, and complete study abroad support.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ServicesClientPage />
    </Suspense>
  );
}

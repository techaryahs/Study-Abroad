import type { Metadata } from "next";
import ServicesClientPage from "./ServicesClientPage";

export const metadata: Metadata = {
  title:
    "International Eduleader Council Services | Study Abroad Admissions, Visa & Career Guidance",

  description:
    "Explore IEC – International Eduleader Council services including university admissions, student visa assistance, SOP & LOR guidance, scholarships, career counselling, and complete study abroad support.",
};

export default function Page() {
  return <ServicesClientPage />;
}
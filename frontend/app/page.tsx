import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title:
    "EduLeaderGlobal | Study Abroad Consultants in India",

  description:
    "EduLeaderGlobal helps students study abroad with expert guidance for admissions, visas, SOPs, scholarships, and university selection in the USA, UK, Australia, Germany, Ireland & Dubai.",
};

export default function Page() {
  return <HomeClient />;
}
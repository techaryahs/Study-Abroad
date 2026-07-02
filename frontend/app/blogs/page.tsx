import type { Metadata } from "next";
import ArticlesPageClient from "./ArticlesPageClient";

export const metadata: Metadata = {
  title: "Articles & Insights | EduLeaderGlobal",
  description:
    "Expert study abroad articles covering universities, visas, scholarships, SOPs, careers, student life, IELTS, and accommodation.",
};

export default function BlogsPage() {
  return <ArticlesPageClient />;
}

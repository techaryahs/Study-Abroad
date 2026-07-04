"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, UserRound } from "lucide-react";
import type { Article } from "@/data/articles";
import { shouldUseUnoptimizedArticleImage } from "@/lib/articlesStore";

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <section
      id="featured-article"
      className="rounded-[32px] border border-[rgba(197,160,89,0.18)] bg-white p-3 shadow-[0_18px_60px_rgba(45,41,38,0.06)]"
    >
      <div className="grid gap-8 overflow-hidden rounded-[24px] lg:grid-cols-[1.05fr_0.95fr]">
        <Link
          href={`/blogs/${article.slug}`}
          className="group relative block min-h-[320px] overflow-hidden bg-[#F8F5F0] sm:min-h-[420px]"
        >
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            unoptimized={shouldUseUnoptimizedArticleImage(article.coverImage)}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/55 via-transparent to-transparent" />
          <span className="absolute left-6 top-6 rounded-full border border-white/35 bg-white/90 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#C5A059] shadow-sm">
            {article.category}
          </span>
        </Link>

        <div className="flex flex-col justify-center px-5 py-7 sm:px-8 lg:px-6 lg:py-10">
          <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#A8A29E]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} className="text-[#C5A059]" />
              {article.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} className="text-[#C5A059]" />
              {article.readingTime}
            </span>
          </div>

          <h2 className="fd text-4xl font-bold leading-[0.98] tracking-tight text-[#2D2926] sm:text-5xl">
            {article.title}
          </h2>

          <p className="mt-5 text-base font-medium leading-relaxed text-[#6B5E51]">
            {article.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.18em] text-[#6B5E51]">
            <UserRound size={15} className="text-[#C5A059]" />
            {article.author}
          </div>

          <div className="mt-8">
            <Link
              href={`/blogs/${article.slug}`}
              className="inline-flex items-center gap-3 rounded-xl bg-[#2D2926] px-7 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#C5A059] shadow-[0_14px_30px_rgba(45,41,38,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C5A059] hover:text-white"
            >
              Read More
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

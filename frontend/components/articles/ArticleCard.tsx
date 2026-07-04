"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, UserRound } from "lucide-react";
import type { Article } from "@/data/articles";
import { shouldUseUnoptimizedArticleImage } from "@/lib/articlesStore";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="h-full">
      <Link
        href={`/blogs/${article.slug}`}
        className="group block h-full overflow-hidden rounded-[24px] border border-[rgba(197,160,89,0.16)] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.025)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(197,160,89,0.42)] hover:shadow-[0_22px_50px_rgba(197,160,89,0.10)]"
      >
        <div className="relative h-52 overflow-hidden bg-[#F8F5F0]">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            unoptimized={shouldUseUnoptimizedArticleImage(article.coverImage)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/35 via-transparent to-transparent" />
          <span className="absolute left-5 top-5 rounded-full border border-white/40 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059] shadow-sm">
            {article.category}
          </span>
        </div>

        <div className="flex h-[calc(100%-13rem)] flex-col p-6">
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#A8A29E]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} className="text-[#C5A059]" />
              {article.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={13} className="text-[#C5A059]" />
              {article.readingTime}
            </span>
          </div>

          <h3 className="fd text-2xl font-bold leading-tight tracking-tight text-[#2D2926] transition-colors duration-300 group-hover:text-[#C5A059]">
            {article.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm font-medium leading-relaxed text-[#6B5E51]">
            {article.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between gap-4 pt-6">
            <span className="inline-flex min-w-0 items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#6B5E51]">
              <UserRound size={13} className="shrink-0 text-[#C5A059]" />
              <span className="truncate">{article.author}</span>
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2D2926] text-white transition-all duration-300 group-hover:bg-[#C5A059] group-hover:text-white">
              <ArrowRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserRound,
} from "lucide-react";
import ArticleCard from "@/components/articles/ArticleCard";
import { articles, getArticleBySlug } from "@/data/articles";

export default function ArticleDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return (
      <main
        className="flex min-h-screen items-center justify-center px-6 py-24 text-center"
        style={{
          background: "#FDFBF7",
          color: "#2D2926",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
            .fd { font-family: 'Cormorant Garamond', serif; }
          `}</style>
          <h1 className="fd text-4xl font-bold text-[#2D2926]">
            Article Not Found
          </h1>
          <p className="mt-3 text-sm font-medium text-[#6B5E51]">
            The article you are looking for is not available.
          </p>
          <Link
            href="/blogs"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#2D2926] px-6 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#C5A059] transition-all duration-300 hover:bg-[#C5A059] hover:text-white"
          >
            Back to Articles
            <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    );
  }

  const relatedArticles = articles
    .filter(
      (candidate) =>
        candidate.category === article.category && candidate.slug !== article.slug
    )
    .concat(articles.filter((candidate) => candidate.slug !== article.slug))
    .slice(0, 3);

  return (
    <main
      className="min-h-screen pb-28"
      style={{
        background: "#FDFBF7",
        color: "#2D2926",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .fd { font-family: 'Cormorant Garamond', serif; }
        .gold-shimmer {
          background: linear-gradient(90deg,#C5A059,#E6D5B8,#C5A059,#D4AF37,#C5A059);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <section
        className="px-6 pb-12 pt-12 md:pb-16 md:pt-16"
        style={{
          background:
            "linear-gradient(180deg, rgba(197,160,89,0.08) 0%, rgba(253,251,247,0) 100%)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-10 inline-flex items-center gap-2 rounded-xl border border-[rgba(197,160,89,0.22)] bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#6B5E51] shadow-sm transition-all duration-300 hover:border-[#C5A059] hover:text-[#C5A059]"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="relative min-h-[340px] overflow-hidden rounded-[32px] border border-[rgba(197,160,89,0.18)] bg-white p-3 shadow-[0_18px_60px_rgba(45,41,38,0.06)] sm:min-h-[460px]">
              <div className="relative h-full min-h-[316px] overflow-hidden rounded-[24px] sm:min-h-[436px]">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/50 via-transparent to-transparent" />
                <span className="absolute left-6 top-6 rounded-full border border-white/35 bg-white/90 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-[#C5A059] shadow-sm">
                  {article.category}
                </span>
              </div>
            </div>

            <header>
              <span className="inline-block rounded-full border border-[rgba(197,160,89,0.3)] px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059]">
                Articles & Insights
              </span>
              <h1 className="fd mt-5 text-5xl font-bold leading-[0.95] tracking-tight text-[#2D2926] sm:text-6xl md:text-7xl">
                {article.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-[#6B5E51] md:text-lg">
                {article.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#A8A29E]">
                <span className="inline-flex items-center gap-2">
                  <UserRound size={14} className="text-[#C5A059]" />
                  {article.author}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} className="text-[#C5A059]" />
                  {article.publishedAt}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={14} className="text-[#C5A059]" />
                  {article.readingTime}
                </span>
              </div>
            </header>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-[32px] border border-[rgba(197,160,89,0.16)] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.025)] sm:p-10 md:p-12">
          <div className="space-y-7 text-base font-medium leading-[1.85] text-[#6B5E51]">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 rounded-[28px] border border-[rgba(197,160,89,0.18)] bg-[#F8F5F0] p-6 sm:p-8">
            <h2 className="fd text-3xl font-bold text-[#2D2926]">
              Key Takeaways
            </h2>
            <div className="mt-6 grid gap-4">
              {article.highlights.map((highlight) => (
                <div key={highlight} className="flex gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-[#C5A059]"
                  />
                  <p className="text-sm font-bold leading-relaxed text-[#6B5E51]">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="h-fit rounded-[32px] bg-[#2D2926] p-7 text-white shadow-[0_24px_70px_rgba(45,41,38,0.14)] lg:sticky lg:top-32">
          <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#C5A059]">
            Need Help?
          </span>
          <h2 className="fd mt-3 text-3xl font-bold leading-tight text-white">
            Turn reading into a clear admissions plan.
          </h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-white/70">
            Speak with our counsellors for university shortlisting, SOP review,
            scholarship planning, and visa strategy.
          </p>
          <Link
            href="/services"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C5A059] px-6 py-4 text-[11px] font-black uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-white hover:text-[#2D2926]"
          >
            Explore Services
            <ArrowRight size={15} />
          </Link>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-16 lg:px-12">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#C5A059]">
              Continue Reading
            </span>
            <h2 className="fd mt-2 text-4xl font-bold text-[#2D2926] sm:text-5xl">
              Related Articles
            </h2>
          </div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#C5A059] transition-colors hover:text-[#2D2926]"
          >
            View all
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((relatedArticle) => (
            <ArticleCard key={relatedArticle.slug} article={relatedArticle} />
          ))}
        </div>
      </section>
    </main>
  );
}

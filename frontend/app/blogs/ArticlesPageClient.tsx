"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ArticleCard from "@/components/articles/ArticleCard";
import CategoryFilters from "@/components/articles/CategoryFilters";
import FeaturedArticle from "@/components/articles/FeaturedArticle";
import NewsletterSection from "@/components/articles/NewsletterSection";
import Pagination from "@/components/articles/Pagination";
import PopularTopics from "@/components/articles/PopularTopics";
import {
  articleCategories,
  articles,
  featuredArticle,
  popularTopics,
} from "@/data/articles";

const ARTICLES_PER_PAGE = 6;

export default function ArticlesPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;
      const matchesSearch =
        !normalizedQuery ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.excerpt.toLowerCase().includes(normalizedQuery) ||
        article.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE)
  );

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document
      .getElementById("latest-articles")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

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
        .filter-scroll::-webkit-scrollbar { display: none; }
        .filter-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <section
        className="relative overflow-hidden px-6 pb-12 pt-20 text-center md:pb-16 md:pt-24"
        style={{
          background:
            "linear-gradient(180deg, rgba(197,160,89,0.08) 0%, rgba(253,251,247,0) 100%)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <span className="mb-5 inline-block rounded-full border border-[rgba(197,160,89,0.3)] px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059] shadow-sm">
            Student Knowledge Hub
          </span>
          <h1 className="fd text-5xl font-bold leading-[0.95] tracking-tight text-[#2D2926] sm:text-6xl md:text-7xl lg:text-8xl">
            Articles & <span className="gold-shimmer">Insights</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-[#6B5E51] md:text-lg">
            Expert guides, university updates, visa tips, scholarships, and
            career advice to help students achieve their study abroad goals.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto -mt-3 max-w-4xl rounded-[28px] border border-[rgba(197,160,89,0.18)] bg-white p-2 shadow-[0_14px_44px_rgba(45,41,38,0.06)]">
          <div className="flex items-center gap-3 rounded-[22px] bg-[#F8F5F0] px-5 py-2">
            <Search size={18} className="shrink-0 text-[#C5A059]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search articles..."
              className="min-h-12 w-full bg-transparent text-sm font-bold text-[#2D2926] outline-none placeholder:text-[#A8A29E]"
              aria-label="Search articles"
            />
          </div>
        </div>

        <div className="pt-7">
          <CategoryFilters
            categories={articleCategories}
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-12 lg:py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#C5A059]">
              Editor&apos;s Pick
            </span>
            <h2 className="fd mt-2 text-4xl font-bold text-[#2D2926] sm:text-5xl">
              Featured Article
            </h2>
          </div>
        </div>
        <FeaturedArticle article={featuredArticle} />
      </section>

      <section
        id="latest-articles"
        className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-16 lg:px-12"
      >
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#C5A059]">
              Fresh Guidance
            </span>
            <h2 className="fd mt-2 text-4xl font-bold text-[#2D2926] sm:text-5xl">
              Latest Articles
            </h2>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#A8A29E]">
            {filteredArticles.length} article
            {filteredArticles.length === 1 ? "" : "s"} found
          </p>
        </div>

        {paginatedArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="rounded-[28px] border border-[rgba(197,160,89,0.16)] bg-white px-6 py-20 text-center shadow-sm">
            <h3 className="fd text-3xl font-bold text-[#2D2926]">
              No articles found
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-[#6B5E51]">
              Try a different search term or switch back to all categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setCurrentPage(1);
              }}
              className="mt-6 rounded-xl bg-[#2D2926] px-6 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#C5A059] transition-all duration-300 hover:bg-[#C5A059] hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-12">
        <PopularTopics topics={popularTopics} />
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-12">
        <NewsletterSection />
      </section>
    </main>
  );
}

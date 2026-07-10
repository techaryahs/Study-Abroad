"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import ArticleCard from "@/components/articles/ArticleCard";
import CategoryFilters from "@/components/articles/CategoryFilters";
import FeaturedArticle from "@/components/articles/FeaturedArticle";
import NewsletterSection from "@/components/articles/NewsletterSection";
import Pagination from "@/components/articles/Pagination";
import PopularTopics from "@/components/articles/PopularTopics";
import { articleCategories, popularTopics } from "@/data/articles";
import {
  getPublicFeaturedArticle,
  getPublicLatestArticles,
} from "@/lib/articlesStore";
import { useManagedArticles } from "@/lib/useArticles";

const ARTICLES_PER_PAGE = 6;

export default function ArticlesPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const managedArticles = useManagedArticles();

  const featuredArticle = useMemo(
    () => getPublicFeaturedArticle(managedArticles),
    [managedArticles]
  );

  const latestArticles = useMemo(
    () => getPublicLatestArticles(managedArticles),
    [managedArticles]
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return latestArticles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;
      const matchesSearch =
        !normalizedQuery ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.excerpt.toLowerCase().includes(normalizedQuery) ||
        article.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, latestArticles, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE)
  );

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

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
      className="relative min-h-screen overflow-hidden pb-28 text-[#10324a]"
      style={{
        background: "radial-gradient(circle at top left, rgba(44,165,157,0.16), transparent 30%), linear-gradient(135deg, #f8f4ea 0%, #fcfbf7 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .fd { font-family: 'Cormorant Garamond', serif; }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .filter-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute right-[-8%] top-[8%] h-[480px] w-[480px] rounded-full bg-[#d2a14a]/15 blur-[130px]" />
        <div className="absolute left-[-10%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#2ca59d]/10 blur-[130px]" />
      </div>

      <section className="relative z-10 overflow-hidden px-6 pb-12 pt-20 text-center md:pb-16 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <span className="mb-5 inline-block rounded-full border border-[#2ca59d]/20 bg-[#2ca59d]/10 px-5 py-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-[#0f4c5c] shadow-sm">
            Student Knowledge Hub
          </span>
          <h1 className="fd text-5xl font-bold leading-[0.95] tracking-tight text-[#D4A54A] sm:text-6xl md:text-7xl lg:text-8xl">
            Articles & Insights
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base font-medium leading-relaxed text-[#4b5b6a] md:text-lg">
            Expert guides, university updates, visa tips, scholarships, and
            career advice to help students achieve their study abroad goals.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto -mt-3 max-w-4xl rounded-[28px] border border-[#10324a]/10 bg-white/80 p-2 shadow-[0_20px_60px_rgba(16,50,74,0.08)] backdrop-blur-xl">
          <div className="flex items-center gap-3 rounded-[22px] bg-[#f8f4ea]/60 px-5 py-2">
            <Search size={18} className="shrink-0 text-[#2ca59d]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search articles..."
              className="min-h-12 w-full bg-transparent text-sm font-bold text-[#10324a] outline-none placeholder:text-[#10324a]/30"
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

      {featuredArticle && (
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-14 lg:px-12 lg:py-16">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#0f4c5c]">
                Editor&apos;s Pick
              </span>
              <h2 className="fd mt-2 text-4xl font-bold text-[#D4A54A] sm:text-5xl">
                Featured Article
              </h2>
            </div>
          </div>
          <FeaturedArticle article={featuredArticle} />
        </section>
      )}

      <section
        id="latest-articles"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-28 px-6 pb-16 lg:px-12"
      >
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#0f4c5c]">
              Fresh Guidance
            </span>
            <h2 className="fd mt-2 text-4xl font-bold text-[#D4A54A] sm:text-5xl">
              Latest Articles
            </h2>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#4b5b6a]/60">
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
          <div className="rounded-[28px] border border-[#10324a]/10 bg-white/80 px-6 py-20 text-center shadow-sm">
            <h3 className="fd text-3xl font-bold text-[#10324a]">
              No articles found
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-[#4b5b6a]">
              Try a different search term or switch back to all categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setCurrentPage(1);
              }}
              className="mt-6 rounded-xl bg-[#10324a] px-6 py-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#d2a14a] transition-all duration-300 hover:bg-[#d2a14a] hover:text-[#16364b]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 lg:px-12">
        <PopularTopics topics={popularTopics} />
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <NewsletterSection />
      </section>
    </main>
  );
}
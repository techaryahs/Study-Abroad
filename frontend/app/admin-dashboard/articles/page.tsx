"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Edit2,
  ExternalLink,
  Eye,
  FileText,
  ImageIcon,
  Plus,
  Save,
  Search,
  Star,
  Tag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { getToken, getUser } from "@/app/lib/token";
import {
  articleCategories,
  type ArticleCategory,
  type ArticleStatus,
} from "@/data/articles";
import {
  formatArticleDate,
  isValidArticleImageSource,
  normalizeArticle,
  saveManagedArticles,
  slugifyArticleTitle,
  type ManagedArticle,
} from "@/lib/articlesStore";
import { useManagedArticles } from "@/lib/useArticles";

type ViewMode = "list" | "form";
type BannerState = { type: "success" | "error"; text: string } | null;

interface ArticleFormState {
  title: string;
  slug: string;
  category: ArticleCategory;
  coverImage: string;
  excerpt: string;
  content: string;
  author: string;
  readingTime: string;
  tags: string;
  featured: boolean;
  status: ArticleStatus;
  publishedAt: string;
}

const ADMIN_CATEGORIES = articleCategories.filter(
  (category): category is ArticleCategory => category !== "All"
);

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-[#c2a878]/40 transition-colors";

const labelClass =
  "block text-[11px] font-black uppercase tracking-[0.16em] text-[#c2a878]/60 mb-2";

const emptyForm = (): ArticleFormState => ({
  title: "",
  slug: "",
  category: "Study Abroad",
  coverImage: "",
  excerpt: "",
  content: "",
  author: "",
  readingTime: "",
  tags: "",
  featured: false,
  status: "Draft",
  publishedAt: formatArticleDate(),
});

const splitParagraphs = (value: string) =>
  value
    .split(/\n{2,}|\r?\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const splitTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

function Banner({ banner }: { banner: BannerState }) {
  if (!banner) return null;

  const isSuccess = banner.type === "success";

  return (
    <div
      className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${
        isSuccess
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/20 bg-red-500/10 text-red-400"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
      )}
      <span className="text-[12px]">{banner.text}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
        status === "Published"
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-amber-500/15 text-amber-300"
      }`}
    >
      {status}
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className={labelClass}>{children}</label>;
}

function PreviewModal({
  article,
  onClose,
}: {
  article: ManagedArticle;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0d0f12] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0d0f12]/95 px-5 py-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c2a878]/10">
              <Eye size={17} className="text-[#c2a878]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">
                Article Preview
              </p>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                {article.category}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {article.status === "Published" && (
              <a
                href={`/blogs/${article.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/50 transition-colors hover:border-[#c2a878]/30 hover:text-[#c2a878] sm:flex"
              >
                Public Page
                <ExternalLink size={13} />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-white/35 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="relative h-64 bg-white/[0.03] sm:h-80">
              {article.coverImage ? (
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/20">
                  <ImageIcon size={32} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/25 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#c2a878]">
                  {article.category}
                </span>
                {article.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#c2a878] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">
                    <Star size={11} />
                    Featured
                  </span>
                )}
                <StatusBadge status={article.status} />
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <div>
                <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                  {article.title}
                </h2>
                <p className="mt-4 text-sm font-medium leading-relaxed text-white/55">
                  {article.excerpt}
                </p>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/35">
                <span className="inline-flex items-center gap-2">
                  <UserRound size={13} className="text-[#c2a878]" />
                  {article.author}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={13} className="text-[#c2a878]" />
                  {article.readingTime}
                </span>
                <span>{article.publishedAt}</span>
              </div>

              <div className="space-y-4 text-sm font-medium leading-7 text-white/65">
                {article.content.length > 0 ? (
                  article.content.map((paragraph, index) => (
                    <p key={`${article.slug}-${index}`}>{paragraph}</p>
                  ))
                ) : (
                  <p>No article content has been added yet.</p>
                )}
              </div>

              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#c2a878]/20 bg-[#c2a878]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#c2a878]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminArticlesPage() {
  const router = useRouter();
  const articles = useManagedArticles();
  const [authChecked, setAuthChecked] = useState(false);
  const [mode, setMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleFormState>(() => emptyForm());
  const [banner, setBanner] = useState<BannerState>(null);
  const [previewArticle, setPreviewArticle] = useState<ManagedArticle | null>(
    null
  );

  useEffect(() => {
    const user = getUser();
    const token = getToken();

    if (!user || user.role !== "admin" || !token) {
      router.push("/auth/login");
      return;
    }

    setAuthChecked(true);
  }, [router]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return articles;

    return articles.filter((article) => {
      const tags = article.tags.join(" ").toLowerCase();
      return (
        article.title.toLowerCase().includes(query) ||
        article.slug.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.status.toLowerCase().includes(query) ||
        tags.includes(query)
      );
    });
  }, [articles, searchQuery]);

  const stats = useMemo(
    () => ({
      total: articles.length,
      published: articles.filter((article) => article.status === "Published")
        .length,
      drafts: articles.filter((article) => article.status === "Draft").length,
      featured: articles.filter((article) => article.featured).length,
    }),
    [articles]
  );

  const editingArticle = editingSlug
    ? articles.find((article) => article.slug === editingSlug)
    : undefined;

  const startCreate = () => {
    setForm(emptyForm());
    setEditingSlug(null);
    setBanner(null);
    setMode("form");
  };

  const startEdit = (article: ManagedArticle) => {
    setForm({
      title: article.title,
      slug: article.slug,
      category: article.category,
      coverImage: article.coverImage,
      excerpt: article.excerpt,
      content: article.content.join("\n\n"),
      author: article.author,
      readingTime: article.readingTime,
      tags: article.tags.join(", "),
      featured: article.featured,
      status: article.status,
      publishedAt: article.publishedAt,
    });
    setEditingSlug(article.slug);
    setBanner(null);
    setMode("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildArticleFromForm = (
    sourceForm: ArticleFormState,
    existing?: ManagedArticle
  ): ManagedArticle =>
    normalizeArticle(
      {
        slug: slugifyArticleTitle(sourceForm.slug),
        category: sourceForm.category,
        title: sourceForm.title,
        excerpt: sourceForm.excerpt,
        coverImage: sourceForm.coverImage,
        author: sourceForm.author,
        publishedAt: sourceForm.publishedAt || formatArticleDate(),
        readingTime: sourceForm.readingTime,
        content: splitParagraphs(sourceForm.content),
        highlights: existing?.highlights || [],
        tags: splitTags(sourceForm.tags),
        featured: sourceForm.featured,
        status: sourceForm.status,
      },
      existing
    );

  const validateForm = () => {
    const slug = form.slug.trim();

    if (!form.title.trim()) return "Title is required.";
    if (!slug) return "Slug is required.";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return "Slug can use lowercase letters, numbers, and hyphens only.";
    }
    if (!form.coverImage.trim()) return "Featured image is required.";
    if (!isValidArticleImageSource(form.coverImage.trim())) {
      return "Featured image must start with /, http(s)://, or data:image/.";
    }
    if (!form.excerpt.trim()) return "Short description is required.";
    if (!form.content.trim()) return "Full article content is required.";
    if (!form.author.trim()) return "Author is required.";
    if (!form.readingTime.trim()) return "Reading time is required.";
    if (form.status === "Published" && !form.publishedAt.trim()) {
      return "Published date is required for published articles.";
    }

    const duplicateSlug = articles.some(
      (article) => article.slug === slug && article.slug !== editingSlug
    );
    if (duplicateSlug) return "An article with this slug already exists.";

    return null;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setBanner({ type: "error", text: validationError });
      return;
    }

    const article = buildArticleFromForm(form, editingArticle);
    let remainingArticles = articles.filter(
      (item) => item.slug !== editingSlug && item.slug !== article.slug
    );

    if (article.featured) {
      remainingArticles = remainingArticles.map((item) => ({
        ...item,
        featured: false,
      }));
    }

    const nextArticles = [...remainingArticles];
    if (editingSlug) {
      const originalIndex = articles.findIndex(
        (item) => item.slug === editingSlug
      );
      nextArticles.splice(Math.max(0, originalIndex), 0, article);
    } else {
      nextArticles.unshift(article);
    }

    saveManagedArticles(nextArticles);
    setBanner({
      type: "success",
      text: editingSlug
        ? "Article updated successfully."
        : "Article created successfully.",
    });
    setEditingSlug(null);
    setForm(emptyForm());
    setMode("list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (article: ManagedArticle) => {
    if (!window.confirm(`Delete "${article.title}"?`)) return;

    saveManagedArticles(
      articles.filter((item) => item.slug !== article.slug)
    );
    setBanner({ type: "success", text: "Article deleted successfully." });
  };

  const handleTitleChange = (value: string) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: current.slug ? current.slug : slugifyArticleTitle(value),
    }));
  };

  const handlePreviewForm = () => {
    setPreviewArticle(buildArticleFromForm(form, editingArticle));
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c2a878]/30 border-t-[#c2a878]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-2 rounded-full bg-[#c2a878]" />
              <div className="min-w-0">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white sm:text-4xl">
                  Articles
                </h1>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.35em] text-gray-500">
                  Admin Content Management
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 sm:ml-auto">
              <button
                type="button"
                onClick={() => router.push("/admin-dashboard")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] font-black uppercase tracking-wider text-gray-400 transition-all hover:text-white"
              >
                <ArrowLeft size={14} />
                Dashboard
              </button>
              {mode === "list" ? (
                <button
                  type="button"
                  onClick={startCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#c2a878] px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-black transition-all hover:bg-yellow-100 active:scale-95"
                >
                  <Plus size={14} />
                  Add Article
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMode("list");
                    setEditingSlug(null);
                    setBanner(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 transition-all hover:text-white"
                >
                  <X size={14} />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <Banner banner={banner} />

        {mode === "list" && (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Total", value: stats.total, icon: FileText },
                { label: "Published", value: stats.published, icon: CheckCircle2 },
                { label: "Drafts", value: stats.drafts, icon: Edit2 },
                { label: "Featured", value: stats.featured, icon: Star },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#c2a878]/10 bg-[#c2a878]/[0.02] p-5"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#c2a878]/10">
                    <Icon size={17} className="text-[#c2a878]" />
                  </div>
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-2">
                <Search size={17} className="shrink-0 text-[#c2a878]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search articles..."
                  className="min-h-11 w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015]">
              <div className="border-b border-white/5 px-5 py-4">
                <h2 className="text-[12px] font-black uppercase tracking-[0.18em] text-white/70">
                  All Articles ({filteredArticles.length})
                </h2>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="text-[12px] font-black uppercase tracking-[0.28em] text-gray-700">
                    No articles found
                  </p>
                </div>
              ) : (
                <>
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-600">
                          <th className="px-5 py-4">Image</th>
                          <th className="px-5 py-4">Title</th>
                          <th className="px-5 py-4">Category</th>
                          <th className="px-5 py-4">Author</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4">Published Date</th>
                          <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredArticles.map((article) => (
                          <tr
                            key={article.slug}
                            className="border-b border-white/5 transition-colors hover:bg-[#c2a878]/[0.03]"
                          >
                            <td className="px-5 py-4">
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="h-14 w-20 rounded-xl object-cover"
                              />
                            </td>
                            <td className="max-w-[320px] px-5 py-4">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-black text-white">
                                  {article.title}
                                </p>
                                {article.featured && (
                                  <Star
                                    size={13}
                                    className="shrink-0 fill-[#c2a878] text-[#c2a878]"
                                  />
                                )}
                              </div>
                              <p className="mt-1 truncate text-[12px] font-semibold text-white/35">
                                /blogs/{article.slug}
                              </p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded-full border border-[#c2a878]/20 bg-[#c2a878]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#c2a878]">
                                {article.category}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-[12px] font-bold text-white/55">
                              {article.author}
                            </td>
                            <td className="px-5 py-4">
                              <StatusBadge status={article.status} />
                            </td>
                            <td className="px-5 py-4 text-[12px] font-bold text-white/45">
                              {article.publishedAt || "Not published"}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewArticle(article)}
                                  title="View"
                                  className="rounded-lg p-2 text-white/35 transition-colors hover:bg-[#c2a878]/10 hover:text-[#c2a878]"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => startEdit(article)}
                                  title="Edit"
                                  className="rounded-lg p-2 text-white/35 transition-colors hover:bg-[#c2a878]/10 hover:text-[#c2a878]"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(article)}
                                  title="Delete"
                                  className="rounded-lg p-2 text-white/35 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="divide-y divide-white/5 lg:hidden">
                    {filteredArticles.map((article) => (
                      <div key={article.slug} className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="h-20 w-24 shrink-0 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <StatusBadge status={article.status} />
                              {article.featured && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#c2a878]/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#c2a878]">
                                  <Star size={10} />
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="line-clamp-2 text-sm font-black text-white">
                              {article.title}
                            </p>
                            <p className="mt-1 text-[12px] font-semibold text-white/35">
                              {article.category} - {article.author}
                            </p>
                            <p className="mt-1 text-[12px] font-semibold text-white/30">
                              {article.publishedAt || "Not published"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewArticle(article)}
                            className="rounded-lg border border-white/10 px-3 py-2 text-white/45"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(article)}
                            className="rounded-lg border border-white/10 px-3 py-2 text-white/45"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(article)}
                            className="rounded-lg border border-white/10 px-3 py-2 text-white/45"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {mode === "form" && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#c2a878]/10 bg-[#c2a878]/[0.02] p-5 sm:p-6"
          >
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-white">
                  {editingSlug ? "Edit Article" : "Add Article"}
                </h2>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.22em] text-gray-600">
                  {editingSlug ? editingSlug : "New draft"}
                </p>
              </div>
              <StatusBadge status={form.status} />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <FieldLabel>Title</FieldLabel>
                <input
                  value={form.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="Article title"
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel>Slug</FieldLabel>
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      slug: slugifyArticleTitle(event.target.value),
                    }))
                  }
                  placeholder="article-slug"
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel>Category</FieldLabel>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      category: event.target.value as ArticleCategory,
                    }))
                  }
                  className={`${inputClass} bg-[#0d0f12]`}
                >
                  {ADMIN_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Featured Image</FieldLabel>
                <div className="relative">
                  <ImageIcon
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2a878]/40"
                  />
                  <input
                    value={form.coverImage}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        coverImage: event.target.value,
                      }))
                    }
                    placeholder="/blog-ivy.png"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Author</FieldLabel>
                <div className="relative">
                  <UserRound
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2a878]/40"
                  />
                  <input
                    value={form.author}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        author: event.target.value,
                      }))
                    }
                    placeholder="Author name"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Reading Time</FieldLabel>
                <div className="relative">
                  <Clock3
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2a878]/40"
                  />
                  <input
                    value={form.readingTime}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        readingTime: event.target.value,
                      }))
                    }
                    placeholder="6 min read"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Published Date</FieldLabel>
                <input
                  value={form.publishedAt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      publishedAt: event.target.value,
                    }))
                  }
                  placeholder="July 3, 2026"
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel>Status</FieldLabel>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as ArticleStatus,
                    }))
                  }
                  className={`${inputClass} bg-[#0d0f12]`}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <FieldLabel>Short Description</FieldLabel>
                <textarea
                  value={form.excerpt}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      excerpt: event.target.value,
                    }))
                  }
                  placeholder="Short summary shown in article cards"
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="lg:col-span-2">
                <FieldLabel>Full Article Content</FieldLabel>
                <textarea
                  value={form.content}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      content: event.target.value,
                    }))
                  }
                  placeholder="Write the full article content. Separate paragraphs with new lines."
                  rows={10}
                  className={`${inputClass} resize-y leading-7`}
                />
              </div>

              <div>
                <FieldLabel>Tags</FieldLabel>
                <div className="relative">
                  <Tag
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2a878]/40"
                  />
                  <input
                    value={form.tags}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        tags: event.target.value,
                      }))
                    }
                    placeholder="visa, scholarships, canada"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Featured</FieldLabel>
                <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        featured: event.target.checked,
                      }))
                    }
                    className="h-5 w-5 accent-[#c2a878]"
                  />
                  <span className="text-sm font-bold text-white/70">
                    Show as featured article
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handlePreviewForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 transition-all hover:text-white"
              >
                <Eye size={14} />
                Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("list");
                  setEditingSlug(null);
                  setBanner(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-gray-500 transition-all hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c2a878] px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-black transition-all hover:bg-yellow-100 active:scale-95"
              >
                <Save size={14} />
                {editingSlug ? "Update Article" : "Create Article"}
              </button>
            </div>
          </form>
        )}
      </div>

      {previewArticle && (
        <PreviewModal
          article={previewArticle}
          onClose={() => setPreviewArticle(null)}
        />
      )}
    </div>
  );
}

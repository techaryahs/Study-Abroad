import {
  articleCategories,
  articles,
  featuredArticle,
  type Article,
  type ArticleCategory,
  type ArticleStatus,
} from "@/data/articles";

export const ARTICLE_STORAGE_KEY = "admin_articles_v1";
export const ARTICLE_STORE_EVENT = "articles-updated";

export type ManagedArticle = Article & {
  tags: string[];
  featured: boolean;
  status: ArticleStatus;
};

type StoredArticlesPayload = {
  version: number;
  articles: ManagedArticle[];
};

const STORE_VERSION = 1;
const DEFAULT_CATEGORY: ArticleCategory = "Study Abroad";
const DEFAULT_IMAGE = "/blog-ivy.png";

const clean = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isBrowser = () => typeof window !== "undefined";

const isArticleStatus = (value: unknown): value is ArticleStatus =>
  value === "Draft" || value === "Published";

const isArticleCategory = (value: unknown): value is ArticleCategory =>
  typeof value === "string" &&
  value !== "All" &&
  articleCategories.includes(value as (typeof articleCategories)[number]);

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => clean(item))
    .filter((item): item is string => Boolean(item));
};

const dedupeArticles = (source: ManagedArticle[]) => {
  const seen = new Set<string>();
  return source.filter((article) => {
    if (seen.has(article.slug)) return false;
    seen.add(article.slug);
    return true;
  });
};

export const slugifyArticleTitle = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const formatArticleDate = (date = new Date()) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const shouldUseUnoptimizedArticleImage = (src: string) =>
  /^https?:\/\//i.test(src) || /^data:image\//i.test(src);

export const isValidArticleImageSource = (src: string) =>
  src.startsWith("/") ||
  /^https?:\/\//i.test(src) ||
  /^data:image\//i.test(src);

export function normalizeArticle(
  article: Partial<Article>,
  fallback: Partial<ManagedArticle> = {}
): ManagedArticle {
  const title = clean(article.title) || fallback.title || "Untitled Article";
  const slug =
    slugifyArticleTitle(clean(article.slug) || title) ||
    fallback.slug ||
    "untitled-article";

  return {
    slug,
    category: isArticleCategory(article.category)
      ? article.category
      : fallback.category || DEFAULT_CATEGORY,
    title,
    excerpt: clean(article.excerpt) || fallback.excerpt || "",
    coverImage:
      clean(article.coverImage) || fallback.coverImage || DEFAULT_IMAGE,
    author:
      clean(article.author) ||
      fallback.author ||
      "EduLeaderGlobal Editorial Team",
    publishedAt:
      clean(article.publishedAt) || fallback.publishedAt || formatArticleDate(),
    readingTime: clean(article.readingTime) || fallback.readingTime || "5 min read",
    content: toStringArray(article.content).length
      ? toStringArray(article.content)
      : fallback.content || [],
    highlights: toStringArray(article.highlights).length
      ? toStringArray(article.highlights)
      : fallback.highlights || [],
    tags: toStringArray(article.tags).length
      ? toStringArray(article.tags)
      : fallback.tags || [],
    featured:
      typeof article.featured === "boolean"
        ? article.featured
        : Boolean(fallback.featured),
    status: isArticleStatus(article.status)
      ? article.status
      : fallback.status || "Published",
  };
}

export function getSeedArticles(): ManagedArticle[] {
  return [
    normalizeArticle(featuredArticle, {
      featured: true,
      status: "Published",
    }),
    ...articles.map((article) =>
      normalizeArticle(article, { status: "Published" })
    ),
  ];
}

export function getManagedArticles(): ManagedArticle[] {
  if (!isBrowser()) return getSeedArticles();

  try {
    const raw = localStorage.getItem(ARTICLE_STORAGE_KEY);
    if (!raw) return getSeedArticles();

    const parsed = JSON.parse(raw) as StoredArticlesPayload | ManagedArticle[];
    const source = Array.isArray(parsed) ? parsed : parsed.articles;

    if (!Array.isArray(source)) return getSeedArticles();

    return dedupeArticles(
      source.map((article) =>
        normalizeArticle(article, { status: "Published" })
      )
    );
  } catch {
    return getSeedArticles();
  }
}

export function saveManagedArticles(nextArticles: ManagedArticle[]) {
  if (!isBrowser()) return;

  const normalized = dedupeArticles(
    nextArticles.map((article) => normalizeArticle(article))
  );
  const payload: StoredArticlesPayload = {
    version: STORE_VERSION,
    articles: normalized,
  };

  localStorage.setItem(ARTICLE_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(ARTICLE_STORE_EVENT));
}

export const getPublishedArticles = (articleList: ManagedArticle[]) =>
  articleList.filter((article) => article.status === "Published");

export function getPublicFeaturedArticle(articleList: ManagedArticle[]) {
  const publishedArticles = getPublishedArticles(articleList);
  return (
    publishedArticles.find((article) => article.featured) ||
    publishedArticles[0]
  );
}

export function getPublicLatestArticles(articleList: ManagedArticle[]) {
  const featured = getPublicFeaturedArticle(articleList);
  return getPublishedArticles(articleList).filter(
    (article) => article.slug !== featured?.slug
  );
}

export function getArticleBySlugFromList(
  articleList: ManagedArticle[],
  slug: string,
  includeDrafts = false
) {
  return articleList.find(
    (article) =>
      article.slug === slug &&
      (includeDrafts || article.status === "Published")
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  ARTICLE_STORAGE_KEY,
  ARTICLE_STORE_EVENT,
  getManagedArticles,
  getSeedArticles,
  type ManagedArticle,
} from "@/lib/articlesStore";

export function useManagedArticles() {
  const [articles, setArticles] = useState<ManagedArticle[]>(() =>
    getSeedArticles()
  );

  useEffect(() => {
    const syncArticles = () => setArticles(getManagedArticles());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ARTICLE_STORAGE_KEY) syncArticles();
    };

    syncArticles();
    window.addEventListener(ARTICLE_STORE_EVENT, syncArticles);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(ARTICLE_STORE_EVENT, syncArticles);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return articles;
}

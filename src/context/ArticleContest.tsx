import { createContext, useContext, useState, type ReactNode } from "react";
import { mockArticles } from "../utils/mockData";
import type { Article } from "../types/article";

interface ArticlesContextType {
  articles: Article[];
  updateArticle: (updatedArticle: Article) => void;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(
  undefined
);

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);

  const updateArticle = (updatedArticle: Article) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === updatedArticle.id ? updatedArticle : article
      )
    );
  };

  return (
    <ArticlesContext.Provider value={{ articles, updateArticle }}>
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (context === undefined) {
    throw new Error("useArticles must be used within an ArticlesProvider");
  }
  return context;
};

import type { Article } from "../types/article";

const authors = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams"];
const statuses = ["Published", "Draft"] as const;

export const generateMockArticles = (count: number): Article[] => {
  const articles: Article[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    articles.push({
      id: `article-${i}`,
      title: `Article Title ${i + 1}`,
      author: authors[Math.floor(Math.random() * authors.length)],
      content: `This is the content of article ${
        i + 1
      }. It contains some sample text for demonstration purposes.`,
      publishedDate: date.toISOString(),
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 200),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return articles;
};

export const mockArticles = generateMockArticles(50);

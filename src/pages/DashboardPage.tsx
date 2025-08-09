import { useMemo, useState } from "react";
import type { Article, SortField, SortOrder } from "../types/article";
import {
  ArrowDownIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { EditArticleModal } from "../components/EditArticleModal";
import { toast } from "react-toastify";
import { PerformanceChart } from "../components/PerformanceChart";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { useArticles } from "../context/ArticleContest";
import { exportToCSV } from "../utils/exportUtils";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { articles, updateArticle } = useArticles();
  const [authorFilter, setAuthorFilter] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [sortField, setSortField] = useState<SortField>("publishedDate");
  const [sortDirection, setSortDirection] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");

  // Get unique authors
  const authors = useMemo(() => {
    const uniqueAuthors = new Set(articles.map((article) => article.author));
    return Array.from(uniqueAuthors).sort();
  }, [articles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Filter by author
      if (authorFilter && article.author !== authorFilter) return false;

      // Filter by date range
      const articleDate = new Date(article.publishedDate);
      if (dateRange[0] && articleDate < dateRange[0]) return false;
      if (dateRange[1] && articleDate > dateRange[1]) return false;

      // Filter by search query
      if (
        debouncedSearchQuery &&
        !article.title
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [articles, authorFilter, dateRange, debouncedSearchQuery]);

  // Sort articles
  const filteredAndSortedArticles = useMemo(() => {
    const sorted = [...filteredArticles].sort((a, b) => {
      if (sortField === "publishedDate") {
        const dateA = new Date(a.publishedDate).getTime();
        const dateB = new Date(b.publishedDate).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === "asc"
          ? (a[sortField] ?? 0) - (b[sortField] ?? 0)
          : (b[sortField] ?? 0) - (a[sortField] ?? 0);
      }
    });
    return sorted;
  }, [filteredArticles, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Render sort icon based on current sort field and direction
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field)
      return <ArrowsUpDownIcon className="h-4 w-4 inline ml-1" />;
    return sortDirection === "asc" ? (
      <ArrowUpIcon className="h-4 w-4 inline ml-1" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 inline ml-1" />
    );
  };

  // Calculate paginated data
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedArticles.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredAndSortedArticles, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedArticles.length / itemsPerPage);

  // Add handler for edit button
  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  // Handle save in modal
  const handleSave = (updatedArticle: Article) => {
    updateArticle(updatedArticle);
    toast.success("Article updated successfully!");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Articles</h2>
        <button
          onClick={() =>
            exportToCSV(
              filteredAndSortedArticles.map((article) => ({
                Title: article.title,
                Author: article.author,
                "Published Date": article.publishedDate,
                Views: article.views,
                Likes: article.likes,
                Comments: article.comments,
                Status: article.status,
              })),
              `articles-${new Date().toISOString().slice(0, 10)}`
            )
          }
          className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
        >
          Export to CSV
        </button>
      </div>

      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search by Title
            </label>
            <input
              type="text"
              id="search"
              className="w-full rounded-md px-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Author Filter */}
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter by Author
            </label>
            <select
              id="author"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e) =>
                  setDateRange([
                    e.target.value ? new Date(e.target.value) : null,
                    dateRange[1],
                  ])
                }
              />
              <span className="flex items-center">to</span>
              <input
                type="date"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e) =>
                  setDateRange([
                    dateRange[0],
                    e.target.value ? new Date(e.target.value) : null,
                  ])
                }
              />
              <button
                className="px-3 py-1 bg-gray-200 rounded-md text-sm"
                onClick={() => setDateRange([null, null])}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published Date
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("views")}
              >
                Views {renderSortIcon("views")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Likes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comments
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedArticles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {article.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(article.publishedDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.likes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.comments}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user?.role === "admin" && (
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handleEdit(article)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredAndSortedArticles.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {filteredAndSortedArticles.length}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Performance Chart */}
      <div className="flex justify-end mt-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setViewMode("daily")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === "daily"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewMode === "monthly"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <PerformanceChart
        articles={filteredAndSortedArticles.map(
          ({ publishedDate, views, likes, comments }) => ({
            publishedDate,
            views: views ?? 0,
            likes: likes ?? 0,
            comments: comments ?? 0,
          })
        )}
        viewMode={viewMode}
      />

      <EditArticleModal
        article={selectedArticle}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isOpen={isModalOpen}
      />
    </div>
  );
};

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { useMemo } from "react";
import { parseISO } from "date-fns/fp";

interface PerformanceChartProps {
  articles: Array<{
    publishedDate: string;
    views: number;
    likes: number;
    comments: number;
  }>;
  viewMode: "daily" | "monthly";
}

export const PerformanceChart = ({
  articles,
  viewMode,
}: PerformanceChartProps) => {
  // Prepare chart data
  const chartData = useMemo(() => {
    const dataMap = new Map<
      string,
      { views: number; likes: number; comments: number; date: string }
    >();

    articles.forEach((article) => {
      const date = parseISO(article.publishedDate);
      const key =
        viewMode === "daily"
          ? format(date, "yyyy-MM-dd")
          : format(date, "yyyy-MM");

      const existing = dataMap.get(key) || {
        views: 0,
        likes: 0,
        comments: 0,
        date: key,
      };
      dataMap.set(key, {
        views: existing.views + article.views,
        likes: existing.likes + article.likes,
        comments: existing.comments + article.comments,
        date: key,
      });
    });

    return Array.from(dataMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [articles, viewMode]);

  return (
    <div className="mt-8 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Article Performance</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="likes" stroke="#82ca9d" />
            <Line type="monotone" dataKey="comments" stroke="#ffc658" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

"use client";
import { useEffect, useState } from "react";

type Widget = {
  type: string;
  label: string;
  value?: string;
  rows?: string[];
  data?: number[];
};

type Section = {
  title: string;
  widgets: Widget[];
};

type DashboardData = {
  sections: Section[];
};

function StatsWidget({ widget }: { widget: Widget }) {
  return (
    <div
      data-testid="widget-stats"
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-2 hover:shadow-md transition-shadow"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {widget.label}
      </p>
      <p className="text-4xl font-bold text-gray-900">{widget.value}</p>
      <p className="text-xs text-green-500 font-medium">↑ Live from MongoDB</p>
    </div>
  );
}

function TableWidget({ widget }: { widget: Widget }) {
  return (
    <div
      data-testid="widget-table"
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 col-span-2 hover:shadow-md transition-shadow"
    >
      <p className="text-sm font-semibold text-gray-700 mb-4">{widget.label}</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 text-gray-400 font-medium">#</th>
            <th className="text-left py-2 text-gray-400 font-medium">Details</th>
          </tr>
        </thead>
        <tbody>
          {widget.rows?.map((row, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-3 text-gray-400 w-8">{i + 1}</td>
              <td className="py-3 text-gray-700">{row}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {(!widget.rows || widget.rows.length === 0) && (
        <p className="text-gray-400 text-sm">No data available</p>
      )}
    </div>
  );
}

function ChartWidget({ widget }: { widget: Widget }) {
  const max = Math.max(...(widget.data || [1]));
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div
      data-testid="widget-chart"
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 col-span-2 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm font-semibold text-gray-700">{widget.label}</p>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          This Week
        </span>
      </div>
      <div className="flex items-end gap-3 h-36">
        {widget.data?.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">{val}</span>
            <div
              className="w-full bg-black rounded-t-lg transition-all duration-500"
              style={{ height: `${(val / max) * 100}px` }}
            />
            <span className="text-xs text-gray-400">
              {days[i] ?? i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WidgetRenderer({ widget }: { widget: Widget }) {
  if (widget.type === "stats") return <StatsWidget widget={widget} />;
  if (widget.type === "table") return <TableWidget widget={widget} />;
  if (widget.type === "chart") return <ChartWidget widget={widget} />;
  return null;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin?userId=user-123&projectId=123")
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new Error(res.error);
        setData(res.data);
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100 text-center">
          <p className="text-red-500 font-medium">Error loading dashboard</p>
          <p className="text-gray-400 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.sections?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">No dashboard config found in MongoDB.</p>
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Project: Demo · Last updated: {lastUpdated}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">Live · MongoDB</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 max-w-5xl mx-auto">
        {data.sections.map((section, i) => (
          <div key={i} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                {section.title}
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {section.widgets.map((widget, j) => (
                <WidgetRenderer key={j} widget={widget} />
              ))}
            </div>
          </div>
        ))}

        <p className="text-center text-xs text-gray-300 mt-8">
          Edit sections and widgets directly in MongoDB to update this dashboard
        </p>
      </div>
    </div>
  );
}
// components/widgets/WidgetRenderer.tsx
"use client";

type Widget = {
  type: string;
  label: string;
  value?: string;
  rows?: string[];
  data?: number[];
};

export default function WidgetRenderer({ widget }: { widget: Widget }) {
  if (widget.type === "stats") {
    return (
      <div data-testid="widget-stats" className="border rounded p-4 bg-white shadow-sm">
        <p className="text-sm text-gray-500">{widget.label}</p>
        <p className="text-2xl font-bold mt-1">{widget.value}</p>
      </div>
    );
  }

  if (widget.type === "table") {
    return (
      <div data-testid="widget-table" className="border rounded p-4 bg-white shadow-sm col-span-2">
        <p className="text-sm font-semibold text-gray-700 mb-2">{widget.label}</p>
        <ul className="divide-y">
          {widget.rows?.map((row, i) => (
            <li key={i} className="py-1 text-sm text-gray-600">{row}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (widget.type === "chart") {
    const max = Math.max(...(widget.data || [1]));
    return (
      <div data-testid="widget-chart" className="border rounded p-4 bg-white shadow-sm col-span-2">
        <p className="text-sm font-semibold text-gray-700 mb-3">{widget.label}</p>
        <div className="flex items-end gap-2 h-24">
          {widget.data?.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-black rounded-t"
                style={{ height: `${(val / max) * 80}px` }}
              />
              <span className="text-xs text-gray-400">{val}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
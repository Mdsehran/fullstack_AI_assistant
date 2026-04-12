"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin?userId=123&projectId=123")
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-4">
      {data.sections.map((section: any, i: number) => (
        <div key={i}>
          <h2 className="text-xl font-bold">{section.title}</h2>

          <div className="grid grid-cols-2 gap-4 mt-2">
            {section.widgets.map((widget: any, j: number) => (
              <div key={j} className="border p-4 rounded">
                <h3>{widget.label}</h3>
                <p>{widget.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
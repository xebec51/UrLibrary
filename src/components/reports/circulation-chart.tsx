"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CirculationChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-72 rounded-lg border border-border bg-surface p-4">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="name" fontSize={12} stroke="#64748B" />
          <YAxis allowDecimals={false} fontSize={12} stroke="#64748B" />
          <Tooltip cursor={{ fill: "#F1F5F9" }} />
          <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

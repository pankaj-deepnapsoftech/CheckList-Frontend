import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { usePlcData } from "../hooks/usePlcData";

// ── Professional color palette ──
const COLORS = [
  "#1f77b4", // standard dashboard blue
  "#17becf", // teal / cyan accent
  "#6baed6", // soft blue
  "#9ecae1", // light blue
  "#4b5563", // cool gray-700
  "#9ca3af", // gray-400
  "#d1d5db", // gray-300
  "#374151", // gray-800
  // "#0f4c81", // deep industrial blue (primary)
];

// ── Double Doughnut Chart ──
function DowntimeByCase({ data }) {
  const hasData = data && data.length > 0;
  
  return (
    <div
      className="relative bg-white/90 backdrop-blur rounded-2xl 
border border-slate-200/60 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] 
p-6 overflow-hidden"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Downtime Distribution by Case {hasData ? <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            LIVE
          </span> : ""}
      </h3>

      <div className="h-[360px] md:h-[360px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Outer ring - Detailed breakdown or Main Data if dynamic */}
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="92%"
                paddingAngle={2}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-outer-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={0.9}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)", // slate-900
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#E5E7EB",
                  padding: "12px 16px",
                  fontSize: "13px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                }}
                itemStyle={{ color: "#E5E7EB" }}
                labelStyle={{ fontWeight: 600 }}
              />

              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "12px",
                  color: "#475569",
                  paddingTop: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 font-medium">No Data Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helper to format hours into "Xh Ym" ──
const formatDuration = (totalHours) => {
  if (!totalHours) return "0h 0m";
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
};

// ── Half Doughnut (Semi-circle) ──
function DowntimeByMachine({ data }) {
  const hasData = data && data.length > 0;
  const totalDowntime = hasData ? data.reduce((acc, curr) => acc + curr.value, 0) : 0;

  return (
    <div
      className="relative bg-white/90 backdrop-blur rounded-2xl 
border border-slate-200/60 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.15)] 
p-6 overflow-hidden"
    >
      <h3 className="text-[15px] font-semibold text-slate-700 tracking-wide uppercase">
        Downtime Distribution by Case
        {hasData && (
          <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            LIVE
          </span>
        )}
      </h3>

      <div className="h-[380px] md:h-[380px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="85%"
                innerRadius="65%"
                outerRadius="90%"
                startAngle={180}
                endAngle={0}
                paddingAngle={2}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

                {/* Center total label */}
                <Label
                  value="TOTAL DOWNTIME"
                  position="center"
                  dy={70}
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    fill: "#64748B",
                    fontWeight: 600,
                  }}
                />
                <Label
                  value={formatDuration(totalDowntime)}
                  position="center"
                  dy={92}
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    fill: "#0F172A",
                  }}
                />
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(184, 245, 236, 0.96)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#1e293b",
                  padding: "10px 14px",
                  fontSize: "13px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                }}
                itemStyle={{ color: "#1e293b" }}
                formatter={(value) => [formatDuration(value), "Downtime"]}
              />
              <Legend
                verticalAlign="bottom"
                height={50}
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 font-medium">No Data Found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Export Component ──
export default function DowntimeCharts({ filters = {} }) {
  const { getPlcErrorDistribution, getPlcDowntimeByMachine } = usePlcData(filters, { live: true });
  const errorData = getPlcErrorDistribution.data || [];
  const machineDowntimeData = getPlcDowntimeByMachine.data || [];

  return (
    <div className=" bg-slate-50/70 mt-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
            Downtime Analysis Overview
          </h2>
          {/* <div className="text-sm text-slate-600 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
            Last 30 days • Static demo
          </div> */}
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
          <DowntimeByCase data={errorData} />
          <DowntimeByMachine data={machineDowntimeData} />
        </div>
      
      </div>
    </div>
  );
}

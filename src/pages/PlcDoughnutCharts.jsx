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
  "#c299e0",
  "#3B82F6",
  "#14B8A6", // teal-green
  "#60A5FA",
  "#7bb9e3", // indigo tint
  "#6B7280",
  "#9CA3AF",
  "#CBD5E1",
  "#4B5563",
];



// ── Downtime by Case - Data (Double Doughnut) ──
const caseMainData = [
  { name: "Mechanical", value: 38 },
  { name: "Electrical", value: 22 },
  { name: "Material", value: 16 },
  { name: "Human", value: 11 },
  { name: "Tooling", value: 8 },
  { name: "Setup", value: 5 },
];

const caseDetailData = [
  { name: "Bearing Failure", value: 14 },
  { name: "Gear Wear", value: 11 },
  { name: "Motor Fault", value: 9 },
  { name: "Sensor Issue", value: 7 },
  { name: "Power Supply", value: 6 },
  { name: "Cable Damage", value: 5 },
  { name: "Shortage", value: 10 },
  { name: "Quality Issue", value: 6 },
  { name: "Operator Absent", value: 7 },
  { name: "Training Gap", value: 4 },
  { name: "Die Change", value: 5 },
  { name: "Calibration", value: 3 },
];

// ── Downtime by Machine - Data (Half Doughnut) ──
const machineData = [
  { name: "CJ2M_01", value: 42 },
  { name: "CJ2M_02", value: 31 },
  { name: "CJ2M_03", value: 28 },
  { name: "CJ2M_04", value: 19 },
  { name: "CJ2M_05", value: 15 },
  { name: "Press_01", value: 12 },
  { name: "Press_02", value: 9 },
  { name: "CJ2M_06", value: 6 },
];

// ── Double Doughnut Chart ──
function DowntimeByCase({ data }) {
  const hasData = data && data.length > 0;
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm pb-20 pt-5 pl-5 pr-5">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Downtime Distribution by Case {hasData ? "(Live)" : ""}
      </h3>

      <div className="h-[380px] md:h-[380px]">
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
                innerRadius="50%"
                outerRadius="92%"
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                  backgroundColor: "rgba(184, 245, 236, 0.96)",
                  border: "none",
                  borderRadius: "10px",
                  color: "#1e293b",
                  padding: "12px 16px",
                  fontSize: "13px",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                }}
                itemStyle={{ color: "#1e293b" }}
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Downtime Hours by Machine
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
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
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
                  value="Total Downtime"
                  position="center"
                  dy={80}
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    fill: "#1e293b",
                  }}
                />
                <Label
                  value={formatDuration(totalDowntime)}
                  position="center"
                  dy={100}
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    fill: "#1e293b",
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

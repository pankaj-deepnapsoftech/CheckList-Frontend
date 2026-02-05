import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

// ── Professional color palette ──
const COLORS = [
  "#0f4c81", // deep industrial blue (primary)
  "#1f77b4", // standard dashboard blue
  "#17becf", // teal / cyan accent
  "#6baed6", // soft blue
  "#9ecae1", // light blue
  "#4b5563", // cool gray-700
  "#9ca3af", // gray-400
  "#d1d5db", // gray-300
  "#374151", // gray-800
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
function DowntimeByCase() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-20">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Downtime Distribution by Case
      </h3>

      <div className="h-[380px] md:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Inner ring - Main categories */}
            <Pie
              data={caseMainData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="48%"
              outerRadius="68%"
              paddingAngle={3}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {caseMainData.map((entry, index) => (
                <Cell
                  key={`cell-inner-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* Outer ring - Detailed breakdown */}
            <Pie
              data={caseDetailData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="92%"
              paddingAngle={2}
            >
              {caseDetailData.map((entry, index) => (
                <Cell
                  key={`cell-outer-${index}`}
                  fill={COLORS[(index + 2) % COLORS.length]}
                  opacity={0.9}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.96)",
                border: "none",
                borderRadius: "10px",
                color: "#f1f5f9",
                padding: "12px 16px",
                fontSize: "13px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
              }}
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
      </div>
    </div>
  );
}

// ── Half Doughnut (Semi-circle) ──
function DowntimeByMachine() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Downtime Hours by Machine
      </h3>

      <div className="h-[380px] md:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={machineData}
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
              {machineData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

              {/* Center total label */}
              <Label
                value="Total Downtime"
                position="center"
                dy={100}
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  fill: "#1e293b",
                }}
              />
              <Label
                value="183 h"
                position="center"
                dy={120}
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  fill: "#1e293b",
                }}
              />
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.96)",
                border: "none",
                borderRadius: "10px",
                color: "#f1f5f9",
                padding: "10px 14px",
                fontSize: "13px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
              }}
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
      </div>
    </div>
  );
}

// ── Main Export Component ──
export default function DowntimeCharts() {
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
          <DowntimeByCase />
          <DowntimeByMachine />
        </div>

      
      </div>
    </div>
  );
}

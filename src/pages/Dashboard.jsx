import { Search } from "lucide-react";
import React, { useState, useMemo } from "react";

/* ---------- Sample data ---------- */
const SUMMARY = [
  { title: "Total Assembly", value: 100, delta: 5 },
  { title: "Total Employees", value: 70, delta: -2 },
  { title: "Total Roles", value: 9, delta: 1 },
  { title: "All Processes", value: 8, delta: 0 },
];

const LINE_DATA = [
  { label: "500", running: 18, fault: 8 },
  { label: "1000A", running: 24, fault: 14 },
  { label: "1000B", running: 28, fault: 18 },
  { label: "2000", running: 22, fault: 16 },
  { label: "5000", running: 30, fault: 12 },
  { label: "6000", running: 20, fault: 18 },
  { label: "7000", running: 26, fault: 16 },
  { label: "8000", running: 22, fault: 20 },
];

const PIE_DATA = [
  { label: "Checked", value: 40, color: "#60A5FA" },
  { label: "Unchecked", value: 18, color: "#FB7185" },
  { label: "In Progress", value: 22, color: "#34D399" },
];

const TABLE_ROWS = [
  { process: "500", name: "PCB Depaneling", method: "Visual By ESD Meter", check: "SOP", status: "Complete" },
  { process: "1000 A", name: "Print Plate Soldering", method: "Visual Check", check: "When Bit Change", status: "Complete" },
  { process: "1000 B", name: "Print Plate Soldering", method: "Visual By Limit Sample", check: "SOP", status: "Pending" },
  { process: "2000", name: "Case & Slider Greasing", method: "Weighting Machine", check: "SOP", status: "Complete" },
  { process: "5000", name: "Cover Assy", method: "Visual Check In Pressure Gauge", check: "SOP", status: "Error" },
  { process: "6000", name: "Knob assy", method: "Visual & Manual", check: "SOP", status: "Pending" },
  { process: "7000", name: "Auto Check", method: "Visual Check In FR unit", check: "SOP", status: "Complete" },
  { process: "8000", name: "Final Inspection", method: "Visual & Manual", check: "SOP", status: "Complete" },
];

/* ---------- Small helpers ---------- */
function getMinMax(arr, key) {
  const vals = arr.map((r) => r[key]);
  return [Math.min(...vals), Math.max(...vals)];
}

function toPolylinePoints(data, key, width = 600, height = 140, pad = 20) {
  const count = data.length;
  const stepX = (width - pad * 2) / Math.max(1, count - 1);
  const [min, max] = getMinMax(data, key);
  const range = Math.max(1, max - min);
  return data
    .map((d, i) => {
      const x = pad + i * stepX;
      const y = pad + (height - pad * 2) * (1 - (d[key] - min) / range);
      return `${x},${y}`;
    })
    .join(" ");
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}
function polarToCartesian(cx, cy, r, angleInRad) {
  return { x: cx + r * Math.cos(angleInRad), y: cy + r * Math.sin(angleInRad) };
}

/* ---------- Subcomponents ---------- */
function StatCard({ title, value, delta }) {
  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl p-5 
      shadow-[0_1px_3px_rgba(0,0,0,0.06)]
      hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]
      transition-all duration-300">

      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-gray-800">{value}</div>
        </div>
      </div>

      <div className={`mt-3 text-sm ${delta >= 0 ? "text-green-600" : "text-red-500"}`}>
        {delta >= 0 ? `▲ ${Math.abs(delta)}` : `▼ ${Math.abs(delta)}`} v/s last month
      </div>
    </div>
  );
}

function Tooltip({ x, y, text }) {
  if (!x || !y) return null;
  return (
    <div
      className="absolute pointer-events-none bg-gray-900/90 text-white text-xs px-2 py-1 rounded shadow-lg"
      style={{ transform: "translate(-50%, -130%)", left: x, top: y }}
    >
      {text}
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function Dashboard() {
  const [range, setRange] = useState("Weekly");
  const [lineHover, setLineHover] = useState({ x: null, y: null, text: null });
  const [pieHover, setPieHover] = useState({ x: null, y: null, text: null });

  const linePolylineRunning = useMemo(() => toPolylinePoints(LINE_DATA, "running", 680, 150, 12), []);
  const linePolylineFault = useMemo(() => toPolylinePoints(LINE_DATA, "fault", 680, 150, 12), []);

  const pieTotal = PIE_DATA.reduce((s, p) => s + p.value, 0);

  return (
    <div className="min-h-screen from-gray-50 to-gray-100 text-gray-900">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Check Item Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor assembly checks, errors and progress
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center border border-gray-200/70 rounded-lg px-3 py-2 bg-white shadow-sm">
            <Search size={20} className="text-gray-500 mr-2" />
            <input
              placeholder="Search process, name..."
              className="outline-none text-sm"
            />
          </div>

          <button className="px-3 py-2 bg-white border border-gray-200/70 rounded-lg shadow-sm text-sm">
            Aug 21 - Sep 21
          </button>

          <select
            className="text-sm px-3 py-2 border border-gray-200/70 rounded-lg bg-white shadow-sm"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
      </header>

      {/* Summary */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {SUMMARY.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} delta={s.delta} />
        ))}
      </section>

      {/* Main Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 space-y-6">
          {/* Line Chart */}
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">
                  Assembly Graph
                </h3>
                <div className="text-xs text-gray-400">
                  Showing {range} data
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Legend:{" "}
                <span className="ml-2 inline-block w-3 h-3 bg-indigo-500 rounded-full mr-1" />
                Running{" "}
                <span className="ml-3 inline-block w-3 h-3 bg-pink-400 rounded-full mr-1" />
                Fault
              </div>
            </div>

            <div className="relative mt-4">
              <Tooltip x={lineHover.x} y={lineHover.y} text={lineHover.text} />

              <svg viewBox="0 0 700 160" className="w-full h-40">
                {LINE_DATA.map((d, i) => {
                  const x = 12 + (i * (700 - 24)) / (LINE_DATA.length - 1);
                  return (
                    <line
                      key={i}
                      x1={x}
                      x2={x}
                      y1={8}
                      y2={152}
                      stroke="#f3f4f6"
                    />
                  );
                })}

                <polyline
                  points={linePolylineRunning}
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <polyline
                  points={linePolylineFault}
                  fill="none"
                  stroke="#FB7185"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {LINE_DATA.map((d, i) => {
                  const stepX = (700 - 24) / (LINE_DATA.length - 1);
                  const x = 12 + i * stepX;
                  const [minR, maxR] = getMinMax(LINE_DATA, "running");
                  const yR =
                    12 +
                    (140 - 24) *
                      (1 - (d.running - minR) / Math.max(1, maxR - minR));
                  return (
                    <g key={i}>
                      <rect
                        x={x - stepX / 2}
                        y={0}
                        width={stepX}
                        height={160}
                        fill="transparent"
                        onMouseMove={(ev) => {
                          const rect = ev.currentTarget.getBoundingClientRect();
                          setLineHover({
                            x: rect.left + rect.width / 2,
                            y: rect.top + 8,
                            text: `${d.label} — Running: ${d.running}, Fault: ${d.fault}`,
                          });
                        }}
                        onMouseLeave={() =>
                          setLineHover({ x: null, y: null, text: null })
                        }
                      />
                      <circle
                        cx={x}
                        cy={yR}
                        r="4"
                        fill="#4F46E5"
                        stroke="#fff"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Pie & Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Pie */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700">
                    Total Assembly
                  </h4>
                  <div className="text-xs text-gray-400">Overview</div>
                </div>
                <select className="text-sm border border-gray-300 rounded-lg px-2 py-1">
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div className="flex items-center gap-6 mt-4">
                <svg width="140" height="140" viewBox="0 0 32 32">
                  {(() => {
                    let cum = 0;
                    return PIE_DATA.map((s, i) => {
                      const start = (cum / pieTotal) * Math.PI * 2;
                      // eslint-disable-next-line react-hooks/immutability
                      cum += s.value;
                      const end = (cum / pieTotal) * Math.PI * 2;
                      return (
                        <path
                          key={i}
                          d={describeArc(16, 16, 14, start, end)}
                          fill={s.color}
                          onMouseMove={(ev) => {
                            const rect =
                              ev.currentTarget.getBoundingClientRect();
                            setPieHover({
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                              text: `${s.label}: ${s.value}`,
                            });
                          }}
                          onMouseLeave={() =>
                            setPieHover({ x: null, y: null, text: null })
                          }
                        />
                      );
                    });
                  })()}
                </svg>
                <div>
                  {PIE_DATA.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: s.color }}
                      />
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">
                          {s.label}
                        </div>
                        <div className="text-xs text-gray-400">
                          {s.value} items
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Tooltip x={pieHover.x} y={pieHover.y} text={pieHover.text} />
            </div>

            {/* Active Assembly Bars */}
            <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">
                  Active Assembly
                </h4>
                <div className="text-xs text-gray-400">Running vs Fault</div>
              </div>

              <div className="mt-4 flex items-end gap-2 h-36">
                {LINE_DATA.map((d, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-6 bg-indigo-500 rounded-t"
                      style={{ height: `${d.running * 3}px` }}
                    />
                    <div
                      className="w-6 bg-pink-300 rounded-t mt-1"
                      style={{ height: `${d.fault * 3}px` }}
                    />
                    <div className="text-xs text-gray-500 mt-1">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Small 3 charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              "Checked Assembly",
              "Errors Assembly",
              "Assembly Line Checking",
            ].map((t) => (
              <div
                key={t}
                className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm"
              >
                <h5 className="text-sm font-semibold text-gray-700">{t}</h5>
                <div className="h-28 flex items-center justify-center text-gray-400">
                  Coming Soon
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700">
              Quick Actions
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="text-sm px-3 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">
                New Check Item
              </button>
              <button className="text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white">
                Import
              </button>
              <button className="text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white">
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Assembly
            </h4>

            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-sm">
                <thead className="text-gray-500 text-xs bg-gray-50/50">
                  <tr>
                    <th className="py-2 text-left px-2">Process</th>
                    <th className="py-2 text-left px-2">Name</th>
                    <th className="py-2 text-left px-2">Method</th>
                    <th className="py-2 text-left px-2">Check</th>
                    <th className="py-2 text-left px-2">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {TABLE_ROWS.map((r, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200/40 hover:bg-gray-100/50 transition"
                    >
                      <td className="py-2 px-2">{r.process}</td>
                      <td className="py-2 px-2">{r.name}</td>
                      <td className="py-2 px-2">{r.method}</td>
                      <td className="py-2 px-2">{r.check}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            r.status === "Complete"
                              ? "bg-green-100 text-green-700"
                              : r.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-right">
              <button className="text-sm text-indigo-600">View all</button>
            </div>
          </div>

          {/* Status Summary */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-gray-700">
              Status Summary
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="px-3 py-2 rounded-lg bg-green-50 text-green-700">
                Complete — 5
              </div>
              <div className="px-3 py-2 rounded-lg bg-yellow-50 text-yellow-700">
                Pending — 2
              </div>
              <div className="px-3 py-2 rounded-lg bg-red-50 text-red-700">
                Error — 1
              </div>
              <div className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                In Progress — 3
              </div>
            </div>
          </div>
        </aside>
      </section>

      <footer className="text-center text-xs text-gray-400 mt-6">
        © {new Date().getFullYear()} Check Item Management
      </footer>
    </div>
  );
}

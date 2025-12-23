import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Clock3,
  Users,
  Activity,
} from "lucide-react";
import { useDashboardCards } from "../hooks/useDashboard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/* ---------------- Mock / Static Data ---------------- */

const LINE_TREND = [
  { label: "Shift A", checked: 40, error: 5, unchecked: 10 },
  { label: "Shift B", checked: 38, error: 7, unchecked: 12 },
  { label: "Shift C", checked: 30, error: 10, unchecked: 15 },
  { label: "General", checked: 45, error: 4, unchecked: 8 },
];

const DONUT_DATA = [
  { label: "Checked", value: 120, color: "#22c55e" },
  { label: "Unchecked", value: 40, color: "#eab308" },
  { label: "In Progress", value: 25, color: "#3b82f6" },
];

const ASSEMBLY_BAR = [
  { label: "500", running: 18, fault: 6 },
  { label: "1000A", running: 24, fault: 9 },
  { label: "1000B", running: 20, fault: 12 },
  { label: "2000", running: 26, fault: 4 },
  { label: "5000", running: 14, fault: 10 },
];

const MONTHLY_DATA = [
  { month: "Jan", checked: 820, unchecked: 120, error: 60 },
  { month: "Feb", checked: 760, unchecked: 160, error: 70 },
  { month: "Mar", checked: 910, unchecked: 90, error: 45 },
  { month: "Apr", checked: 880, unchecked: 110, error: 55 },
  { month: "May", checked: 1020, unchecked: 80, error: 40 },
  { month: "Jun", checked: 980, unchecked: 100, error: 50 },
  { month: "Jul", checked: 1100, unchecked: 70, error: 35 },
  { month: "Aug", checked: 1060, unchecked: 95, error: 48 },
  { month: "Sep", checked: 990, unchecked: 130, error: 65 },
  { month: "Oct", checked: 1150, unchecked: 60, error: 30 },
  { month: "Nov", checked: 1080, unchecked: 85, error: 42 },
  { month: "Dec", checked: 1200, unchecked: 50, error: 25 },
];

const TABLE_ROWS = [
  {
    date: "2025-12-23",
    company: "JP Minda",
    plant: "Plant 1",
    line: "500",
    process: "PCB Depaneling",
    part: "Main PCB",
    checkItem: "ESD Check",
    inspectionStatus: "Checked",
    issueStatus: "OK",
    resolutionStatus: "Resolved",
    checkedBy: "Rohan Singh",
    time: "10:12",
    remarks: "Within range",
  },
  {
    date: "2025-12-23",
    company: "JP Minda",
    plant: "Plant 1",
    line: "1000A",
    process: "Print Plate Soldering",
    part: "Connector",
    checkItem: "Solder Quality",
    inspectionStatus: "Checked",
    issueStatus: "Error",
    resolutionStatus: "Pending",
    checkedBy: "Priya Sharma",
    time: "10:35",
    remarks: "Bridging observed",
  },
  {
    date: "2025-12-23",
    company: "JP Minda",
    plant: "Plant 2",
    line: "2000",
    process: "Case & Slider Greasing",
    part: "Slider",
    checkItem: "Grease Weight",
    inspectionStatus: "Unchecked",
    issueStatus: "Error",
    resolutionStatus: "Open",
    checkedBy: "-",
    time: "-",
    remarks: "Awaiting inspection",
  },
  {
    date: "2025-12-23",
    company: "JP Minda",
    plant: "Plant 3",
    line: "5000",
    process: "Cover Assy",
    part: "Top Cover",
    checkItem: "Air Leak",
    inspectionStatus: "Checked",
    issueStatus: "Error",
    resolutionStatus: "Resolved",
    checkedBy: "Amit Patel",
    time: "09:55",
    remarks: "Leak fixed",
  },
];

/* ---------------- Helpers ---------------- */

function getMinMax(arr, key) {
  const vals = arr.map((r) => r[key]);
  return [Math.min(...vals), Math.max(...vals)];
}

function toPolylinePoints(data, key, width = 700, height = 150, pad = 24) {
  const count = data.length;
  const stepX = (width - pad * 2) / Math.max(1, count - 1);
  const [min, max] = getMinMax(data, key);
  const range = Math.max(1, max - min);
  return data
    .map((d, i) => {
      const x = pad + i * stepX;
      const y = pad + (height - pad * 2) * (1 - (d[key] - min) / range);
      return x + "," + y;
    })
    .join(" ");
}

function polarToCartesian(cx, cy, r, angleInRad) {
  return {
    x: cx + r * Math.cos(angleInRad),
    y: cy + r * Math.sin(angleInRad),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
  return (
    "M " +
    cx +
    " " +
    cy +
    " L " +
    start.x +
    " " +
    start.y +
    " A " +
    r +
    " " +
    r +
    " 0 " +
    largeArcFlag +
    " 0 " +
    end.x +
    " " +
    end.y +
    " Z"
  );
}

/* ---------------- Small UI Pieces ---------------- */

function KPIBadge({ delta }) {
  const isUp = delta >= 0;
  return (
    <div
      className={
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs " +
        (isUp ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600")
      }
    >
      <span>{Math.abs(delta)} vs last period</span>
    </div>
  );
}

function StatCard({ title, value, delta, icon, loading }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {loading ? "..." : value}
          </p>
        </div>
        <div className="inline-flex items-center justify-center rounded-lg bg-slate-50 text-slate-500 p-2">
          {icon}
        </div>
      </div>
      <KPIBadge delta={delta} />
    </div>
  );
}

function StatusPill({ status }) {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
  if (status === "Checked")
    return (
      <span className={base + " bg-emerald-50 text-emerald-700"}>Checked</span>
    );
  if (status === "Unchecked")
    return (
      <span className={base + " bg-amber-50 text-amber-700"}>Unchecked</span>
    );
  if (status === "In Progress")
    return (
      <span className={base + " bg-sky-50 text-sky-700"}>In Progress</span>
    );
  return (
    <span className={base + " bg-slate-100 text-slate-700"}>{status}</span>
  );
}

function IssuePill({ status }) {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
  if (status === "OK")
    return <span className={base + " bg-emerald-50 text-emerald-700"}>OK</span>;
  if (status === "Error")
    return <span className={base + " bg-rose-50 text-rose-700"}>Error</span>;
  return (
    <span className={base + " bg-slate-100 text-slate-700"}>{status}</span>
  );
}

function ResolutionPill({ status }) {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
  if (status === "Resolved")
    return <span className={base + " bg-sky-50 text-sky-700"}>Resolved</span>;
  if (status === "Open")
    return <span className={base + " bg-rose-50 text-rose-700"}>Open</span>;
  if (status === "Pending")
    return (
      <span className={base + " bg-amber-50 text-amber-700"}>Pending</span>
    );
  return (
    <span className={base + " bg-slate-100 text-slate-700"}>{status}</span>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </span>
  );
}

function StatusSummaryCard({
  label,
  colorFrom,
  colorTo,
  dotColor,
  count,
  percentage,
}) {
  return (
    <div
      className={
        "flex flex-col justify-between rounded-xl bg-gradient-to-br " +
        colorFrom +
        " " +
        colorTo +
        " p-3 shadow-sm"
      }
    >
      <div className="mb-2 flex items-center gap-2">
        <span className={"h-3 w-3 rounded-full " + dotColor} />
        <span className="text-xs font-semibold text-slate-800">{label}</span>
      </div>
      <div className="mb-2 text-xl font-bold text-slate-900">{count}</div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
        <div
          className="h-1.5 rounded-full bg-black/30"
          style={{ width: percentage + "%" }}
        />
      </div>
    </div>
  );
}

function MiniKPI({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[11px] text-slate-600">{label}</span>
      </div>
      <span className="text-[11px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-[9px] text-emerald-700">
      ✓
    </span>
  );
}

function InsightItem({ title, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-medium text-slate-500">{title}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{detail}</p>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="whitespace-nowrap px-3 py-2 text-left text-[11px] uppercase tracking-wide text-slate-500 bg-slate-50">
      {children}
    </th>
  );
}

function Td({ children }) {
  return (
    <td className="whitespace-nowrap px-3 py-2 align-top text-[11px] text-slate-700">
      {children}
    </td>
  );
}

function MiniBar({ label, value, max }) {
  const width = (value / max) * 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-400">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-1.5 rounded-full bg-rose-400"
          style={{ width: width + "%" }}
        />
      </div>
    </div>
  );
}

/* MultiSelect (chips + dropdown) */

function MultiSelect({
  id,
  label,
  options,
  value,
  onChange,
  placeholder,
  isOpen,
  onToggle,
  onClose,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const toggleOption = (opt) => {
    let next = Array.isArray(value) ? [...value] : [];
    if (next.includes(opt)) {
      next = next.filter((v) => v !== opt);
    } else {
      next.push(opt);
    }
    onChange(next);
  };

  return (
    <div className="relative min-w-[180px]" ref={ref}>
      <label className="mb-1 block text-[11px] font-medium text-slate-500">
        {label}
      </label>

      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-[11px] text-slate-700 hover:bg-slate-50"
      >
        <div className="flex flex-wrap gap-1 max-h-10 overflow-hidden">
          {value && value.length > 0 ? (
            value.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-[2px] text-[10px] text-slate-700"
              >
                {v}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(v);
                  }}
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  ×
                </span>
              </span>
            ))
          ) : (
            <span className="text-slate-400">
              {placeholder || "Select " + label}
            </span>
          )}
        </div>
        <span className="ml-2 text-slate-400 text-[10px]">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <div className="max-h-48 overflow-auto text-[11px]">
            {options.map((opt) => {
              const selected = value.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleOption(opt)}
                  className={
                    "flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-slate-50 " +
                    (selected ? "bg-slate-50" : "")
                  }
                >
                  <span className="text-[12px] w-3">{selected ? "✔" : ""}</span>
                  <span className="text-slate-700">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Main Dashboard ---------------- */

export default function ChecklistDashboard() {
  const [lineHover, setLineHover] = useState({
    x: null,
    y: null,
    text: null,
  });
  const [donutHover, setDonutHover] = useState({
    x: null,
    y: null,
    text: null,
  });

  const [filters, setFilters] = useState({
    company: [],
    plant: [],
    line: [],
    process: [],
    part: [],
    inspectionStatus: [],
    issueStatus: [],
    dateRange: "Today",
  });

  const [openSelect, setOpenSelect] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const trendChecked = useMemo(
    () => toPolylinePoints(LINE_TREND, "checked"),
    []
  );
  const trendError = useMemo(() => toPolylinePoints(LINE_TREND, "error"), []);
  const trendUnchecked = useMemo(
    () => toPolylinePoints(LINE_TREND, "unchecked"),
    []
  );

  const donutTotal = DONUT_DATA.reduce((s, d) => s + d.value, 0);

  const getAssemblyCardsData = {
    data: {
      total_checked: 140,
      total_unchecked: 35,
      total_resolved: 90,
      total_errors: 20,
    },
  };

  const {
    data: cardData,
    isLoading: cardsLoading,
    isError: cardsError,
  } = useDashboardCards();

  console.log("HJGDSKH", cardData);

  const summaryCards = [
    {
      title: "Total Assemblies",
      value: cardData?.totals?.assembly ?? 0,
      delta: cardData?.month_difference?.assembly ?? 0,
      icon: <Activity className="w-4 h-4" />,
    },
    {
      title: "Total Employees",
      value: cardData?.totals?.employee ?? 0,
      delta: cardData?.month_difference?.employee ?? 0,
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Total Processes",
      value: cardData?.totals?.process ?? 0,
      delta: cardData?.month_difference?.process ?? 0,
      icon: <Filter className="w-4 h-4" />,
    },
    {
      title: "Total Parts",
      value: cardData?.totals?.parts ?? 0,
      delta: cardData?.month_difference?.parts ?? 0,
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  ];

  const defectLines = [  
    { label: "Line 1000B", faults: 12 },
    { label: "Line 5000", faults: 10 },
    { label: "Line 1000A", faults: 9 },
    { label: "Line 2000", faults: 4 },
  ];
  const maxFault = Math.max(...defectLines.map((d) => d.faults));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sticky Header + Filters */}
      <div className="border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex flex-col gap-3">
          <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Check Item Dashboard
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Monitor assembly checks, errors & progress
              </p>
            </div>
            <button
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </header>

          <section className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:flex-wrap sm:items-end">
            <MultiSelect
              id="company"
              label="Company"
              options={["JP Minda", "Sub-company 1", "Sub-company 2"]}
              value={filters.company}
              onChange={(v) => handleFilterChange("company", v)}
              placeholder="All Companies + Multi"
              isOpen={openSelect === "company"}
              onToggle={() =>
                setOpenSelect(openSelect === "company" ? null : "company")
              }
              onClose={() => openSelect === "company" && setOpenSelect(null)}
            />
            <MultiSelect
              id="plant"
              label="Plant"
              options={["Plant 1", "Plant 2", "Plant 3"]}
              value={filters.plant}
              onChange={(v) => handleFilterChange("plant", v)}
              placeholder="All Plants + Multi"
              isOpen={openSelect === "plant"}
              onToggle={() =>
                setOpenSelect(openSelect === "plant" ? null : "plant")
              }
              onClose={() => openSelect === "plant" && setOpenSelect(null)}
            />
            <MultiSelect
              id="line"
              label="Assembly Line"
              options={["500", "1000A", "1000B", "2000", "5000"]}
              value={filters.line}
              onChange={(v) => handleFilterChange("line", v)}
              placeholder="All Lines + Multi"
              isOpen={openSelect === "line"}
              onToggle={() =>
                setOpenSelect(openSelect === "line" ? null : "line")
              }
              onClose={() => openSelect === "line" && setOpenSelect(null)}
            />
            <MultiSelect
              id="process"
              label="Process"
              options={[
                "PCB Depaneling",
                "Soldering",
                "Greasing",
                "Cover Assy",
              ]}
              value={filters.process}
              onChange={(v) => handleFilterChange("process", v)}
              placeholder="All Processes + Multi"
              isOpen={openSelect === "process"}
              onToggle={() =>
                setOpenSelect(openSelect === "process" ? null : "process")
              }
              onClose={() => openSelect === "process" && setOpenSelect(null)}
            />
            <MultiSelect
              id="part"
              label="Part"
              options={["Main PCB", "Connector", "Slider", "Top Cover"]}
              value={filters.part}
              onChange={(v) => handleFilterChange("part", v)}
              placeholder="All Parts + Multi"
              isOpen={openSelect === "part"}
              onToggle={() =>
                setOpenSelect(openSelect === "part" ? null : "part")
              }
              onClose={() => openSelect === "part" && setOpenSelect(null)}
            />
            <MultiSelect
              id="inspection"
              label="Inspection Status"
              options={["Checked", "Unchecked", "In Progress"]}
              value={filters.inspectionStatus}
              onChange={(v) => handleFilterChange("inspectionStatus", v)}
              placeholder="Checked / Unchecked + Multi"
              isOpen={openSelect === "inspection"}
              onToggle={() =>
                setOpenSelect(openSelect === "inspection" ? null : "inspection")
              }
              onClose={() => openSelect === "inspection" && setOpenSelect(null)}
            />
            <MultiSelect
              id="issue"
              label="Issue Status"
              options={["OK", "Error"]}
              value={filters.issueStatus}
              onChange={(v) => handleFilterChange("issueStatus", v)}
              placeholder="Error / Resolved + Multi"
              isOpen={openSelect === "issue"}
              onToggle={() =>
                setOpenSelect(openSelect === "issue" ? null : "issue")
              }
              onClose={() => openSelect === "issue" && setOpenSelect(null)}
            />
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-[11px] font-medium text-slate-500">
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, dateRange: e.target.value }))
                }
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 focus:border-slate-400 focus:outline-none"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
          </section>
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 space-y-4">
        {cardsError && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {cardsError}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((c, i) => (
            <StatCard
              key={i}
              title={c.title}
              value={c.value}
              delta={c.delta}
              icon={c.icon}
              loading={cardsLoading}
            />
          ))}
        </section>

        {/* Trend + Status + Donut; Smart insights left column ke niche */}
        <section className="grid gap-4 xl:grid-cols-12">
          {/* Left column */}
          <div className="space-y-4 xl:col-span-8">
            {/* Line Trend */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    Monthly Inspection Trend
                  </h2>
                  <p className="text-xs text-slate-400">
                    Checked vs Unchecked assemblies (monthly)
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={MONTHLY_DATA}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="checkedGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#22c55e"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="#22c55e"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="uncheckedGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#eab308"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#eab308"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="errorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#ef4444"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#ef4444"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        fontSize: 12,
                      }}
                    />

                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12 }}
                    />

                    <Area
                      type="monotone"
                      dataKey="checked"
                      stroke="#22c55e"
                      strokeWidth={2.5}
                      fill="url(#checkedGradient)"
                      name="Checked"
                    />
                    <Area
                      type="monotone"
                      dataKey="unchecked"
                      stroke="#eab308"
                      strokeWidth={2.5}
                      fill="url(#uncheckedGradient)"
                      name="Unchecked"
                    />
                    <Area
                      type="monotone"
                      dataKey="error"
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      fill="url(#errorGradient)"
                      name="Error"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active Assembly Performance */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Active Assembly Performance
                  </h3>
                  <p className="text-xs text-slate-400">
                    Running vs fault count by assembly line
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <LegendDot color="#1d4ed8" label="Running" />
                  <LegendDot color="#fb7185" label="Fault" />
                </div>
              </div>
              <div className="mt-3 flex h-40 items-end gap-4 overflow-x-auto pb-1">
                {ASSEMBLY_BAR.map((d) => {
                  const maxVal = Math.max(d.running, d.fault);
                  const scale = 100 / Math.max(1, maxVal);
                  return (
                    <div
                      key={d.label}
                      className="flex flex-col items-center gap-1 min-w-[54px]"
                    >
                      <div className="flex w-7 flex-col justify-end gap-1">
                        <div
                          className="w-full rounded-t bg-indigo-600"
                          style={{ height: d.running * scale + "px" }}
                        />
                        <div
                          className="w-full rounded-t bg-rose-400"
                          style={{ height: d.fault * scale + "px" }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart Insights under performance */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-800">
                  Smart Insights
                </h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2 text-xs">
                <InsightItem
                  title="Highest error rate"
                  value="Line 1000B"
                  detail="12 faults in last 24h"
                />
                <InsightItem
                  title="Longest pending item"
                  value="Grease Weight Check"
                  detail="Pending for 3.2h on Line 2000"
                />
                <InsightItem
                  title="Top performing inspector"
                  value="Priya Sharma"
                  detail="96% on-time checks this week"
                />
                <InsightItem
                  title="Repeating defect"
                  value="SOP Violation"
                  detail="7 occurrences across 3 lines"
                />
              </div>
            </div>
          </div>

          {/* Right column */}
          <aside className="space-y-4 xl:col-span-4">
            {/* Status Summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Status Summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <StatusSummaryCard
                  label="Checked"
                  colorFrom="from-emerald-50"
                  colorTo="to-emerald-100"
                  dotColor="bg-emerald-600"
                  count={getAssemblyCardsData.data.total_checked || 0}
                  percentage={72}
                />
                <StatusSummaryCard
                  label="Unchecked"
                  colorFrom="from-amber-50"
                  colorTo="to-amber-100"
                  dotColor="bg-amber-500"
                  count={getAssemblyCardsData.data.total_unchecked || 0}
                  percentage={18}
                />
                <StatusSummaryCard
                  label="Resolved"
                  colorFrom="from-sky-50"
                  colorTo="to-sky-100"
                  dotColor="bg-sky-500"
                  count={getAssemblyCardsData.data.total_resolved || 0}
                  percentage={65}
                />
                <StatusSummaryCard
                  label="Error"
                  colorFrom="from-rose-50"
                  colorTo="to-rose-100"
                  dotColor="bg-rose-500"
                  count={getAssemblyCardsData.data.total_errors || 0}
                  percentage={12}
                />
              </div>
            </div>

            {/* Donut + Error KPIs + only Top Defect Lines */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Inspection Overview
                  </h3>
                  <p className="text-xs text-slate-400">
                    Distribution of inspection status
                  </p>
                </div>
                <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">
                  <option>Today</option>
                  <option>Week</option>
                  <option>Month</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Tooltip
                    x={donutHover.x}
                    y={donutHover.y}
                    text={donutHover.text}
                  />
                  <svg width="140" height="140" viewBox="0 0 32 32">
                    {(() => {
                      let cum = 0;
                      return DONUT_DATA.map((s, i) => {
                        const start = (cum / donutTotal) * Math.PI * 2;
                        const end =
                          ((cum + s.value) / donutTotal) * Math.PI * 2;
                        cum += s.value;
                        return (
                          <path
                            key={i}
                            d={describeArc(16, 16, 13, start, end)}
                            fill={s.color}
                            onMouseMove={(ev) => {
                              const rect =
                                ev.currentTarget.getBoundingClientRect();
                              const percent = (
                                (s.value / donutTotal) *
                                100
                              ).toFixed(1);
                              setDonutHover({
                                x: rect.left + rect.width / 2,
                                y: rect.top,
                                text:
                                  s.label +
                                  ": " +
                                  s.value +
                                  " (" +
                                  percent +
                                  "%)",
                              });
                            }}
                            onMouseLeave={() =>
                              setDonutHover({ x: null, y: null, text: null })
                            }
                          />
                        );
                      });
                    })()}
                    <circle cx="16" cy="16" r="7" fill="white" />
                    <text
                      x="16"
                      y="16"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-slate-800 text-[6px]"
                    >
                      {donutTotal}
                    </text>
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  {DONUT_DATA.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="text-xs font-medium text-slate-700">
                          {s.label}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {s.value} items
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <MiniKPI
                  label="Total Errors"
                  value="32"
                  icon={<AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                />
                <MiniKPI
                  label="Open Errors"
                  value="9"
                  icon={
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  }
                />
                <MiniKPI
                  label="Resolved Errors"
                  value="23"
                  icon={<CheckIcon />}
                />
                <MiniKPI
                  label="Avg Resolution Time"
                  value="2.4h"
                  icon={<Clock3 className="w-3.5 h-3.5 text-sky-500" />}
                />
              </div>

              <div className="pt-1 border-t border-slate-100">
                <p className="mb-2 text-[11px] font-semibold text-slate-700">
                  Top Defect Lines
                </p>
                <div className="space-y-2">
                  {defectLines.map((d) => (
                    <MiniBar
                      key={d.label}
                      label={d.label}
                      value={d.faults}
                      max={maxFault}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Data Grid */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Inspection Data Grid
              </h3>
              <p className="text-xs text-slate-400">
                Detailed record of inspections with filters and export
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by part, process, line..."
                  className="h-8 w-48 rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-2 text-xs text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
                />
              </div>
              <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                Column Filters
              </button>
              <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="min-w-full border-collapse text-xs">
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Company</Th>
                  <Th>Plant</Th>
                  <Th>Assembly Line</Th>
                  <Th>Process</Th>
                  <Th>Part</Th>
                  <Th>Check Item</Th>
                  <Th>Inspection Status</Th>
                  <Th>Issue Status</Th>
                  <Th>Resolution</Th>
                  <Th>Checked By</Th>
                  <Th>Time</Th>
                  <Th>Remarks</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {TABLE_ROWS.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 cursor-pointer">
                    <Td>{r.date}</Td>
                    <Td>{r.company}</Td>
                    <Td>{r.plant}</Td>
                    <Td>{r.line}</Td>
                    <Td>{r.process}</Td>
                    <Td>{r.part}</Td>
                    <Td>{r.checkItem}</Td>
                    <Td>
                      <StatusPill status={r.inspectionStatus} />
                    </Td>
                    <Td>
                      <IssuePill status={r.issueStatus} />
                    </Td>
                    <Td>
                      <ResolutionPill status={r.resolutionStatus} />
                    </Td>
                    <Td>{r.checkedBy}</Td>
                    <Td>{r.time}</Td>
                    <Td className="max-w-[160px] truncate" title={r.remarks}>
                      {r.remarks}
                    </Td>
                    <Td>
                      <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100">
                        View
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Showing 1–10 of 120 inspections</span>
            <div className="flex items-center gap-1">
              <button className="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50">
                Prev
              </button>
              <button className="rounded border border-slate-200 bg-slate-900 px-2 py-1 text-white">
                1
              </button>
              <button className="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50">
                2
              </button>
              <button className="rounded border border-slate-200 px-2 py-1 hover:bg-slate-50">
                Next
              </button>
            </div>
          </div>
        </section>

        <footer className="pt-1 pb-3 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} Check Item Management
        </footer>
      </main>
    </div>
  );
}

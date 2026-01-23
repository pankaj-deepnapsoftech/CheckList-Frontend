import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";

const summaryCards = [
  {
    label: "Total Production",
    value: 247,
    subtitle: "All Records",
    accent: "text-blue-600",
    border: "border-blue-100",
    bg: "bg-blue-50",
    trend: "up",
  },
  {
    label: "Avg Temperature",
    value: "50.6°C",
    subtitle: "Overall Average",
    accent: "text-emerald-600",
    border: "border-emerald-100",
    bg: "bg-emerald-50",
    trend: "up",
  },
  {
    label: "Avg Pressure",
    value: "9.1 bar",
    subtitle: "Overall Average",
    accent: "text-cyan-600",
    border: "border-cyan-100",
    bg: "bg-cyan-50",
    trend: "up",
  },
  {
    label: "Total Machines",
    value: 4,
    subtitle: "Active Devices",
    accent: "text-purple-600",
    border: "border-purple-100",
    bg: "bg-purple-50",
    trend: "up",
  },
  {
    label: "Avg RPM",
    value: 1625,
    subtitle: "Overall Average",
    accent: "text-orange-500",
    border: "border-orange-100",
    bg: "bg-orange-50",
    trend: "up",
  },
  {
    label: "Running",
    value: 0,
    subtitle: "Active Machines",
    accent: "text-emerald-600",
    border: "border-emerald-100",
    bg: "bg-emerald-50",
    trend: "up",
  },
  {
    label: "Stroke Count",
    value: 9,
    subtitle: "Stroke Count",
    accent: "text-amber-500",
    border: "border-amber-100",
    bg: "bg-amber-50",
    trend: "down",
  },
  {
    label: "Stopped",
    value: 4,
    subtitle: "Stopped Machines",
    accent: "text-rose-500",
    border: "border-rose-100",
    bg: "bg-rose-50",
    trend: "down",
  },
];

const machineFilterOptions = [
  "All Brands",
  "Siemens",
  "Weinview",
  "Omron",
];

const productionStatusOptions = ["All", "Active", "Inactive"];

const runningStatusOptions = ["All Status", "Running", "Stopped"];

const machineMetricsData = [
  { name: "Machine 1", production: 176, downtime: 45 },
  { name: "Machine 2", production: 24, downtime: 18 },
  { name: "Machine 3", production: 82, downtime: 52 },
  { name: "Machine 4", production: 47, downtime: 45 },
];

const rpmPressureData = [
  { name: "Siemens", rpm: 1800, pressure: 10 },
  { name: "Weinview", rpm: 1500, pressure: 7.03 },
  { name: "Omron", rpm: 1400, pressure: 9.49 },
];

const plcMachines = [
  {
    brand: "Siemens",
    model: "S7-1200",
    protocol: "S7COMM",
    status: "Stopped",
    product: "Product01",
    lastUpdated: "18/01/2026, 00:53:57",
    productionCount: 164,
    rpm: 1800,
    temperature: "44.7°C",
    pressure: "10 BAR",
    motorStatus: "OFF",
    productionStatus: "ACTIVE",
    plcStatus: "STOPPED",
  },
  {
    brand: "Weinview",
    model: "MT8102iE",
    protocol: "MODBUS RTU/TCP",
    status: "Stopped",
    product: "W004",
    assigned: "Kajal CE1",
    lastUpdated: "15/01/2026, 18:39:40",
    productionCount: 14,
    rpm: 1500,
    temperature: "64.0°C",
    pressure: "7.03 BAR",
    motorStatus: "OFF",
    productionStatus: "ACTIVE",
    plcStatus: "STOPPED",
  },
  {
    brand: "Omron",
    model: "NX-Series",
    protocol: "FINS",
    status: "Stopped",
    product: "004",
    assigned: "Puneet Chandila",
    lastUpdated: "13/01/2026, 23:06:15",
    productionCount: 36,
    rpm: 1400,
    temperature: "48.2°C",
    pressure: "9.49 BAR",
    motorStatus: "OFF",
    productionStatus: "INACTIVE",
    plcStatus: "STOPPED",
  },
];

function SummaryCard({ card }) {
  const isUpTrend = card.trend === "up";
  const trendColor = isUpTrend ? "text-emerald-600" : "text-rose-600";
  const trendBg = isUpTrend ? "bg-emerald-100" : "bg-rose-100";
  
  return (
    <div
      className={`rounded-xl border ${card.border} ${card.bg} px-4 py-3 shadow-sm`}
    >
      <p className="text-xs font-medium text-gray-600">{card.label}</p>
      <div className="mt-1 flex items-center gap-2">
        <p className={`text-2xl font-semibold ${card.accent}`}>
          {card.value}
        </p>
        <div className={`flex items-center justify-center rounded-full ${trendBg} p-0.5`}>
          {isUpTrend ? (
            <ArrowUp size={14} className={trendColor} />
          ) : (
            <ArrowDown size={14} className={trendColor} />
          )}
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-600">
        {card.subtitle}
      </p>
    </div>
  );
}

function PlcMachineCard({ machine }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50/60 via-white to-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
      <div className="flex items-start justify-between pb-2 border-b border-rose-100/60">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {machine.brand}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{machine.model}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
            {machine.status}
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            {machine.protocol}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
        {machine.assigned && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
            ASSIGNED: {machine.assigned}
          </span>
        )}
        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
          PRODUCT: {machine.product}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mt-1">
        <div className="space-y-1">
          <p className="text-gray-500">Last Updated</p>
          <p className="font-medium text-gray-800">{machine.lastUpdated}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Production Count</p>
          <p className="font-semibold text-gray-900">
            {machine.productionCount}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">RPM</p>
          <p className="font-semibold text-blue-700">{machine.rpm}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Temperature</p>
          <p className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {machine.temperature}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Pressure</p>
          <p className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            {machine.pressure}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-gray-500">Motor</p>
            <span
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white uppercase ${
                machine.motorStatus === "OFF"
                  ? "bg-rose-500"
                  : "bg-emerald-500"
              }`}
            >
              {machine.motorStatus}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-gray-500">Production</p>
            <span
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white uppercase ${
                machine.productionStatus === "ACTIVE"
                  ? "bg-emerald-500"
                  : "bg-rose-500"
              }`}
            >
              {machine.productionStatus}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-gray-500">PLC</p>
            <span
              className={`rounded px-3 py-1.5 text-xs font-semibold text-white uppercase ${
                machine.plcStatus === "STOPPED"
                  ? "bg-rose-500"
                  : "bg-emerald-500"
              }`}
            >
              {machine.plcStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlcLiveData() {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Machine Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor real-time machine performance and status
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Last updated: 14:39:13
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              LIVE
            </span>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} card={card} />
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Machine
              </label>
              <select className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {machineFilterOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Production Status
              </label>
              <select className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {productionStatusOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Running Status
              </label>
              <select className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {runningStatusOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">
                Machine Metrics
              </h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={machineMetricsData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip cursor={{ fill: "#f9fafb" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="production" name="Production" fill="#0ea5e9" />
                  <Bar dataKey="downtime" name="Downtime" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">
                RPM &amp; Pressure
              </h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rpmPressureData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip cursor={{ fill: "#f9fafb" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    yAxisId="left"
                    dataKey="rpm"
                    name="RPM"
                    fill="#facc15"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="pressure"
                    name="Pressure (bar)"
                    fill="#a855f7"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* PLC Machine Data */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">
              PLC Machine Data (Latest per Machine)
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {plcMachines.map((m) => (
              <PlcMachineCard key={m.brand} machine={m} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


import React from "react";
import { Layers, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  useDashboardCards,
  useMonthlyInspectionTrend,
  useAssemblyStatus,
  useInspectionOverview,
} from "../hooks/useDashboard";
import { useCheckItemHistory } from "../hooks/useCheckItemHistory";
import { useLogin } from "../hooks/useLogin";

/* ===================== STATIC COLORS ===================== */
const COLORS = ["#22c55e", "#facc15", "#ef4444"];

/* ===================== PAGE ===================== */

export default function UserDashboard() {
  const { logedinUser } = useLogin();
  const user = logedinUser?.data;
  const permissions = user?.userRole?.permissions || [];

  // Assembly‑related permissions (all assembly modules from sidebar)
  const assemblyPaths = [
    "/assembly-line",
    "/assigned-assembly-lines",
    "/assembly-line-status",
    "/assembly-line-admin/error",
    "/assembly-line/error",
  ];

  // Only if user has at least one assembly module permission, we show assembly data
  const canSeeAssembly = permissions.some((p) => assemblyPaths.includes(p));

  if (!canSeeAssembly) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            User Dashboard
          </h1>
          <p className="text-sm text-gray-500">No data Found.</p>
        </div>
      </div>
    );
  }
  // Cards data (scoped to this user by backend)
  const { data: cardData, isLoading: cardsLoading } = useDashboardCards();

  // Monthly inspection trend (user assemblies only)
  const { data: monthlyTrendData = [], isLoading: trendLoading } =
    useMonthlyInspectionTrend();

  // Assembly status list (today, user assemblies)
  const inspectionStatus = useAssemblyStatus();
  const inspectionData = inspectionStatus?.data || [];

  // Status summary (checked/unchecked/errors/resolved) – from assembly cards API
  const { getAssemblyCardsData } = useCheckItemHistory();
  const statusSummary = getAssemblyCardsData?.data || {};

  // Inspection overview (error assemblies, resolved/open)
  const { data: inspectionOverview } = useInspectionOverview();

  const openErrors =
    inspectionOverview?.summary?.stillErrorAssemblies ||
    statusSummary.total_errors ||
    0;
  const resolvedErrors =
    inspectionOverview?.summary?.resolvedAssemblies ||
    statusSummary.total_resolved ||
    0;
  console.log("??", cardData);
  // KPI cards for user
  const stats = [
    {
      title: "My Assemblies",
      value: statusSummary?.total_assemblies ?? 0,
      icon: Layers,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Checked Today",
      value: statusSummary.total_checked ?? 0,
      icon: CheckCircle,
      bg: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Unchecked Today",
      value: statusSummary.total_unchecked ?? 0,
      icon: Clock,
      bg: "bg-yellow-50",
      color: "text-yellow-600",
    },
    {
      title: "Open Errors",
      value: openErrors,
      icon: AlertTriangle,
      bg: "bg-red-50",
      color: "text-red-600",
    },
  ];

  // Trend chart uses monthlyTrendData (month name + checked/error)
  const trendData = monthlyTrendData.map((m) => ({
    day: `${m.month}/${m.year}`,
    checked: m.checked,
    error: m.error,
  }));

  // Donut status data from statusSummary
  const statusData = [
    { name: "Checked", value: statusSummary.total_checked || 0 },
    { name: "Unchecked", value: statusSummary.total_unchecked || 0 },
    { name: "Errors", value: statusSummary.total_errors || 0 },
  ];

  // Recent assemblies table from inspectionData
  const recentAssemblies = (inspectionData || []).map((a) => {
    console.log("sdfngybcsdjhg", inspectionData);
    const checked = a.checked;
    const status = checked ? "Checked" : "Unchecked";
    return {
      assembly_number: a.assembly_number || "-",
      assembly_name: a.assembly_name || a.assembly_name || "-",
      method: a.part?.part_name || "N/A",
      time: new Date(
        a.updatedAt || a.createdAt || new Date()
      ).toLocaleTimeString(),
      status,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">User Dashboard</h1>
        <p className="text-sm text-gray-500">
          Monitor assembly checks, errors and progress
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="text-2xl font-semibold mt-1">{item.value}</h2>
            </div>
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <item.icon className={item.color} size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Professional Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Assembly Performance Trend
            </h3>
            <span className="text-xs text-gray-500">
              Monthly (My Assemblies)
            </span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient
                  id="checkedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>

                <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend verticalAlign="top" height={30} />

              <Area
                type="monotone"
                dataKey="checked"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#checkedGradient)"
                name="Checked Assemblies"
              />

              <Area
                type="monotone"
                dataKey="error"
                stroke="#ef4444"
                strokeWidth={2.5}
                fill="url(#errorGradient)"
                name="Error Assemblies"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <h3 className="text-base font-semibold mb-4">Status Summary</h3>

          <PieChart width={240} height={240}>
            <Pie
              data={statusData}
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
            >
              {statusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Assembly Details</h3>
          <button className="text-sm text-indigo-600 hover:underline">
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-300">
                <th className="py-3 px-3">Assembly No</th>
                <th className="py-3 px-3">Assembly Name</th>
                <th className="py-3 px-3">Check Method</th>
                <th className="py-3 px-3">Check Time</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentAssemblies.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-3 font-medium">
                    {item.assembly_number}
                  </td>

                  <td className="py-3 px-3">{item.assembly_name}</td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                      {item.method}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-gray-600">{item.time}</td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          item.status === "Checked"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Unchecked"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

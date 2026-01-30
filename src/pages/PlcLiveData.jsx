import { useState, useMemo } from "react";
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
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { usePlcData } from "../hooks/usePlcData";
import { usePlcProduct } from "../hooks/usePlcProduct";

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

function PlcMachineCard({ machine, products = [] }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const statusVal = (machine.status || "").trim() || "—";
  const statusLower = statusVal.toLowerCase();
  const isRunning = statusLower === "running";
  const isStopped = statusLower === "stopped";
  const isIdle = statusLower === "idle" || statusLower === "—";
  const statusStyles = isRunning
    ? "bg-emerald-500/12 text-emerald-700 border-emerald-200"
    : isStopped
    ? "bg-rose-500/12 text-rose-700 border-rose-200"
    : isIdle
    ? "bg-slate-500/10 text-slate-600 border-slate-200"
    : "bg-amber-500/12 text-amber-700 border-amber-200";
  const dotColor = isRunning ? "bg-emerald-500" : isStopped ? "bg-rose-500" : "bg-slate-400";

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/60 via-white to-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3 relative">
      <div className="flex items-start justify-between pb-2 border-b border-blue-100/60 gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {machine.device_id || "N/A"}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Model: {machine.model || "N/A"}</p>
          {machine.alarm && (
            <p className="text-xs text-rose-600 mt-1 font-semibold">Alarm: {machine.alarm}</p>
          )}
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyles}`}
        >
          {isRunning && <span className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`} />}
          {statusVal}
        </span>
      </div>

      {/* Product fields (MATERIAL_CODE, PART_NO, MODEL_CODE) for this machine */}
      {products.length > 0 && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-2 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Products on this machine
          </p>
          {products.map((p, i) => (
            <div key={p._id || i} className="text-xs space-y-0.5 border-b border-slate-200 last:border-0 last:pb-0 pb-1.5 last:pb-0">
              <p className="text-gray-700">
                <span className="text-gray-500">Material Code:</span>{" "}
                <span className="font-medium">{p.material_code || "—"}</span>
              </p>
              <p className="text-gray-700">
                <span className="text-gray-500">Part No:</span>{" "}
                <span className="font-medium">{p.part_no || "—"}</span>
              </p>
              <p className="text-gray-700">
                <span className="text-gray-500">Model Code:</span>{" "}
                <span className="font-medium">{p.model_code || "—"}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs mt-1">
        <div className="space-y-1">
          <p className="text-gray-500">Last Updated</p>
          <p className="font-medium text-gray-800">
            {formatDate(machine.timestamp || machine.created_at)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Production Count</p>
          <p className="font-semibold text-gray-900">
            {machine.production_count || 0}
          </p>
        </div>
          <div className="space-y-1">
            <p className="text-gray-500">Start Time</p>
            <p className="font-medium text-gray-800">
              {formatDate(machine.start_time || machine.Start_time)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Stop Time</p>
            <p className="font-medium text-gray-800">
              {machine.stop_time ? formatDate(machine.stop_time) : (machine.Stop_time ? formatDate(machine.Stop_time) : "—")}
            </p>
          </div>
        <div className="space-y-1">
          <p className="text-gray-500">Latch Force</p>
          <p className="font-semibold text-blue-700">{machine.latch_force || 0}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Claw Force</p>
          <p className="font-semibold text-indigo-700">{machine.claw_force || 0}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Safety Lever</p>
          <p className="font-semibold text-emerald-700">{machine.safety_lever || 0}</p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Claw Lever</p>
          <p className="font-semibold text-purple-700">{machine.claw_lever || 0}</p>
        </div>
        <div className="space-y-1 col-span-2">
          <p className="text-gray-500">Stroke</p>
          <p className="font-semibold text-orange-700">{machine.stroke || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default function PlcLiveData() {
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const filters = useMemo(() => {
    const f = {};
    if (selectedDevice && selectedDevice !== "All") {
      f.device_id = selectedDevice;
    }
    if (selectedModel && selectedModel !== "All") {
      f.model = selectedModel;
    }
    return f;
  }, [selectedDevice, selectedModel]);

  const { getAllPlcData } = usePlcData(filters);
  const { getAllPlcProducts } = usePlcProduct({});
  const { data: plcDataList = [], isLoading, isFetching } = getAllPlcData;
  const productsList = getAllPlcProducts.data || [];

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!plcDataList || plcDataList.length === 0) {
      return {
        totalProduction: 0,
        avgLatchForce: 0,
        avgClawForce: 0,
        totalDevices: 0,
        avgSafetyLever: 0,
        avgClawLever: 0,
        totalStroke: 0,
        avgProductionCount: 0,
      };
    }

    const totalProduction = plcDataList.reduce((sum, item) => sum + (item.production_count || 0), 0);
    const avgLatchForce = Math.round(
      plcDataList.reduce((sum, item) => sum + (item.latch_force || 0), 0) / plcDataList.length
    );
    const avgClawForce = Math.round(
      plcDataList.reduce((sum, item) => sum + (item.claw_force || 0), 0) / plcDataList.length
    );
    const avgSafetyLever = Math.round(
      plcDataList.reduce((sum, item) => sum + (item.safety_lever || 0), 0) / plcDataList.length
    );
    const avgClawLever = Math.round(
      plcDataList.reduce((sum, item) => sum + (item.claw_lever || 0), 0) / plcDataList.length
    );
    const totalStroke = plcDataList.reduce((sum, item) => sum + (item.stroke || 0), 0);
    const avgProductionCount = Math.round(totalProduction / plcDataList.length);

    // Get unique device IDs
    const uniqueDevices = new Set(plcDataList.map((item) => item.device_id).filter(Boolean));
    const totalDevices = uniqueDevices.size;

    return {
      totalProduction,
      avgLatchForce,
      avgClawForce,
      totalDevices,
      avgSafetyLever,
      avgClawLever,
      totalStroke,
      avgProductionCount,
    };
  }, [plcDataList]);

  // Get latest record per device
  const latestPerDevice = useMemo(() => {
    if (!plcDataList || plcDataList.length === 0) return [];

    const deviceMap = new Map();
    plcDataList.forEach((item) => {
      const deviceId = item.device_id || "Unknown";
      const existing = deviceMap.get(deviceId);
      if (!existing || new Date(item.created_at || item.timestamp) > new Date(existing.created_at || existing.timestamp)) {
        deviceMap.set(deviceId, item);
      }
    });

    return Array.from(deviceMap.values());
  }, [plcDataList]);

  // Products grouped by machine_name (device_id) for machine cards
  const productsByMachine = useMemo(() => {
    const map = {};
    productsList.forEach((p) => {
      const key = (p.machine_name || "").trim();
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [productsList]);

  // Get unique devices and models for filters
  const uniqueDevices = useMemo(() => {
    const devices = new Set(plcDataList.map((item) => item.device_id).filter(Boolean));
    return Array.from(devices).sort();
  }, [plcDataList]);

  const uniqueModels = useMemo(() => {
    const models = new Set(plcDataList.map((item) => item.model).filter(Boolean));
    return Array.from(models).sort();
  }, [plcDataList]);

  // Prepare chart data
  const forceChartData = useMemo(() => {
    return latestPerDevice.slice(0, 10).map((item) => ({
      name: item.device_id || "Unknown",
      latchForce: item.latch_force || 0,
      clawForce: item.claw_force || 0,
      safetyLever: item.safety_lever || 0,
      clawLever: item.claw_lever || 0,
    }));
  }, [latestPerDevice]);

  const strokeProductionData = useMemo(() => {
    return latestPerDevice.slice(0, 10).map((item) => ({
      name: item.device_id || "Unknown",
      stroke: item.stroke || 0,
      productionCount: item.production_count || 0,
    }));
  }, [latestPerDevice]);

  const summaryCards = [
    {
      label: "Total Production",
      value: summaryStats.totalProduction,
      subtitle: "All Records",
      accent: "text-blue-600",
      border: "border-blue-100",
      bg: "bg-blue-50",
      trend: "up",
    },
    {
      label: "Avg Latch Force",
      value: summaryStats.avgLatchForce,
      subtitle: "Overall Average",
      accent: "text-emerald-600",
      border: "border-emerald-100",
      bg: "bg-emerald-50",
      trend: "up",
    },
    {
      label: "Avg Claw Force",
      value: summaryStats.avgClawForce,
      subtitle: "Overall Average",
      accent: "text-cyan-600",
      border: "border-cyan-100",
      bg: "bg-cyan-50",
      trend: "up",
    },
    {
      label: "Total Devices",
      value: summaryStats.totalDevices,
      subtitle: "Active Devices",
      accent: "text-purple-600",
      border: "border-purple-100",
      bg: "bg-purple-50",
      trend: "up",
    },
    {
      label: "Avg Safety Lever",
      value: summaryStats.avgSafetyLever,
      subtitle: "Overall Average",
      accent: "text-orange-500",
      border: "border-orange-100",
      bg: "bg-orange-50",
      trend: "up",
    },
    {
      label: "Avg Claw Lever",
      value: summaryStats.avgClawLever,
      subtitle: "Overall Average",
      accent: "text-indigo-600",
      border: "border-indigo-100",
      bg: "bg-indigo-50",
      trend: "up",
    },
    {
      label: "Total Stroke",
      value: summaryStats.totalStroke,
      subtitle: "Total Stroke Count",
      accent: "text-amber-500",
      border: "border-amber-100",
      bg: "bg-amber-50",
      trend: "up",
    },
    {
      label: "Avg Production Count",
      value: summaryStats.avgProductionCount,
      subtitle: "Per Record",
      accent: "text-rose-500",
      border: "border-rose-100",
      bg: "bg-rose-50",
      trend: "up",
    },
  ];

  const lastUpdated = useMemo(() => {
    if (!plcDataList || plcDataList.length === 0) return "No data";
    const latest = plcDataList[0];
    const date = new Date(latest.created_at || latest.timestamp || Date.now());
    return date.toLocaleTimeString("en-GB");
  }, [plcDataList]);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-full px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              PLC Live Data Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor real-time PLC machine performance and status
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Last updated: {lastUpdated}
              {isFetching && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" />
                  Updating...
                </span>
              )}
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
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Device ID
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Devices</option>
                {uniqueDevices.map((device) => (
                  <option key={device} value={device}>
                    {device}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Models</option>
                {uniqueModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
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
                Force Metrics (Latest per Device)
              </h2>
            </div>
            <div className="h-64">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              ) : forceChartData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forceChartData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip cursor={{ fill: "#f9fafb" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="latchForce" name="Latch Force" fill="#0ea5e9" />
                    <Bar dataKey="clawForce" name="Claw Force" fill="#3b82f6" />
                    <Bar dataKey="safetyLever" name="Safety Lever" fill="#10b981" />
                    <Bar dataKey="clawLever" name="Claw Lever" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">
                Stroke & Production Count
              </h2>
            </div>
            <div className="h-64">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-gray-400" />
                </div>
              ) : strokeProductionData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={strokeProductionData} barSize={32}>
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
                      dataKey="stroke"
                      name="Stroke"
                      fill="#f59e0b"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="productionCount"
                      name="Production Count"
                      fill="#ef4444"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* PLC Machine Data */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">
              PLC Machine Data (Latest per Device)
            </h2>
            {isLoading && (
              <Loader2 size={16} className="animate-spin text-gray-400" />
            )}
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
          ) : latestPerDevice.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">
              No PLC data available
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {latestPerDevice.map((machine, index) => (
                <PlcMachineCard
                  key={machine._id || index}
                  machine={machine}
                  products={productsByMachine[machine.device_id] || []}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
import DowntimeCharts from "./PlcDoughnutCharts";
import { ArrowUp, ArrowDown, Loader2, History } from "lucide-react";
import { usePlcData } from "../hooks/usePlcData";
import { usePlcProduct } from "../hooks/usePlcProduct";
import { useNavigate } from "react-router-dom";

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

 
  
 

  const statusVal = (machine.Status || "").trim() || "—";
  const navigate = useNavigate();
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
  
  const statusColor = isRunning
    ? "bg-emerald-400/40 border-emerald-200 "
    : isStopped
      ? "bg-rose-400/40 border-rose-200"
      : "bg-slate-400/40 border-slate-200";

  return (
    <div
      className={`rounded-2xl border ${statusColor}
       bg-gradient-to-b from-blue-50/60 via-white to-white
        p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3 relative`}
    >
      <div className="flex items-start justify-between pb-2 border-b border-blue-100/60 gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {machine.device_id || "N/A"}
          </h3>
          {/* {console.log("this ois my machine======>>>>>", machine.machine.model)} */}
          <p className="text-xs text-gray-500 mt-0.5">
            Company: {machine.companyname || "N/A"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Plant: {machine.plantname || "N/A"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Model: {machine.machine.model || "N/A"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Assembly Line: {machine.linenumber || "N/A"}
          </p>
          {machine.alarm && (
            <p className="text-xs text-rose-600 mt-1 font-semibold">
              Alarm: {machine.alarm}
            </p>
          )}
        </div>
        <span
          onClick={() =>
            navigate(
              `/plc/history?device_id=${encodeURIComponent(machine.device_id || "")}`,
            )
          }
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide cursor-pointer hover:opacity-80 ${statusStyles}`}
        >
          <History size={14} />
          History
        </span>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyles}`}
        >
          {isRunning && (
            <span
              className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`}
            />
          )}
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
            <div
              key={p._id || i}
              className="text-xs space-y-0.5 border-b border-slate-200 last:border-0 last:pb-0 pb-1.5 last:pb-0"
            >
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
        {/* <div className="space-y-1">
          <p className="text-gray-500">Production Count</p>
          <p className="font-semibold text-gray-900">
            {machine.production_count || 0}
          </p>
        </div> */}

        <div className="space-y-1">
          <p className="text-gray-500">Start Time</p>
          <p className="font-medium text-gray-800">
            {formatDate(machine.start_time || machine.Start_time)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-gray-500">Stop Time</p>
          {machine?.Stop_time === null ? (
            <p className="text-green-600">Running</p>
          ) : (
            <p className="font-medium text-gray-800">
              {machine.stop_time
                ? formatDate(machine.stop_time)
                : machine.Stop_time
                  ? formatDate(machine.Stop_time)
                  : "—"}
            </p>
          )}
        </div>
        {/* {machine.latch_force === null ? (
          ""
        ) : (
          <div className="space-y-1">
            <p className="text-gray-500">Latch Force</p>
            <p className="font-semibold text-blue-700">
              {machine.latch_force || 0}
            </p>
          </div>
        )}

        {machine.claw_force === null ? (
          ""
        ) : (
          <div className="space-y-1">
            <p className="text-gray-500">Claw Force</p>
            <p className="font-semibold text-indigo-700">
              {machine.claw_force || 0}
            </p>
          </div>
        )}
        {machine.safety_lever === null ? (
          ""
        ) : (
          <div className="space-y-1">
            <p className="text-gray-500">Safety Lever</p>
            <p className="font-semibold text-emerald-700">
              {machine.safety_lever || 0}
            </p>
          </div>
        )}
        {machine.claw_lever === null ? (
          ""
        ) : (
          <div className="space-y-1">
            <p className="text-gray-500">Claw Lever</p>
            <p className="font-semibold text-purple-700">
              {machine.claw_lever || 0}
            </p>
          </div>
        )}
        {machine.stroke === null ? (
          ""
        ) : (
          <div className="space-y-1 col-span-2">
            <p className="text-gray-500">Stroke</p>
            <p className="font-semibold text-orange-700">
              {machine.stroke || 0}
            </p>
          </div>
        )} */}
        {/* Product */}
        {machine.product && (
          <div className="space-y-1">
            <p className="text-gray-500">Product</p>
            <p className="font-semibold text-gray-800">{machine.product}</p>
          </div>
        )}

        {/* Production Count - product ke neeche */}
        {machine.production_count !== null &&
          machine.production_count !== undefined && (
            <div className="space-y-1">
              <p className="text-gray-500">Production Count</p>
              <p className="font-semibold text-gray-800">
                {machine.production_count}
              </p>
            </div>
          )}

        {/* Live Data Parameters - scrollable */}
        <div className="col-span-2 mt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Live Data
          </p>
          <div className="max-h-44 overflow-y-auto overflow-x-hidden pr-3 custom-scrollbar rounded-lg border border-slate-100 bg-slate-50/50 p-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {machine?.parameters &&
                Object.keys(machine.parameters).length > 0 &&
                Object.entries(machine.parameters).map(([key, value]) => (
                  <div key={key} className="space-y-0.5 min-w-0">
                    <p
                      className="text-gray-500 break-words"
                      title={key.replaceAll("_", " ")}
                    >
                      {key.replaceAll("_", " ")}
                    </p>
                    <p className="font-semibold text-gray-800 break-words">
                      {value}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDateTime(isoStr) {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return "—";
    // Show the time exactly as UTC (jo PLC se aa raha hai),
    // browser ka local timezone shift ignore karne ke liye UTC getters use kiye hain.
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    const h = String(d.getUTCHours()).padStart(2, "0");
    const m = String(d.getUTCMinutes()).padStart(2, "0");
    const s = String(d.getUTCSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${h}:${m}:${s}`;
  } catch {
    return "—";
  }
}

function durationMinutes(startTime, stopTime) {
  if (!startTime || !stopTime) return 0;
  const start = new Date(startTime).getTime();
  const stop = new Date(stopTime).getTime();
  if (Number.isNaN(start) || Number.isNaN(stop)) return 0;
  return Math.max(0, Math.round((stop - start) / 60000));
}

function formatDurationHoursMinutes(totalMinutes) {
  const m = totalMinutes != null ? Number(totalMinutes) : NaN;
  if (Number.isNaN(m) || m < 0) return "—";
  const hours = Math.floor(m / 60);
  const mins = Math.round(m % 60);
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins} min`;
}

export default function PlcLiveData() {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("");

  const [dateRangePreset, setDateRangePreset] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

const filters = useMemo(() => {
  const f = {};

  if (selectedDevice && selectedDevice !== "All") f.device_id = selectedDevice;
  if (selectedStatus && selectedStatus !== "All") f.status = selectedStatus;
  if (selectedCompany && selectedCompany !== "All") f.company_name = selectedCompany;
  if (selectedPlant && selectedPlant !== "All") f.plant_name = selectedPlant;

  // Date range: use startDate/endDate for API (filters by created_at)
  let computedStart = "";
  let computedEnd = "";

  if (dateRangePreset && dateRangePreset !== "Custom") {
    const now = new Date();
    let fromDate;

    if (dateRangePreset === "Today") {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      computedStart = fromDate.toISOString();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      computedEnd = endOfDay.toISOString();
    } else if (dateRangePreset === "This Week") {
      fromDate = new Date(now);
      fromDate.setDate(now.getDate() - now.getDay());
      fromDate.setHours(0, 0, 0, 0);
      computedStart = fromDate.toISOString();
      computedEnd = new Date().toISOString();
    } else if (dateRangePreset === "This Month") {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      computedStart = fromDate.toISOString();
      computedEnd = new Date().toISOString();
    }

    if (computedStart && computedEnd) {
      f.startDate = computedStart;
      f.endDate = computedEnd;
    }
  } else if (startDate || endDate) {
    if (startDate) {
      const d = new Date(startDate);
      d.setHours(0, 0, 0, 0);
      f.startDate = d.toISOString();
    }
    if (endDate) {
      const d = new Date(endDate);
      d.setHours(23, 59, 59, 999);
      f.endDate = d.toISOString();
    }
  }

  return f;
}, [
  selectedDevice,
  selectedStatus,
  selectedCompany,
  selectedPlant,
  dateRangePreset,
  startDate,
  endDate,
]);

  const { getAllPlcData } = usePlcData(filters);
  const { getAllPlcData: getAllForOptions } = usePlcData({}, { live: true });
  const { getAllPlcProducts } = usePlcProduct({});
  const { data: plcDataList = [], isLoading, isFetching } = getAllPlcData;
  const allDataForOptions = getAllForOptions.data || [];
  const productsList = getAllPlcProducts.data || [];

  // Dynamic options for Company & Plant dropdowns
  const companyOptions = useMemo(() => {
    const set = new Set(allDataForOptions.map((item) => item.companyname).filter(Boolean));
    return Array.from(set).sort();
  }, [allDataForOptions]);

  const plantOptions = useMemo(() => {
    const set = new Set(allDataForOptions.map((item) => item.plantname).filter(Boolean));
    return Array.from(set).sort();
  }, [allDataForOptions]);

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
        totalUniqueParameters: 0,
        totalParameterValues: 0,
        avgParametersPerRecord: 0,
      };
    }

    const totalProduction = plcDataList.reduce(
      (sum, item) => sum + (item.production_count || 0),
      0,
    );
    const avgLatchForce = Math.round(
      plcDataList.reduce((sum, item) => sum + (item.latch_force || 0), 0) /
        plcDataList.length,
    );
    const avgClawForce = Math.round(
      plcDataList.reduce((sum, item) => sum + (item.claw_force || 0), 0) /
        plcDataList.length,
    );
    const avgSafetyLever = Math.round(
      plcDataList.reduce((sum, item) => sum + (item.safety_lever || 0), 0) /
        plcDataList.length,
    );
    const avgClawLever = Math.round(
      plcDataList.reduce((sum, item) => sum + (item.claw_lever || 0), 0) /
        plcDataList.length,
    );
    const totalStroke = plcDataList.reduce(
      (sum, item) => sum + (item.stroke || 0),
      0,
    );
    const avgProductionCount = Math.round(totalProduction / plcDataList.length);

    // Get unique device IDs
    const uniqueDevices = new Set(
      plcDataList.map((item) => item.device_id).filter(Boolean),
    );
    const totalDevices = uniqueDevices.size;

    const allParameterNames = new Set();
    let totalParameterValues = 0;

    plcDataList.forEach((item) => {
      if (item.parameters && typeof item.parameters === "object") {
        const paramKeys = Object.keys(item.parameters);
        paramKeys.forEach((key) => allParameterNames.add(key));
        totalParameterValues += paramKeys.length;
      }
    });

    const totalUniqueParameters = allParameterNames.size;
    const avgParametersPerRecord =
      plcDataList.length > 0
        ? Math.round(totalParameterValues / plcDataList.length)
        : 0;

    return {
      totalProduction,
      avgLatchForce,
      avgClawForce,
      totalDevices,
      avgSafetyLever,
      avgClawLever,
      totalStroke,
      avgProductionCount,
      totalUniqueParameters,
      totalParameterValues,
      avgParametersPerRecord,
    };
  }, [plcDataList]);

  const stoppages = useMemo(() => {
     
      return plcDataList
        .filter((row) => row.Start_time || row.Stop_time)
        .map((row) => {
          const start = row.Start_time || row.timestamp || row.Start_time;
          
          const stop =row.Stop_time ?? null;
          const isRunning = !stop && start;
          const mins = isRunning ? null : durationMinutes(start, stop);
          return {
            id: row._id,
            machine: row.model || row.device_id || "—",
            code: row.device_id || "—",
            startTime: formatDateTime(start),
            stopTime: isRunning ? "—" : formatDateTime(stop),
            durationMinutes: mins,
            reason: row.reason || "—",
            status: isRunning ? "Running" : "Recorded"
          };
        })
        .sort((a, b) => {
          const da = plcDataList.find((r) => r._id === a.id);
          const db = plcDataList.find((r) => r._id === b.id);
          const tA = (da?.start_time || da?.timestamp || "").toString();
          const tB = (db?.start_time || db?.timestamp || "").toString();
          return tB.localeCompare(tA);
        });
    }, [plcDataList]);

    const SlicedStoppages = stoppages.slice(0,4)

  // Get latest record per device
  const latestPerDevice = useMemo(() => {
    if (!plcDataList || plcDataList.length === 0) return [];

    const deviceMap = new Map();
    plcDataList.forEach((item) => {
      const deviceId = item.device_id || "Unknown";
      const existing = deviceMap.get(deviceId);
      if (
        !existing ||
        new Date(item.created_at || item.timestamp) >
          new Date(existing.created_at || existing.timestamp)
      ) {
        deviceMap.set(deviceId, item);
      }
    });

    return Array.from(deviceMap.values());
  }, [plcDataList]);

  // Active = Running, Inactive = Stopped/Idle/other
  const machineStatusCounts = useMemo(() => {
    const active = latestPerDevice.filter(
      (m) => (m.Status || "").toLowerCase() === "running",
    ).length;
    const inactive = latestPerDevice.length - active;
    return { activeMachines: active, inactiveMachines: inactive };
  }, [latestPerDevice]);

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
    const devices = new Set(
      plcDataList.map((item) => item.device_id).filter(Boolean),
    );
    return Array.from(devices).sort();
  }, [plcDataList]);

  const uniqueModels = useMemo(() => {
    const models = new Set(
      plcDataList.map((item) => item.model).filter(Boolean),
    );
    return Array.from(models).sort();
  }, [plcDataList]);

  // Prepare chart data
  // Prepare chart data - updated to include more fields
  const forceChartData = useMemo(() => {
    return latestPerDevice.slice(0, 10).map((item) => {
      const base = {
        name: item.device_id || "Unknown",
      };

      // Add all numeric parameters
      if (item.parameters && typeof item.parameters === "object") {
        Object.entries(item.parameters).forEach(([key, value]) => {
          // Only include numeric values (skip strings like "ALARM")
          if (typeof value === "number") {
            base[key] = value;
          }
        });
      }

      return base;
    });
  }, [latestPerDevice]);

  const allParameterKeys = useMemo(() => {
    const keys = new Set();
    latestPerDevice.forEach((item) => {
      if (item.parameters && typeof item.parameters === "object") {
        Object.keys(item.parameters).forEach((key) => {
          // Only numeric ones
          if (typeof item.parameters[key] === "number") {
            keys.add(key);
          }
        });
      }
    });
    return Array.from(keys);
  }, [latestPerDevice]);

  const strokeProductionData = useMemo(() => {
    return latestPerDevice.slice(0, 10).map((item) => {
      let paramCount = 0;
      if (item.parameters && typeof item.parameters === "object") {
        paramCount = Object.keys(item.parameters).length;
      }

      return {
        name: item.device_id || "Unknown",
        stroke: item.stroke || 0,
        productionCount: item.production_count || 0,
        parametersCount: paramCount,
      };
    });
  }, [latestPerDevice]);

  const summaryCards = [
    {
      label: "Total Machines",
      value: summaryStats.totalDevices,
      subtitle: "Active Devices",
      accent: "text-purple-600",
      border: "border-purple-100",
      bg: "bg-purple-50",
      trend: "up",
    },
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
      label: "Total Parameters",
      value: summaryStats.totalParameterValues,
      subtitle: "All readings",
      accent: "text-purple-600",
      border: "border-purple-100",
      bg: "bg-purple-50",
      trend: "up",
    },
    // {
    //   label: "Avg Production Count",
    //   value: summaryStats.avgProductionCount,
    //   subtitle: "Per Record",
    //   accent: "text-rose-500",
    //   border: "border-rose-100",
    //   bg: "bg-rose-50",
    //   trend: "up",
    // },
    // {
    //   label: "Total Unique Parameters",
    //   value: summaryStats.totalUniqueParameters,
    //   subtitle: "Different types",
    //   accent: "text-indigo-600",
    //   border: "border-indigo-100",
    //   bg: "bg-indigo-50",
    //   trend: "up",
    // },

    // Option B - Total parameter readings collected

    // Option C - Average per record
    // {
    //   label: "Avg Parameters",
    //   value: summaryStats.avgParametersPerRecord,
    //   subtitle: "Per record",
    //   accent: "text-cyan-600",
    //   border: "border-cyan-100",
    //   bg: "bg-cyan-50",
    //   trend: "up",
    // },
    // {
    //   label: "Avg Latch Force",
    //   value: summaryStats.avgLatchForce,
    //   subtitle: "Overall Average",
    //   accent: "text-emerald-600",
    //   border: "border-emerald-100",
    //   bg: "bg-emerald-50",
    //   trend: "up",
    // },
    {
      label: "Total Running Machines",
      value: machineStatusCounts.activeMachines,
      subtitle: "Currently Running",
      accent: "text-emerald-600",
      border: "border-emerald-100",
      bg: "bg-emerald-50",
      trend: "up",
    },
    {
      label: "Total Stopped Machines",
      value: machineStatusCounts.inactiveMachines,
      subtitle: "Currently Stopped",
      accent: "text-rose-500",
      border: "border-rose-100",
      bg: "bg-rose-50",
      trend: "up",
    },
    {
      label: "Total Errors",
      value: summaryStats.avgClawForce,
      subtitle: "Overall Average",
      accent: "text-red-600",
      border: "border-red-200",
      bg: "bg-red-100",
      trend: "up",
    },
    // {
    //   label: "Avg Claw Force",
    //   value: summaryStats.avgClawForce,
    //   subtitle: "Overall Average",
    //   accent: "text-cyan-600",
    //   border: "border-cyan-100",
    //   bg: "bg-cyan-50",
    //   trend: "up",
    // },

    // {
    //   label: "Avg Safety Lever",
    //   value: summaryStats.avgSafetyLever,
    //   subtitle: "Overall Average",
    //   accent: "text-orange-500",
    //   border: "border-orange-100",
    //   bg: "bg-orange-50",
    //   trend: "up",
    // },
    // {
    //   label: "Avg Claw Lever",
    //   value: summaryStats.avgClawLever,
    //   subtitle: "Overall Average",
    //   accent: "text-indigo-600",
    //   border: "border-indigo-100",
    //   bg: "bg-indigo-50",
    //   trend: "up",
    // },
    // {
    //   label: "Total Stroke",
    //   value: summaryStats.totalStroke,
    //   subtitle: "Total Stroke Count",
    //   accent: "text-amber-500",
    //   border: "border-amber-100",
    //   bg: "bg-amber-50",
    //   trend: "up",
    // },
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
        {/* Filters */}
        <section className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
          {/* Company - dynamic from API */}
          <div className="flex min-w-[160px] flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500">
              Company
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Companies</option>
              {companyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Plant - dynamic from API */}
          <div className="flex min-w-[160px] flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500">
              Plant
            </label>
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Plants</option>
              {plantOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="flex min-w-[260px] flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500">
              Date Range
            </label>
            <select
              value={dateRangePreset}
              onChange={(e) => {
                setDateRangePreset(e.target.value);
                // Optional: clear custom dates when preset changes
                if (e.target.value !== "Custom") {
                  setStartDate("");
                  setEndDate("");
                }
              }}
              className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Custom">Custom Range</option>
            </select>

            {/* Show date inputs only when Custom is selected */}
            {dateRangePreset === "Custom" && (
              <div className="mt-1 flex gap-2">
                <div className="flex-1">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Machine Name */}
          <div className="flex min-w-[180px] flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500">
              Machine Name
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Machines</option>
              {uniqueDevices.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex min-w-[140px] flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-500">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="Running">Running</option>
              <option value="Stopped">Stopped</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="ml-auto flex items-center">
            <button
              onClick={() => {
                setSelectedCompany("");
                setSelectedPlant("");
                setDateRangePreset("");
                setStartDate("");
                setEndDate("");
                setSelectedDevice("");
                setSelectedStatus("");
              }}
              className="h-9 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        </section>

        {/* Summary cards */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} card={card} />
          ))}
        </div>

        <DowntimeCharts />

        {/* Charts */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">
                Parameters (Latest per Device)
              </h2>
              <span className="text-xs text-gray-500">Top 10 devices</span>
            </div>

            <div className="h-[300px]">
              {" "}
              {/* a bit taller because more bars = more legend space */}
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
                  <BarChart data={forceChartData} barSize={26}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      angle={-35}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      cursor={{ fill: "#f9fafb" }}
                      wrapperStyle={{
                        zIndex: 1000,
                        outline: "none",
                      }}
                    />
                    {/* <Legend
                      wrapperStyle={{ fontSize: 11 }}
                      layout="horizontal"
                      verticalAlign="top"
                      height={50}
                    /> */}

                    {allParameterKeys.map((paramKey, index) => {
                      // Simple color rotation - you can define your own colors
                      const colors = [
                        "#0ea5e9",
                        "#3b82f6",
                        "#10b981",
                        "#8b5cf6",
                        "#f59e0b",
                        "#ef4444",
                        "#6366f1",
                        "#ec4899",
                        "#64748b",
                      ];
                      const fillColor = colors[index % colors.length];

                      return (
                        <Bar
                          key={paramKey}
                          dataKey={paramKey}
                          name={paramKey.replace(/_/g, " ")}
                          fill={fillColor}
                        />
                      );
                    })}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">
                Parameters & Production Count
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
                <ResponsiveContainer
                  className="mt-15"
                  width="100%"
                  height="100%"
                >
                  <BarChart data={strokeProductionData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      angle={-35}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip cursor={{ fill: "#f9fafb" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />

                    {/* <Bar
                      yAxisId="left"
                      dataKey="stroke"
                      name="Stroke"
                      fill="#f59e0b"
                    /> */}
                    <Bar
                      yAxisId="left"
                      dataKey="productionCount"
                      name="Production Count"
                      fill="#ef4444"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="parametersCount"
                      name="Parameters Count"
                      fill="#8b5cf6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Stoppages Data */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Stoppage Details (Today)
              </h2>
              <p className="text-xs text-gray-500">
                Machine name, start / stop time and stoppage duration.
              </p>
            </div>
            <button
              onClick={() => navigate("/plc-data/stoppage")}
              className="px-5 py-[7px] rounded-[10px] bg-blue-500 text-white font-semibold active:scale-95 hover:cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                    Machine
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                    Start Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                    Stopped Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                    Duration
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                    Reason
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {SlicedStoppages.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-2 text-xs text-gray-800">
                      <div className="font-semibold">{s.machine}</div>
                      <div className="text-[11px] text-gray-500">{s.code}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-xs text-gray-700">
                      {s.startTime}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-xs text-gray-700">
                      {s.stopTime}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-xs font-semibold text-gray-900">
                      {formatDurationHoursMinutes(s.durationMinutes)}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700 max-w-xs">
                      {s.reason}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-xs">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 font-semibold text-[11px] ${
                          s.status === "Running"
                            ? "bg-emerald-50 text-emerald-600"
                            : s.status === "Stopped"
                              ? "bg-rose-50 text-rose-600"
                              : s.status === "Resolved"
                                ? "bg-emerald-50 text-emerald-600"
                                : s.status === "Recorded"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {stoppages.length === 0 && (
          <div className="mt-6 rounded-xl border border-gray-100 bg-white py-10 text-center text-sm text-gray-500">
            No stoppage records yet. PLC data with start/stop time will appear
            here.
          </div>
        )}
      </div>
    </div>
  );
};




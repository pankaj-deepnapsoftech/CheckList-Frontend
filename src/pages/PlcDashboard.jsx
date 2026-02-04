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
  
    console.log("this is my machine", machine);
 

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
          <p className="text-xs text-gray-500 mt-0.5">
            Model: {machine.model || "N/A"}
          </p>
          {machine.alarm && (
            <p className="text-xs text-rose-600 mt-1 font-semibold">
              Alarm: {machine.alarm}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusStyles}`}
        >
          {isRunning && (
            <span
              className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`}
            />
          )}
          {statusVal}
        </span>
      </div>

      

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
          {machine?.stop_time === null ? (
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
        {
            machine.productionCount === null ?(
            ""
            ):(
                <div className="space-y-1 col-span-2">
            <p className="text-gray-500">Production Count</p>
            <p className="font-semibold text-green-700">
              {machine.production_count|| 0}
            </p>
          </div>
            )
        }
        
        {machine.latch_force === null ? (
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
        )}
        
        
        
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
              PLC Machine Data
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor real-time PLC machine data
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

import { useMemo } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { usePlcData } from "../hooks/usePlcData";
import { useState } from "react";

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

export default function PlcStoppage() {
  const [selectedDevice, setSelectedDevice] = useState("");
  const filters = useMemo(() => {
    const f = {};
    if (selectedDevice && selectedDevice !== "All"){
      f.device_id = selectedDevice;
    }
    return f;
  }, [selectedDevice]);
  
  // console.log("filters",filters)
  const { getAllPlcData } = usePlcData(filters);
  const plcList = getAllPlcData.data || [];
  console.log(plcList)
  const isLoading = getAllPlcData.isLoading;
  const isError = getAllPlcData.isError;
  const refetch = getAllPlcData.refetch;
  

  const stoppages = useMemo(() => {
   
    return plcList
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
        const da = plcList.find((r) => r._id === a.id);
        const db = plcList.find((r) => r._id === b.id);
        const tA = (da?.start_time || da?.timestamp || "").toString();
        const tB = (db?.start_time || db?.timestamp || "").toString();
        return tB.localeCompare(tA);
      });
  }, [plcList]);

  const totalStoppages = stoppages.length;
  const completedStoppages = useMemo(
    () => stoppages.filter((s) => s.durationMinutes != null).length,
    [stoppages]
  );
  const totalMinutes = useMemo(
    () => stoppages.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0),
    [stoppages]
  );
  const runningMachines = useMemo(() => {
    return (plcList || []).filter((r) => r.Start_time && !r.Stop_time).length;
  }, [plcList]);

    const uniqueDevices = [...new Set(plcList.map((item) => item.device_id).filter(Boolean))];


  return (
      <div className="min-h-full bg-gray-50">
        <div className="mx-auto max-w-full px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Machine Stoppage Summary
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Start / stop times from PLC Data API — machine, duration and status.
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {isLoading && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white py-8 text-gray-500">
              <Loader2 size={24} className="animate-spin" />
              <span>Loading stoppage data…</span>
            </div>
          )}
          {isError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {getAllPlcData.error?.response?.data?.message || getAllPlcData.error?.message || "Failed to load stoppage data."}
            </div>
          )}
          {!isLoading && !isError && (
          <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-gray-600">Running Machines</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">
                {runningMachines}
              </p>
              <p className="mt-1 text-[11px] text-emerald-700">Currently running</p>
            </div>

            <div className="rounded-xl border border-blue-100  px-4 py-3 shadow-sm bg-blue-50/60">
              <p className="text-xs font-medium text-gray-500">Total Recorded Count</p>
              
              <p className="mt-1 text-2xl font-semibold text-blue-600">
                {totalStoppages}
              </p>
              <p className="mt-1 text-[11px] text-blue-700">Currently Stoppages</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-gray-500">
                Total Recorded Time
              </p>
              <p className="mt-1 text-2xl font-semibold text-amber-600">
                {formatDurationHoursMinutes(totalMinutes)}
              </p>
              {/* <p className="mt-1 text-[11px] text-emerald-700">Total Time Stoppage</p> */}
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-gray-500">
                Average Duration
              </p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">
                {completedStoppages ? formatDurationHoursMinutes(Math.round(totalMinutes / completedStoppages)) : "—"}
              </p>
              {/* <p className="mt-1 text-[11px] text-emerald-700">Total Average Duration</p> */}
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-3">
                <label className="text-xs font-medium text-gray-500">
                  Machine ID
                </label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="h-9 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Machines</option>
                  {uniqueDevices.map((device) => (
                    <option key={device} value={device}>
                      {device}
                    </option>
                  ))}
                </select>
              </div>

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
                  {stoppages.map((s) => (
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
              No stoppage records yet. PLC data with start/stop time will appear here.
            </div>
          )}
          </>
          )}
        </div>
      </div>
  );
}
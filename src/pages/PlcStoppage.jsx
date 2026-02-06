import { useMemo } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { usePlcData } from "../hooks/usePlcData";
import { useState } from "react";
import Pagination from "../Components/Pagination/Pagination";

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
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(1000)
  const filters = useMemo(() => {
    const f = {};
    if (selectedDevice && selectedDevice !== "All"){
      f.device_id = selectedDevice;
    }
    return f;
  }, [selectedDevice]);
  
  // console.log("filters",filters)
  const { getAllPlcData } = usePlcData(filters,"",page,limit);
  const plcList = getAllPlcData.data || [];
  console.log(plcList)
  const isLoading = getAllPlcData.isLoading;
  const isError = getAllPlcData.isError;
  const refetch = getAllPlcData.refetch;
  

  const stoppages = useMemo(() => {
    // 1. Prepare all records with a unified timestamp
    const allRecords = plcList.map((row) => {
      const ts = row.timestamp || row.created_at || row.Start_time;
      return {
        ...row,
        _ts: ts ? new Date(ts).getTime() : 0,
        _start: row.Start_time ? new Date(row.Start_time).getTime() : null,
        _stop: row.Stop_time ? new Date(row.Stop_time).getTime() : null,
      };
    });

    // 2. Group by device
    const grouped = {};
    allRecords.forEach((r) => {
      const dId = r.device_id || "unknown";
      if (!grouped[dId]) grouped[dId] = [];
      grouped[dId].push(r);
    });

    const result = [];

    // 3. Process each device
    Object.keys(grouped).forEach((deviceId) => {
      const records = grouped[deviceId].sort((a, b) => a._ts - b._ts);
      
      // -- A) Extract Sessions (Original Logic) --
      // We still want to show the main "Start/Stop" cycles as rows
      const sessions = records.filter((r) => r.Start_time || r.Stop_time);
      
      // Calculate gaps between sessions (Stopped Duration)
      sessions.forEach((row, index) => {
        let stoppedGapMinutes = null;
        if (index > 0) {
          const prev = sessions[index - 1];
          // If previous had a stop time, and current has start time
          if (prev._stop && row._start) {
            const diff = row._start - prev._stop;
            if (diff > 0) {
              stoppedGapMinutes = Math.round(diff / 60000);
            }
          }
        }

        const start = row.Start_time || row.timestamp;
        const stop = row.Stop_time ?? null;
        const isRunning = !stop && start;
        const mins = isRunning ? null : durationMinutes(start, stop);

        result.push({
          id: row._id,
          machine: row.model || row.device_id || "—",
          company:row.companyname,
          code: row.device_id || "—",
          startTime: formatDateTime(start),
          stopTime: isRunning ? "—" : formatDateTime(stop),
          durationMinutes: mins,
          stoppedGapMinutes: stoppedGapMinutes,
          reason: row.reason || "—",
          status: isRunning ? "Running" : "Recorded",
          _sortTime: row._ts,
          type: "session"
        });
      });

      // -- B) Detect Idle Intervals --
      // "jb machine start hogyi h start time aagya hai too uske 30 second tk agar koi production count nhi increase hoti..."
      
      let lastProdCount = -1;
      let lastProdChangeTime = 0;
      let isIdling = false;
      let idleStartTs = 0;
      
      // We iterate through ALL records to track production count changes
      records.forEach((r) => {
        const currentTs = r._ts;
        const currentProd = r.production_count;

        // Skip records without valid timestamp or production count
        if (!currentTs || currentProd === undefined || currentProd === null) return;

        // Initialize tracking on first valid record
        if (lastProdCount === -1) {
          lastProdCount = currentProd;
          lastProdChangeTime = currentTs;
          return;
        }

        if (currentProd !== lastProdCount) {
          // Production increased/changed
          if (isIdling) {
            // End of Idle period
            const durationMins = Math.round((currentTs - idleStartTs) / 60000);
             if (durationMins > 0) { // Only record significant idle times?
              result.push({
                id: `idle-${r._id}-${idleStartTs}`,
                machine: r.model || r.device_id || "—",
                code: r.device_id || "—",
                startTime: formatDateTime(new Date(idleStartTs).toISOString()),
                stopTime: formatDateTime(new Date(currentTs).toISOString()),
                durationMinutes: durationMins,
                stoppedGapMinutes: null,
                reason: "No Production",
                status: "Idle",
                _sortTime: idleStartTs,
                type: "idle"
              });
            }
            isIdling = false;
          }
          
          // Reset tracking
          lastProdCount = currentProd;
          lastProdChangeTime = currentTs;
        } else {
          // Production count is same
          const diffMs = currentTs - lastProdChangeTime;
          
          // Check if we exceeded 30 seconds threshold
          if (!isIdling && diffMs > 30000) {
            // Start Idling
            isIdling = true;
            idleStartTs = lastProdChangeTime + 30000; // Idle starts 30s after last change
          }
        }
      });
      
      // If still idling at the end of records?
      // Typically we don't close it until we see a change or we can mark it as "Current Idle"
      // But for now let's leave it open or close at last record? 
      // User said "jb tk production incease na ho". If it never increases in the dataset, it's idle till end.
      if (isIdling && records.length > 0) {
          const lastRecord = records[records.length-1];
          const endTs = lastRecord._ts;
          if (endTs > idleStartTs) {
             const durationMins = Math.round((endTs - idleStartTs) / 60000);
             result.push({
                id: `idle-open-${deviceId}`,
                machine: lastRecord.model || lastRecord.device_id || "—",
                code: lastRecord.device_id || "—",
                startTime: formatDateTime(new Date(idleStartTs).toISOString()),
                stopTime: "—", // Ongoing
                durationMinutes: durationMins,
                stoppedGapMinutes: null,
                reason: "No Production (Current)",
                status: "Idle",
                _sortTime: idleStartTs,
                type: "idle"
              });
          }
      }

    });

    // Sort descending by start time for display
    return result.sort((a, b) => b._sortTime - a._sortTime);
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

  const totalIdleMinutes = useMemo(
    () => stoppages.filter(s => s.type === 'idle').reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0),
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
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

            <div className="rounded-xl border border-purple-100 bg-purple-50/60 px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-gray-500">
                Total Idle Time
              </p>
              <p className="mt-1 text-2xl font-semibold text-purple-600">
                {formatDurationHoursMinutes(totalIdleMinutes)}
              </p>
              <p className="mt-1 text-[11px] text-purple-700">No Production</p>
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
                      Stopped Duration
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                      Idle Duration
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                      Reason
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white" value={limit}>
                  {stoppages.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-2 text-xs text-gray-800">
                        <div className="font-semibold">{s.company}</div>
                        <div className="text-[11px] text-gray-500">{s.code}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-xs text-gray-700">
                        {s.startTime}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-xs text-gray-700">
                        {s.stopTime}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-xs font-semibold text-gray-900">
                        {s.type === 'idle' ? "—" : formatDurationHoursMinutes(s.durationMinutes)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-xs font-semibold text-gray-900">
                        {formatDurationHoursMinutes(s.stoppedGapMinutes)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-xs font-semibold text-purple-600">
                        {s.type === 'idle' ? formatDurationHoursMinutes(s.durationMinutes) : "—"}
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
                              : s.status === "Idle"
                              ? "bg-purple-50 text-purple-600"
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
          <Pagination
        page={page}
        setPage={setPage}
        hasNextpage={stoppages?.length === limit}
      />
          </>
          )}
        </div>
      </div>
  );
}

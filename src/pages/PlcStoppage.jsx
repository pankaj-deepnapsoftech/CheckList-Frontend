import { useMemo } from "react";

const demoStoppages = [
  {
    id: 1,
    machine: "Siemens S7-1200",
    code: "MCH-01",
    startTime: "18/01/2026 14:10:23",
    stopTime: "18/01/2026 14:25:48",
    durationMinutes: 15,
    reason: "Emergency stop triggered",
    status: "Stopped",
  },
  {
    id: 2,
    machine: "Weinview MT8102iE",
    code: "MCH-02",
    startTime: "18/01/2026 13:05:10",
    stopTime: "18/01/2026 13:18:40",
    durationMinutes: 13,
    reason: "PLC communication loss",
    status: "Resolved",
  },
  {
    id: 3,
    machine: "Omron NX-Series",
    code: "MCH-03",
    startTime: "18/01/2026 11:32:05",
    stopTime: "18/01/2026 11:50:15",
    durationMinutes: 18,
    reason: "High temperature alarm",
    status: "Investigating",
  },
  {
    id: 4,
    machine: "Siemens S7-1200",
    code: "MCH-01",
    startTime: "18/01/2026 09:10:00",
    stopTime: "18/01/2026 09:20:30",
    durationMinutes: 10,
    reason: "Operator break",
    status: "Resolved",
  },
];

export default function PlcStoppage() {
  const totalStoppages = demoStoppages.length;
  const totalMinutes = useMemo(
    () => demoStoppages.reduce((sum, s) => sum + s.durationMinutes, 0),
    []
  );
  // Demo: assume 3 machines total and 1 currently stopped
  const runningMachines = 2;

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Machine Stoppage Summary
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track machine start / stop time and stoppage duration.
            </p>
            <p className="mt-1 text-xs text-gray-400">Demo data (static)</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 shadow-sm">
            <p className="text-xs font-medium text-gray-600">Running Machines</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600">
              {runningMachines}
            </p>
            <p className="mt-1 text-[11px] text-emerald-700">Currently running</p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium text-gray-500">Total Stoppages</p>
            
            <p className="mt-1 text-2xl font-semibold text-blue-600">
              {totalStoppages}
            </p>
            <p className="mt-1 text-[11px] text-emerald-700">Currently Stoppages</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium text-gray-500">
              Total Stoppage Time
            </p>
            <p className="mt-1 text-2xl font-semibold text-amber-600">
              {totalMinutes} min
            </p>
            {/* <p className="mt-1 text-[11px] text-emerald-700">Total Time Stoppage</p> */}
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium text-gray-500">
              Average Duration
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600">
              {Math.round(totalMinutes / totalStoppages)} min
            </p>
             {/* <p className="mt-1 text-[11px] text-emerald-700">Total Average Duration</p> */}
          </div>
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
                    Duration (min)
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
                {demoStoppages.map((s) => (
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
                      {s.durationMinutes} min
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700 max-w-xs">
                      {s.reason}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-xs">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 font-semibold text-[11px] ${
                          s.status === "Stopped"
                            ? "bg-rose-50 text-rose-600"
                            : s.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-600"
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
      </div>
    </div>
  );
}
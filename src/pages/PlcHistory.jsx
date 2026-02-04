import { useSearchParams, useNavigate } from "react-router-dom";
import { usePlcData } from "../hooks/usePlcData";
import { ArrowLeft, Loader2, History } from "lucide-react";

export default function PlcHistory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const deviceId = searchParams.get("device_id") || "";

  const { getAllPlcData } = usePlcData(
    { device_id: deviceId || undefined },
    { live: false }
  );

  const historyList = getAllPlcData.data || [];
  const isLoading = getAllPlcData.isLoading;
  const isError = getAllPlcData.isError;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
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

  if (!deviceId) {
    return (
      <div className="min-h-full bg-gray-50">
        <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/plc-data/live")}
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to Live Data
          </button>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
            <History size={48} className="mx-auto mb-3 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Select a machine to view history
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Go to PLC Live Data and click the <strong>History</strong> button
              on any machine card to see its complete history.
            </p>
            <button
              onClick={() => navigate("/plc-data/live")}
              className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
            >
              Go to Live Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-full px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/plc-data/live")}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back to Live Data
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                PLC History — {deviceId}
              </h1>
              <p className="text-sm text-gray-500">
                {historyList.length} record(s) found
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-gray-400" />
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
            <p className="text-rose-700">
              {getAllPlcData.error?.response?.data?.message ||
                getAllPlcData.error?.message ||
                "Failed to load history"}
            </p>
          </div>
        ) : historyList.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <History size={40} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">No history records for this machine</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Start Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Stop Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Production Count
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Parameters
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {historyList.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                        {formatDate(row.timestamp)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                        {formatDate(row.Start_time || row.start_time)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                        {row.Stop_time || row.stop_time
                          ? formatDate(row.Stop_time || row.stop_time)
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            (row.Status || "").toLowerCase() === "running"
                              ? "bg-emerald-100 text-emerald-800"
                              : (row.Status || "").toLowerCase() === "stopped"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {row.Status || "—"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-800">
                        {row.product || "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">
                        {row.production_count ?? "—"}
                      </td>
                      <td className="max-w-xs px-4 py-3 text-xs text-gray-600">
                        {row.parameters && Object.keys(row.parameters).length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(row.parameters)
                              .slice(0, 5)
                              .map(([k, v]) => (
                                <span
                                  key={k}
                                  className="rounded bg-gray-100 px-1.5 py-0.5"
                                >
                                  {k}: {String(v)}
                                </span>
                              ))}
                            {Object.keys(row.parameters).length > 5 && (
                              <span className="text-gray-400">
                                +{Object.keys(row.parameters).length - 5} more
                              </span>
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

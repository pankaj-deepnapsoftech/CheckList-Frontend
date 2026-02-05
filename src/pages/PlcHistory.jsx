import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePlcData } from "../hooks/usePlcData";
import { ArrowLeft, Loader2, History, X, FileText } from "lucide-react";

export default function PlcHistory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const deviceId = searchParams.get("device_id") || "";

  // State for modal
  const [selectedRow, setSelectedRow] = useState(null);

  const { getAllPlcData } = usePlcData(
    { device_id: deviceId || undefined },
    { live: false },
  );

  const historyList = getAllPlcData.data || [];
  const isLoading = getAllPlcData.isLoading;
  const isError = getAllPlcData.isError;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openParametersModal = (row) => {
    setSelectedRow(row);
  };

  const closeModal = () => {
    setSelectedRow(null);
  };

  if (!deviceId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
        {/* ... no device selected content remains the same ... */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/plc-data/live")}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:shadow"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Machine History
              </h1>
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                <span className="font-medium text-indigo-700">{deviceId}</span>
                <span>•</span>
                <span>{historyList.length} records</span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} className="animate-spin text-indigo-500" />
              <p className="text-gray-600">Loading history...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-rose-100 bg-white p-10 text-center shadow-xl">
            <p className="text-lg font-medium text-rose-700">
              {getAllPlcData.error?.response?.data?.message ||
                getAllPlcData.error?.message ||
                "Failed to load machine history"}
            </p>
          </div>
        ) : historyList.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-xl">
            <History size={56} className="mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-800">
              No history records yet
            </h3>
            <p className="mt-2 text-gray-600">
              This machine hasn't produced any logged events.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Timestamp
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Start Time
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Stop Time
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Product
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Production Count
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Parameters
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {historyList.map((row) => {
                    const status = (row.Status || "").toLowerCase();
                    const isRunning = status === "running";
                    const isStopped = status === "stopped";

                    return (
                      <tr
                        key={row._id}
                        className="hover:bg-indigo-50/40 transition-colors"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-900">
                          {formatDate(row.timestamp)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-800">
                          {formatDate(row.Start_time || row.start_time)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-800">
                          {row.Stop_time || row.stop_time
                            ? formatDate(row.Stop_time || row.stop_time)
                            : "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${
                              isRunning
                                ? "bg-emerald-100 text-emerald-800"
                                : isStopped
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {isRunning && (
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            )}
                            {isStopped && (
                              <span className="h-2 w-2 rounded-full bg-rose-500" />
                            )}
                            {row.Status || "Unknown"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-800">
                          {row.product || "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">
                          {row.production_count ?? "—"}
                          <span className="ml-1.5 text-xs font-normal text-gray-500">
                            pcs
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {row.parameters &&
                          Object.keys(row.parameters).length > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
                              {Object.entries(row.parameters)
                                .slice(0, 1)
                                .map(([key, value]) => (
                                  <span
                                    key={key}
                                    className="rounded bg-gray-100 px-2.5 py-1 text-xs"
                                  >
                                    {key}:{" "}
                                    <span className="font-medium">
                                      {String(value)}
                                    </span>
                                  </span>
                                ))}
                              {Object.keys(row.parameters).length > 1 && (
                                <button
                                  onClick={() => openParametersModal(row)}
                                  className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                                >
                                  View all ({Object.keys(row.parameters).length}
                                  )
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Parameters Modal */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  All Parameters — Record {formatDate(selectedRow.timestamp)}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(selectedRow.parameters).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {key}
                    </div>
                    <div className="mt-1 break-words text-sm font-medium text-gray-900">
                      {String(value)}
                    </div>
                  </div>
                ))}
              </div>

              {Object.keys(selectedRow.parameters).length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  No parameters available for this record
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-gray-200 px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

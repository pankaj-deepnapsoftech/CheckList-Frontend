import React, { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Pencil, X, OctagonAlert } from "lucide-react";
import { useAssemblyLineError } from "../hooks/useAssemblyLineError";

export default function AssemblyError() {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selected, setSelected] = useState(null);

  const { getAssemblyLineError } = useAssemblyLineError();

  const errorsRaw = getAssemblyLineError?.data;
  const errors = useMemo(() => {
    if (!errorsRaw) return [];
    return Array.isArray(errorsRaw) ? errorsRaw : [errorsRaw];
  }, [errorsRaw]);

  const formatDateShort = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    const day = d.toLocaleString("en-GB", { day: "2-digit" });
    const mon = d.toLocaleString("en-GB", { month: "short" });
    const yr = d.getFullYear();
    return `${day}-${mon}-${yr}`;
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-red-50 via-rose-50 to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
              <OctagonAlert className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Assembly Errors</h1>
              <p className="text-sm text-slate-500">Review and resolve inspection issues</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5">
            <p className="text-xs font-medium text-red-600">Open Errors</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {errors.filter((e) => e?.is_error).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5">
            <p className="text-xs font-medium text-emerald-600">Resolved</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">
              {errors.filter((e) => !e?.is_error).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-medium text-slate-600">Total Records</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{errors.length}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Error History</h3>
            <p className="text-sm text-slate-500">Inspection items with error status and audit info</p>
          </div>

          <div className="sm:hidden p-4 space-y-4">
            {errors.length === 0 && (
              <div className="text-center py-12 text-slate-500">No error records found</div>
            )}
            {errors.map((row) => (
              <div
                key={row?._id}
                className={`rounded-2xl border shadow-sm p-4 ${
                  row?.is_error ? "border-red-200 bg-red-50/50" : "border-emerald-200 bg-emerald-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm ${
                        row?.is_error ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                      }`}
                    >
                      {row?.is_error ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                      {row?.is_error ? "Error Found" : "No Error Found"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelected(row);
                      setOpenUpdate(true);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-xl transition-all"
                  >
                    <Pencil size={14} />
                    Update
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Info label="Item" value={row?.checkList?.item} />
                  <Info label="Method" value={row?.checkList?.check_list_method} />
                  <Info label="Time" value={row?.checkList?.check_list_time} />
                  <Info
                    label="Assembly"
                    value={`${row?.assembly?.assembly_name} (${row?.assembly?.assembly_number})`}
                  />
                  <Info
                    label="Process"
                    value={`${row?.process_id?.process_name} (${row?.process_id?.process_no})`}
                  />
                  <Info label="Result" value={row?.result} />
                  <Info label="Status" value={row?.status} />
                  <Info label="Created" value={formatDateShort(row?.createdAt)} />
                  <Info label="Updated" value={formatDateShort(row?.updatedAt)} />
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-slate-700">Description</div>
                  <div className={`text-sm ${row?.is_error ? "text-red-700" : "text-slate-600"}`}>
                    {row?.description || "—"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto hidden sm:block">
            <table className="min-w-full text-sm whitespace-nowrap">
              <thead className="bg-slate-100/80 sticky top-0 backdrop-blur-sm z-10">
                <tr>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Severity</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Item</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Method</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Time</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Assembly</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Process</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Result</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Description</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Status</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Created</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Updated</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left font-semibold text-slate-700 tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {errors.map((row) => (
                  <tr
                    key={row?._id}
                    className={`transition duration-200 group ${
                      row?.is_error ? "bg-red-50/40 hover:bg-red-50/70" : "bg-emerald-50/40 hover:bg-emerald-50/70"
                    }`}
                  >
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm ${
                          row?.is_error ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"
                        }`}
                      >
                        {row?.is_error ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                        {row?.is_error ? "Error" : "OK"}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="font-semibold text-slate-900">{row?.checkList?.item || "—"}</div>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{row?.checkList?.check_list_method || "—"}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{row?.checkList?.check_list_time || "—"}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      {(row?.assembly?.assembly_name || "—") + " / " + (row?.assembly?.assembly_number || "—")}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      {(row?.process_id?.process_name || "—") + " / " + (row?.process_id?.process_no || "—")}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{row?.result || "—"}</td>
                    <td className={`px-4 py-3 sm:px-6 sm:py-4 ${row?.is_error ? "text-red-700" : "text-slate-600"}`}>
                      {row?.description || "—"}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm bg-slate-50 text-slate-600 border-slate-200">
                        {row?.status || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{formatDateShort(row?.createdAt)}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{formatDateShort(row?.updatedAt)}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <button
                        onClick={() => {
                          setSelected(row);
                          setOpenUpdate(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-xl transition-all duration-200 shadow-sm"
                      >
                        <Pencil size={14} />
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
                {errors.length === 0 && (
                  <tr>
                    <td colSpan={12} className="text-center py-16 text-slate-500">
                      No error records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UpdateErrorModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        data={selected}
      />
    </div>
  );
}

function UpdateErrorModal({ open, onClose, data }) {
  const { updateAssemblyLineError } = useAssemblyLineError();

  if (!open || !data) return null;

  const isYesNo = data?.checkList?.result_type === "yesno";
  const [resultValue, setResultValue] = useState(
    isYesNo ? (data?.is_error ? "no" : "yes") : data?.result || ""
  );

  const submit = () => {
    const payload = {
      checkList: data?.checkList?._id,
      process_id: data?.process_id?._id,
      assembly: data?.assembly?._id,
      result: resultValue,
    };
    updateAssemblyLineError.mutate(
      { id: data?._id, data: payload },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl transition-transform duration-500">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">Update Error Result</h3>
            <p className="text-sm text-slate-500">Modify the evaluation for this record</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
            <X />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto h-[calc(100vh-160px)]">
          <Info label="Item" value={data?.checkList?.item} />
          <Info label="Method" value={data?.checkList?.check_list_method} />
          <Info label="Time" value={data?.checkList?.check_list_time} />
          <Info
            label="Assembly"
            value={`${data?.assembly?.assembly_name} (${data?.assembly?.assembly_number})`}
          />
          <Info
            label="Process"
            value={`${data?.process_id?.process_name} (${data?.process_id?.process_no})`}
          />

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Result</label>
            {isYesNo ? (
              <select
                value={resultValue}
                onChange={(e) => setResultValue(e.target.value)}
                className={`w-full appearance-none px-4 py-3 rounded-xl border bg-white font-medium text-slate-800 focus:outline-none focus:ring-4 transition-all duration-200 ${
                  resultValue === "yes"
                    ? "border-emerald-300 focus:ring-emerald-200"
                    : "border-red-300 focus:ring-red-200"
                }`}
              >
                <option value="">Select Result</option>
                <option value="yes">yes</option>
                <option value="no">no</option>
              </select>
            ) : (
              <input
                type="text"
                value={resultValue}
                onChange={(e) => setResultValue(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-white font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200"
                placeholder="Enter result"
              />
            )}
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={updateAssemblyLineError.isPending || !resultValue}
            className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {updateAssemblyLineError.isPending ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="font-medium">{label}</span>
      <span className="text-slate-600 text-right">{value || "—"}</span>
    </div>
  );
}

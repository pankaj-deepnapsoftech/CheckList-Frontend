import React, { useState } from "react";
import {
  X,
  Search,
  RefreshCw,
  Eye,
  Edit2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Refresh from "../components/Refresh/Refresh";
import Pagination from "../Components/Pagination/Pagination";
import {useCheckItemHistory} from "../hooks/useCheckItemHistory";
import ViewCheckItemHistoryModal from "../components/modal/addModal/ViewCheckItemHistoryModal";
import EditCheckItemHistoryModal from "../components/modal/addModal/EditCheckItemHistoryModal";



export default function CheckItemHistory({ open, onClose }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showRefresh, setShowRefresh] = useState(false);
  const { getCheckItemHistory, getAssemblyReportToday } = useCheckItemHistory();
  const [selected, setSelected] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

console.log(
  "This is my Today=====>>>>",
  getAssemblyReportToday?.data
);

  const filteredData = getAssemblyReportToday?.data;

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`absolute right-0 top-0 h-full w-full max-w-6xl bg-linear-to-br 
        from-slate-50 via-blue-50 to-indigo-100 shadow-2xl 
        transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-white/60 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Check Item History
            </h2>
            <p className="text-sm text-slate-500">
              Historical quality check records
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl cursor-pointer hover:bg-slate-100 transition"
          >
            <X />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search check items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-200 outline-none font-medium"
              />
            </div>

            <button
              onClick={async () => {
                setShowRefresh(true);
                await new Promise((r) => setTimeout(r, 1000));
                setShowRefresh(false);
              }}
              className="px-5 cursor-pointer py-3 rounded-2xl bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <RefreshCw size={18} /> Refresh
            </button>
          </div>
        </div>

        <div className="px-6 pb-10 overflow-y-auto h-[calc(100vh-220px)]">
          {showRefresh ? (
            <Refresh />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredData?.map((h) => (
                <div
                  key={h?._id}
                  className="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {console.log("This is my h", h?.process_id?.process_name)}
                  "This is my filter", h?.process_id?.process_name )
                  <div className="border-b border-slate-200 p-5 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500">
                        {/* {h?.assembly?.assembly_name} /{" "} */}
                        {h?.process_id?.process_name}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {h?.checkList?.item}
                      </h3>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1 ${
                        h.result === "Checked OK"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {h.result === "Checked OK" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                      {h.result}
                    </span>
                  </div>
                  <div className="p-5 space-y-4 text-sm text-slate-700">
                    {/* <p>
                      <strong>Method:</strong> {h?.checkList?.check_list_method}
                    </p>
                    <p>
                      <strong>Time:</strong> {h?.checkList?.check_list_time}
                    </p>
                    <p>
                      <strong>Checked By:</strong> {h.user_id.full_name} (
                      {h.user_id.user_id})
                    </p> */}
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(h.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="px-5 pb-5 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelected(h);
                        setViewOpen(true);
                      }}
                      className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center gap-1"
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      onClick={() => {
                        setSelected(h);
                        setEditOpen(true);
                      }}
                      className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t bg-white/70 backdrop-blur-xl">
          <Pagination page={page} setPage={setPage} />
        </div>

        <ViewCheckItemHistoryModal
          open={viewOpen}
          data={selected}
          onClose={() => setViewOpen(false)}
        />

        <EditCheckItemHistoryModal
          open={editOpen}
          data={selected}
          onClose={() => setEditOpen(false)}
        />
      </div>
    </div>
  );
}

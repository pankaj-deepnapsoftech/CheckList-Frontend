import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Download,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
} from "lucide-react";
import CheckItemHistoryModal from "./CheckItemHistory";
import { useCheckItemHistory } from "../hooks/useCheckItemHistory";
import { useAssemblyLine } from "../hooks/useAssemblyLine";
import Pagination from "../components/Pagination/Pagination";

export default function AssemblyLineStatus() {
  const [search, setSearch] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
const [assemblyLine, setAssemblyLine] = useState("ALL");
const [dateFilter, setDateFilter] = useState("TODAY");
const [statusFilter, setStatusFilter] = useState("ALL");
const [resultFilter, setResultFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [assemblyLine, dateFilter, statusFilter, resultFilter]);

  const DATE_OPTIONS = ["TODAY", "YESTERDAY", "THIS_WEEK", "THIS_MONTH"];
  const STATUS_OPTIONS = ["ALL", "CHECKED", "UN-CHECKED"];
  const RESULT_OPTIONS = ["ALL", "ERROR", "RESOLVED"];

  const {getAssemblyLineData} = useAssemblyLine();


  const { getAssemblyCardsData } = useCheckItemHistory();

  console.log(
    "this is my assembly",
    getAssemblyLineData?.data
  );

 
const assemblies = getAssemblyLineData?.data;

  const tableData = Array.isArray(assemblies)
    ? assemblies.map((item) => ({
        id: item?._id,
        assemblyNumber: item?.assembly_number || "—",
        assemblyName: item?.assembly_name || "—",
        companyName: item?.company_id?.company_name || "—",
        plantName: item?.plant_id?.plant_name || "—",

        // ❗ TEMP STATUS (API not ready yet)
        // TODO: replace this when backend provides status
        status: "UN-CHECKED",
      }))
    : [];

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTableData = tableData.slice(startIndex, endIndex);
  const hasNextPage = endIndex < tableData.length;



const cards = Array.isArray(assemblies)
  ? assemblies.map((item) => {
    const assembly = item;

    console.log("this is item",item)

    const process =
      Array.isArray(assembly?.process_id) && assembly.process_id.length > 0
        ? assembly.process_id[0]
        : {};

        {console.log("sdhgueq==========>>>>",assembly.process_id.length);}

    return {
      assemblyName: assembly?.assembly_name || "—",
      assemblyNumber: assembly?.assembly_number || "—",

      //  COMPANY
      companyName: assembly?.company_id?.company_name || "—",
      companyAddress: assembly?.company_id?.company_address || "—",

      // PLANT
      plantName: assembly?.plant_id?.plant_name || "—",
      plantAddress: assembly?.plant_id?.plant_address || "—",

      //  PROCESS
      processName: process?.process_name || "—",
      processNo: process?.process_no || "—",

      //  STATUS
      status: item?.is_error ? "Issue Found" : "Checked OK",
      compliance: item?.is_error ? 0 : 100,

      //  CHECKED BY
      responsible: assembly?.responsibility?.full_name || "—",
      responsibleId: assembly?.responsibility?.user_id || "—",

      items: [
        {
          label: item?.checkList?.item || "Checked OK",
          value: item?.result || "OK",
          status: item?.is_error ? "fail" : "pass",
        },
      ],
    };
  })
  : [];






  const getStatusIcon = (status) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "fail":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl text-black font-semibold">
              Assembly Line Status
            </h1>
            <p className="text-gray-500 text-sm">
              Real-time production line monitoring & compliance
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center cursor-pointer gap-2">
              <Plus size={20} />
              New Check
            </button>
            <button className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
              <Download size={20} />
              Export
            </button>
            <button
              onClick={() => setOpenHistory(true)}
              className="px-6 py-3 bg-linear-to-r from-red-400 to-red-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <History size={20} />
              History
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            {/* Assembly Line */}
            <FilterSelect
              label="Assembly Line"
              value={assemblyLine}
              onChange={setAssemblyLine}
              options={[
                "ALL",
                "001 / ASS1",
                "002 / ASS2",
                "003 / ASS3",
                "004 / ASS4",
              ]}
              width="min-w-[220px]"
            />

            {/* Date */}
            <FilterSelect
              label="Date"
              value={dateFilter}
              onChange={setDateFilter}
              options={["TODAY", "YESTERDAY", "THIS_WEEK", "THIS_MONTH"]}
              width="min-w-[180px]"
            />

            {/* Status */}
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={["ALL", "CHECKED", "UN-CHECKED"]}
              width="min-w-[180px]"
            />

            {/* Result */}
            <FilterSelect
              label="Result"
              value={resultFilter}
              onChange={setResultFilter}
              options={["ALL", "ERROR", "RESOLVED"]}
              width="min-w-[180px]"
            />

            {/* Reset */}
            <button
              onClick={() => {
                setAssemblyLine("ALL");
                setDateFilter("TODAY");
                setStatusFilter("ALL");
                setResultFilter("ALL");
                setPage(1);
              }}
              className="h-[42px] px-5 rounded-xl border border-slate-300 text-sm font-semibold
      text-slate-600 hover:bg-slate-100 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Total Assemblies
                </p>
                <p className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mt-1">
                  {getAssemblyCardsData?.data?.total_assemblies || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Checked</p>
                <p className="text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mt-1">
                  {getAssemblyCardsData?.data?.total_checked || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />.
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Unchecked</p>
                <p className="text-3xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-1">
                  {getAssemblyCardsData?.data?.total_unchecked}
                </p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Errors</p>
                <p className="text-3xl font-bold bg-linear-to-r from-red-600 to-red-700 bg-clip-text text-transparent mt-1">
                  {getAssemblyCardsData?.data?.total_errors || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Assembly Line Overview
            </h3>
            <p className="text-sm text-slate-500">
              Assembly, company, plant & current inspection status
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100/80 sticky top-0 backdrop-blur-sm z-10">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700 tracking-wide">Assembly</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700 tracking-wide">Company</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700 tracking-wide hidden md:table-cell">Plant</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700 tracking-wide">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-700 tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentTableData.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/50 transition duration-200 group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {row.assemblyNumber} / {row.assemblyName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{row.companyName}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-slate-900">{row.plantName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm ${
                          row.status === "CHECKED"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }`}
                      >
                        {row.status === "CHECKED" ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <AlertCircle size={14} />
                        )}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setOpenHistory(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <History size={14} />
                        History
                      </button>
                    </td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                            <Search className="w-8 h-8 text-slate-400" />
                         </div>
                         <p className="text-lg font-medium text-slate-600">No assembly data found</p>
                         <p className="text-sm text-slate-400">Try adjusting your filters or search query</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        {tableData.length > 0 && (
          <div >
            <Pagination page={page} setPage={setPage} hasNextpage={hasNextPage} />
          </div>
        )}
      </div>
      <CheckItemHistoryModal
        open={openHistory}
        onClose={() => setOpenHistory(false)}
      />

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

function Metric({ label, value, danger }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`text-lg font-bold ${
          danger ? "text-red-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}



function FilterSelect({ label, value, onChange, options, width }) {
  return (
    <div className={`flex flex-col gap-1 ${width}`}>
      <label className="text-xs font-medium text-slate-500">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e?.target?.value)}
        className="h-[42px] px-4 rounded-xl border border-slate-300 bg-white
        text-sm font-medium text-slate-800
        focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
      >
        {options?.map((opt) => (
          <option key={opt} value={opt}>
            {opt?.replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}

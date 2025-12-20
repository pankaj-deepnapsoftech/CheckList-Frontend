import React, { useState } from "react";
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

export default function AssemblyLineStatus() {
  const [search, setSearch] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const { getAssemblyReportToday } = useCheckItemHistory();

  console.log("this is my assembly today", getAssemblyReportToday?.data);

const assemblies = getAssemblyReportToday?.data

console.log("This is my all data======>>>>>", assemblies)

const cards = Array.isArray(assemblies)
  ? assemblies.map((item) => {
      const assembly = item;

      // console.log("this is item",item)

      const process =
        Array.isArray(assembly?.process_id) && assembly.process_id.length > 0
          ? assembly.process_id[0]
          : {};

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
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 lg:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
            {/* Assembly Line Select */}
            <div className="relative group">
              <select className="appearance-none bg-linear-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl px-5 py-3 text-lg font-semibold text-slate-800 w-full lg:w-72 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400">
                <option>001 / ASS1</option>
                <option>002 / ASS2</option>
                <option>003 / ASS3</option>
                <option>004 / ASS4</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors w-4 h-4 pointer-events-none" />
            </div>

            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-md group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors w-5 h-5"
                size={20}
              />
              <input
                className="w-full pl-14 pr-5 py-3 bg-linear-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl text-lg font-medium text-slate-800 shadow-sm hover:shadow-md focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 placeholder-slate-400"
                placeholder="Search processes, parameters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all duration-200 hover:scale-105">
                <RefreshCw size={20} className="animate-spin-slow" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all duration-200 hover:scale-105 flex items-center gap-1"
                >
                  <SlidersHorizontal size={20} />
                  {isFiltersOpen && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      3
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Total Lines
                </p>
                <p className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mt-1">
                  4
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
                  2
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
                <p className="text-3xl font-bold bg-linear-to-r from-red-600 to-red-700 bg-clip-text text-transparent mt-1">
                  2
                </p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">Compliance</p>
                <p className="text-3xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-1">
                  76%
                </p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group bg-white border border-slate-200 rounded-2xl shadow-sm
    hover:shadow-lg transition-all duration-300"
            >
              {/* ================= HEADER ================= */}
              <div className="border-b border-slate-200 p-5 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-500">
                    {card?.assemblyNumber} / {card?.assemblyName}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {card?.processName}
                    <span className="text-sm text-slate-400 ml-1">
                      ({card?.processNo})
                    </span>
                  </h3>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${
                    card?.status === "Checked"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {card?.status}
                </span>
              </div>

              {/* ================= COMPANY + PLANT ================= */}
              <div className="p-5 space-y-3 text-sm text-slate-700">
                <p>
                  <strong>Company:</strong> {card?.companyName}
                </p>
                <p>
                  <strong>Company Address:</strong> {card?.companyAddress}
                </p>
                <p>
                  <strong>Plant:</strong> {card?.plantName}
                </p>
                <p>
                  <strong>Plant Address:</strong> {card?.plantAddress}
                </p>
              </div>

              {/* ================= CHECKLIST PREVIEW ================= */}
              <div className="px-5 pb-4 space-y-2">
                {card.items?.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm
          bg-slate-50 border border-slate-200 rounded-xl px-4 py-2"
                  >
                    <span className="text-slate-700">{item?.label}</span>
                    <span
                      className={`font-semibold ${
                        item?.status === "fail"
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {item?.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* ================= FOOTER ================= */}
              <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
                Checked by {card?.responsible} ({card?.responsibleId})
              </div>
            </div>
          ))}
        </div>
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

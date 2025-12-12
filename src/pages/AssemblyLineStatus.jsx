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
} from "lucide-react";

export default function AssemblyLineStatus() {
  const [search, setSearch] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const cards = [
    {
      line: "001 / ASS1",
      title: "PCB Depaneling",
      status: "Checked",
      items: [
        {
          label: "Air Pressure Should be 5-6 kg/cm²",
          value: "9kg",
          status: "fail",
        },
        { label: "No water in FR unit", value: "No", status: "pass" },
        { label: "Operator ESD equipment", value: "Okay", status: "pass" },
        { label: "ESD meter check", value: "0/2", status: "fail" },
      ],
    },
    {
      line: "001 / ASS1",
      title: "Print Plate Soldering / 1000 A",
      status: "Unchecked",
      items: [
        { label: "Soldering tip 370°C-390°C", value: "450°C", status: "fail" },
        { label: "RX-80HRT-1.6D bit used", value: "Yes", status: "pass" },
        { label: "Bit condition OK", value: "Okay", status: "pass" },
        { label: "Lead free solder 18 SWG", value: "Yes", status: "pass" },
        { label: "No gap after soldering", value: "Okay", status: "pass" },
        { label: "Operator ESD equipment", value: "Okay", status: "pass" },
        { label: "ESD meter check", value: "0/2", status: "fail" },
      ],
    },
    {
      line: "001 / ASS1",
      title: "Print Plate Soldering / 1000 B",
      status: "Checked",
      items: [
        { label: "Soldering tip 370°C-390°C", value: "450°C", status: "fail" },
        { label: "RX-80HRT-1.6D bit used", value: "Yes", status: "pass" },
        { label: "Bit condition OK", value: "Okay", status: "pass" },
        { label: "Lead free solder 18 SWG", value: "Yes", status: "pass" },
        { label: "No gap after soldering", value: "Okay", status: "pass" },
      ],
    },
    {
      line: "001 / ASS1",
      title: "Case & Slider Greasing / 2000",
      status: "Unchecked",
      items: [
        { label: "FLOIL G-347CA not expired", value: "Yes", status: "pass" },
        { label: "Slider greased properly", value: "Okay", status: "pass" },
        { label: "Case bush greased", value: "Okay", status: "pass" },
        { label: "ESD meter check", value: "0/2", status: "fail" },
      ],
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl text-black font-semibold">
              Assembly Line Status
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Real-time production line monitoring & compliance
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
              <Plus size={20} />
              New Check
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
              <Download size={20} />
              Export
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 lg:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
            {/* Assembly Line Select */}
            <div className="relative group">
              <select className="appearance-none bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl px-5 py-3 text-lg font-semibold text-slate-800 w-full lg:w-72 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400">
                <option>001 / ASS1</option>
                <option>002 / ASS2</option>
                <option>003 / ASS3</option>
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
                className="w-full pl-14 pr-5 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl text-lg font-medium text-slate-800 shadow-sm hover:shadow-md focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 placeholder-slate-400"
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
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mt-1">
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
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mt-1">
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
                <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mt-1">
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
                <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-1">
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
          {cards
            .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
            .map((card, index) => (
              <div
                key={index}
                className="group bg-white border border-slate-200 rounded-2xl shadow-sm 
  hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Card Body */}
                <div className="flex flex-col justify-between flex-1">
                  {/* Header */}
                  <div className="border-b border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className="text-[11px] font-semibold text-slate-500 tracking-wide 
        bg-slate-100 px-2.5 py-1 rounded-full"
                      >
                        {card.line}
                      </span>

                      <button
                        className="text-sm text-slate-600 hover:text-black 
          px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 
          transition-colors flex items-center gap-1"
                      >
                        View
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900 leading-snug">
                      {card.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-5 flex-1">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Overall Status
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                          card.status === "Checked"
                            ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                            : "text-red-600 border-red-200 bg-red-50"
                        }`}
                      >
                        {card.status}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {card.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3.5
            bg-slate-50 rounded-xl border border-slate-200 hover:bg-white 
            hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-1.5 rounded-lg border ${
                                item.status === "pass"
                                  ? "bg-emerald-50 border-emerald-200"
                                  : item.status === "fail"
                                  ? "bg-red-50 border-red-200"
                                  : "bg-amber-50 border-amber-200"
                              }`}
                            >
                              {getStatusIcon(item.status)}
                            </div>

                            <p className="text-sm text-slate-800">
                              {item.label}
                            </p>
                          </div>

                          <span
                            className="px-3 py-1.5 bg-white border border-slate-200 
            rounded-lg text-sm font-medium text-slate-900 min-w-[70px] 
            text-center"
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FOOTER ALWAYS AT BOTTOM */}
                <div className="px-6 pb-6 pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Compliance Score</span>
                    <span className="font-semibold text-slate-900">78%</span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-700 h-1.5 rounded-full w-[78%]"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

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

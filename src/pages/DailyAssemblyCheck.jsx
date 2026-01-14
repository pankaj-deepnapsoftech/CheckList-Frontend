import React from "react";
import { Database, CheckCircle2, AlertCircle } from "lucide-react";

const DailyCheckAssembly = () => {
  // 🔹 UI-only mock data (empty = no data, add items = show data)
  const checklistData = [1, 2, 3]; 
  // const checklistData = []; // uncomment to see "No Data"

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-4 space-y-4">

        {/* ================= HEADER ================= */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Daily Check – Assembly
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Daily quality verification checklist for assembly lines
          </p>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
              <option>Select Assembly</option>
            </select>

            <select className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
              <option>Select Process</option>
            </select>

            <input
              type="date"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            />
          </div>
        </div>

        {/* ================= DATA / EMPTY ================= */}
        {checklistData.length === 0 ? (
          /* ---------- EMPTY STATE ---------- */
          <div className="flex justify-center mt-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-8 text-center max-w-xl w-full">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 mx-auto">
                <Database className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800">
                No Data Available
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Select assembly and date to view daily check items.
              </p>
            </div>
          </div>
        ) : (
          /* ---------- DATA UI ---------- */
          <>
            <div className="rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden">

              {/* Assembly Header */}
              <div className="bg-blue-500 p-6 text-white">
                <h2 className="text-2xl font-bold">
                  Assembly Name
                  <span className="ml-2 text-blue-200 text-lg">
                    (ASM-001)
                  </span>
                </h2>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    Process A
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    Process B
                  </span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-slate-50">
                {["Company", "Plant", "Responsible"].map((label, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                  >
                    <p className="text-xs text-slate-500 font-medium">
                      {label}
                    </p>
                    <p className="font-semibold text-slate-800 text-lg">
                      Sample Data
                    </p>
                    {label === "Responsible" && (
                      <p className="text-xs text-slate-400">
                        user@email.com
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Checklist */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-700 mb-5">
                  Daily Checklist Items
                </h3>

                <div className="space-y-4">
                  {checklistData.map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center
                                 rounded-xl border border-gray-200 bg-slate-50 p-4"
                    >
                      <div className="sm:col-span-2">
                        <p className="font-semibold text-slate-800">
                          {index + 1}. Check Item Name
                        </p>
                        <p className="text-xs text-blue-600">
                          Method: Visual
                        </p>
                      </div>

                      <div className="text-sm text-slate-500">
                        ⏱ 2 min
                      </div>

                      <div className="sm:col-span-2 flex gap-2">
                        <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          OK
                        </button>

                        <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-medium">
                          <AlertCircle className="w-4 h-4" />
                          Issue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition">
                Submit Daily Check
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DailyCheckAssembly;

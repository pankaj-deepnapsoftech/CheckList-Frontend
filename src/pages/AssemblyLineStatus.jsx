import React, { useState } from "react";
import { Search, Plus, RefreshCw, Download, SlidersHorizontal } from "lucide-react";

export default function AssemblyLineStatus() {
  const [search, setSearch] = useState("");

  const cards = [
    {
      line: "001 / ASS1",
      title: "PCB Depaneling",
      status: "Checked",
      items: [
        { label: "Air Pressure Should be 5-6 kg/cm2", value: "9kg" },
        { label: "There should be no water in FR unit", value: "No" },
        { label: "Operator should wear ESD appratus/Equipment", value: "Okay" },
        { label: "ESD should be checked with ESD meter", value: "0/2" },
      ],
    },
    {
      line: "001 / ASS1",
      title: "Print Plate Soldering / 1000 A",
      status: "Unchecked",
      items: [
        { label: "Soldering bit tip temperature should be 370°C - 390°C", value: "450°C" },
        { label: "Soldering iron bit type RX-80HRT-1.6D should be used", value: "Yes" },
        { label: "Soldering iron bit condition should be OK", value: "Okay" },
        { label: "Solder wire lead free 18 SWG Ø1.0mm (Grade 60/40) should be used", value: "Yes" },
        { label: "There should be no gap in between Terminal & Print plate after soldering", value: "Okay" },
        { label: "Operator should wear ESD appratus/Equipment", value: "Okay" },
        { label: "ESD should be checked with ESD meter", value: "0/2" },
      ],
    },
    {
      line: "001 / ASS1",
      title: "Print Plate Soldering / 1000 B",
      status: "Checked",
      items: [
        { label: "Soldering bit tip temperature should be 370°C - 390°C", value: "450°C" },
        { label: "Soldering iron bit type RX-80HRT-1.6D should be used", value: "Yes" },
        { label: "Soldering iron bit condition should be OK", value: "Okay" },
        { label: "Solder wire lead free 18 SWG Ø1.0mm (Grade 60/40) should be used", value: "Yes" },
        { label: "There should be no gap in between Terminal & Print plate after soldering", value: "Okay" },
      ],
    },
    {
      line: "001 / ASS1",
      title: "Case & Slider Greasing / 2000",
      status: "Unchecked",
      items: [
        { label: "Grease type FLOIL G-347CA should not be expired", value: "Yes" },
        { label: "Slider should be greased properly", value: "Okay" },
        { label: "Case bush should be greased properly", value: "Okay" },
        { label: "ESD should be checked with ESD meter", value: "0/2" },
      ],
    },
  ];

  return (
    <div className="p-8 space-y-8">

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900">Assembly Line Status</h1>

      {/* Search row */}
      <div className="flex flex-col md:flex-row items-center gap-4">

        {/* Select Assembly Line (Dummy input) */}
        <div className="border rounded-xl px-4 py-2 bg-white w-full md:w-64 text-gray-700 font-medium">
          Select Assembly Line
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full md:w-80 bg-white border rounded-xl px-4 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            className="outline-none ml-2 w-full"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <SlidersHorizontal size={20} className="text-gray-700 cursor-pointer" />
          <Plus size={20} className="text-gray-700 cursor-pointer" />
          <RefreshCw size={20} className="text-gray-700 cursor-pointer" />
          <Download size={20} className="text-gray-700 cursor-pointer" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards
          .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
          .map((card, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="text-gray-500 text-sm">
                  Assembly No. / Assembly Name
                </div>
                <button className="text-green-600 text-sm font-medium hover:underline">
                  View Detail
                </button>
              </div>

              {/* Line Name */}
              <p className="text-lg font-semibold text-gray-900 mt-1">{card.line}</p>

              {/* Title */}
              <p className="text-2xl font-semibold mt-3">{card.title}</p>

              {/* Status + Items */}
              <div className="mt-4 space-y-3">

                {/* Status Row */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      card.status === "Checked"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {card.status}
                  </span>
                </div>

                {card.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-gray-700"
                  >
                    <p className="text-sm">{item.label}</p>

                    <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs border border-gray-300">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

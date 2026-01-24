import React, { useMemo, useState } from "react";
import { Search, Loader2, Eye } from "lucide-react";
import { useTemplateMaster } from "../hooks/Template Hooks/useTemplateMaster";
import { X,  FileText, MapPin, Clock } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "re-assign", label: "Re-assign" },
  { value: "completed", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

function formatStatusDisplay(raw) {
  const map = {
    pending: "Pending",
    "in-progress": "In Progress",
    "re-assign": "Re-assign",
    completed: "Approved",
    rejected: "Rejected",
  };
  return map[raw] || raw || "—";
}

function getStatusBadge(status) {
  switch (status) {
    case "completed":
    case "Approved":
      return "bg-green-100 text-green-800";
    case "rejected":
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "re-assign":
    case "Re-assign":
      return "bg-orange-100 text-orange-800";
    case "in-progress":
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "pending":
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

const getDummyTimelineForTemplate = (templateName) => [
  {
    id: 1,
    type: "Logged In",
    letter: "L",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    time: "Yesterday 10:49 AM",
    detail:  "Template",
    subDetail: "Deepnap Softech",
    hasNotes: true,
  },
  {
    id: 2,
    type: "Waiting",
    letter: "W",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    time: "Yesterday 01:46 PM",
    detail: "Waiting - 2hrs 56m",
    address: "4A, HSIDC, Sector 31, Faridabad, Haryana 121003, India",
    timeRange: "(Yesterday 10:49 AM - Yesterday 01:46 PM)",
  },
  {
    id: 3,
    type: "Waiting",
    letter: "W",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    time: "Yesterday 02:38 PM",
    detail: "Waiting - 23 mins",
    address:
      "88JX+99W, IMT Main Rd, Sector 69, Faridabad, Haryana 121004, India",
    timeRange: "(Yesterday 02:15 PM - Yesterday 02:38 PM)",
  },
  {
    id: 4,
    type: "Waiting",
    letter: "W",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    time: "Yesterday 02:45 PM",
    detail: "Waiting - 5 mins",
    address: "62, Sector 59, Faridabad, Haryana 121004, India",
    timeRange: "(Yesterday 02:40 PM - Yesterday 02:45 PM)",
  },
  {
    id: 5,
    type: "Checked In",
    letter: "C",
    color: "bg-sky-500",
    textColor: "text-sky-600",
    time: "Yesterday 03:02 PM",
    detail: "Checked In",
    address:
      "11/12 Chawla Colony, Ballabhgarh, Faridabad, Haryana 121004, India",
    hasNotes: true,
    hasInfo: true,
  },
  {
    id: 6,
    type: "Checked Out",
    letter: "C",
    color: "bg-sky-500",
    textColor: "text-sky-600",
    time: "Yesterday 03:07 PM",
    detail: "Checked Out",
    address:
      "11/12 Chawla Colony, Ballabhgarh, Faridabad, Haryana 121004, India",
  },
];


function TimelineViewModal({ isOpen, onClose, templateName }) {
  if (!isOpen) return null;

  const timeline = getDummyTimelineForTemplate(templateName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`
          relative w-full max-w-3xl max-h-[92vh] 
          rounded-2xl border border-white/20 
          bg-white/80 backdrop-blur-xl shadow-2xl
          transition-all duration-300 scale-100 opacity-100
          flex flex-col overflow-hidden
        `}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200/50 bg-white/90 backdrop-blur-md px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Activity Timeline
            </h2>
            <p className="text-sm text-gray-600 mt-0.5 font-medium">
              {templateName || "Selected Template"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100/80 hover:text-gray-700 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="relative pl-10">
            {timeline.map((event, index) => {
              const isFirst = index === 0;

              return (
                <div
                  key={event.id}
                  className="relative flex gap-6 pb-10 last:pb-0 group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 w-10 h-10 flex items-center justify-center -translate-x-1/2 z-10">
                    <div
                      className={`w-4 h-4 rounded-full ${event.color} ring-4 ring-white shadow-md group-hover:ring-blue-100 transition-all duration-300`}
                    />
                  </div>

                  {/* Colored Connecting Line (from previous dot to this one) */}
                  {!isFirst && (
                    <div
                      className="absolute left-[18px] top-[-40px] bottom-[-40px] w-1 z-0"
                      style={{
                        background: `linear-gradient(to bottom, ${event.color.replace("bg-", "")}cc, ${event.color.replace("bg-", "")}40)`,
                      }}
                    />
                  )}

                  {/* Time Label */}
                  <div className="w-28 flex-shrink-0 text-right pt-1.5">
                    <p className="text-xs font-medium text-gray-500">
                      {event.time.split(" ")[0]}
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {event.time.split(" ").slice(1).join(" ")}
                    </p>
                  </div>

                  {/* Event Card */}
                  <div
                    className={`
                      flex-1 rounded-xl border border-gray-200/60 
                      bg-white/70 backdrop-blur-sm shadow-sm 
                      p-4 transition-all duration-300
                      group-hover:shadow-md group-hover:-translate-y-0.5
                      group-hover:border-blue-200/50
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${event.color} text-white font-bold shadow-sm`}
                        >
                          {event.letter}
                        </div>
                        <div>
                          <span className={`font-semibold ${event.textColor}`}>
                            {event.detail}
                          </span>
                          {event.subDetail && (
                            <p className="text-sm text-gray-600 mt-0.5">
                              {event.subDetail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {event.address && (
                      <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                        <MapPin
                          size={16}
                          className="mt-0.5 flex-shrink-0 text-gray-500"
                        />
                        <span>{event.address}</span>
                      </div>
                    )}

                    {event.timeRange && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock size={14} />
                        <span>{event.timeRange}</span>
                      </div>
                    )}

                    {event.hasNotes && (
                      <button className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                        <FileText size={14} />
                        View Notes
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}









export default function TemplateStatus() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { templateStatusListQuery } = useTemplateMaster("");
  const statusList = templateStatusListQuery.data || [];

  const filteredData = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    const st = (statusFilter || "").trim();
    return statusList.filter((r) => {
      const matchStatus = !st || (r.status || "").toLowerCase() === st.toLowerCase();
      if (!matchStatus) return false;
      if (!q) return true;
      const searchable = [
        r.template_name,
        r.template_type,
        r.status,
        formatStatusDisplay(r.status),
        r.workflow_name,
        r.user_name,
        r.employee_user_id,
        r.email,
      ]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase());
      return searchable.some((s) => s.includes(q));
    });
  }, [statusList, searchQuery, statusFilter]);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Template Status
          </h1>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by template, type, status, user, user ID, email, workflow..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[160px] rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {(searchQuery || statusFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("");
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {templateStatusListQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : templateStatusListQuery.isError ? (
            <div className="px-6 py-8 text-center text-sm text-red-600">
              {templateStatusListQuery.error?.response?.data?.message ||
                templateStatusListQuery.error?.message ||
                "Failed to load template status."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Template Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Assigned User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No records found. Try different search or status filter.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((r) => (
                      <tr
                        key={`${r.template_id}-${r.user_id}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {r.template_name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            {r.template_type || "—"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {r.user_name || "—"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {r.employee_user_id || "—"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {r.email || "—"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-lg px-2 py-1.5 text-xs font-medium ${getStatusBadge(r.status)}`}
                          >
                            {formatStatusDisplay(r.status || "pending")}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md active:scale-95"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <TimelineViewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                // templateName={templateName}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

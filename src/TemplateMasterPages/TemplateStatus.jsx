import React, { useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useTemplateMaster } from "../hooks/Template Hooks/useTemplateMaster";

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

export default function TemplateStatus() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
          <h1 className="text-2xl font-semibold text-gray-900">Template Status</h1>
          <p className="mt-1 text-sm text-gray-500">
            Har assigned user ka status (assigned_users ke andar wala status)
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                        No records found. Try different search or status filter.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((r) => (
                      <tr key={`${r.template_id}-${r.user_id}`} className="hover:bg-gray-50">
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

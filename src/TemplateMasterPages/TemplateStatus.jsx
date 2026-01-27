import React, { useMemo, useState } from "react";
import { Search, Loader2, Eye, X } from "lucide-react";
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
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
    case "Rejected":
    case "reject":
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

function getWorkflowStatusLabel(status) {
  if (!status) return "Pending";
  const s = String(status).toLowerCase();
  if (s === "approved") return "Approved";
  if (s === "reject") return "Rejected";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function WorkflowStatusViewModal({
  isOpen,
  onClose,
  templateName,
  workflowName,
  chain = [],
  isLoading,
  isError,
  errorMessage,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`
          relative w-full max-w-3xl max-h-[92vh]
          rounded-2xl border border-white/20
          bg-white/80 backdrop-blur-xl shadow-2xl
          transition-all duration-300 scale-100 opacity-100
          flex flex-col overflow-hidden
        `}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200/50 bg-white/90 backdrop-blur-md px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Workflow Status
            </h2>
            <p className="text-sm text-gray-600 mt-0.5 font-medium">
              {templateName || "Selected Template"}
              {workflowName ? ` · ${workflowName}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100/80 hover:text-gray-700 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
              <Loader2 size={24} className="animate-spin" />
              <span>Loading workflow status…</span>
            </div>
          )}
          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              {errorMessage || "Failed to load workflow status."}
            </div>
          )}
          {!isLoading && !isError && (!chain || chain.length === 0) && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600">
              No workflow assigned or no approval steps defined.
            </div>
          )}
          {!isLoading && !isError && chain && chain.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {chain.map((item, index) => (
                <React.Fragment key={item.stage_index ?? index}>
                  {index > 0 && (
                    <span className="text-gray-400 font-medium select-none" aria-hidden>
                      →
                    </span>
                  )}
                  <div
                    className={`
                      inline-flex flex-col gap-1 rounded-xl border border-gray-200/60
                      bg-white shadow-sm px-4 py-3 min-w-[120px]
                      ${item.type === "HOD" ? "ring-1 ring-blue-200/60" : ""}
                    `}
                  >
                    <span
                      className={`text-xs font-medium uppercase tracking-wider ${
                        item.type === "HOD" ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      {item.type === "HOD" ? "HOD" : "User"}
                    </span>
                    <span className="font-semibold text-gray-900 truncate max-w-[160px]" title={item.label}>
                      {item.label || "—"}
                    </span>
                    <span
                      className={`inline-flex w-fit rounded-lg px-2 py-1 text-xs font-medium ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {getWorkflowStatusLabel(item.status)}
                    </span>
                    {item.approved_at && (
                      <span className="text-xs text-gray-500">
                        {new Date(item.approved_at).toLocaleString()}
                      </span>
                    )}
                    {item.remarks && (
                      <p className="text-xs text-gray-600 mt-1 border-t border-gray-100 pt-1" title={item.remarks}>
                        {item.remarks.length > 40 ? `${item.remarks.slice(0, 40)}…` : item.remarks}
                      </p>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}









export default function TemplateStatus() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { templateStatusListQuery, workflowStatusQuery } = useTemplateMaster(
    "",
    selectedRow?.template_id ?? null
  );
  const statusList = templateStatusListQuery.data || [];
  const workflowData = workflowStatusQuery.data;

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
                            onClick={() => {
                              setSelectedRow(r);
                              setIsModalOpen(true);
                            }}
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

              <WorkflowStatusViewModal
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedRow(null);
                }}
                templateName={selectedRow?.template_name}
                workflowName={workflowData?.workflow_name}
                chain={workflowData?.chain}
                isLoading={workflowStatusQuery.isLoading}
                isError={workflowStatusQuery.isError}
                errorMessage={
                  workflowStatusQuery.error?.response?.data?.message ||
                  workflowStatusQuery.error?.message
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

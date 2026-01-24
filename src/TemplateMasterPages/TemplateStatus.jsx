import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

export default function TemplateStatus() {
  // Dummy data for template statuses
  const [statusData] = useState([
    {
      id: 1,
      template_name: "Quality Inspection Form",
      template_type: "NEW",
      status: "Approved",
      submitted_by: "John Doe",
      submitted_date: "2026-01-20",
      approved_by: "Admin User",
      approved_date: "2026-01-21",
      remarks: "All fields verified and approved",
    },
    {
      id: 2,
      template_name: "Safety Checklist",
      template_type: "AMENDMENT",
      status: "Pending",
      submitted_by: "Jane Smith",
      submitted_date: "2026-01-22",
      approved_by: "-",
      approved_date: "-",
      remarks: "Awaiting review",
    },
    {
      id: 3,
      template_name: "Production Report",
      template_type: "NEW",
      status: "Rejected",
      submitted_by: "Mike Johnson",
      submitted_date: "2026-01-19",
      approved_by: "Admin User",
      approved_date: "2026-01-20",
      remarks: "Missing mandatory fields",
    },
    {
      id: 4,
      template_name: "Maintenance Log",
      template_type: "AMENDMENT",
      status: "Pending",
      submitted_by: "Sarah Williams",
      submitted_date: "2026-01-23",
      approved_by: "-",
      approved_date: "-",
      remarks: "Under review",
    },
    {
      id: 5,
      template_name: "Compliance Form",
      template_type: "NEW",
      status: "Approved",
      submitted_by: "David Brown",
      submitted_date: "2026-01-18",
      approved_by: "Admin User",
      approved_date: "2026-01-19",
      remarks: "Compliant with standards",
    },
    {
      id: 6,
      template_name: "Audit Checklist",
      template_type: "NEW",
      status: "Rejected",
      submitted_by: "Emily Davis",
      submitted_date: "2026-01-21",
      approved_by: "Admin User",
      approved_date: "2026-01-22",
      remarks: "Incomplete documentation",
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 size={18} className="text-green-600" />;
      case "Rejected":
        return <XCircle size={18} className="text-red-600" />;
      case "Pending":
        return <Clock size={18} className="text-yellow-600" />;
      default:
        return <AlertCircle size={18} className="text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Template Status
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and track the status of all template submissions
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Submitted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Approved By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Approved Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {statusData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {item.template_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {item.template_type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {item.submitted_by}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {item.submitted_date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {item.approved_by}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {item.approved_date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

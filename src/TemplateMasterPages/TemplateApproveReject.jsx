import React, { useState } from "react";
import { CheckCircle2, XCircle, Eye, Search, X } from "lucide-react";

export default function TemplateApproveReject() {
  // Dummy data for pending templates
  const [templates] = useState([
    {
      id: 1,
      template_name: "Quality Inspection Form",
      template_type: "NEW",
      submitted_by: "John Doe",
      submitted_date: "2026-01-22",
      fields_count: 8,
      description: "Form for quality inspection of products",
    },
    {
      id: 2,
      template_name: "Safety Checklist",
      template_type: "AMENDMENT",
      submitted_by: "Jane Smith",
      submitted_date: "2026-01-23",
      fields_count: 12,
      description: "Updated safety checklist with new requirements",
    },
    {
      id: 3,
      template_name: "Production Report",
      template_type: "NEW",
      submitted_by: "Mike Johnson",
      submitted_date: "2026-01-23",
      fields_count: 15,
      description: "Daily production reporting template",
    },
    {
      id: 4,
      template_name: "Maintenance Log",
      template_type: "AMENDMENT",
      submitted_by: "Sarah Williams",
      submitted_date: "2026-01-24",
      fields_count: 10,
      description: "Equipment maintenance tracking form",
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredTemplates = templates.filter((template) =>
    template.template_name.toLowerCase().includes(searchText.toLowerCase()) ||
    template.submitted_by.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleApprove = (templateId) => {
    alert(`Template "${templates.find((t) => t.id === templateId)?.template_name}" has been approved!`);
    // In real implementation, this would call an API
  };

  const handleReject = (templateId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      alert(`Template "${templates.find((t) => t.id === templateId)?.template_name}" has been rejected.\nReason: ${reason}`);
      // In real implementation, this would call an API
    }
  };

  const openViewModal = (template) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Template Approval
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve or reject template submissions
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by template name or submitted by..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-10 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {template.template_name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {template.template_type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {template.fields_count} fields
                  </span>
                </div>
              </div>

              <div className="mb-4 space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Submitted By:</span>{" "}
                  {template.submitted_by}
                </div>
                <div>
                  <span className="font-medium">Date:</span>{" "}
                  {template.submitted_date}
                </div>
                {template.description && (
                  <div className="mt-2 text-xs text-gray-500">
                    {template.description}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openViewModal(template)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => handleApprove(template.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  <CheckCircle2 size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(template.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No templates found</p>
          </div>
        )}

        {/* View Modal */}
        {isViewModalOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedTemplate.template_name}
                </h2>
                <button
                  onClick={closeViewModal}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Template Type:
                    </span>{" "}
                    <span className="text-sm text-gray-900">
                      {selectedTemplate.template_type}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Submitted By:
                    </span>{" "}
                    <span className="text-sm text-gray-900">
                      {selectedTemplate.submitted_by}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Submitted Date:
                    </span>{" "}
                    <span className="text-sm text-gray-900">
                      {selectedTemplate.submitted_date}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Total Fields:
                    </span>{" "}
                    <span className="text-sm text-gray-900">
                      {selectedTemplate.fields_count}
                    </span>
                  </div>
                  {selectedTemplate.description && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Description:
                      </span>{" "}
                      <span className="text-sm text-gray-900">
                        {selectedTemplate.description}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-4">
                  <button
                    onClick={closeViewModal}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedTemplate.id);
                      closeViewModal();
                    }}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedTemplate.id);
                      closeViewModal();
                    }}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

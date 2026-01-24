import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { X, Eye, FileText, MapPin, Loader2, Sparkles } from "lucide-react";

// Demo card – hamesha dikhega, View pe timeline (image jaisa) open hoga
const DEMO_CARD = {
  _id: "demo",
  template_name: "Demo Template (Activity Timeline)",
  template_type: "DEMO",
  isDemo: true,
};

// Dummy timeline events (adapt when backend has template history API)
const getDummyTimelineForTemplate = (templateName) => [
  {
    id: 1,
    type: "Logged In",
    letter: "L",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    time: "Yesterday 10:49 AM",
    detail: templateName || "Template",
    subDetail: "Deepnap Softech",
    hasNotes: true,
    badge: "89%",
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
    address: "88JX+99W, IMT Main Rd, Sector 69, Faridabad, Haryana 121004, India",
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
    address: "11/12 Chawla Colony, Ballabhgarh, Faridabad, Haryana 121004, India",
    hasNotes: true,
    badge: "58%",
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
    address: "11/12 Chawla Colony, Ballabhgarh, Faridabad, Haryana 121004, India",
    badge: "57%",
  },
];

function TimelineViewModal({ isOpen, onClose, template }) {
  if (!isOpen) return null;

  const timeline = getDummyTimelineForTemplate(template?.template_name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Template History
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {template?.template_name || "Template"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Timeline */}
        <div className="overflow-y-auto p-5">
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200"
              aria-hidden="true"
            />

            {timeline.map((event, index) => (
              <div
                key={event.id}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                {/* Left: date/time */}
                <div className="w-28 flex-shrink-0 text-right">
                  <p className="text-xs font-medium text-gray-500">
                    {event.time.split(" ")[0]}
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {event.time.split(" ").slice(1).join(" ")}
                  </p>
                </div>

                {/* Middle: icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${event.color} text-white font-semibold shadow`}
                  >
                    {event.letter}
                  </div>
                </div>

                {/* Right: content */}
                <div className="min-w-0 flex-1 rounded-lg border border-gray-100 bg-gray-50/80 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-sm font-semibold ${event.textColor}`}
                    >
                      {event.detail}
                      {event.hasInfo && (
                        <span className="ml-1 inline-flex text-red-500">
                          <svg
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </span>
                    {event.badge && (
                      <span className="rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {event.badge}
                      </span>
                    )}
                  </div>
                  {event.subDetail && (
                    <p className="mt-1 text-sm text-gray-700">
                      {event.subDetail}
                    </p>
                  )}
                  {event.address && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-gray-600">
                      <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                      <span>{event.address}</span>
                    </div>
                  )}
                  {event.timeRange && (
                    <p className="mt-1 text-xs text-gray-500">
                      {event.timeRange}
                    </p>
                  )}
                  {event.hasNotes && (
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <FileText size={14} />
                      Notes
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template, onView }) {
  const isDemo = template?.isDemo;
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow ${
        isDemo
          ? "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {template.template_name}
            </h3>
            {isDemo && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                <Sparkles size={12} />
                Demo
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            {template.template_type || "—"}
          </p>
          {!isDemo && template.workflow?.workflow_name && (
            <p className="mt-1 text-xs text-gray-400">
              Workflow: {template.workflow.workflow_name}
            </p>
          )}
          {isDemo && (
            <p className="mt-1 text-xs text-amber-600">
              Click View to see activity timeline (Logged In, Waiting, Checked In/Out)
            </p>
          )}
        </div>
        <button
          onClick={() => onView(template)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Eye size={16} />
          View
        </button>
      </div>
    </div>
  );
}

export default function TemplateModuleHistory() {
  const [viewingTemplate, setViewingTemplate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["template-master", "templates"],
    queryFn: async () => {
      const res = await axiosHandler.get("/template-master/templates");
      return res?.data?.data || [];
    },
  });

  const handleView = (template) => {
    setViewingTemplate(template);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setViewingTemplate(null);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Template Module History
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View history and activity timeline for each template
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Demo card – hamesha pehle, View pe image jaisa timeline dikhega */}
          <TemplateCard
            key="demo"
            template={DEMO_CARD}
            onView={handleView}
          />
          {isLoading ? (
            <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-8">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : (
            templates.map((t) => (
              <TemplateCard
                key={t._id}
                template={t}
                onView={handleView}
              />
            ))
          )}
        </div>
      </div>

      <TimelineViewModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        template={viewingTemplate}
      />
    </div>
  );
}

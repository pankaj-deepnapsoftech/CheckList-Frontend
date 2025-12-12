import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function CompanyDrawer({ open, onClose, data, onSubmit, mode = "add" }) {
  const [formData, setFormData] = useState({
    company_name: "",
    company_address: "",
    gst: "",
    description: "",
  });

  // Fill form with received data (for edit/view)
  useEffect(() => {
    if (data) {
      setFormData({
        company_name: data.company_name || "",
        company_address: data.company_address || "",
        gst: data.gst || "",
        description: data.description || "",
      });
    } else {
      setFormData({
        company_name: "",
        company_address: "",
        gst: "",
        description: "",
      });
    }
  }, [data]);

  if (!open) return null;

  const isViewMode = mode === "view";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isViewMode && onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      {/* DRAWER */}
      <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {mode === "add" && "Add New Company"}
            {mode === "edit" && "Edit Company"}
            {mode === "view" && "View Company"}
          </h2>
          <button className="cursor-pointer" onClick={onClose}>
            <X size={22} className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* FORM */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 "
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              required
              readOnly={isViewMode}
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">
              Company Address
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 "
              value={formData.company_address}
              onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
              readOnly={isViewMode}
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">GST</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 "
              value={formData.gst}
              onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
              readOnly={isViewMode}
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 "
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              readOnly={isViewMode}
            />
          </div>

          {!isViewMode && (
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4"
            >
              {mode === "add" ? "Add Company" : "Update Company"}
            </button>
          )}
        </form>
      </div>

      {/* ANIMATION CSS */}
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

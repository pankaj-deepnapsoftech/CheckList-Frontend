import React, { useEffect, useRef, useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

export default function UserRoleModal({
  open,
  onClose,
  mode = "add",
  initialData = null,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    role: "",
    description: "",
    permissions: [],
  });

  const [permOpen, setPermOpen] = useState(false);
  const isView = mode === "view";
  const permRef = useRef(null);

  // SIDEBAR PAGES ONLY
  const SIDEBAR_PAGES = [
    "Dashboard",
    "Company",
    "Plant Name",
    "User Role",
    "Employee",
    "Process",
    "Assembly Line",
    "Assembly Line Status",
  ];

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        role: initialData.role || "",
        description: initialData.description || "",
        permissions: initialData.permissions || [],
      });
    } else {
      setFormData({ role: "", description: "", permissions: [] });
    }
  }, [mode, initialData, open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (permOpen && permRef.current && !permRef.current.contains(e.target)) {
        setPermOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [permOpen]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!formData.role.trim()) return alert("Role is required");
    onSubmit(formData);
    onClose();
  };

  const togglePermission = (page) => {
    if (isView) return;

    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(page)
        ? prev.permissions.filter((p) => p !== page)
        : [...prev.permissions, page],
    }));
  };

  const removePermission = (page) => {
    if (isView) return;
    setFormData({
      ...formData,
      permissions: formData.permissions.filter((p) => p !== page),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white h-full w-[420px] shadow-lg p-6 relative">
        <button className="absolute right-4 top-4" onClick={onClose}>
          <X size={22} className="text-gray-500 hover:text-black" />
        </button>

        <h2 className="text-xl font-semibold mb-6">
          {mode === "add"
            ? "Add New Role"
            : mode === "edit"
            ? "Edit Role"
            : "View Role"}
        </h2>

        {/* ROLE */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            disabled={isView}
            className={`w-full border rounded-lg px-3 py-2 mt-1 ${
              isView && "bg-gray-100 cursor-not-allowed"
            }`}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            disabled={isView}
            className={`w-full border rounded-lg px-3 py-2 mt-1 ${
              isView && "bg-gray-100 cursor-not-allowed"
            }`}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* PERMISSIONS (PAGES) */}
        <div className="relative" ref={permRef}>
          <label className="text-sm font-medium text-gray-700">
            Sidebar Pages
          </label>

          <div
            onClick={() => !isView && setPermOpen(!permOpen)}
            className={`border rounded-lg px-3 py-2 mt-1 min-h-[48px] cursor-pointer ${
              isView && "bg-gray-100 cursor-not-allowed"
            }`}
          >
            <div className="flex flex-wrap gap-2">
              {formData.permissions.length === 0 && (
                <span className="text-gray-500 text-sm">Select pages...</span>
              )}

              {formData.permissions.map((page) => (
                <span
                  key={page}
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm"
                >
                  {page}
                  {!isView && (
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePermission(page);
                      }}
                    />
                  )}
                </span>
              ))}
            </div>

            <div className="absolute right-4 top-[65%] -translate-y-1/2">
              {permOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          {permOpen && !isView && (
            <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-56 overflow-auto p-3">
              {SIDEBAR_PAGES.map((page) => (
                <label
                  key={page}
                  className="flex items-center gap-2 py-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(page)}
                    onChange={() => togglePermission(page)}
                  />
                  <span className="text-sm text-gray-700">{page}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {!isView && (
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            {mode === "add" ? "Submit" : "Update Role"}
          </button>
        )}
      </div>
    </div>
  );
}

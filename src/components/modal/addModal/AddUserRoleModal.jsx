import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import PermissionSelector from "./PermissionSelector";

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

  // Fill form when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        role: initialData.role || "",
        description: initialData.description || "",
        permissions: initialData.permissions || [],
      });
    } else {
      setFormData({ role: "", description: "", permissions: [] });
    }
  }, [mode, initialData, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!formData.role.trim()) return alert("Role is required");

    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft relative">
        {/* HEADER */}
        <button className="absolute right-4 top-4" onClick={onClose}>
          <X size={22} className="text-gray-500 hover:text-black" />
        </button>

        <h2 className="text-xl font-semibold mb-6">
          {mode === "add" ? "Add New Role" : "Edit Role"}
        </h2>

        {/* ROLE */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium">
            Description
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* PERMISSIONS */}
        <PermissionSelector
          value={formData.permissions}
          onChange={(perms) => setFormData({ ...formData, permissions: perms })}
        />

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mt-6 w-full"
        >
          {mode === "add" ? "Submit" : "Update Role"}
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import PermissionSelector from "./PermissionSelector";

export default function EditUserRoleModal({ open, onClose, data }) {
  const [formData, setFormData] = useState({
    role: "",
    description: "",
    permissions: [],
  });

  // Add Permission
  const addPermission = (perm) => {
    if (!value.includes(perm)) {
      onChange([...value, perm]);
    }
  };

  // Fill form with received data
  useEffect(() => {
    if (data) {
      setFormData({
        role: data.role || "",
        description: data.description || "",
        permissions: data.permissions || [],
      });
    }
  }, [data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      {/* DRAWER */}
      <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Role</h2>
          <button className="cursor-pointer" onClick={onClose}>
            <X size={22} className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-4">
          {/* ROLE */}
          <div>
            <label className="text-sm font-medium">Role *</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* PERMISSIONS */}
          <PermissionSelector
            value={formData.permissions}
            onChange={(perms) =>
              setFormData({ ...formData, permissions: perms })
            }
          />

          {/* SUBMIT BUTTON */}
          <button className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4">
            Update Role
          </button>
        </div>
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

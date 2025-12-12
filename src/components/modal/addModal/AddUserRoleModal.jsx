import React, { useEffect, useState } from "react";
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

  const PERMISSION_GROUPS = {
    "Purchase Order": ["Create PO", "View PO", "Edit PO", "Delete PO"],
    Inventory: ["Direct", "Indirect", "WIP"],
    Users: ["Add User", "Edit User", "Delete User", "View User"],
  };

  
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && initialData) {
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

  const togglePermission = (perm) => {
    if (isView) return;

    if (formData.permissions.includes(perm)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== perm),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, perm],
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft relative">
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

        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled={isView}
            className={`w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 ${
              isView ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-700 font-medium">
            Description
          </label>
          <input
            type="text"
            disabled={isView}
            className={`w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 ${
              isView ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* PERMISSIONS */}
        <div className="relative mt-3">
          <label className="text-sm text-gray-700 font-medium">
            Permissions
          </label>
          <div
            className={`border border-gray-300 rounded-lg px-3 py-2 mt-1 bg-white min-h-[48px] cursor-pointer ${
              isView ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            onClick={() => !isView && setPermOpen(!permOpen)}
          >
            <div className="flex flex-wrap gap-2">
              {formData.permissions.length === 0 && (
                <span className="text-gray-400 text-sm">
                  Select permissions...
                </span>
              )}

              {formData.permissions.map((perm) => (
                <span
                  key={perm}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm"
                >
                  {perm}
                </span>
              ))}
            </div>

            <div className="absolute right-4 top-[55%] -translate-y-1/2">
              {permOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          {permOpen && !isView && (
            <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-1 w-full z-50 max-h-60 overflow-auto p-3">
              {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => (
                <div key={group} className="mb-3">
                  <p className="font-semibold text-gray-700 text-sm border-b pb-1 mb-2">
                    {group}
                  </p>

                  {perms.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 py-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                      />
                      <span className="text-gray-700 text-sm">{perm}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {!isView && (
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 mt-6 w-full"
          >
            {mode === "add" ? "Submit" : "Update Role"}
          </button>
        )}
      </div>
    </div>
  );
}

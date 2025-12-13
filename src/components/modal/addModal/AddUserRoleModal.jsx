import React, { useEffect, useRef, useState } from "react";
import { X, ChevronDown, ChevronUp, Search } from "lucide-react";

export default function UserRoleModal({
  open,
  onClose,
  mode = "add",
  initialData = null,
  onSubmit,
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    role: "",
    description: "",
    permissions: [],
  });

  const [permOpen, setPermOpen] = useState(false);
  const [searchPage, setSearchPage] = useState("");
  const permRef = useRef(null);

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

  /* -------------------- EFFECTS -------------------- */

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

  // ESC key close
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setPermOpen(false);
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Click outside close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (permOpen && permRef.current && !permRef.current.contains(e.target)) {
        setPermOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [permOpen]);

  if (!open) return null;

  /* -------------------- HANDLERS -------------------- */

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
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.filter((p) => p !== page),
    }));
  };

  const filteredPages = SIDEBAR_PAGES.filter((p) =>
    p.toLowerCase().includes(searchPage.toLowerCase())
  );

  /* -------------------- UI -------------------- */

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="bg-white h-full w-[420px] shadow-xl p-6 relative animate-slideLeft">
        {/* Close */}
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
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className={`w-full border rounded-xl px-3 py-2 mt-1 transition
              ${
                isView
                  ? "bg-gray-100 cursor-not-allowed"
                  : "focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              }`}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            disabled={isView}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`w-full border rounded-xl px-3 py-2 mt-1 transition
              ${
                isView
                  ? "bg-gray-100 cursor-not-allowed"
                  : "focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              }`}
          />
        </div>

        {/* PERMISSIONS */}
        <div className="relative mt-4" ref={permRef}>
          <label className="text-sm font-medium text-gray-700">
            Permission
          </label>

          <div
            onClick={() => !isView && setPermOpen(!permOpen)}
            className={`border rounded-xl px-3 py-2 mt-1 min-h-[52px] cursor-pointer transition-all
              ${
                permOpen
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-700 hover:border-gray-800"
              }
              ${isView && "bg-gray-100 cursor-not-allowed"}
            `}
          >
            <div className="flex flex-wrap gap-2">
              {formData.permissions.length === 0 && (
                <span className="text-gray-400 text-sm">
                  Select pages
                </span>
              )}

              {formData.permissions.map((page) => (
                <span
                  key={page}
                  className="group flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
                >
                  {page}
                  {!isView && (
                    <X
                      size={14}
                      onClick={(e) => {
                        e.stopPropagation();
                        removePermission(page);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition cursor-pointer hover:text-sky-500"
                    />
                  )}
                </span>
              ))}
            </div>

            <div className="absolute right-4 top-[65%] -translate-y-1/2 text-gray-500">
              {permOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          {/* DROPDOWN */}
          <div
            className={`absolute z-50 mt-2 w-full rounded-xl border bg-white shadow-xl transition-all
              ${
                permOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }
            `}
          >
            {/* Search */}
            <div className="p-3 border-b flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
              <input
                value={searchPage}
                onChange={(e) => setSearchPage(e.target.value)}
                placeholder="Search pages..."
                className="w-full text-sm outline-none"
              />
            </div>

            {/* Options */}
            <div className="max-h-56 overflow-auto p-2">
              {filteredPages.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-4">
                  No pages found
                </p>
              )}

              {filteredPages.map((page) => (
                <label
                  key={page}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
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
          </div>
        </div>

        {/* ACTION */}
        {!isView && (
          <button
            onClick={handleSubmit}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
          >
            {mode === "add" ? "Create Role" : "Update Role"}
          </button>
        )}
      </div>
    </div>
  );
}

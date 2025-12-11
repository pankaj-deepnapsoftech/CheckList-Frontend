import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

const AVAILABLE_PERMS = [
  "Purchase-order",
  "Direct",
  "Indirect",
];

export default function PermissionSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);

  // Add Permission
  const addPermission = (perm) => {
    if (!value.includes(perm)) {
      onChange([...value, perm]);
    }
  };

  // Remove Permission
  const removePermission = (perm) => {
    onChange(value.filter((p) => p !== perm));
  };

  return (
    <div className="relative">
      <label className="text-sm font-medium">Permissions</label>

      {/* INPUT BOX */}
      <div
        className="border rounded-lg px-3 py-2 mt-1 w-full cursor-pointer min-h-[48px]"
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap gap-2">
          {value.map((perm, i) => (
            <span
              key={i}
              className="bg-gray-200 cursor-pointer text-gray-800 px-2 py-1 rounded-md flex items-center gap-1 text-sm"
            >
              {perm}
              <X
                size={14}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  removePermission(perm);
                }}
              />
            </span>
          ))}
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronDown className="text-gray-500" size={18} />
        </div>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute bg-white border rounded-lg shadow-lg mt-1 w-full z-50 max-h-48 overflow-auto">
          {AVAILABLE_PERMS.map((perm, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => addPermission(perm)}
            >
              {perm}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

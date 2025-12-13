import { Menu, X, Bell } from "lucide-react";

export default function Navbar({ onMenuClick, isMobileOpen }) {
  return (
    <div className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
        <div className="flex items-center gap-3 shrink-0">
        
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={onMenuClick}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h2 className="hidden md:block text-xl font-semibold">
            Good Morning, <span className="text-blue-600 font-bold">ADMIN</span>
          </h2>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div className="relative cursor-pointer">
            <Bell size={22} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full"></span>
          </div>

          {/* Profile */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-teal-200 text-gray-800 font-semibold cursor-pointer">
            A
          </div>
        </div>
      </div>
    </div>
  );
}

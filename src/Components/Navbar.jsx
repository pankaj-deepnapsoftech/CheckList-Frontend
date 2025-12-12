import { Bell } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        {/* LEFT SIDE */}
        <div>
          <h2 className="text-xl font-semibold">
            Good Morning, <span className="text-blue-600 font-bold">ADMIN</span>
          </h2>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          {/* Notification Icon */}
          <div className="relative cursor-pointer">
            <Bell size={20} className="text-gray-700" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </div>

          {/* Profile Avatar */}
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-200 text-gray-800 font-semibold cursor-pointer">
            A
          </div>
        </div>
      </div>
    </div>
  );
}

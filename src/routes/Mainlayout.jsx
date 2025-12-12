import { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

export default function Layout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* FIXED SIDEBAR */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* RIGHT AREA */}
      <div className="flex flex-col flex-1 h-full">
        {/* FIXED NAVBAR */}
        <div className="fixed top-0 left-0 md:left-64 right-0 z-50">
          <Navbar
            isMobileOpen={isMobileOpen}
            onMenuClick={() => setIsMobileOpen(!isMobileOpen)}
          />
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="pt-20 px-4 overflow-y-auto h-full bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}

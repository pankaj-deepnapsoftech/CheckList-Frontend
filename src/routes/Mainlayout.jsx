import { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

export default function Layout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-1">
        <Navbar 
          isMobileOpen={isMobileOpen}
          onMenuClick={() => setIsMobileOpen(!isMobileOpen)}
        />

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}





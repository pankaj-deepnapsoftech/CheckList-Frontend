import { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { useLogin } from "../hooks/useLogin";

export default function Layout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
 
 
  return (
    <div className="flex h-screen overflow-x-hidden overflow-y-scroll">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex flex-col flex-1 h-full">
        <div className="fixed top-0 left-0 md:left-64 right-0 z-50">
          <Navbar
            isMobileOpen={isMobileOpen}
            onMenuClick={() => setIsMobileOpen(!isMobileOpen)}
          />
        </div>
        <div className="pt-20 px-4 overflow-y-auto h-full bg-gray-50">
         {children}
        </div>
      </div>
    </div>
  );
}

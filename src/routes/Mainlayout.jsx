import { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

export default function Layout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
     
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

    
      <div className="flex flex-col flex-1 min-w-0">
    
        <Navbar
          isMobileOpen={isMobileOpen}
          onMenuClick={() => setIsMobileOpen(!isMobileOpen)}
        />

        <main className="flex-1  overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

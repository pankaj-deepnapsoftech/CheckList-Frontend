import { useState } from "react";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

export default function Layout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
 
   
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex flex-col flex-1 h-full w-full relative">
        <Navbar
          isMobileOpen={isMobileOpen}
          onMenuClick={() => setIsMobileOpen(!isMobileOpen)}
        />
        
        <main className="flex-1 p-3 overflow-y-auto bg-gray-50">
         {children}
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    User,
    Shield,
    Key,
    Package,
    LogOut,
    ShoppingBag,
    Building,
    X
} from "lucide-react";


const Sidebar = () => {

    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const allMenu = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Company", path: "/company", icon: <Building size={20} /> },
        { name: "Plant Name", path: "/plant-name", icon: <Package size={20} /> },
        { name: "User Role", path: "/user-role", icon: <Shield size={20} /> },
        { name: "Employee", path: "/employee", icon: <User size={20} /> },
        { name: "Process", path: "/process", icon: <ShoppingBag size={20} /> },
        { name: "Assembly Line", path: "/assembly-line", icon: <Key size={20} /> },
        { name: "Assembly Line Status", path: "/assembly-line-status", icon: <Key size={20} /> },
    ];

    const closeMobile = () => setIsMobileOpen(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            
            <aside className="hidden md:flex w-64 bg-white shadow-lg p-5 border-r border-gray-200 flex-col justify-between h-screen">
                <div>
                  
                    <div className="flex justify-center mb-6">
                        <img
                            src="https://jpmgroup.co.in/assets/companies/main-logo.webp"
                            alt="Logo"
                            className="h-36 object-contain"
                        />
                    </div>

                    
                    <nav className="flex flex-col gap-1">
                        {allMenu.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-2 rounded-lg transition-all
                                    ${isActive
                                        ? "bg-blue-100 text-blue-600 font-medium shadow-sm"
                                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"}`
                                }
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2
                        bg-blue-500 hover:bg-blue-600 text-white
                        rounded-lg py-2.5 shadow-sm transition-all"
                    >
                        <LogOut size={18} className="opacity-90" />
                        Logout
                    </button>
                </div>
            </aside>

           
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 z-40 flex">
                    {/* Dimmed Background */}
                    <div className="fixed inset-0 bg-black/40" onClick={closeMobile} />

                    <aside className="relative w-64 bg-white shadow-lg p-4 border-r border-gray-200 flex flex-col justify-between h-full animate-slideIn">

                        <div className="flex items-center justify-between mb-6">
                            <img
                                src="https://jpmgroup.co.in/assets/companies/main-logo.webp"
                                alt="Logo"
                                className="h-10 object-contain"
                            />
                            <button className="p-2 rounded-md bg-gray-100" onClick={closeMobile}>
                                <X size={18} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-1">
                            {allMenu.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end
                                    onClick={closeMobile}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 p-2 rounded-lg transition-all
                                        ${isActive
                                            ? "bg-blue-100 text-blue-600 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"}`
                                    }
                                >
                                    {item.icon}
                                    {item.name}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="mt-auto pt-4 border-t border-gray-200">
                            <Button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 
                                bg-blue-500 hover:bg-blue-600 text-white 
                                rounded-lg py-2.5 shadow-sm transition-all"
                            >
                                <LogOut size={18} />
                                Logout
                            </Button>
                        </div>

                    </aside>
                </div>
            )}
        </>
    );
};

export default Sidebar;

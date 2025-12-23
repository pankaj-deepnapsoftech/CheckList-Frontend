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
  X,
  ChartNoAxesCombined,
  LaptopMinimalCheck,
  GitCompare,
  ChevronsLeftRightEllipsis,
  Airplay
} from "lucide-react";
import { useLogin } from "../hooks/useLogin";

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logedinUser } = useLogin();

  const permissions = logedinUser?.data?.role?.permissions || [];
  const IsSuper = logedinUser?.data?.is_admin === true;
  const closeMobile = () => setIsMobileOpen(false);
  const navigate = useNavigate();
  const { logOutUser } = useLogin();

  const allMenu = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },

    { name: "Company", path: "/company", icon: <Building size={20} /> },
    { name: "Plant Name", path: "/plant-name", icon: <Package size={20} /> },
    { name: "Assembly Line", path: "/assembly-line", icon: <Key size={20} /> },
    { name: "User Role", path: "/user-role", icon: <Shield size={20} /> },
    { name: "Employee", path: "/employee", icon: <User size={20} /> },
    { name: "Parts", path: "/parts", icon: <GitCompare size={20} /> },
    { name: "Process", path: "/process", icon: <ShoppingBag size={20} /> },
    {
      name: "Check Item",
      path: "/checkitem",
      icon: <LaptopMinimalCheck size={20} />,
    },
    {
      name: "Inspection-Data",
      path: "/checkitem-data",
      icon: <ChevronsLeftRightEllipsis size={20} />,
    },
    !IsSuper && {
      name: "Assigned Assembly Lines",
      path: "/assigned-assembly-lines",
      icon: <Airplay size={20} />
    },
    {
      name: "Inspection Status",
      path: "/assembly-line-status",
      icon: <ChartNoAxesCombined size={20} />,
    },
  ].filter(Boolean);

  const allowedMenu = IsSuper
    ? allMenu
    : allMenu.filter((i) => permissions.includes(i?.path));

  const handleLogout = () => {
    logOutUser.mutate();
    navigate("/login");
  };

  return (
    <>
      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <aside className="hidden md:flex w-64 bg-white shadow-xl p-5 flex-col justify-between h-screen">
        <div>
          <div
            className="flex flex-col items-center mb-6 mt-2"
            onClick={() => {
              closeMobile();
              navigate("/");
            }}
          >
            <img
              src="https://jpmgroup.co.in/assets/svg/logo-color.svg"
              alt="Logo"
              className="h-20 object-contain"
            />
            <p className="text-[#2e4c99] font-semibold text-[18px] mt-2">
              &nbsp;JP MINDA GROUP
            </p>
          </div>

          <nav className="flex flex-col gap-1">
            {allowedMenu.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg transition-all whitespace-nowrap
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={() => handleLogout()}
            className="w-full flex items-center justify-center gap-2 
                       bg-blue-500 hover:bg-blue-600 text-white 
                       rounded-lg py-2.5 shadow-sm transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ---------- MOBILE SIDEBAR ---------- */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-[50] pt-[50px] flex">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black/40" onClick={closeMobile} />

          {/* Drawer Sidebar */}
          <aside className="relative w-64 bg-white shadow-xl p-4 flex flex-col justify-between h-full animate-slideIn">
            {/* Top Logo + Close Icon */}
            <div
              className="flex items-center mb-6 mt-2"
              onClick={() => {
                closeMobile();
                navigate("/");
              }}
            >
              <img
                src="https://jpmgroup.co.in/assets/svg/logo-color.svg"
                alt="Logo"
                className="h-14 object-contain"
              />
              <p className="text-[#2e4c99] font-semibold text-[19px]">
                &nbsp;JP MINDA GROUP
              </p>
              {/* <button
                className="p-2 rounded-md bg-gray-100"
                onClick={closeMobile}
              >
               
              </button> */}
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col gap-1">
              {allowedMenu.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Logout Mobile */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <button
                onClick={() => handleLogout()}
                className="w-full flex items-center justify-center gap-2 
                           bg-blue-500 hover:bg-blue-600 text-white 
                           rounded-lg py-2.5 shadow-sm transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;

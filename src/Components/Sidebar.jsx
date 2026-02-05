import { NavLink, useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import {
  LayoutDashboard,
  User,
  Shield,
  Key,
  Package,
  LogOut,
  ShoppingBag,
  Building,
  ChartNoAxesCombined,
  LaptopMinimalCheck,
  GitCompare,
  ChevronsLeftRightEllipsis,
  Airplay,
  AlertOctagon,
  House,
  BookCheck,
  LayoutTemplate,
  Repeat2,
  ChevronDown,
  WorkflowIcon,
  GraduationCap,
  Cpu,
  Activity,
  FileText,
  XCircle,
  CircleOff,
  History,
  CheckCircle2,
  Boxes,
  ChartNetwork,
} from "lucide-react";
import { useLogin } from "../hooks/useLogin";

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logedinUser, logOutUser } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const user = logedinUser?.data;
  const permissions = user?.userRole?.permissions || [];
  const IsSuper = user?.is_admin === true;

  const closeMobile = () => setIsMobileOpen(false);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  // ================= MENU =================
  const allMenu = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Company", path: "/company", icon: <Building size={20} /> },
    { name: "Plant Name", path: "/plant-name", icon: <Package size={20} /> },
    { name: "Department", path: "/department", icon: <House size={20} /> },
    { name: "User Role", path: "/user-role", icon: <Shield size={20} /> },
    { name: "Employee", path: "/employee", icon: <User size={20} /> },

    {
      name: "Checklist Module",
      icon: <BookCheck size={20} />,
      children: [
        {
          name: "Assembly Line",
          path: "/assembly-line",
          icon: <Key size={18} />,
        },
        { name: "Parts", path: "/parts", icon: <GitCompare size={18} /> },
        { name: "Process", path: "/process", icon: <ShoppingBag size={18} /> },
        {
          name: "Check Item",
          path: "/checkitem",
          icon: <LaptopMinimalCheck size={18} />,
        },
        {
          name: "Inspection-Data",
          path: "/checkitem-data",
          icon: <ChevronsLeftRightEllipsis size={18} />,
        },
        {
          name: "Inspection Status",
          path: "/assembly-line-status",
          icon: <ChartNoAxesCombined size={18} />,
        },
        {
          name: "Assembly Line Error",
          path: IsSuper ? "/assembly-line-admin/error" : "/assembly-line/error",
          icon: <AlertOctagon size={18} />,
        },
      ],
    },

    {
      name: "Template Module",
      icon: <GraduationCap size={20} />,
      children: [
        {
          name: "Manage Template",
          path: "/template-master",
          icon: <LayoutTemplate size={18} />,
        },
        {
          name: "Template Status",
          path: "/template-status",
          icon: <CheckCircle2 size={18} />,
        },
        {
          name: "Template Approval",
          path: "/template-approve-reject",
          icon: <XCircle size={18} />,
        },
        // { name: "Template Module History", path: "/template-module-history", icon: <History size={18} /> },
        {
          name: "Manage Release Group",
          path: "/release-group",
          icon: <Repeat2 size={18} />,
        },
        {
          name: "Manage Workflow",
          path: "/workflow",
          icon: <WorkflowIcon size={18} />,
        },
        {
          name: "Manage Documents",
          path: "/document-management",
          icon: <FileText size={18} />,
        },
      ],
    },

    !IsSuper && {
      name: "My Templates",
      path: "/assigned-templates",
      icon: <LayoutTemplate size={20} />,
    },

    {
      name: "Plc-Data",
      icon: <Cpu size={20} />,
      children: [
        {
          name: "PLC-Dashboard",
          path: "/plc-data/live",
          icon: <Activity size={18} />,
        },
        {
          name: "Live-Data",
          path: "/plc-data/dashboard",
          icon: <LayoutDashboard size={18} />,
        },

        {
          name: "Stoppage",
          path: "/plc-data/stoppage",
          icon: <CircleOff size={18} />,
        },
        // {
        //   name: "Plc-Analytics",
        //   path: "/plc/analytics",
        //   icon: <ChartNetwork size={18} />,
        // },
        // {
        //   name: "Products",
        //   path: "/plc-data/products",
        //   icon: <Boxes size={18} />,
        // },
        {
          name: "QC Check",
          path: "/plc-data/qc-check",
          icon: <Boxes size={18} />,
        },
      ],
    },

    !IsSuper && {
      name: "Assigned Assembly Lines",
      path: "/assigned-assembly-lines",
      icon: <Airplay size={20} />,
    },

    !IsSuper && {
      name: "Daily Assembly Check",
      path: "/daily-assembly-check",
      icon: <BookCheck size={20} />,
    },
  ].filter(Boolean);

  // ================= PERMISSION =================
  // User-specific pages that should always be visible to non-admin users
  const userSpecificPaths = [
    "/assigned-assembly-lines",
    "/daily-assembly-check",
  ];

const allowedMenu = IsSuper
  ? allMenu
  : allMenu
      .map((item) => {
        if (item?.children) {
          const allowedChildren = item?.children.filter((child) =>
            permissions.includes(child?.path),
          );
          if (allowedChildren?.length === 0) return null;

          return {
            ...item,
            children: allowedChildren,
          };
        }
        if (item?.path && permissions.includes(item?.path)) {
          return item;
        }
        if (item?.path && userSpecificPaths.includes(item?.path)) {
          return item;
        }

        return null;
      })
      .filter(Boolean);




  const handleLogout = () => {
    logOutUser.mutate();
    navigate("/login");
  };

  // ================= MENU RENDER =================
  const renderMenu = () => (
    <nav className="flex flex-col gap-1">
      {allowedMenu.map((item) => {
        if (item.children) {
          return (
            <div key={item.name}>
              <div className="flex items-center justify-between ">
                <button
                  onClick={() => toggleMenu(item.name)}
                  className="flex items-center gap-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100 flex-1 whitespace-nowrap"
                >
                  {item.icon}
                  <span className="truncate">{item.name}</span>
                </button>


                <button onClick={() => toggleMenu(item.name)} className="p-2">
                  <ChevronDown
                    size={16}
                    className={`transition ${openMenu === item.name ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>

              {openMenu === item.name && (
                <div className="ml-6 flex flex-col gap-1 ">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.path}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md text-sm
   whitespace-nowrap overflow-hidden
   ${isActive
                          ? "bg-blue-100 text-blue-600 font-normal"
                          : "text-gray-600 hover:bg-gray-100"
                        }`
                      }

                    >
                      {child.icon}
                      <span className="truncate max-w-[160px]">
                        {child.name}
                      </span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        }

        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.name}
            onClick={() => {
              closeMobile();
              if (item.path) {
                navigate(item.path);
              }
            }}
            className={`flex items-center gap-3 p-2 rounded-lg w-full text-left
              ${isActive
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {item.icon}
            {item.name}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* DESKTOP */}
      <aside className="hidden md:flex w-[20%]  bg-white shadow-xl p-5 flex-col h-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* LOGO */}
          <div
            className="flex flex-col items-center mb-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="https://jpmgroup.co.in/assets/svg/logo-color.svg"
              alt="Logo"
              className="h-20"
            />
            <p className="text-[#2e4c99] font-semibold text-lg mt-2">
              JP MINDA GROUP
            </p>
          </div>

          {/* SCROLLABLE MENU */}
          <div className="flex-1 overflow-y-auto z pr-1 custom-scrollbar">
            {renderMenu()}
          </div>
        </div>

        <div className="text-gray-400 text-xs text-center leading-[15px] ">
          Developed & Maintained by
          <p>© 2026 Deepnap Softech</p>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2.5"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* MOBILE */}
      {/* {isMobileOpen && (
        <div className="mt-[25px] pt-40">
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40" onClick={closeMobile} />

            <aside className="relative w-64 bg-white p-4 flex flex-col h-full">
              <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {renderMenu()}
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2.5"
              >
                <LogOut size={18} />
                Logout
              </button>
            </aside>
          </div>
        </div>
      )} */}

      {isMobileOpen && (
        <div className="mt-[25px] pt-40">
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40" onClick={closeMobile} />

            {/* Sidebar */}
            <aside className="relative w-[70%] bg-white flex flex-col h-full shadow-2xl">
              {/* Logo + Company Name Section */}
              <div className="p-2 mt-15 border-b border-gray-200">
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => {
                    closeMobile();
                    navigate("/");
                  }}
                >
                  <img
                    src="https://jpmgroup.co.in/assets/svg/logo-color.svg"
                    alt="JP Minda Group Logo"
                    className="h-16 w-auto object-contain"
                  />
                  <p className="text-[#2e4c99] font-bold text-lg mt-3 tracking-wide">
                    JP MINDA GROUP
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {renderMenu()}
              </div>

              <p className="text-gray-400 text-xs text-center leading-[15px] ">
                Developed & Maintained by
                <p>© 2026 Deepnap Softech</p>
              </p>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg py-3 font-medium shadow-sm transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
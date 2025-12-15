import { Menu, X, Bell } from "lucide-react";
import { useState , useRef , useEffect } from "react";
import ProfileDropDown from "../Components/DropDown/ProfileDropDown";
import NotificationDropdown from "../Components/DropDown/NotificationDropDown";

export default function Navbar({ onMenuClick, isMobileOpen }) {

  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const notifRef = useRef(null);
  const notifButtonRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Profile dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

      // Notification dropdown
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target) &&
        notifButtonRef.current &&
        !notifButtonRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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
            <Bell size={22} className="text-gray-700"
            ref={notifButtonRef}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full"></span>
              {notificationsOpen && (
              <NotificationDropdown
                innerRef={notifRef} 
                onClose={() => setNotificationsOpen(false)} 
              />
            )}
          </div>

          {/* Profile */}
          <div 
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-teal-200 text-gray-800 font-semibold cursor-pointer">
            A
          </div>
          {open && (
            <ProfileDropDown ref={dropdownRef} onClose={() => setOpen(false)}/>
          )}
        </div>
      </div>
    </div>
  );
}

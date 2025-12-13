import { X, LogOut } from "lucide-react";

const ProfileDropDown = ({ ref , onClose}) => {
  return (
    <div
      ref={ref}
      className="absolute top-16 right-8 z-50 min-w-[300px] max-w-[300px] bg-white border border-gray-200 rounded-xl shadow-lg p-4 transition-all duration-200"
    >
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-300 text-white font-semibold text-lg cursor-pointer">
            A
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-900">Profile Name </p>
            <p className="text-gray-500 text-sm">example123@gmail.com</p>
          </div>
        </div>
        <button
         onClick={onClose}
         className="p-1 rounded-full hover:bg-gray-100 transition ml-2">
          <X size={20} className="text-gray-500 hover:text-gray-900" />
        </button>
      </div>

    
      <ul className="flex flex-col gap-2">
        <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
          Dashboard
        </li>
        <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
          Settings
        </li>
        <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition">
          Help & Support
        </li>
      </ul>

   
      <button
        className="w-full flex items-center justify-center gap-2 
                           bg-blue-500 hover:bg-blue-600 text-white 
                           rounded-lg py-2.5 shadow-sm transition-all mt-4"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default ProfileDropDown;

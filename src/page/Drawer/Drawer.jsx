import React from "react";

export const Drawer = ({ open, onClose }) => {
  return (
    <>

      <div
        className={`
          fixed top-0 right-0 h-full bg-white shadow-xl z-50 
          sm:w-1/2  w-full
          transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >

      <div
        onClick={onClose}
        className={`
         inset-0  transition-opacity duration-300 z-40
          m-4
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >

     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
       <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
     </svg>

      </div>

      
        <div className="p-8 flex flex-col gap-2 pb-32 overflow-y-auto h-full">


          <svg
            onClick={onClose}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 cursor-pointer"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>

        
          <div className="flex flex-col gap-8 p-4">
            <p className="text-3xl pb-4">Employee</p>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Id</p>
              <input
              type="text" 
              name="id"
              className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none focus:ring-0" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Full Name</p>
              <input
              type="text"
              name="full_name"
              className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none focus:ring-0" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Email</p>
              <input
              type="text"
              name="email"
              className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none focus:ring-0" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Role</p>
              <input
              type="text"
              name="role"
              className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none focus:ring-0" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Designation</p>
              <input
              type="text"
              name="designation"
              className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none focus:ring-0" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">User Id</p>
              <input
              type="text"
              name="user_id"
              className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none focus:ring-0" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Password</p>
              <input
              type="password"
              name="password"
              className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none focus:ring-0" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Employee Plant</p>
              <input
              type="text"
              name="employee_plant"
              className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none focus:ring-0" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Employee Company</p>
              <input
              type="text"
              name="employee_company"
              className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none focus:ring-0" />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-semibold">Assembly Line</p>
              <input
              type="text"
              name="assembly_line"
              className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none focus:ring-0" />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-1/2 min-w-20 self-center mt-8">
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

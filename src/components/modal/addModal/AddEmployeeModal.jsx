import React from "react";

const AddEmployeeModal = ({ open, onClose }) => {
  return (
    <>
      <div
        className={`
          fixed top-0 right-0 h-full bg-white shadow-xl z-50 
          sm:w-1/2 w-full
          transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Close Button (Top Left inside Drawer) */}
        <div onClick={onClose} className="absolute top-4 left-4 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-8 flex flex-col gap-2 pb-32 overflow-y-auto h-full">
          <p className="text-3xl pb-4 mt-8">Employee</p>

          {/* Fields Here */}
          <div className="flex flex-col gap-8 p-4">
            {[
              "Id",
              "Full Name",
              "Email",
              "Role",
              "Designation",
              "User Id",
              "Password",
              "Employee Plant",
              "Employee Company",
              "Assembly Line",
            ].map((label, i) => (
              <div className="flex flex-col gap-2" key={i}>
                <p className="font-semibold">{label}</p>
                <input
                  type={label === "Password" ? "password" : "text"}
                  className="w-full border p-1 rounded-lg text-gray-600 focus:outline-none"
                />
              </div>
            ))}

            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-1/2 min-w-20 self-center mt-8">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Background Overlay */}
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40"></div>
      )}
    </>
  );
};

export default AddEmployeeModal;

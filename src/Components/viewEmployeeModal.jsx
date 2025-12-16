// import React, { useEffect, useState } from "react";
// import { X } from "lucide-react";

// export default function ViewEmployeeModal({ open, onClose, data }) {
//   const [employee, setEmployee] = useState({
//     full_name: "",
//     email: "",
//     role: "",
//     designation: "",
//     user_id: "",
//     Employee_plant: "",
//     employee_company: "",
//     assambly_line: [],
//   });

//   useEffect(() => {
//     if (data) {
//       setEmployee({
//         full_name: data.full_name || "N/A",
//         email: data.email || "N/A",
//         role: data.role?.name || "N/A",
//         designation: data.designation || "N/A",
//         user_id: data.user_id || "N/A",
//         Employee_plant: data.Employee_plant?.plant_name || "N/A",
//         employee_company: data.employee_company?.company_name || "N/A",
//         assambly_line: data.assambly_line?.map(l => l.line_name) || [],
//       });
//     }
//   }, [data]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">

//       <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft">

//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">Employee Details</h2>
//           <button onClick={onClose}>
//             <X size={22} className="text-gray-500 hover:text-black" />
//           </button>
//         </div>

//         <div className="flex flex-col gap-4">

//           <Info label="Full Name" value={employee.full_name} />
//           <Info label="Email" value={employee.email} />
//           <Info label="User ID" value={employee.user_id} />
//           <Info label="Role" value={employee.role} />
//           <Info label="Designation" value={employee.designation} />
//           <Info label="Plant" value={employee.Employee_plant} />
//           <Info label="Company" value={employee.employee_company} />

//           <div>
//             <label className="text-sm text-gray-700 font-medium">Assembly Lines</label>
//             <ul className="border bg-gray-100 rounded-lg px-3 py-2 mt-1 list-disc">
//               {employee.assambly_line.length > 0 ? (
//                 employee.assambly_line.map((line, idx) => (
//                   <li key={idx}>{line}</li>
//                 ))
//               ) : (
//                 <p>No lines assigned</p>
//               )}
//             </ul>
//           </div>

//         </div>
//       </div>

//       <style>{`
//         @keyframes slideLeft {
//           from { transform: translateX(100%); }
//           to { transform: translateX(0); }
//         }
//         .animate-slideLeft {
//           animation: slideLeft 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

// function Info({ label, value }) {
//   return (
//     <div>
//       <label className="text-sm text-gray-700 font-medium">{label}</label>
//       <p className="border rounded-lg px-3 py-2 mt-1 bg-gray-100">{value}</p>
//     </div>
//   );
// }

import { useState } from "react";
import AddEmployeeModal from "../components/modal/addModal/AddEmployeeModal"


const employees = Array(10).fill({
  name: "Raghav Chadha",
  userId: "454334",
  role: "Lorem Ipsum",
  designation: "Lorem Ipsum",
});

const  Employee=()=>{

  const [search, setSearch] = useState("");

   const [openDrawer, setOpenDrawer] = useState(false);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Employee</h1>
        <button
        onClick={() => setOpenDrawer(true)}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
           Add New Employee
        </button>
       
      </div>

      {/* Search + Icons */}
      <div className="flex justify-between items-center ">

        <div className="flex flex-row gap-4 justify-center items-center">
        <p className="text-xl">Employee</p>
        <div className="flex flex-row items-center relative w-72 border rounded-lg px-3 py-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>

          <input
            type="text"
            placeholder="Search"
            className="pl-2   border-none w-full focus:outline-none focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        </div>

        <div className="flex gap-5 text-xl text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.72 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
         </svg>

         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
         </svg>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-50 text-gray-700 font-semibold text-center">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">User ID</th>
              <th className="p-4">Role</th>
              <th className="p-4">Designation</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition text-center"
              >
                <td className="p-4">{emp.name}</td>
                <td className="p-4">{emp.userId}</td>
                <td className="p-4">{emp.role}</td>
                <td className="p-4">{emp.designation}</td>
                <td className="p-4 flex gap-4 text-lg text-gray-700 justify-center">

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-500">
                   <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                 </svg>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddEmployeeModal open={openDrawer} onClose={() => setOpenDrawer(false)} />

    </div>
  );
}

export default Employee
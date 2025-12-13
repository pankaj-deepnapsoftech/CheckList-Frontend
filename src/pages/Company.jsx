import { useState, useEffect } from "react";
import { Plus, RefreshCw, Search, Eye, Edit2, Trash2 } from "lucide-react";
import CompanyDrawer from "../components/CompanyDrawer";
import { useCompanies } from "../hooks/useCompanies";




const Company = () => { 
  const { listQuery, remove } = useCompanies()
  const [search, setSearch] = useState("");
  const [editTable,setTable] = useState(null)
  const [openModal,setOpenModal] = useState(false)



  const filteredCompanyies = listQuery?.data?.filter((com) =>
    com.company_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id)=>{
   if(window.confirm("are you sure you want to delete this data")){
     remove.mutate(id)
   }
  }


  return (
    <div className="p-4 sm:p-6 w-full">
     
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">Companyies</h1>
        <p className="text-gray-500 text-sm">Manage Company</p>
      </div>

    
      <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] rounded-2xl p-4 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

      
        <div className="flex justify-between items-center ">

          <div className="flex items-center gap-3 w-full sm:max-w-[300px] border border-gray-200 rounded-lg px-3 py-2">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search companyies..."
              className="w-full outline-none text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


        </div>

        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <div className="flex justify-between items-center ">

            <button
              onClick={() => setOpenModal(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              Add New Company
            </button>

          </div>

          <button className="border border-gray-200 w-full sm:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 text-gray-700">
            <RefreshCw size={18} /> Refresh
          </button>

        </div>


      </div>


      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-gray-100 mt-6 p-5">

      
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <h2 className="text-gray-800 text-lg font-semibold">{filteredCompanyies?.length} Companyies Found</h2>

         
          <div className="flex items-center gap-4 text-gray-600">
            <span>Show:</span>
            <select className="border border-gray-200 rounded-lg px-2 py-1 cursor-pointer">
              <option>5</option>
              <option>10</option>
              <option>15</option>
            </select>
          </div>
        </div>

      
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[700px] text-left overflow-x-auto">
           
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 text-sm text-center">
                <th className="px-5 py-3 font-semibold">Company Name</th>
                <th className="px-5 py-3 font-semibold">Company Address</th>
                <th className="px-5 py-3 font-semibold">GST</th>
                <th className="px-5 py-3 font-semibold">Description</th>
                <th className="px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>

          
            <tbody className="text-gray-700">
              {filteredCompanyies?.map((com, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-blue-50/40 transition-all duration-200 text-center"
                >
                  <td className="px-5 py-4">{com.company_name}</td>
                  <td className="px-5 py-4">{com.company_address}</td>
                  <td className="px-5 py-4">
                    <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow">
                      {com.gst_no || "N/A"}
                    </span>
                  </td>
                  <td className="px-5 py-4">{com.description || "N/A"}</td>

                
                  <td className="px-5 py-4 flex justify-center gap-5">
                    
                    <Eye
                      size={20}
                      className="text-blue-500 hover:text-blue-600 hover:scale-125 cursor-pointer transition transform"
                      onClick={() => {
                        setSelectedCompany(com);
                        setDrawerMode("view");
                        setDrawerOpen(true);
                      }}
                    />

                   
                    <Edit2
                      size={20}
                      className="text-green-500 hover:text-green-700 hover:scale-125 cursor-pointer transition transform"
                      onClick={() => {
                        setTable(com)
                        setOpenModal(true)
                      }}
                    />

                  
                    <Trash2
                      size={20}
                      className="text-red-500 hover:text-red-600 hover:scale-125 cursor-pointer transition transform"
                      onClick={() => handleDelete(com?._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CompanyDrawer setOpenModal={setOpenModal} openModal={openModal} editTable={editTable} />
     
    </div>
  );
}

export default Company
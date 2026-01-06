import { useAssignedAssemblyLines } from "../hooks/useAssignedAssemblyLines";
import  AssemblyLineCards from "../components/AssemblyLineCard/AssemblyLineCards"
import { useState } from "react";
import { Edit2 } from "lucide-react";

const AssignedAssemblyLines = () => {
  const [limit, setLimit] = useState(10);

  const { getAssignedAssemblyLines } = useAssignedAssemblyLines();
  const { data: AssemblyLines = [], isLoading } = getAssignedAssemblyLines;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Checked":
        return "bg-green-500 text-white";
      case "Issue Found":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className=" rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Assigned Assembly Lines
              </h1>
              <p className="text-slate-500 mt-1 text-sm sm:text-base">
                Manage Your Assembly Lines
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl">
        
        <AssemblyLineCards AssemblyLines={AssemblyLines}/>
      
      </div>
    </div>
  );
};

export default AssignedAssemblyLines;

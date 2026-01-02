import React from "react";
import { Clock } from "lucide-react";
import { OctagonAlert, CircleCheckBig } from "lucide-react";

const AssemblyLineCards = ({ AssemblyLines = [] }) => {
  const getStatusClass = (isError) => {
    if (isError) {
      return "text-red-500 bg-red-100 p-4 border rounded-xl";
    } else {
      return "text-green-500 bg-green-100 p-3 border rounded-xl";
    }
  };

  return (
    <div className="flex flex-col w-full p-6 space-y-10 bg-gray-50 min-h-screen">
      {AssemblyLines.map((asl) => (
        <div
          key={asl._id}
          className="rounded-lg shadow-lg bg-white overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-400 p-6 rounded-t-lg text-white">
            <h2 className="text-2xl font-bold">
              {asl.assembly_name}{" "}
              <span className="font-normal text-blue-200">
                ({asl.assembly_number})
              </span>
            </h2>
            <div className="mt-2">
              <span className="font-semibold">Process: </span>
              {asl.process_id?.map((proc) => (
                <span
                  key={proc._id}
                  className="inline-block bg-white text-blue-400 text-sm rounded-full px-3 py-1 m-2 cursor-default select-none"
                >
                  {proc.process_name} ({proc.process_no})
                </span>
              ))}
            </div>
          </div>

          {/* Info cards */}
          <div className="flex flex-wrap gap-6 p-6">
            <InfoCard title="Company" content={asl.company?.company_name} />
            <InfoCard title="Plant" content={asl.plant?.plant_name} />
            <InfoCard
              title="Responsible"
              content={
                <div>
                  <span className="font-semibold text-blue-400 cursor-pointer hover:underline">
                    {asl.responsibleUser?.full_name} (
                    {asl.responsibleUser?.user_id})
                  </span>
                  <br />
                  <span className="text-gray-500 text-sm">
                    {asl.responsibleUser?.email}
                  </span>
                </div>
              }
            />
          </div>

          {/* Checklist Section */}
          <div className="px-6 pb-6">
            <h3 className="text-blue-400 font-bold text-lg mb-4">
              Checklist Items
            </h3>

            {asl.process_id?.map((proc, i) => (
              <div
                key={proc._id}
                className="mb-6 rounded-lg border border-blue-200 p-4"
              >
                <h4 className="font-semibold text-blue-400 mb-3">
                  {i + 1}. {proc.process_name} ({proc.process_no})
                </h4>

                {proc.check_list_items?.map((check, idx) => (
                  <ChecklistItem
                    key={check._id}
                    index={idx}
                    check={check}
                    getStatusClass={getStatusClass}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const InfoCard = ({ title, content }) => (
  <div className="bg-white rounded-md shadow-sm p-4 w-64 min-w-[250px]">
    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
      {title}
    </p>
    <div className="text-lg font-semibold text-gray-600">{content}</div>
  </div>
);

const ChecklistItem = ({ index, check, getStatusClass }) => {
  return (
    <div className="bg-blue-50 rounded-md p-3 mb-3" key={check._id}>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-600">
            {index + 1}. {check.item}
          </p>
          <p className="text-blue-400 text-sm">
            Method: {check.check_list_method}
          </p>
          {(check.min !== undefined ||
            check.max !== undefined ||
            check.uom) && (
            <p className="text-blue-400 text-sm ">
              {check.min !== undefined && (
                <span className="mr-4">Min: {check.min}</span>
              )}
              {check.max !== undefined && (
                <span className="mr-4">Max: {check.max}</span>
              )}
              {check.uom && <span>UOM: {check.uom}</span>}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
          <Clock size={16} />
          <span>{check.check_list_time}</span>
        </div>
      </div>

      {/* Checklist History */}
      {check.check_items_history?.length > 0 ? (
        <div className="mt-2">
          <span className="text-blue-400 font-semibold text-sm ">History:</span>
          <ul className="list-disc list-inside text-gray-700 text-sm mt-3 space-y-3">
            {check.check_items_history.map((hist) => (
              <li key={hist._id} className="flex  items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusClass(
                    hist.is_error
                  )}`}
                >
                  {hist.is_error ? (
                    <span className="flex items-center gap-1 text-nowrap text-xs text-red-600 font-medium">
                      <OctagonAlert size={14} />
                      Error Found
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-nowrap text-green-600 font-medium px-2">
                      <CircleCheckBig size={14} />
                      Checked
                    </span>
                  )}
                </span>
                <span
                  className={`${
                    hist.is_error
                      ? "text-red-600 text-xs font-semibold truncate"
                      : "text-blue-400 font-semibold truncate"
                  }`}
                >
                  {" "}
                  {hist.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-2 text-gray-400 text-xs ">No history available</p>
      )}
    </div>
  );
};

export default AssemblyLineCards;

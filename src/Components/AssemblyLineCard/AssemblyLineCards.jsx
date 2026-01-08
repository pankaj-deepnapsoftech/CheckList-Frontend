import React from "react";
import { Clock } from "lucide-react";
import { OctagonAlert, CircleCheckBig } from "lucide-react";
import { motion } from "framer-motion";

const AssemblyLineCards = ({ AssemblyLines = [] }) => {
  const getStatusClass = (isError) =>
    isError
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className="w-full p-6 space-y-6 bg-gray-50 min-h-screen">
      {AssemblyLines.map((asl) => (
        <motion.div
          key={asl._id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-gray-200 rounded-xl shadow-sm"
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {asl.assembly_name}
              <span className="ml-2 text-sm text-gray-500">
                ({asl.assembly_number})
              </span>
            </h2>

            <div className="flex flex-wrap gap-2 mt-3">
              {asl.process_id?.map((proc) => (
                <span
                  key={proc._id}
                  className="px-3 py-1 text-xs font-medium border rounded-md bg-gray-50 text-gray-700"
                >
                  {proc.process_name} ({proc.process_no})
                </span>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <InfoCard title="Company" content={asl.company?.company_name} />
            <InfoCard title="Plant" content={asl.plant?.plant_name} />
            <InfoCard
              title="Responsible"
              content={
                <>
                  <p className="font-medium text-gray-800">
                    {asl.responsibleUser?.full_name} (
                    {asl.responsibleUser?.user_id})
                  </p>
                  <p className="text-sm text-gray-500">
                    {asl.responsibleUser?.email}
                  </p>
                </>
              }
            />
          </div>

          {/* Checklist */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Checklist Items
            </h3>

            {asl.process_id?.map((proc, i) => (
              <div
                key={proc._id}
                className="mb-6 border border-gray-200 rounded-lg p-5"
              >
                <h4 className="font-medium text-gray-800 mb-4">
                  {i + 1}. {proc.process_name} ({proc.process_no})
                </h4>

                <div className="space-y-4">
                  {proc.check_list_items?.map((check, idx) => (
                    <ChecklistItem
                      key={check._id}
                      index={idx}
                      check={check}
                      getStatusClass={getStatusClass}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const InfoCard = ({ title, content }) => (
  <div className="border border-gray-200 rounded-lg p-4 bg-white">
    <p className="text-xs text-gray-500 uppercase mb-1">{title}</p>
    <div className="text-sm font-medium text-gray-800">{content}</div>
  </div>
);

const ChecklistItem = ({ index, check, getStatusClass }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-medium text-gray-800">
            {index + 1}. {check.item}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Method: {check.check_list_method}
          </p>

          {(check.min !== undefined ||
            check.max !== undefined ||
            check.uom) && (
            <div className="mt-2 text-xs text-gray-600 flex gap-4">
              {check.min !== undefined && <span>Min: {check.min}</span>}
              {check.max !== undefined && <span>Max: {check.max}</span>}
              {check.uom && <span>UOM: {check.uom}</span>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock size={14} />
          {check.check_list_time}
        </div>
      </div>

      {/* History */}
      {check.check_items_history?.length > 0 ? (
        <div className="mt-4 border-t pt-4 space-y-2">
          {check.check_items_history.map((hist) => (
            <div
              key={hist._id}
              className="flex items-center gap-3 text-sm"
            >
              <span
                className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusClass(
                  hist.is_error
                )}`}
              >
                {hist.is_error ? (
                  <OctagonAlert size={14} />
                ) : (
                  <CircleCheckBig size={14} />
                )}
              </span>
              <span className="text-gray-700 truncate">
                {hist.description}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-400">No history available</p>
      )}
    </div>
  );
};

export default AssemblyLineCards;

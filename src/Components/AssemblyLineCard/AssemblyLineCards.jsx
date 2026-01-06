import React from "react";
import { Clock } from "lucide-react";
import { OctagonAlert, CircleCheckBig } from "lucide-react";
import { motion } from "framer-motion";

const AssemblyLineCards = ({ AssemblyLines = [] }) => {
  const getStatusClass = (isError) => {
    if (isError) {
      return "bg-blue-50 border-blue-200 text-blue-700";
    } else {
      return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  return (
    <div className="flex flex-col w-full p-8 space-y-8 bg-slate-50 min-h-screen">
      {AssemblyLines.map((asl, index) => (
        <motion.div
          key={asl._id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="group rounded-3xl shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden border border-blue-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-500"
        >
          {/* Header */}
          <div className="bg-blue-500 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight mb-2 leading-tight">
                {asl.assembly_name}
                <span className="ml-4 text-blue-100 font-semibold text-lg">
                  ({asl.assembly_number})
                </span>
              </h2>

              <div className="flex flex-wrap gap-2">
                {asl.process_id?.map((proc) => (
                  <span
                    key={proc._id}
                    className="bg-white/20 backdrop-blur-sm text-blue-50 text-sm font-semibold rounded-full px-4 py-2 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    {proc.process_name} ({proc.process_no})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
            <InfoCard title="Company" content={asl.company?.company_name} />
            <InfoCard title="Plant" content={asl.plant?.plant_name} />
            <InfoCard
              title="Responsible"
              content={
                <div>
                  <p className="font-bold text-xl text-blue-700 hover:text-blue-800 cursor-pointer transition-colors">
                    {asl.responsibleUser?.full_name} (
                    {asl.responsibleUser?.user_id})
                  </p>
                  <p className="text-sm text-blue-500 mt-1 font-medium">
                    {asl.responsibleUser?.email}
                  </p>
                </div>
              }
            />
          </div>

          {/* Checklist */}
          <div className="px-8 pb-10 pt-4">
            <h3 className="text-2xl font-bold text-blue-700 mb-8 border-b border-blue-100 pb-4">
              Checklist Items
            </h3>

            {asl.process_id?.map((proc, i) => (
              <motion.div
                key={proc._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-10 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/50 to-blue-25/50 p-8 backdrop-blur-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                <h4 className="text-xl font-bold text-blue-700 mb-8 flex items-center gap-3">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg">
                    {i + 1}
                  </span>
                  {proc.process_name} ({proc.process_no})
                </h4>

                <div className="space-y-5">
                  {proc.check_list_items?.map((check, idx) => (
                    <ChecklistItem
                      key={check._id}
                      index={idx}
                      check={check}
                      getStatusClass={getStatusClass}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const InfoCard = ({ title, content }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    className="group rounded-2xl border border-blue-100 bg-white/60 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 -z-10"></div>
    <p className="text-xs uppercase tracking-wider text-blue-500 font-semibold mb-3 group-hover:text-blue-600 transition-colors">
      {title}
    </p>
    <div className="text-xl font-bold text-blue-800 group-hover:text-blue-900 transition-colors">
      {content}
    </div>
  </motion.div>
);

const ChecklistItem = ({ index, check, getStatusClass }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-xl hover:border-blue-200 hover:bg-white/90 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/2 to-blue-600/2 -z-10"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex-1">
          <p className="font-bold text-lg text-blue-800 group-hover:text-blue-900 mb-2 leading-tight">
            {index + 1}. {check.item}
          </p>
          <p className="text-sm text-blue-600 font-semibold mb-2">
            Method: <span className="font-normal">{check.check_list_method}</span>
          </p>

          {(check.min !== undefined ||
            check.max !== undefined ||
            check.uom) && (
            <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
              <div className="flex flex-wrap gap-4 text-xs text-blue-600 font-medium">
                {check.min !== undefined && (
                  <span>Min: <span className="font-bold">{check.min}</span></span>
                )}
                {check.max !== undefined && (
                  <span>Max: <span className="font-bold">{check.max}</span></span>
                )}
                {check.uom && <span>UOM: <span className="font-bold">{check.uom}</span></span>}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm font-bold text-blue-600 ml-4 flex-shrink-0">
          <Clock size={16} className="text-blue-500" />
          <span>{check.check_list_time}</span>
        </div>
      </div>

      {/* History */}
      {check.check_items_history?.length > 0 ? (
        <div className="pt-6 border-t border-blue-100 relative z-10">
          <p className="text-sm font-bold text-blue-600 mb-4 flex items-center gap-2">
            History
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          </p>

          <div className="space-y-3">
            {check.check_items_history.map((hist) => (
              <motion.div
                key={hist._id}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-blue-25/50 border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <span
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getStatusClass(
                    hist.is_error
                  )}`}
                >
                  {hist.is_error ? (
                    <>
                      <OctagonAlert size={16} className="text-blue-600" />
                      <span className="text-blue-700">Error</span>
                    </>
                  ) : (
                    <>
                      <CircleCheckBig size={16} className="text-blue-600" />
                      <span className="text-blue-700">Checked</span>
                    </>
                  )}
                </span>

                <span
                  className={`flex-1 truncate text-sm font-medium ${
                    hist.is_error
                      ? "text-blue-700"
                      : "text-blue-600"
                  }`}
                >
                  {hist.description}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 p-6 bg-blue-50/30 rounded-xl border-2 border-dashed border-blue-200 text-center relative z-10">
          <p className="text-sm text-blue-500 font-medium">No history available</p>
        </div>
      )}
    </motion.div>
  );
};

export default AssemblyLineCards;

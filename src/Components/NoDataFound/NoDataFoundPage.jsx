import { Database } from "lucide-react";

const NoDataFoundPage = ({
  title = "No Data Found",
  subtitle = "There is no data available to display.",
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md
                      px-10 py-12 text-center max-w-2xl w-full">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6 mx-auto">
          <Database className="w-9 h-9 text-slate-400" />
        </div>

        <h3 className="text-2xl font-semibold text-slate-800">
          {title}
        </h3>

        <p className="text-base text-slate-500 mt-3 leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default NoDataFoundPage;
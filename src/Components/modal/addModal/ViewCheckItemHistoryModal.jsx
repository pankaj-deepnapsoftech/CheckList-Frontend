import { X, CheckCircle2, AlertCircle } from "lucide-react";

export default function ViewCheckItemHistoryModal({ open, onClose, data }) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl
        transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-semibold">View Check Item History</h3>
            <p className="text-sm text-slate-500">
              Complete quality check information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl"
          >
            <X />
          </button>
        </div>

        {/* body */}
        <div className="p-6 space-y-5 overflow-y-auto h-[calc(100vh-120px)]">
          <Section title="Check Information">
            <Info label="Item" value={data.checkList.item} />
            <Info label="Method" value={data.checkList.check_list_method} />
            <Info label="Time" value={data.checkList.check_list_time} />
          </Section>

          <Section title="Production Details">
            <Info
              label="Assembly"
              value={`${data?.assembly?.assembly_name} (${data?.assembly?.assembly_number})`}
            />
            <Info
              label="Process"
              value={`${data?.process_id?.process_name} (${data?.process_id?.process_no})`}
            />
          </Section>

          <Section title="Result">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
              ${
                data.result === "Pass"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {data.result === "Pass" ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              {data.result}
            </span>

            {data.remark && (
              <p className="mt-2 text-sm text-slate-600">
                <strong>Remark:</strong> {data.remark}
              </p>
            )}
          </Section>

          <Section title="Audit">
            <Info
              label="Checked By"
              value={`${data.user_id.full_name} (${data.user_id.user_id})`}
            />
            <Info
              label="Checked On"
              value={new Date(data.createdAt).toLocaleString()}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
      <h4 className="text-sm font-semibold text-slate-700 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="text-slate-600 text-right">{value}</span>
    </div>
  );
}

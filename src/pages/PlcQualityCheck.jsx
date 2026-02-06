import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
  Loader2,
  Download,
  Trash,
} from "lucide-react";
import { usePlcData } from "../hooks/usePlcData";
import { usePlcProduct } from "../hooks/usePlcProduct";
import { toast } from "react-toastify";
import SearchableSelect from "../Components/SearchableDropDown/SearchableDropdown";
import { useFormik } from "formik";
import { useQualityCheck } from "../hooks/useQualityCheck";
import Refresh from "../components/Refresh/Refresh";
import axios from "axios";
import Pagination from "../Components/Pagination/Pagination";


export default function PlcProducts() {
  const [showRefresh, setShowRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [machineFilter, setMachineFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1)
  const [isSpinning, setIsSpinning] = useState(false)

  const { getAllQualityChecks, createQualityCheck, deleteQualityCheck } = useQualityCheck({
    search,
    machine_name: machineFilter || undefined,
  });
  const qcList = getAllQualityChecks.data || [];
  const isLoadingQC = getAllQualityChecks.isLoading;
  const isErrorQC = getAllQualityChecks.isError;

  const fetchProductDetails = async () => {
    const inputVal = values.part_no;


    if (!inputVal) {
      return toast.warn("First enter Part No. or Material Code");
    }
    const foundProduct = getdata?.data?.find(
      (item) =>
        item.parameters?.part_no === inputVal ||
        item.parameters?.material_code === inputVal,
    );
    if (foundProduct) {
      setFieldValue("machine_name", foundProduct.device_id || "");
      setFieldValue("material_code", foundProduct.companyname || "");
      setFieldValue("model_code", foundProduct.plantname || "");
      setFieldValue("production_count", foundProduct.production_count || "");

      toast.success("Details fetched successfully");
    } else {
      toast.error("No matching record found");
    }
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    setFieldValue,
  } = useFormik({
    initialValues: {
      production_count: "",
      material_code: "",
      model_code: "",
      machine_name: "",
      part_no: "",
    },
    onSubmit: (val) => {
      createQualityCheck.mutate(val);
      setIsAddOpen(false);
    },
  });

  const { getAllPlcData } = usePlcData({});
  const plcDataList = getAllPlcData.data || [];

  const {
    getAllPlcProducts,
    createPlcProduct,
    updatePlcProduct,
    deletePlcProduct,
    getdata,
  } = usePlcProduct({
    search,
    machine_name: machineFilter || undefined,
  });


  const getTableData = getAllPlcProducts?.data;

  const handleRefresh = async () => {
    setIsSpinning(true)
    setPage(1)
    setShowRefresh(true);
    getAllPlcData.refetch();
    getAllPlcProducts.refetch();
    getAllQualityChecks.refetch();
    setTimeout(() => {
      setIsSpinning(false)
    }, 1000)
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    await Promise.all([
      getAllPlcProducts.refetch(),
      getAllPlcData.refetch(),
      getAllQualityChecks.refetch(),
      minDelay,
    ]);
    setShowRefresh(false);
  };

  const productsList = getAllPlcProducts.data || [];
  const isLoadingProducts = getAllPlcProducts.isLoading;
  const isErrorProducts = getAllPlcProducts.isError;

  const machineOptions = useMemo(() => {
    const machines = new Set();
    plcDataList.forEach((item) => {
      if (item.device_id && item.device_id.trim())
        machines.add(item.device_id.trim());
    });
    productsList.forEach((p) => {
      if (p.machine_name && p.machine_name.trim())
        machines.add(p.machine_name.trim());
    });
    return Array.from(machines).sort();
  }, [plcDataList, productsList]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    // setForm({
    //   part_number: product.part_number || "",
    //   product_name: product.product_name || "",
    //   company_name: product.company_name || "",
    //   plant_name: product.plant_name || "",
    //   machine_name: product.machine_name || "",
    // });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    // try {
    //   await updatePlcProduct.mutateAsync({ id: selectedProduct._id, data: form });
    //   setIsEditOpen(false);
    //   setSelectedProduct(null);
    //   handleReset();
    // } catch (_) { }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deletePlcProduct.mutateAsync(selectedProduct._id);
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return "—";
      const day = String(d.getUTCDate()).padStart(2, "0");
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const year = d.getUTCFullYear();
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${day} ${months[d.getUTCMonth()]} ${year}`;
    } catch {
      return "—";
    }
  };

  const visibleRows = qcList.slice(0, pageSize);

  return (
    <div className="min-h-full bg-gray-50 my-4 mt-9">
      <div className="w-[930px]  flex justify-between mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold">Quality Check</h1>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
          onClick={() => {
            handleReset();
            setIsAddOpen(true);
          }}
        >
          Add Quality Check
        </button>
      </div>
      <div className="w-[930px] h-[38px] mx-auto flex justify-between mt-10">
        <div className="flex relative w-full max-w-md">
          <Search
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/2 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search"
            type="text"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleRefresh}
            className="px-2 py-1  rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-100 transition text-gray-500"
          >
            <RefreshCcw className={`h-4 w-5 transition-transform ${isSpinning ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      <div className="w-[930px]  border border-gray-200 rounded-xl mx-auto mt-5 shadow-md bg-white">
        <table className="w-full min-w-[930px] text-sm text-center ">
          <thead>
            <tr className="bg-linear-to-r from-blue-600 to-sky-500 text-white uppercase whitespace-nowrap outline-none rounded-t-lg text-xs tracking-wide">
              <th className="px-4 sm:px-6 py-3 font-medium rounded-tl-xl">
                PART NUMBER
              </th>
              <th className="px-4 sm:px-6 py-3 font-medium">COMPANY NAME</th>
              <th className="px-4 sm:px-6 py-3 font-medium">PLANT NAME</th>
              <th className="px-4 sm:px-6 py-3 font-medium">QUANTITY</th>
              <th className="px-4 sm:px-6 py-3 font-medium">APPROVED</th>
              <th className="px-4 sm:px-6 py-3 font-medium">REJECTED</th>
              <th>DATE</th>
              <th className="px-4 sm:px-6 py-3 font-medium rounded-tr-xl">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y  divide-gray-200">
            {isLoadingQC && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Loading quality checks...</span>
                  </div>
                </td>
              </tr>
            )}
            {isErrorQC && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-10 text-center text-sm text-red-600"
                >
                  {getAllQualityChecks.error?.response?.data?.message ||
                    "Failed to load quality checks"}
                </td>
              </tr>
            )}
            {getTableData?.length === 0 && (
              <tr className="relative">
                <td
                  colSpan={8}
                  className="mt-10 pt-30 align-middle text-center text-lg
                  text-gray-500"
                >
                  No quality checks found
                </td>
              </tr>
            )}
            {!isLoadingQC &&
              getTableData?.map((row) => (
                <tr
                  key={row._id}
                  className="text-center bg-white hover:bg-gray-50"
                >
                  <td className="px-4 sm:px-6 py-3">{row.part_no || "—"}</td>
                  <td className="px-4 sm:px-6 py-3">
                    {row.company_name || "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-3">{row.plant_name || "—"}</td>
                  <td className="px-4 sm:px-6 py-3">—</td>
                  <td className="px-4 sm:px-6 py-3">
                    {row.status === "Approved" ? "Approved" : "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    {row.status === "Rejected" ? "Rejected" : "—"}
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    {formatDate(row.checked_at || row.created_at)}
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <button
                      onClick={() => deleteQualityCheck.mutate(row._id)}
                      className=" text-red-500 cursor-pointer hover:text-red-700"
                    >
                      <Trash size={17} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        
          
      </div>

      <Pagination 
        page={page}
        setPage={setPage}
      />

      {/* // Add Quality Check is here  */}

      {isAddOpen && (
        <form
          onSubmit={handleSubmit}
          className="fixed inset-0 z-50 flex justify-end"
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              setIsAddOpen(false);
              handleReset();
            }}
            aria-hidden="true"
          />
          <div className="relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Quality Check
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter product and machine details
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  handleReset();
                }}
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="flex flex-col">
                <label className="block text-[15px] font-medium text-gray-700 mb-1">
                  Enter Part No. / Material Code
                </label>
                <input
                  name="part_no"
                  value={values.part_no}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter part number or material code..."
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 mt-5 py-2 px-4 text-white border rounded border-gray-300 cursor-pointer w-[45%] self-end"
                  onClick={fetchProductDetails}
                  type="button"
                >
                  Get Product Details
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Production Count
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 outline-none"
                  type="number"
                  name="production_count"
                  readOnly
                  value={values.production_count}
                  placeholder="Waiting..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="material_code"
                    value={values.material_code}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus:outline-none"
                    placeholder="Waiting..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Plant Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600  focus:outline-none"
                    name="model_code"
                    value={values.model_code}
                    readOnly
                    placeholder="Waiting..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Machine Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600  focus:outline-none"
                  name="machine_name"
                  value={values.machine_name}
                  readOnly
                  placeholder="Waiting..."
                />
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddOpen(false);
                  handleReset();
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createQualityCheck.isPending}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                onClick={() => setIsAddOpen(false)}
              >
                {createQualityCheck.isPending && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Save Quality Check
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

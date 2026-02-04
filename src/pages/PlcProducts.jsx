import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, RefreshCcw, Search, Trash2, X, Loader2 } from "lucide-react";
import { usePlcData } from "../hooks/usePlcData";
import { usePlcProduct } from "../hooks/usePlcProduct";
import { toast } from "react-toastify";

export default function PlcProducts() {
  const [search, setSearch] = useState("");
  const [machineFilter, setMachineFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    part_number: "",
    product_name: "",
    company_name: "",
    plant_name: "",
    machine_name: "",
  });

  const { getAllPlcData } = usePlcData({});
  const plcDataList = getAllPlcData.data || [];

  const { getAllPlcProducts, createPlcProduct, updatePlcProduct, deletePlcProduct } = usePlcProduct({
    search,
    machine_name: machineFilter || undefined,
  });
  const productsList = getAllPlcProducts.data || [];
  const isLoadingProducts = getAllPlcProducts.isLoading;
  const isErrorProducts = getAllPlcProducts.isError;

  const machineOptions = useMemo(() => {
    const machines = new Set();
    plcDataList.forEach((item) => {
      if (item.device_id && item.device_id.trim()) machines.add(item.device_id.trim());
    });
    productsList.forEach((p) => {
      if (p.machine_name && p.machine_name.trim()) machines.add(p.machine_name.trim());
    });
    return Array.from(machines).sort();
  }, [plcDataList, productsList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      part_number: "",
      product_name: "",
      company_name: "",
      plant_name: "",
      machine_name: "",
    });
  };

  const handleSave = async () => {
    if (!form.part_number && !form.product_name && !form.company_name && !form.plant_name && !form.machine_name) {
      toast.error("Please fill at least one field");
      return;
    }
    try {
      await createPlcProduct.mutateAsync(form);
      setSelectedProduct(res?.data || res);
      setIsAddOpen(false);
      resetForm();
    } catch (_) {}
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setForm({
      part_number: product.part_number || "",
      product_name: product.product_name || "",
      company_name: product.company_name || "",
      plant_name: product.plant_name || "",
      machine_name: product.machine_name || "",
    });
    setIsEditOpen(true);
    console.log(product)
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    try {
      await updatePlcProduct.mutateAsync({ id: selectedProduct._id, data: form });
      setIsEditOpen(false);
      setSelectedProduct(null);
      resetForm();
    } catch (_) {}
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deletePlcProduct.mutateAsync(selectedProduct._id);
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    } catch (_) {}
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return "—";
      const day = String(d.getUTCDate()).padStart(2, "0");
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const year = d.getUTCFullYear();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${day} ${months[d.getUTCMonth()]} ${year}`;
    } catch {
      return "—";
    }
  };

  const visibleRows = productsList.slice(0, pageSize);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
                <div className="h-6 w-6 rounded-md bg-white/15" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Quality Check</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage your products and services inventory</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
                onClick={() => { resetForm(); setIsAddOpen(true); }}
              >
                <Plus size={16} />
                Add Quality Check
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => { getAllPlcData.refetch(); getAllPlcProducts.refetch(); }}
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px] max-w-xl">
              <div className="text-sm font-medium text-gray-900">Search Quality Check</div>
              <div className="mt-2 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, ID, category..."
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="min-w-[200px]">
              <div className="text-sm font-medium text-gray-900">Filter by Machine</div>
              <div className="mt-2">
                <select
                  value={machineFilter}
                  onChange={(e) => setMachineFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All machines</option>
                  {machineOptions.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Quality Check Directory</h2>
              <p className="text-sm text-gray-500 mt-0.5">Showing {visibleRows.length} of {productsList.length} quality check</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Part Number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Plant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Machine    </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Created On</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoadingProducts && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Loader2 size={20} className="animate-spin" />
                        <span>Loading products...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {isErrorProducts && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-red-600">
                      {getAllPlcProducts.error?.response?.data?.message || "Failed to load products"}
                    </td>
                  </tr>
                )}
                {!isLoadingProducts && !isErrorProducts && visibleRows.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{p.part_number || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">{p.product_name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{p.company_name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{p.plant_name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{p.machine_name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{formatDate(p.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => { setSelectedProduct(p); setIsViewOpen(true); }} className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="View"><Eye size={16} /></button>
                        <button type="button" onClick={() => handleEdit(p)} className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100" title="Edit"><Pencil size={16} /></button>
                        <button type="button" onClick={() => { setSelectedProduct(p); setIsDeleteOpen(true); }} className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoadingProducts && !isErrorProducts && visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setIsAddOpen(false); resetForm(); }} aria-hidden="true" />
          <div className="relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Add Quality Check</h2>
                <p className="text-xs text-gray-500 mt-0.5">Enter product and machine details</p>
              </div>
              <button type="button" onClick={() => { setIsAddOpen(false); resetForm(); }} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Part No :</label>
                <input name="part_number" value={form.part_number} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Enter part number..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Product Name</label>
                {/* <textarea name="product_name" value={form.product_name} onChange={handleChange} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" placeholder="Enter material description" /> */}
                <select className="w-full border h-[35px] rounded border-gray-300 text-gray-500 text-sm px-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" name="product_name" value={form.product_name} onChange={handleChange} id="">
                  <option value="product_1">Product 1</option>
                  <option value="product_2">Product 2</option>
                  <option value="product_3">Product 3</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                  {/* <input name="company_name" value={form.company_name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Enter part number" /> */}
                  <select className="w-full h-[35px] border border-gray-300 rounded text-gray-500 text-sm px-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" name="company_name" value={form.company_name} id="" onChange={handleChange}>
                    <option value="company_1">Company 1</option>
                    <option value="company_2">Company 2</option>
                    <option value="company_3">Company 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Plant Name</label>
                  {/* <input name="plant_name" value={form.plant_name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Enter model no./code" /> */}
                  <select className="w-full h-[35px] border rounded border-gray-300 text-gray-500 text-[14px] px-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"  name="plant_name" value={form.plant_name} id="" onChange={handleChange}>
                    <option value="plant_1">Plant 1</option>
                    <option value="plant_2">Plant 2</option>
                    <option value="plant_3">Plant 3</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Machine Name</label>
                <select name="machine_name" value={form.machine_name} onChange={handleChange} disabled={getAllPlcData.isLoading} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed">
                  {/* <option value="">{getAllPlcData.isLoading ? "Loading machines..." : "Select machine"}</option>
                  {machineOptions.map((m) => <option key={m} value={m}>{m}</option>)} */}
                  <option value="">Machine 1</option>
                  <option value="">Machine 2</option>
                  <option value="">Machine 3</option>
                </select>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-3 flex justify-end gap-3">
              <button type="button" onClick={() => { setIsAddOpen(false); resetForm(); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" disabled={createPlcProduct.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2" onClick={handleSave}>
                {createPlcProduct.isPending && <Loader2 size={16} className="animate-spin" />}
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setIsViewOpen(false); setSelectedProduct(null); }} aria-hidden="true" />
          <div className="relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div><h2 className="text-lg font-semibold text-gray-900">View Product</h2><p className="text-xs text-gray-500 mt-0.5">Product details</p></div>
              <button type="button" onClick={() => { setIsViewOpen(false); setSelectedProduct(null); }} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Material Code</label><div className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{selectedProduct.part_number || "—"}</div></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Material Description</label><div className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2 min-h-[60px]">{selectedProduct.product_name || "—"}</div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Part No.</label><div className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{selectedProduct.company_name || "—"}</div></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Model No./Code</label><div className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{selectedProduct.plant_name || "—"}</div></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Machine Name</label><div className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{selectedProduct.machine_name || "—"}</div></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Created On</label><div className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">{formatDate(selectedProduct.created_at)}</div></div>
            </div>
            <div className="border-t border-gray-200 px-6 py-3 flex justify-end">
              <button type="button" onClick={() => { setIsViewOpen(false); setSelectedProduct(null); }} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - same fields as Add */}
      {isEditOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setIsEditOpen(false); setSelectedProduct(null); resetForm(); }} aria-hidden="true" />
          <div className="relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div><h2 className="text-lg font-semibold text-gray-900">Edit Product</h2><p className="text-xs text-gray-500 mt-0.5">Update product and machine details</p></div>
              <button type="button" onClick={() => { setIsEditOpen(false); setSelectedProduct(null); resetForm(); }} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Material Code</label><input name="part_number" value={form.part_number} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Enter material code" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Material Description</label><textarea name="product_name" value={form.product_name} onChange={handleChange} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" placeholder="Enter material description" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Part No.</label><input name="company_name" value={form.company_name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Enter part number" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Model No./Code</label><input name="plant_name" value={form.plant_name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Enter model no./code" /></div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Machine Name</label>
                <select name="machine_name" value={form.machine_name} onChange={handleChange} disabled={getAllPlcData.isLoading} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed">
                  <option value="">{getAllPlcData.isLoading ? "Loading machines..." : "Select machine"}</option>
                  {machineOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-3 flex justify-end gap-3">
              <button type="button" onClick={() => { setIsEditOpen(false); setSelectedProduct(null); resetForm(); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" disabled={updatePlcProduct.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2" onClick={handleUpdate}>
                {updatePlcProduct.isPending && <Loader2 size={16} className="animate-spin" />}
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setIsDeleteOpen(false); setSelectedProduct(null); }} aria-hidden="true" />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div><h2 className="text-lg font-semibold text-gray-900">Delete Product</h2><p className="text-xs text-gray-500 mt-0.5">Are you sure you want to delete this product?</p></div>
              <button type="button" onClick={() => { setIsDeleteOpen(false); setSelectedProduct(null); }} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="px-6 py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">This action cannot be undone.</p>
                <p className="text-xs text-red-700"><span className="font-medium">Material Code:</span> {selectedProduct.part_number || "—"}</p>
                <p className="text-xs text-red-700"><span className="font-medium">Machine Name:</span> {selectedProduct.machine_name || "—"}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-3 flex justify-end gap-3">
              <button type="button" onClick={() => { setIsDeleteOpen(false); setSelectedProduct(null); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" disabled={deletePlcProduct.isPending} onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
                {deletePlcProduct.isPending && <Loader2 size={16} className="animate-spin" />}
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

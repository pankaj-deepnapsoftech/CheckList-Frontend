import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useFormik } from "formik";
import { useCompanies } from "../hooks/useCompanies";
import { companyValidationSchema } from "../Validation/CompanyValidation";

const CompanyDrawer = ({ openModal, setOpenModal, editTable }) => {

  const { create, update } = useCompanies()

  const formik = useFormik({
    initialValues: {
      company_name: editTable?.company_name || "",
      company_address: editTable?.company_address || "",
      gst_no: editTable?.gst_no || "",
      description: editTable?.description || "",
    },
    validationSchema: companyValidationSchema,
    enableReinitialize: true,
    onSubmit: (value) => {
      if (editTable) {
        update.mutate({ id: editTable?._id, data: value })
      } else {
        create.mutate(value)
      }
      formik.resetForm()
      setOpenModal(false)
    }

  })

  if (!openModal) return null;
 

  return (
    <div className={`${openModal ? "translate-x-0" : "translate-x-full"}
 fixed inset-0 bg-black/40  z-50 flex justify-end`}>

      <div className="bg-white h-full w-[420px] shadow-lg p-6 animate-slideLeft overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editTable ? "Edit Company" : "Add Company"}

          </h2>
          <button className="cursor-pointer" onClick={() => { setOpenModal(false); formik.resetForm() }}
          >
            <X size={22} className="text-gray-500 hover:text-black" />
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1"
              value={formik.values.company_name}
              name="company_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />

            {formik.touched.company_name && formik.errors.company_name && (
              <p className="text-red-500">{formik.errors.company_name}</p>
            )}

          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">
              Company Address
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 "
              value={formik.values.company_address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="company_address"
            />
            {formik.touched.company_address && formik.errors.company_address && (
              <p className="text-red-500">{formik.errors.company_address}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">GST</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 "
              value={formik.values.gst_no}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="gst_no"
            />
            {formik.touched.gst_no && formik.errors.gst_no && (
              <p className="text-red-500">{formik.errors.gst_no}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 "
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="description"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500">{formik.errors.description}</p>
            )}
          </div>


          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4"
          >
            {editTable ? "Updated Company " : " Add Company"}
          </button>

        </form>
      </div>


    </div>
  );
}
export default CompanyDrawer;
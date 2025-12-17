import React, { useState } from "react";
import { X, PlusCircle, Trash2 } from "lucide-react";
import { useFormik } from "formik";
import { processValidationSchema } from "../../../Validation/ProcessValidation";
import { useProcess } from "../../../hooks/useProcess";

export default function AddProcessModal({ openModal, setOpenModal, editTable, viewModal, mode }) {
  const { PostProcessData, UpdateProcess } = useProcess()

  const formik = useFormik({
    initialValues: {
      process_no: editTable?.process_no || viewModal?.process_no || "",
      process_name:editTable?.process_name || viewModal?.process_name || "",
    },
    enableReinitialize:true,
    validationSchema: processValidationSchema,
    onSubmit: (value) => {
     if(editTable){
      UpdateProcess.mutate({value:value,id:editTable?._id},{
        onSuccess:()=>{
          setOpenModal(false)
          formik.resetForm()
        }
      })
     }else{
       PostProcessData.mutate(value, {
         onSuccess: () => {
           setOpenModal(false)
           formik.resetForm()
         }
       })
     }
    }
  })

  const isView = !!viewModal;
  const title = {
    add: "Add Process",
    edit: "Update Edit",
    view: "View Process Details",
  };


  if (!open) return null;
  return (
    <div className={`${openModal ? "translate-x-0" : "translate-x-full"}
 fixed inset-0 bg-black/40  z-50 flex justify-end`}>

      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setOpenModal(false)}
      />


      <div className="ml-auto h-full w-full max-w-md bg-white shadow-xl p-6 relative animate-slideLeft overflow-y-auto">

        <button
          className="absolute cursor-pointer right-4 top-4 text-gray-600 hover:text-black"
          onClick={() => setOpenModal(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">{title[mode]}</h2>


        <form onSubmit={formik.handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Process No.</span>
            <input
              disabled={isView}
              type="text"
              value={formik.values.process_no}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="process_no"
              placeholder="Enter Process No."
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {
              formik.touched.process_no && formik.errors.process_no && (
                <p className="text-sm text-red-500">{formik.errors.process_no}</p>
              )
            }
          </label>


          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Process Name</span>
            <input
              disabled={isView}
              type="text"
              value={formik.values.process_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="process_name"
              placeholder="Enter Process Name"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {
              formik.touched.process_name && formik.errors.process_name && (
                <p className="text-sm text-red-500">{formik.errors.process_name}</p>
              )
            }
          </label>



          <button disabled={isView} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
            {title[mode]}
          </button>
        </form>
      </div>
    </div>
  );
}

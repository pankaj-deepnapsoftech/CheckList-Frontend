import React from "react";
import { X, FileText, Upload } from "lucide-react";
import { useFormik } from "formik";

const AddDocumentModal = ({
    openModal,
    setOpenModal,
    editData = null,
    mode = "add",
}) => {
    const isView = mode === "view";

    const titleMap = {
        add: "Add Document",
        edit: "Update Document",
        view: "View Document",
    };

    const formik = useFormik({
        initialValues: {
            document_name: editData?.document_name ?? "",
            category: editData?.category ?? "",
            expiry_date: editData?.expiry_date ?? "",
            document_file: null,
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log("DOCUMENT DATA", values);
            setOpenModal(false);
        },
    });

    const { values, handleChange, handleSubmit, setFieldValue } = formik;

    if (!openModal) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
            <div className="absolute inset-0" onClick={() => setOpenModal(false)} />

            <div className="relative h-full w-full max-w-md bg-white shadow-xl p-6">
                {/* CLOSE */}
                <button
                    className="absolute right-4 top-4 text-gray-600 hover:text-black"
                    onClick={() => setOpenModal(false)}
                >
                    <X size={20} />
                </button>
 
                <h2 className="text-xl font-semibold mb-6">{titleMap[mode]}</h2>

                <form onSubmit={handleSubmit}>
                    {/* DOCUMENT NAME */}
                    <Input
                        label="Document Name"
                        name="document_name"
                        value={values.document_name}
                        onChange={handleChange}
                        readOnly={isView}
                    />

                    {/* CATEGORY */}
                    <Input
                        label="Category"
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        readOnly={isView}
                    />

                    {/* EXPIRY DATE */}
                    <Input
                        type="date"
                        label="Expiry Date"
                        name="expiry_date"
                        value={values.expiry_date}
                        onChange={handleChange}
                        readOnly={isView}
                    />  

                    {/* FILE UPLOAD */}
                    <label className="block mb-6">  
                        <span className="font-medium">Attach Document</span>

                        {isView && editData?.document_file ? (
                            <div className="mt-3 flex items-center gap-2 text-blue-600">
                                <FileText size={18} />
                                <span className="text-sm">{editData.document_file}</span>
                            </div>
                        ) : (
                            <>       
                                {/* DROP ZONE */}
                                <div
                                    className="mt-3 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const file = e.dataTransfer.files[0]; 
                                        if (file) setFieldValue("document_file", file);
                                    }}
                                    onClick={() => document.getElementById("documentUpload").click()}  
                                >
                                    <Upload className="mx-auto mb-3 text-gray-500" size={32} />

                                    <p className="text-gray-700 font-medium">
                                        Drag and drop here
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        or <span className="text-blue-600 font-medium">Browse files</span>
                                    </p>

                                    <input
                                        id="documentUpload"
                                        type="file"
                                        hidden
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) =>
                                            setFieldValue("document_file", e.target.files[0])
                                        }
                                    />
                                </div>

                                {/* FILE INFO */}
                                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                    <span>Accepted File Types: PDF, DOC, DOCX, JPG, PNG...</span>
                                </div>

                                {/* SELECTED FILE */}
                                {values.document_file && (
                                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                                        <FileText size={16} />
                                        <span className="truncate max-w-[250px]">
                                            {values.document_file.name}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </label>


                    {/* SUBMIT */}
                    {!isView && (
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                        >
                            {titleMap[mode]}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

/* ---------- Reusable Components ---------- */

const Input = ({ label, ...props }) => (
    <label className="block mb-4">
        <span className="font-medium">{label}</span>
        <input
            {...props}
            className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg"
        />
    </label>
);

export default AddDocumentModal;

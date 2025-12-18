import * as Yup from "yup";


export const validationSchema = Yup.object({
    process: Yup.string().required("Process is required"),
    item: Yup.string().required("Item is required"),
    description: Yup.string().required("Description is required"),
    check_list_method: Yup.string().required("Check Item method is required"),
    check_list_time: Yup.string().required("Check Item time is required"),
    result_type: Yup.string().required("Result type is required"),

    // min: Yup.number().when("result_type", {
    //     is: "measurement",
    //     then: () => Yup.number().required("Min value required"),
    // }),

    // max: Yup.number().when("result_type", {
    //     is: "measurement",
    //     then: () => Yup.number().required("Max value required"),
    // }),

    // uom: Yup.string().when("result_type", {
    //     is: "measurement",
    //     then: () => Yup.string().required("UOM is required"),
    // }),
});

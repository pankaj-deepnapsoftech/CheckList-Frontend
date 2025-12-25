import * as Yup from "yup";

export const plantValidationSchema = Yup.object({
    plant_name: Yup.string()
        .required("Plant name is required")
        .trim(),

    plant_address: Yup.string()
        .nullable()
        .trim(),

    company_id: Yup.string()
        .required("Company is required")
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
            "Invalid company ID (must be a valid UUID)"
        ),

    description: Yup.string()
        .nullable()
});
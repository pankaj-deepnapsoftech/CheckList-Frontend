import * as Yup from "yup";

export const workflowValidationSchema = Yup.object({
  name: Yup.string()
    .required("Workflow name is required")
    .trim()
    .min(2, "Workflow name must be at least 2 characters"),
  workflow_management: Yup.string()
    .required("Workflow management is required"),
});

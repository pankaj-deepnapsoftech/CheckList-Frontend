import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";

export const RegisterEmployee = (
  hodvales,
  cmId,
  plId,
  search,
  page,
  limit,
  enabled = true,
) => {
  const qc = useQueryClient();

  const getAllEmployee = useQuery({
    queryKey: ["employees", page, limit],
    queryFn: async () => {
      const res = await axiosHandler.get(
        `/users/get-employees?page=${page}&&limit=${limit}`,
      );
      return res?.data?.data;
    },
    enabled: !search,
    placeholderData: keepPreviousData,
  });
  const getAllHOD = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await axiosHandler.get(`/users/get-all-hods`);
      return res?.data?.data;
    },
  });

  const createEmployee = useMutation({
    mutationFn: async (data) => {
      const res = await axiosHandler.post("/users/register-user", data);
      return res?.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create Employee",
      );
    },
  });
  const searchEmployee = useQuery({
    queryKey: ["search-employee",hodvales, cmId, plId, search],
    queryFn: async () => {
      const res = await axiosHandler.get("/users/search-employee", {
        params: {
          is_hod: hodvales,
          company: cmId || undefined,
          plant: plId || undefined,
          search,
        },
      });
      return res.data.data;
    },
    enabled: !!hodvales || !!search || !!cmId || !!plId,
    keepPreviousData: true,
  });

  const updateEmployee = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosHandler.put(
        `/users/update-user-by-admin/${id}`,
        data,
      );
      return res?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee updated successfully" || data?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const toggleTerminateEmployee = useMutation({
    mutationFn: async ({ id, terminate }) => {
      const res = await axiosHandler.put(`/users/update-user-by-admin/${id}`, {
        terminate,
      });

      return {
        terminate,
        message: res?.data?.message,
      };
    },

    onSuccess: ({ terminate }) => {
      if (terminate) {
        toast.error("User Terminated Successfully", {});
      } else {
        toast.success("User Successfully Un-Terminated", {});
      }

      qc.invalidateQueries({ queryKey: ["employees"] });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });
  const AllEmpData = useQuery({
    queryKey: ["get-all-employees"],
    queryFn: async () => {
      const res = await axiosHandler.get("/users/get-all-employees");
      return res?.data?.data;
    },
  });

  return {
    getAllEmployee,
    createEmployee,
    searchEmployee,
    updateEmployee,
    toggleTerminateEmployee,
    AllEmpData,
    getAllHOD,
  };
};

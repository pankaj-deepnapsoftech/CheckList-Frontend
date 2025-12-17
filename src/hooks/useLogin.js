import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";
import { toast } from "react-toastify";

export const useLogin = () => {
  const qc = useQueryClient();

  const logedinUser = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosHandler.get("/users/loged-in-user");
      sessionStorage.setItem("user", JSON.stringify(res?.data?.user));
      return res.data.user;
    },
    retry: false,
    placeholderData: keepPreviousData,
  });  

  const loginUser = useMutation({
    mutationFn: async (data) => {
      const res = await axiosHandler.post("/users/login-user", data);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const logOutUser = useMutation({
    mutationFn: async () => {
      await axiosHandler.get("/users/logout-user");
    },
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["users"] });
      sessionStorage.removeItem("user");
    },
  });

  const forgotPassoword = useMutation({
    mutationFn: async (data) => {
      const res = await axiosHandler.post("/users/verify-email", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset link sent to your email!");
    },
  });

  return {
    logedinUser,
    loginUser,
    logOutUser,
    forgotPassoword,
  };
};

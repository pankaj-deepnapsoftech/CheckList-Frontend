import { useMutation } from "@tanstack/react-query";
import axiosHandler from "../config/axiosconfig";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosHandler.post("/users/login-user", data);
      return res;
    },
  });
};

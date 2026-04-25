import { ApiError } from "@/lib/error";
import axios, { AxiosResponse } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // if (error.response?.status === 401) {
    //   window.location.href = "/login";
    //   return;
    // }

    const isLoginRoute = error.config?.url?.includes("/auth/signin");

    console.log(isLoginRoute);

    if (error.response?.data) {
      const apiError = new ApiError(error.response.data);

      // Only redirect on 401 if NOT on login route
      if (error.response?.status === 401 && !isLoginRoute) {
        window.location.href = "/login";
        return Promise.reject(apiError);
      }

      return Promise.reject(apiError);
    }

    // throw new ApiError({
    //   statusCode: 500,
    //   message: "Something went wrong",
    //   error: "Internal Error",
    // });

    return Promise.reject(
      new ApiError({
        statusCode: 500,
        message: "Something went wrong",
        error: "Internal Error",
      }),
    );
  },
);

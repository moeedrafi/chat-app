import { ApiError } from "@/lib/error";
import axios, { AxiosResponse } from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.data) {
      throw new ApiError(error.response.data);
    }

    throw new ApiError({
      statusCode: 500,
      message: "Something went wrong",
      error: "Internal Error",
    });
  },
);

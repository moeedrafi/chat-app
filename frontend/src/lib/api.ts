import { axiosInstance } from "@/lib/axiosInstance";

type ApiSuccessResponse<T> = {
  data: T;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const api = {
  get: async <TResponse>(
    endpoint: string,
  ): Promise<ApiSuccessResponse<TResponse>> => {
    const res =
      await axiosInstance.get<ApiSuccessResponse<TResponse>>(endpoint);
    return res.data;
  },

  post: async <TBody, TResponse = unknown>(
    endpoint: string,
    data: TBody,
  ): Promise<ApiSuccessResponse<TResponse>> => {
    const res = await axiosInstance.post<ApiSuccessResponse<TResponse>>(
      endpoint,
      data,
    );
    return res.data;
  },

  patch: async <TBody, TResponse = unknown>(
    endpoint: string,
    data: TBody,
  ): Promise<ApiSuccessResponse<TResponse>> => {
    const res = await axiosInstance.patch<ApiSuccessResponse<TResponse>>(
      endpoint,
      data,
    );
    return res.data;
  },

  delete: async <TResponse = unknown>(
    endpoint: string,
  ): Promise<ApiSuccessResponse<TResponse>> => {
    const res =
      await axiosInstance.delete<ApiSuccessResponse<TResponse>>(endpoint);
    return res.data;
  },
};

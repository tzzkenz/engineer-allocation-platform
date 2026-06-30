import type { EmployeeResponse } from "@entities/employee/types/apiTypes";

import employeeBaseApi from "@shared/api/base.api";
import type { LoginRequest, LoginResponse } from "@shared/api/types";

export const authApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (formData) => ({
        url: "/auth/login",
        method: "POST",
        body: formData,
      }),
    }),
    getCurrentUser: builder.query<EmployeeResponse, void>({
      query: () => ({
        url: "/employees/me",
        method: "GET",
      }),
    }),
  }),
});
export const { useLoginMutation, useGetCurrentUserQuery } = authApi;

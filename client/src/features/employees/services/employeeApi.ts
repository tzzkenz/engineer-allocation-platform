import { type PaginatedResult } from "@/shared/type/pagination";

import { type EmployeeResponse } from "@entities/employee/types/apiTypes";

import employeeBaseApi from "@shared/api/base.api";

export const employeeApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<PaginatedResult<EmployeeResponse>, string>({
      query: (params) => ({
        url: `/employees?${params}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetEmployeesQuery } = employeeApi;

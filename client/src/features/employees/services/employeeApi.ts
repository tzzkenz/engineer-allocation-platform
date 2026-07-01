import { type EmployeeResponse } from "@entities/employee/types/apiTypes";

import employeeBaseApi from "@shared/api/base.api";

export const employeeApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeResponse[], void>({
      query: () => ({
        url: "/employees",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetEmployeesQuery } = employeeApi;

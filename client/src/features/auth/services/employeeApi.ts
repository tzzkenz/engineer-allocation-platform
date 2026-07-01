import employeeBaseApi from "@/shared/api/base.api";
import type {
  EmployeeCreateRequest,
  EmployeeCreateResponse,
  EmployeeUpdateRequest,
} from "@/entities/project/types/apiTypes";

export const employeeApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEmployee: builder.mutation<EmployeeCreateResponse,EmployeeCreateRequest>({
      query: (employee) => ({
        url: "/employees",
        method: "POST",
        body: employee,
      }),
    }),

    updateEmployee: builder.mutation<EmployeeCreateResponse,{ employee_id: number; employee: EmployeeUpdateRequest }>({
      query: ({ employee_id, employee }) => ({
        url: `/employees/${employee_id}`,
        method: "PATCH",
        body: employee,
      }),
    }),

    getEmployeeById: builder.query<EmployeeCreateResponse, number>({
      query: (employee_id) => ({
        url: `/employees/${employee_id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetEmployeeByIdQuery,
} = employeeApi;
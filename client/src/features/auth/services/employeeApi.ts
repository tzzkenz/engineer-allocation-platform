import type {
  EmployeeCreateRequest,
  EmployeeCreateResponse,
  EmployeeUpdateRequest,
} from "@/entities/project/types/apiTypes";
import employeeBaseApi from "@/shared/api/base.api";
import {
  type AddEmployeeSkillsRequest,
  type AddEmployeeSkillsResponse,
  type DeleteEmployeeSkillRequest,
  type DeleteEmployeeSkillResponse,
  type GetEmployeeSkillsResponse,
  type UpdateEmployeeSkillInterestRequest,
} from "@/shared/api/types";

export const employeeApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEmployee: builder.mutation<EmployeeCreateResponse, EmployeeCreateRequest>({
      query: (employee) => ({
        url: "/employees",
        method: "POST",
        body: employee,
      }),
    }),

    updateEmployee: builder.mutation<
      EmployeeCreateResponse,
      { employee_id: number; employee: EmployeeUpdateRequest }
    >({
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
    addEmployeeSkills: builder.mutation<
      AddEmployeeSkillsResponse,
      {
        employee_id: number;
        body: AddEmployeeSkillsRequest;
      }
    >({
      query: ({ employee_id, body }) => ({
        url: `/employees/${employee_id}/skills`,
        method: "POST",
        body,

      }),
      invalidatesTags: (result, error, arg) => [
    { type: "EmployeeSkills", id: arg.employee_id },
  ],
    }),
    getEmployeeSkills: builder.query<GetEmployeeSkillsResponse, number>({
      query: (employee_id) => ({
        url: `/employees/${employee_id}/skills`,
        method: "GET",

      }),
      providesTags: (result, error, employee_id) => [
    { type: "EmployeeSkills", id: employee_id },
  ],
    }),
    deleteEmployeeSkill: builder.mutation<DeleteEmployeeSkillResponse, DeleteEmployeeSkillRequest>({
      query: ({ employee_id, skill_id }) => ({
        url: `/employees/${employee_id}/skills/${skill_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
    { type: "EmployeeSkills", id: arg.employee_id },
  ],
    }),
    updateEmployeeSkillInterest: builder.mutation<
  void,
  {
    employee_id: number;
    skill_id: number;
    body: UpdateEmployeeSkillInterestRequest;
  }
>({
  query: ({ employee_id, skill_id, body }) => ({
    url: `/employees/${employee_id}/skills/${skill_id}/interest`,
    method: "PATCH",
    body,
  }),
  invalidatesTags: (result, error, arg) => [
    { type: "EmployeeSkills", id: arg.employee_id },
  ],
}),
  }),
});

export const {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetEmployeeByIdQuery,
  useAddEmployeeSkillsMutation,
  useGetEmployeeSkillsQuery,
  useDeleteEmployeeSkillMutation,
  useUpdateEmployeeSkillInterestMutation,
} = employeeApi;

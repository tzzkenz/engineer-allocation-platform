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
    }),
    getEmployeeSkills: builder.query<GetEmployeeSkillsResponse, number>({
      query: (employee_id) => ({
        url: `/employees/${employee_id}/skills`,
        method: "GET",
      }),
    }),
    deleteEmployeeSkill: builder.mutation<DeleteEmployeeSkillResponse, DeleteEmployeeSkillRequest>({
      query: ({ employee_id, skill_id }) => ({
        url: `/employees/${employee_id}/skills/${skill_id}`,
        method: "DELETE",
      }),
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
} = employeeApi;

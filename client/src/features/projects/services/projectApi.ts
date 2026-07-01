import type { EmployeeResponse } from "@/entities/employee/types/apiTypes";
import type { PaginatedResult } from "@/shared/type/pagination";

import type {
  AssignEngineerPayload,
  AssignedEmployeeResponse,
  CreateRequirementRequest,
  FeedbackResponse,
  Project,
  RequirementResponse,
  UpdateRequirementRequest,
} from "@entities/project/types/apiTypes";

import employeeBaseApi from "@shared/api/base.api";

const projectApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<PaginatedResult<Project>, string>({
      query: (params) => ({
        url: `/projects?${params}`,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),
    getProject: builder.query<Project, string>({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, projectId) => [{ type: "Project", id: projectId }, "Project"],
    }),
    getRequirements: builder.query<RequirementResponse[], void>({
      query: () => ({
        url: "/project/requirements",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Requirement", id: "LIST" },
              ...result.map(({ id }) => ({
                type: "Requirement" as const,
                id,
              })),
            ]
          : [{ type: "Requirement", id: "LIST" }],
    }),
    getProjectNotes: builder.query<FeedbackResponse[], string>({
      query: (projectId) => ({
        url: `/feedbacks/project/${projectId}`,
        method: "GET",
      }),
      providesTags: (result, _error, projectId) => [
        { type: "Feedback", id: `PROJECT-${projectId}` },
        ...(result?.map((feedback) => ({
          type: "Feedback" as const,
          id: feedback.id,
        })) ?? []),
      ],
    }),
    getCandidates: builder.query<PaginatedResult<EmployeeResponse>, string>({
      query: (params) => ({
        url: `/project/search/matches?${params}`,
      }),
    }),
    getProjectRequirements: builder.query<RequirementResponse[], string>({
      query: (projectId) => ({
        url: `/project/${projectId}/requirements`,
        method: "GET",
      }),
      providesTags: (_result, _error, projectId) => [
        { type: "Requirement", id: `PROJECT-${projectId}` },
      ],
    }),
    getProjectEmployees: builder.query<AssignedEmployeeResponse[], string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/employees`,
        method: "GET",
      }),
      providesTags: (_result, _error, projectId) => [
        { type: "Requirement", id: `PROJECT-${projectId}` },
      ],
    }),
    getRequirement: builder.query<RequirementResponse, number>({
      query: (requestId) => ({
        url: `/project/requirements/${requestId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, requestId) => [{ type: "Requirement", id: requestId }],
    }),
    assignEmployee: builder.mutation<RequirementResponse, AssignEngineerPayload>({
      query: (payload) => ({
        url: "/projects/allocations",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Assign"],
    }),
    createRequirement: builder.mutation<
      RequirementResponse,
      {
        projectId: number;
        body: CreateRequirementRequest;
      }
    >({
      query: ({ projectId, body }) => ({
        url: `/project/${projectId}/requirements`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Requirement", id: "LIST" },
        { type: "Requirement", id: `PROJECT-${projectId}` },
      ],
    }),

    updateRequirement: builder.mutation<
      RequirementResponse,
      {
        requestId: number;
        body: UpdateRequirementRequest;
      }
    >({
      query: ({ requestId, body }) => ({
        url: `/project/requirements/${requestId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { requestId }) => [
        { type: "Requirement", id: requestId },
        { type: "Requirement", id: "LIST" },
      ],
    }),

    deleteRequirement: builder.mutation<void, number>({
      query: (requestId) => ({
        url: `/project/requirements/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, requestId) => [
        { type: "Requirement", id: requestId },
        { type: "Requirement", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetRequirementsQuery,
  useLazyGetRequirementsQuery,
  useGetProjectRequirementsQuery,
  useLazyGetProjectRequirementsQuery,
  useGetRequirementQuery,
  useLazyGetRequirementQuery,
  useCreateRequirementMutation,
  useUpdateRequirementMutation,
  useDeleteRequirementMutation,
  useGetProjectNotesQuery,
  useGetCandidatesQuery,
  useGetProjectEmployeesQuery,
  useAssignEmployeeMutation,
} = projectApi;

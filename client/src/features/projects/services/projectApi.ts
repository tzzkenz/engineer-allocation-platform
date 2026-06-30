import type {
  AdvanceSearchEmployeeParams,
  EmployeeResponse,
} from "@/entities/employee/types/apiTypes";

import type {
  AssignEngineerPayload,
  CreateRequirementRequest,
  FeedbackResponse,
  Project,
  ProjectListResponse,
  RequirementResponse,
  UpdateRequirementRequest,
} from "@entities/project/types/apiTypes";

import employeeBaseApi from "@shared/api/base.api";

const projectApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectListResponse, void>({
      query: () => ({
        url: "/projects",
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
      providesTags: (_result, _error, projectId) => [
        { type: "Feedback", id: `PROJECT-${projectId}` },
      ],
    }),
    getCandidates: builder.query<EmployeeResponse[], string>({
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
      invalidatesTags: ["ASSIGN"],
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
  useAssignEmployeeMutation,
} = projectApi;

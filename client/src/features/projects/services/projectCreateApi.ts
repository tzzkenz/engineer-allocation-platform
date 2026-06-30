import employeeBaseApi from "@/shared/api/base.api";
import type {
  CreateProjectRequest,
  ProjectResponse,
} from "@/shared/api/types";

export const projectApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation<ProjectResponse, CreateProjectRequest>({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: project,
      }),
    }),
  }),
});

export const { useCreateProjectMutation } = projectApi;
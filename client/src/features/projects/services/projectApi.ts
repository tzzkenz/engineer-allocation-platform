import type { Project, ProjectListResponse } from "@entities/project/types/apiTypes";

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
  }),
});

export const { useGetProjectsQuery, useGetProjectQuery } = projectApi;

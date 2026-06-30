import type { ProjectListResponse } from "@entities/project/types/apiTypes";

import employeeBaseApi from "@shared/api/base.api";

const employeeApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectListResponse, void>({
      query: () => ({
        url: "/projects",
        method: "GET",
      }),
      providesTags: ["Project"],
    }),
  }),
});

export const { useGetProjectsQuery } = employeeApi;

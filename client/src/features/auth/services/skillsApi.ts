import employeeBaseApi from "@/shared/api/base.api";
import type { GetAllSkillsResponse } from "@/entities/project/types/apiTypes";

export const skillApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSkills: builder.query<GetAllSkillsResponse, void>({
      query: () => ({
        url: "/skills",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAllSkillsQuery } = skillApi;
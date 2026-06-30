import employeeBaseApi from "@/shared/api/base.api";
import type {
  ProjectResponse,
  UpdateProjectRequest,
} from "@/shared/api/types";

export const projectEditApi= employeeBaseApi.injectEndpoints({
    endpoints: (builder) => ({
        editProject: builder.mutation<ProjectResponse, UpdateProjectRequest>({
          query: ({projectId, ...project}) => ({
            url: `/projects/${projectId}`,
            method: "PATCH",
            body: project,
          }),
        }),
      }),

})
export const {useEditProjectMutation} = projectEditApi;
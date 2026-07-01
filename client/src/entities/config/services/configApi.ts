import type {
  CreateSkillPayload,
  ProjectRoleResponse,
  ProjectRoleUpdate,
  Skill,
  SystemRoleResponseWithDatesResponse,
  UpdateSkillPayload,
} from "@entities/config/types/apiTypes";

import employeeBaseApi from "@shared/api/base.api";

export const configApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectRole: builder.query<ProjectRoleResponse, number>({
      query: (roleId) => ({
        url: `/project-roles/${roleId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, roleId) => [
        { type: "ProjectRole", id: roleId },
        "ProjectRole",
      ],
    }),
    getProjectRoles: builder.query<ProjectRoleResponse[], void>({
      query: () => ({
        url: `/project-roles`,
        method: "GET",
      }),
      providesTags: ["ProjectRole"],
    }),
    updateProjectRole: builder.mutation<
      ProjectRoleResponse,
      {
        roleId: number;
        body: ProjectRoleUpdate;
      }
    >({
      query: ({ roleId, body }) => ({
        url: `/project-roles/${roleId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { roleId }) => [
        { type: "ProjectRole", id: roleId },
        "ProjectRole",
      ],
    }),
    getSkills: builder.query<Skill[], void>({
      query: () => ({
        url: "/skills",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Skill", id: "LIST" },
              ...result.map(({ id }) => ({
                type: "Skill" as const,
                id,
              })),
            ]
          : [{ type: "Skill", id: "LIST" }],
    }),

    getSkill: builder.query<Skill, number>({
      query: (id) => ({
        url: `/skills/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Skill", id }],
    }),

    createSkill: builder.mutation<Skill, CreateSkillPayload>({
      query: (body) => ({
        url: "/skills",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Skill", id: "LIST" }],
    }),

    updateSkill: builder.mutation<
      Skill,
      {
        id: number;
        body: UpdateSkillPayload;
      }
    >({
      query: ({ id, body }) => ({
        url: `/skills/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Skill", id },
        { type: "Skill", id: "LIST" },
      ],
    }),
    getSystemRoles: builder.query<SystemRoleResponseWithDatesResponse[], void>({
      query: () => ({
        url: `/system_roles`,
        method: "GET",
      }),
      providesTags: [{ type: "SystemRole", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProjectRoleQuery,
  useGetProjectRolesQuery,
  useLazyGetProjectRoleQuery,
  useUpdateProjectRoleMutation,
  useGetSkillsQuery,
  useLazyGetSkillsQuery,
  useGetSkillQuery,
  useLazyGetSkillQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useGetSystemRolesQuery,
} = configApi;

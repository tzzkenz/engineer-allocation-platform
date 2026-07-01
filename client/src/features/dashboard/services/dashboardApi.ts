import { type DashboardSummaryResponse } from "@/entities/dashboard/types/apiTypes";
import employeeBaseApi from "@/shared/api/base.api";

const dashboardApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummaryResponse, void>({
      query: () => ({
        url: "/dashboard/summary",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;

import {
  type DashboardInsightsResponse,
  type DashboardSummaryResponse,
} from "@/entities/dashboard/types/apiTypes";
import employeeBaseApi from "@/shared/api/base.api";

const dashboardApi = employeeBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<DashboardSummaryResponse, void>({
      query: () => ({
        url: "/dashboard/summary",
        method: "GET",
      }),
    }),
    getInsights: builder.mutation<DashboardInsightsResponse, void>({
      query: () => ({
        url: "/insights/generate",
        method: "POST",
      }),
    }),
    getLatestInsightsSummary: builder.query<DashboardInsightsResponse, void>({
      query: () => ({
        url: "/insights/latest",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetInsightsMutation,
  useLazyGetLatestInsightsSummaryQuery,
} = dashboardApi;

import { type BaseQueryApi, type FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

import type { RefreshResponse } from "./types";

const isRefreshRequired = (status: number | string | undefined, endpoint: string) => {
  return status === 401 && !endpoint.includes("login");
};

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (isRefreshRequired(result.error?.status, typeof args == "string" ? args : args.url)) {
    let refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: {
          refresh_token: localStorage.getItem("refresh_token"),
        },
      },
      api,
      extraOptions
    );

    let refreshData = refreshResult.data as RefreshResponse;

    if (refreshData) {
      localStorage.setItem("access_token", refreshData.access_token);
      localStorage.setItem("refresh_token", refreshData.refresh_token);

      result = await baseQuery(args, api, extraOptions);
    } else {
      localStorage.clear();
      window.location.reload();
    }
  }

  return result;
};

const employeeBaseApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: baseQuery,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
  tagTypes: ["Project", "ProjectRole", "Requirement", "Skill", "Feedback", "ASSIGN"],
});

export default employeeBaseApi;

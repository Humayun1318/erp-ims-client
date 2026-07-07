import { baseApi } from "@/redux/baseApi";
import { IDashboardSummary } from "@/types/dashboard.types";


export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<IDashboardSummary, void>({
      query: () => ({ url: "/dashboard/summary", method: "GET" }),
      transformResponse: (response: { data: IDashboardSummary }) => response.data,
      providesTags: [{ type: "DASHBOARD", id: "SUMMARY" }],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
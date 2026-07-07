import { baseApi } from "@/redux/baseApi";
import { IDashboardSummary } from "@/types/analytics.types";


export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<IDashboardSummary, void>({
      query: () => ({ url: "/dashboard/summary", method: "GET" }),
      transformResponse: (response: { data: IDashboardSummary }) => response.data,
      providesTags: [{ type: "DASHBOARD", id: "SUMMARY" }],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = analyticsApi;
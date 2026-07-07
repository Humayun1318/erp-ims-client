import { baseApi } from "@/redux/baseApi";
import { IAnalyticsSummary } from "@/types/analytics.types";


export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<IAnalyticsSummary, void>({
      query: () => ({ url: "/dashboard/summary", method: "GET" }),
      transformResponse: (response: { data: IAnalyticsSummary }) => response.data,
      providesTags: [{ type: "DASHBOARD", id: "SUMMARY" }],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = analyticsApi;
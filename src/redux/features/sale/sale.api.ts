import { baseApi } from "@/redux/baseApi";
import { ICreateSalePayload, ISale, ISaleListResponse, ISaleQueryParams } from "@/types/sale.types";


export const saleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSales: builder.query<ISaleListResponse, ISaleQueryParams | void>({
            query: (params) => ({ url: "/sales", method: "GET", params: params ?? undefined }),
            transformResponse: (response: { data: ISaleListResponse }) => response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.result.map((s) => ({ type: "SALE" as const, id: s._id })),
                        { type: "SALE" as const, id: "LIST" },
                    ]
                    : [{ type: "SALE" as const, id: "LIST" }],
        }),

        getSale: builder.query<ISale, string>({
            query: (id) => ({ url: `/sales/${id}`, method: "GET" }),
            transformResponse: (response: { data: ISale }) => response.data,
            providesTags: (_result, _error, id) => [{ type: "SALE", id }],
        }),

        createSale: builder.mutation<ISale, ICreateSalePayload>({
            query: (payload) => ({ url: "/sales", method: "POST", data: payload }),
            transformResponse: (response: { data: ISale }) => response.data,
            // A sale mutates Product stock too — invalidate both lists.
            invalidatesTags: [
                { type: "SALE", id: "LIST" },
                { type: "PRODUCT", id: "LIST" },
                { type: "DASHBOARD", id: "SUMMARY" },
            ],
        }),
    }),
});

export const { useGetSalesQuery, useGetSaleQuery, useCreateSaleMutation } = saleApi;
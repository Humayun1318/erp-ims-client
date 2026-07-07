import { baseApi } from "@/redux/baseApi";
import { ICustomer, ICustomerListResponse, ICustomerQueryParams } from "@/types/customer.types";
// import { ICustomer, ICustomerListResponse, ICustomerQueryParams } from "./customer.types";

export const customerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCustomers: builder.query<ICustomerListResponse, ICustomerQueryParams | void>({
            query: (params) => ({ url: "/customers", method: "GET", params: params ?? undefined }),
            transformResponse: (response: { data: ICustomerListResponse }) => response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.result.map((c) => ({ type: "CUSTOMER" as const, id: c._id })),
                        { type: "CUSTOMER" as const, id: "LIST" },
                    ]
                    : [{ type: "CUSTOMER" as const, id: "LIST" }],
        }),

        createCustomer: builder.mutation<ICustomer, Omit<ICustomer, "_id" | "createdAt" | "updatedAt">>({
            query: (payload) => ({ url: "/customers", method: "POST", data: payload }),
            transformResponse: (response: { data: ICustomer }) => response.data,
            invalidatesTags: [{ type: "CUSTOMER", id: "LIST" }],
        }),

        updateCustomer: builder.mutation<ICustomer, { id: string; payload: Partial<ICustomer> }>({
            query: ({ id, payload }) => ({ url: `/customers/${id}`, method: "PATCH", data: payload }),
            transformResponse: (response: { data: ICustomer }) => response.data,
            invalidatesTags: (_result, _error, { id }) => [
                { type: "CUSTOMER", id },
                { type: "CUSTOMER", id: "LIST" },
            ],
        }),

        deleteCustomer: builder.mutation<null, string>({
            query: (id) => ({ url: `/customers/${id}`, method: "DELETE" }),
            invalidatesTags: [{ type: "CUSTOMER", id: "LIST" }],
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} = customerApi;
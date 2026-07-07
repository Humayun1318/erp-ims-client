import { baseApi } from "@/redux/baseApi";
import { IProduct, IProductListResponse, IProductQueryParams } from "@/types/product.types";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<IProductListResponse, IProductQueryParams | void>({
      query: (params) => ({ url: "/products", method: "GET", params: params ?? undefined }),
      transformResponse: (response: { data: IProductListResponse }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.result.map((p) => ({ type: "PRODUCT" as const, id: p._id })),
              { type: "PRODUCT" as const, id: "LIST" },
            ]
          : [{ type: "PRODUCT" as const, id: "LIST" }],
    }),

    // FormData shape: "data" = JSON string of fields (images: string[] of KEPT urls
    // on update, [] on create) + zero or more "images" file entries for new uploads.
    createProduct: builder.mutation<IProduct, FormData>({
      query: (formData) => ({ url: "/products", method: "POST", data: formData }),
      transformResponse: (response: { data: IProduct }) => response.data,
      invalidatesTags: [{ type: "PRODUCT", id: "LIST" }],
    }),

    updateProduct: builder.mutation<IProduct, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({ url: `/products/${id}`, method: "PATCH", data: formData }),
      transformResponse: (response: { data: IProduct }) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PRODUCT", id },
        { type: "PRODUCT", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation<null, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "PRODUCT", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
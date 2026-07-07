import { baseApi } from "@/redux/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // Users List
    // =========================
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/user",
        method: "GET",
        params, // { page, limit, search, role, status }
      }),
      providesTags: ["ADMIN_USERS"],
    }),

    updateUserStatus: builder.mutation({
      query: (body: {
        userId: string;
        status: "active" | "suspended" | "deleted";
      }) => ({
        url: `/user/${body.userId}/status`,
        method: "PATCH",
        data: { status: body.status },
      }),
      invalidatesTags: ["ADMIN_USERS", "ADMIN_ANALYTICS"],
    })
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} = adminApi;
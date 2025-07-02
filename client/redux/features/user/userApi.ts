import { User } from "../../../types/user";
import { apiSlice } from "../api/apiSlice";

export interface APIResponse {
  success?: boolean;
  message?: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: "/update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
    }),
    editProfile: builder.mutation({
      query: ({ name }) => ({
        url: "/update-user-info",
        method: "PUT",
        body: { name },
        credentials: "include" as const,
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "/update-user-password",
        method: "PUT",
        body: { oldPassword, newPassword },
        credentials: "include" as const,
      }),
    }),
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: "/get-all-users",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateUserRole: builder.mutation<APIResponse, { id: string; role: string }>(
      {
        query: ({ id, role }) => ({
          url: "/update-user-role",
          method: "PUT",
          body: { id, role },
          credentials: "include" as const,
        }),
      }
    ),
    deleteUser: builder.mutation<APIResponse, string>({
      query: (id) => ({
        url: `/delete-user/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    generateEmailVerificationToken: builder.mutation<APIResponse, string>({
      query: (id) => ({
        url: `/generate-email-verification-link`,
        method: "POST",
        body: { id },
        credentials: "include" as const,
      }),
    }),
    verifyEmail: builder.mutation<APIResponse, string>({
      query: (verificationToken) => ({
        url: `/verify-email`,
        method: "POST",
        body: { verificationToken },
        credentials: "include" as const,
      }),
    }),
    forgotPassword: builder.mutation<APIResponse, { email: string }>({
      query: ({ email }) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<
      APIResponse,
      { token: string; email: string; password: string }
    >({
      query: ({ token, email, password }) => ({
        url: "/reset-password",
        method: "POST",
        body: { token, email, password },
      }),
    }),
  }),
});

export const {
  useUpdateAvatarMutation,
  useEditProfileMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useGenerateEmailVerificationTokenMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;

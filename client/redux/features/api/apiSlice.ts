import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { CourseFormData } from "../../../types/course";
import { Order } from "../../../types/order";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  credentials: "include",
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    result.error.status === 401 &&
    result.error.data &&
    typeof result.error.data === "object" &&
    "message" in result.error.data &&
    (result.error.data as { message?: string }).message?.includes(
      "Json web token is expired"
    )
  ) {
    // Try to refresh the token

    const refreshResult = await baseQuery(
      { url: "/refresh", method: "GET" },
      api,
      extraOptions
    );
    if (
      refreshResult.data &&
      (refreshResult.data as { accessToken?: string }).accessToken
    ) {
      // Store new access token in redux (if needed)
      api.dispatch(
        userLoggedIn({
          accessToken: (refreshResult.data as { accessToken: string })
            .accessToken,
          user: (refreshResult.data as { user: unknown }).user,
        })
      );
      // Retry the original query

      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, log out user
      api.dispatch(userLoggedOut());
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    refreshToken: builder.mutation({
      query: () => ({
        url: "refresh",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log("Failed to load user:", error);
        }
      },
    }),
    createCourse: builder.mutation({
      query: (data) => ({
        url: "/create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useRefreshTokenMutation,
  useLoadUserQuery,
  useLazyLoadUserQuery,
  useCreateCourseMutation,
} = apiSlice;

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<{ success: boolean; orders: Order[] }, void>({
      query: () => ({
        url: "/get-all-orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetAllOrdersQuery } = orderApi;

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourses: builder.query<
      { success: boolean; courses: CourseFormData[] },
      void
    >({
      query: () => ({
        url: "/get-all-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getSingleCourse: builder.query<
      { success: boolean; course: CourseFormData },
      string
    >({
      query: (id) => ({
        url: `/get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetAllCoursesQuery, useGetSingleCourseQuery } = courseApi;

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserAnalytics: builder.query<
      {
        success: boolean;
        users: { last12Months: { month: string; count: number }[] };
      },
      void
    >({
      query: () => ({
        url: "/get-user-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseAnalytics: builder.query<
      {
        success: boolean;
        courses: { last12Months: { month: string; count: number }[] };
      },
      void
    >({
      query: () => ({
        url: "/get-course-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getOrderAnalytics: builder.query<
      {
        success: boolean;
        orders: { last12Months: { month: string; count: number }[] };
      },
      void
    >({
      query: () => ({
        url: "/get-order-analytics",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetUserAnalyticsQuery,
  useGetCourseAnalyticsQuery,
  useGetOrderAnalyticsQuery,
} = analyticsApi;

export const courseCrudApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    editCourse: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: CourseFormData }
    >({
      query: ({ id, data }) => ({
        url: `/edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    deleteCourse: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useEditCourseMutation, useDeleteCourseMutation } = courseCrudApi;

// Notification type for API
export interface Notification {
  _id: string;
  type: "info" | "warning" | "success";
  title: string;
  message: string;
  createdAt: string;
  status: "unread" | "read";
}

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query<
      { success: boolean; notifications: Notification[] },
      void
    >({
      query: () => ({
        url: "/get-all-notifications",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateNotification: builder.mutation<
      { success: boolean; message: string; notifications: Notification[] },
      string
    >({
      query: (id) => ({
        url: `/update-notification/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useGetAllNotificationsQuery, useUpdateNotificationMutation } =
  notificationApi;

export const newsletterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/newsletter/subscribe",
        method: "POST",
        body,
      }),
    }),
    getNewsletterSubscribers: builder.query<
      { success: boolean; subscribers: { email: string; createdAt: string }[] },
      void
    >({
      query: () => ({
        url: "/newsletter/subscribers",
        method: "GET",
      }),
    }),
    sendNewsletterEmail: builder.mutation<
      { success: boolean; message: string },
      { subject: string; message: string; emails: string[] }
    >({
      query: (body) => ({
        url: "/newsletter/send",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSubscribeNewsletterMutation,
  useGetNewsletterSubscribersQuery,
  useSendNewsletterEmailMutation,
} = newsletterApi;

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitContact: builder.mutation<
      { success: boolean; message: string },
      { name: string; email: string; message: string }
    >({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
    }),
    getAllContacts: builder.query<
      { success: boolean; contacts: ContactQuery[] },
      void
    >({
      query: () => ({
        url: "/contacts",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    answerContact: builder.mutation<
      { success: boolean; message: string },
      { id: string; answerText: string }
    >({
      query: ({ id, answerText }) => ({
        url: `/contact/${id}/answer`,
        method: "POST",
        credentials: "include" as const,
        body: { answerText },
      }),
    }),
  }),
});

export interface ContactQuery {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  answered: boolean;
  answerText?: string;
}

export const {
  useSubmitContactMutation,
  useGetAllContactsQuery,
  useAnswerContactMutation,
} = contactApi;

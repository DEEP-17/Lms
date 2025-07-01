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
    getStripePublishableKey: builder.query<
      { success: boolean; publishableKey: string },
      void
    >({
      query: () => ({
        url: "/payment/stripePublishableKey",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    createPayment: builder.mutation<
      { success: boolean; clientSecret: string },
      { amount: number }
    >({
      query: ({ amount }) => ({
        url: "/payment",
        method: "POST",
        body: { amount },
        credentials: "include" as const,
      }),
    }),
    createOrder: builder.mutation<
      { success: boolean; order: Order },
      {
        courseId: string;
        userId: string;
        payment_info: object;
      }
    >({
      query: ({ courseId, userId, payment_info }) => ({
        url: "/create-order",
        method: "POST",
        body: {
          courseId,
          userId,
          payment_info,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetStripePublishableKeyQuery,
  useCreatePaymentMutation,
  useCreateOrderMutation,
} = orderApi;

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
    getAllCoursesForAdmin: builder.query<
      { success: boolean; courses: CourseFormData[] },
      void
    >({
      query: () => ({
        url: "/admin/get-all-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getSingleCourseForAdmin: builder.query<
      { success: boolean; course: CourseFormData },
      string
    >({
      query: (id) => ({
        url: `/admin/get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getEnrolledCourses: builder.query<
      { success: boolean; courses: CourseFormData[] },
      void
    >({
      query: () => ({
        url: "/get-enrolled-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCourseContent: builder.query<
      {
        success: boolean;
        content: Array<{
          _id: string;
          title: string;
          description: string;
          videoUrl: string;
          videoSection: string;
          videoLength: number;
          videoPlayer: string;
          links: Array<{ title: string; url: string }>;
          suggestion: string;
          questions: Array<{
            user: { name: string; email: string };
            question: string;
            questionReplies: Array<{
              user: { name: string; email: string };
              answer: string;
            }>;
          }>;
        }>;
      },
      string
    >({
      query: (courseId) => ({
        url: `/get-course-content/${courseId}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    addReview: builder.mutation<
      { success: boolean; course: CourseFormData },
      { courseId: string; review: string; rating: number }
    >({
      query: ({ courseId, review, rating }) => ({
        url: `/add-review/${courseId}`,
        method: "PUT",
        body: { review, rating },
        credentials: "include" as const,
      }),
    }),
    addReplyToReview: builder.mutation<
      { success: boolean; course: CourseFormData },
      { courseId: string; reviewId: string; comment: string }
    >({
      query: ({ courseId, reviewId, comment }) => ({
        url: `/add-reply`,
        method: "PUT",
        body: { courseId, reviewId, comment },
        credentials: "include" as const,
      }),
    }),
    addQuestion: builder.mutation<
      { success: boolean; course: CourseFormData },
      { courseId: string; question: string; contentId: string }
    >({
      query: ({ courseId, question, contentId }) => ({
        url: `/add-question`,
        method: "PUT",
        body: { courseId, question, contentId },
        credentials: "include" as const,
      }),
    }),
    addAnswer: builder.mutation<
      { success: boolean; course: CourseFormData },
      {
        courseId: string;
        questionId: string;
        answer: string;
        contentId: string;
      }
    >({
      query: ({ courseId, questionId, answer, contentId }) => ({
        url: `/add-answer`,
        method: "PUT",
        body: { courseId, questionId, answer, contentId },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useGetSingleCourseQuery,
  useGetAllCoursesForAdminQuery,
  useGetSingleCourseForAdminQuery,
  useGetEnrolledCoursesQuery,
  useGetCourseContentQuery,
  useAddReviewMutation,
  useAddReplyToReviewMutation,
  useAddQuestionMutation,
  useAddAnswerMutation,
} = courseApi;

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

export interface ContactQuery {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  answered: boolean;
  answerText?: string;
}

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

export const {
  useSubmitContactMutation,
  useGetAllContactsQuery,
  useAnswerContactMutation,
} = contactApi;

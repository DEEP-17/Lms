import { apiSlice } from "../api/apiSlice";

const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Single query to get all layout data
    getLayoutData: builder.query({
      query: () => ({
        url: "get-layout/layout",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getHeroData: builder.query({
      query: (type) => ({
        url: `get-layout/${type}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    editHero: builder.mutation({
      query: (data) => ({
        url: "edit-layout",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    // Categories
    getCategoriesData: builder.query({
      query: () => ({
        url: "get-layout/layout",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    editCategories: builder.mutation({
      query: (data) => ({
        url: "edit-layout",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    // Testimonials
    getTestimonialsData: builder.query({
      query: () => ({
        url: "get-layout/layout",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    editTestimonials: builder.mutation({
      query: (data) => ({
        url: "edit-layout",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    // Why Trust Us
    getWhyTrustUsData: builder.query({
      query: () => ({
        url: "get-layout/layout",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    editWhyTrustUs: builder.mutation({
      query: (data) => ({
        url: "edit-layout",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    // Newsletter
    getNewsletterData: builder.query({
      query: () => ({
        url: "get-layout/layout",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    editNewsletter: builder.mutation({
      query: (data) => ({
        url: "edit-layout",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    // Knowledge Guarantee
    getKnowledgeGuaranteeData: builder.query({
      query: () => ({
        url: "get-layout/layout",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    editKnowledgeGuarantee: builder.mutation({
      query: (data) => ({
        url: "edit-layout",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
    // FAQ
    getFaqData: builder.query({
      query: () => ({
        url: "get-layout/layout",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    editFaq: builder.mutation({
      query: (data) => ({
        url: "edit-layout",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetLayoutDataQuery,
  useGetHeroDataQuery,
  useEditHeroMutation,
  useGetCategoriesDataQuery,
  useEditCategoriesMutation,
  useGetTestimonialsDataQuery,
  useEditTestimonialsMutation,
  useGetWhyTrustUsDataQuery,
  useEditWhyTrustUsMutation,
  useGetNewsletterDataQuery,
  useEditNewsletterMutation,
  useGetKnowledgeGuaranteeDataQuery,
  useEditKnowledgeGuaranteeMutation,
  useGetFaqDataQuery,
  useEditFaqMutation,
} = layoutApi;

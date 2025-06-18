import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userLoggedIn } from '../auth/authSlice';
export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_SERVER_URL
    }),
    endpoints: (builder) => ({
        refreshToken: builder.mutation({
            query: () => ({
                url: 'refresh',
                method: 'GET',
                credentials: 'include' as const,
            }),
        }),
        loadUser: builder.query({
            query: () => ({
                url: 'me',
                method: 'GET',
                credentials: 'include' as const,
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
                    console.log('Failed to load user:', error);
                }
            }
        }),
    }),
});

export const { useRefreshTokenMutation,useLoadUserQuery,useLazyLoadUserQuery } = apiSlice;
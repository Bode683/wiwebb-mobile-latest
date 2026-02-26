import { baseApi } from '../../../store/api/baseApi';
import { setUser, clearUser } from '../slice/authSlice';
import type { User } from '../../../types/api';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => '/auth/me/',
      providesTags: ['User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(clearUser());
        }
      },
    }),
  }),
});

export const { useGetMeQuery, useLazyGetMeQuery } = authApi;

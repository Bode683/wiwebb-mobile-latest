import { baseApi } from '../../../store/api/baseApi';
import type { PaginatedUserList, User } from '../../../types/api';

/** Body for inviting a user — backend stamps the rest. */
export interface CreateUserInput {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  status: 'active' | 'pending';
  invite_token?: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  organization_users: { organization: string; is_admin: boolean; is_owner?: boolean }[];
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Active-org filtering is applied client-side (see useOrgUsers); the
    // `?organization=` param is the swappable seam for a real backend.
    getUsers: builder.query<PaginatedUserList, { organization?: string | null } | void>({
      query: (arg) => {
        const org = arg && 'organization' in arg ? arg.organization : null;
        return org ? `/users/user/?organization=${org}` : '/users/user/';
      },
      providesTags: ['User'],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/users/user/${id}/`,
      providesTags: (_r, _e, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<User, CreateUserInput>({
      query: (body) => ({ url: '/users/user/', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: string; patch: Partial<User> }>({
      query: ({ id, patch }) => ({
        url: `/users/user/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => ['User', { type: 'User', id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = usersApi;

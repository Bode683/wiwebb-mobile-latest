import { baseApi } from '../../../store/api/baseApi';
import type { Organization, PaginatedOrganizationList } from '../../../types/api';

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query<PaginatedOrganizationList, void>({
      query: () => '/users/organization/',
      providesTags: ['Organization'],
    }),
    getOrganizationById: builder.query<Organization, string>({
      query: (id) => `/users/organization/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'Organization', id }],
    }),
  }),
});

export const { useGetOrganizationsQuery, useGetOrganizationByIdQuery } = organizationApi;

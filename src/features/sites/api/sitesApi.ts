import { baseApi } from '../../../store/api/baseApi';
import type { PaginatedSiteList, Site } from '../../../types/api';

const TAG = 'Site' as const;

export const sitesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSites: builder.query<PaginatedSiteList, { organization?: string | null } | void>({
      query: (arg) => {
        const org = arg && 'organization' in arg ? arg.organization : null;
        return org ? `/controller/location/?organization=${org}` : '/controller/location/';
      },
      providesTags: [TAG],
    }),
    getSiteById: builder.query<Site, string>({
      query: (id) => `/controller/location/${id}/`,
      providesTags: (_r, _e, id) => [{ type: TAG, id }],
    }),
    createSite: builder.mutation<Site, Omit<Site, 'created' | 'modified'>>({
      query: (body) => ({ url: '/controller/location/', method: 'POST', body }),
      invalidatesTags: [TAG],
    }),
    updateSite: builder.mutation<Site, { id: string; patch: Partial<Site> }>({
      query: ({ id, patch }) => ({
        url: `/controller/location/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [TAG, { type: TAG, id }],
    }),
    deleteSite: builder.mutation<void, string>({
      query: (id) => ({ url: `/controller/location/${id}/`, method: 'DELETE' }),
      invalidatesTags: [TAG],
    }),
  }),
});

export const {
  useGetSitesQuery,
  useGetSiteByIdQuery,
  useCreateSiteMutation,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
} = sitesApi;

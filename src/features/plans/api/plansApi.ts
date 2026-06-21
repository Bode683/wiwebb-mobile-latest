import { baseApi } from '../../../store/api/baseApi';
import type { PaginatedPlanList, Plan } from '../../../types/api';

const TAG = 'Plan' as const;

export const plansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlans: builder.query<PaginatedPlanList, { organization?: string | null } | void>({
      query: (arg) => {
        const org = arg && 'organization' in arg ? arg.organization : null;
        return org ? `/subscriptions/plans/?organization=${org}` : '/subscriptions/plans/';
      },
      providesTags: [TAG],
    }),
    getPlanById: builder.query<Plan, string>({
      query: (id) => `/subscriptions/plans/${id}/`,
      providesTags: (_r, _e, id) => [{ type: TAG, id }],
    }),
    createPlan: builder.mutation<Plan, Omit<Plan, 'id' | 'created' | 'modified'>>({
      query: (body) => ({ url: '/subscriptions/plans/', method: 'POST', body }),
      invalidatesTags: [TAG],
    }),
    updatePlan: builder.mutation<Plan, { id: string; patch: Partial<Plan> }>({
      query: ({ id, patch }) => ({
        url: `/subscriptions/plans/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [TAG, { type: TAG, id }],
    }),
    deletePlan: builder.mutation<void, string>({
      query: (id) => ({ url: `/subscriptions/plans/${id}/`, method: 'DELETE' }),
      invalidatesTags: [TAG],
    }),
  }),
});

export const {
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;

import { baseApi } from '../../../store/api/baseApi';
import type { PaginatedPaymentProviderList, PaymentProvider } from '../../../types/api';

const TAG = 'PaymentProvider' as const;

export const paymentProvidersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentProviders: builder.query<
      PaginatedPaymentProviderList,
      { organization?: string | null } | void
    >({
      query: (arg) => {
        const org = arg && 'organization' in arg ? arg.organization : null;
        return org
          ? `/subscriptions/payment-providers/?organization=${org}`
          : '/subscriptions/payment-providers/';
      },
      providesTags: [TAG],
    }),
    getPaymentProviderById: builder.query<PaymentProvider, string>({
      query: (id) => `/subscriptions/payment-providers/${id}/`,
      providesTags: (_r, _e, id) => [{ type: TAG, id }],
    }),
    updatePaymentProvider: builder.mutation<
      PaymentProvider,
      { id: string; patch: Partial<PaymentProvider> }
    >({
      query: ({ id, patch }) => ({
        url: `/subscriptions/payment-providers/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [TAG, { type: TAG, id }],
    }),
  }),
});

export const {
  useGetPaymentProvidersQuery,
  useGetPaymentProviderByIdQuery,
  useUpdatePaymentProviderMutation,
} = paymentProvidersApi;

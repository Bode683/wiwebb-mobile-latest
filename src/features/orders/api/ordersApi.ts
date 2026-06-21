import { baseApi } from '../../../store/api/baseApi';
import type { PaginatedOrderList, Order } from '../../../types/api';

const TAG = 'Order' as const;

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedOrderList, { organization?: string | null } | void>({
      query: (arg) => {
        const org = arg && 'organization' in arg ? arg.organization : null;
        return org ? `/subscriptions/orders/?organization=${org}` : '/subscriptions/orders/';
      },
      providesTags: [TAG],
    }),
    getOrderById: builder.query<Order, string>({
      query: (id) => `/subscriptions/orders/${id}/`,
      providesTags: (_r, _e, id) => [{ type: TAG, id }],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery } = ordersApi;

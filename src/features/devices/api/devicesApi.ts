import { baseApi } from '../../../store/api/baseApi';
import type { PaginatedDeviceList, Device } from '../../../types/api';

const TAG = 'Device' as const;

export const devicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<PaginatedDeviceList, { organization?: string | null } | void>({
      query: (arg) => {
        const org = arg && 'organization' in arg ? arg.organization : null;
        return org ? `/controller/device/?organization=${org}` : '/controller/device/';
      },
      providesTags: [TAG],
    }),
    getDeviceById: builder.query<Device, string>({
      query: (id) => `/controller/device/${id}/`,
      providesTags: (_r, _e, id) => [{ type: TAG, id }],
    }),
    updateDevice: builder.mutation<Device, { id: string; patch: Partial<Device> }>({
      query: ({ id, patch }) => ({
        url: `/controller/device/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [TAG, { type: TAG, id }],
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useGetDeviceByIdQuery,
  useUpdateDeviceMutation,
} = devicesApi;

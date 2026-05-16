import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export type PaymentMethodType = 'orange-money' | 'mtn-momo' | 'card';

interface MobileMoneyMethod {
  id: string;
  type: 'orange-money' | 'mtn-momo';
  phone: string;
}

interface CardMethod {
  id: string;
  type: 'card';
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export type PaymentMethod = MobileMoneyMethod | CardMethod;

interface PaymentMethodsState {
  methods: PaymentMethod[];
  defaultMethodId: string | null;
}

const initialState: PaymentMethodsState = {
  methods: [],
  defaultMethodId: null,
};

type AddMethodPayload =
  | { type: 'orange-money'; phone: string }
  | { type: 'mtn-momo'; phone: string }
  | { type: 'card'; cardNumber: string; expiry: string; cvv: string };

const paymentMethodsSlice = createSlice({
  name: 'paymentMethods',
  initialState,
  reducers: {
    addPaymentMethod: {
      reducer(state, action: PayloadAction<PaymentMethod>) {
        state.methods.push(action.payload);
        if (!state.defaultMethodId) {
          state.defaultMethodId = action.payload.id;
        }
      },
      prepare(payload: AddMethodPayload) {
        const id = nanoid();
        if (payload.type === 'card') {
          return {
            payload: {
              id,
              type: 'card' as const,
              cardNumber: payload.cardNumber,
              expiry: payload.expiry,
              cvv: payload.cvv,
            },
          };
        }
        return {
          payload: { id, type: payload.type, phone: payload.phone },
        };
      },
    },
    removePaymentMethod(state, action: PayloadAction<string>) {
      state.methods = state.methods.filter((m) => m.id !== action.payload);
      if (state.defaultMethodId === action.payload) {
        state.defaultMethodId = state.methods[0]?.id ?? null;
      }
    },
    setDefaultPaymentMethod(state, action: PayloadAction<string>) {
      if (state.methods.some((m) => m.id === action.payload)) {
        state.defaultMethodId = action.payload;
      }
    },
  },
});

export const {
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
} = paymentMethodsSlice.actions;

export const selectPaymentMethods = (state: RootState) =>
  state.paymentMethods.methods;

export const selectDefaultPaymentMethodId = (state: RootState) =>
  state.paymentMethods.defaultMethodId;

export const selectDefaultPaymentMethod = (state: RootState) => {
  const id = state.paymentMethods.defaultMethodId;
  if (!id) return null;
  return state.paymentMethods.methods.find((m) => m.id === id) ?? null;
};

export default paymentMethodsSlice.reducer;

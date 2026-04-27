import { create } from 'zustand';

interface DashboardState {
  // Step results
  sessionCreated: boolean;
  orderForm: any | null;
  orderFormId: string | null;
  products: any | null;
  addedItems: { skuId: string; name: string; imageUrl: string | null; price: number; quantity: number; seller: string }[];

  // Actions
  setSessionCreated: (val: boolean) => void;
  setOrderForm: (orderForm: any) => void;
  setProducts: (products: any) => void;
  addItemToList: (item: { skuId: string; name: string; imageUrl: string | null; price: number; quantity: number; seller: string }) => void;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sessionCreated: false,
  orderForm: null,
  orderFormId: null,
  products: null,
  addedItems: [],

  setSessionCreated: (val) => set({ sessionCreated: val }),
  setOrderForm: (orderForm) => set({ orderForm, orderFormId: orderForm?.orderFormId }),
  setProducts: (products) => set({ products }),
  addItemToList: (item) => set((state) => ({ addedItems: [...state.addedItems, item] })),
  reset: () => set({ sessionCreated: false, orderForm: null, orderFormId: null, products: null, addedItems: [] }),
}));

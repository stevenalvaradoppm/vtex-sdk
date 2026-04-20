export interface IVtexRepository {
  createSession(email?: string): Promise<void>;
  createOrderForm(): Promise<unknown>;
  getProducts(): Promise<unknown>;
  addItem(orderFormId: string, items: { id: string; quantity: number; seller: string }[]): Promise<unknown>;
  setShipping(orderFormId: string, shippingData: any): Promise<unknown>;
  setClientProfile(orderFormId: string, profileData: any): Promise<unknown>;
}

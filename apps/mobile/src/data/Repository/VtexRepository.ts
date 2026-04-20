import 'reflect-metadata';
import { injectable } from 'inversify';
import { IVtexRepository } from '@/domain/repository/Vtex/IVtexRepository';
import { vtexClient } from '../provider/vtexClient';

@injectable()
export class VtexRepository implements IVtexRepository {
  async createSession(email?: string): Promise<void> {
    await vtexClient.session.createSession(email);
  }

  async createOrderForm(): Promise<unknown> {
    await vtexClient.session.createSession();
    return await vtexClient.checkout.createOrderForm();
  }

  async getProducts(): Promise<unknown> {
    return await vtexClient.checkout.getProducts();
  }

  async addItem(orderFormId: string, items: { id: string; quantity: number; seller: string }[]): Promise<unknown> {
    await vtexClient.session.createSession();
    return await vtexClient.checkout.addItem(orderFormId, items);
  }

  async setShipping(orderFormId: string, shippingData: any): Promise<unknown> {
    await vtexClient.session.createSession();
    return await vtexClient.checkout.setShipping(orderFormId, shippingData);
  }

  async setClientProfile(orderFormId: string, profileData: any): Promise<unknown> {
    await vtexClient.session.createSession();
    return await vtexClient.checkout.setClientProfile(orderFormId, profileData);
  }
}

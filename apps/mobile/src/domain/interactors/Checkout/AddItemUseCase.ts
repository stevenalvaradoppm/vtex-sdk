import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { RepositoryTypes } from '@/domain/entity/Types/RepositoryTypes';
import { IVtexRepository } from '@/domain/repository/Vtex/IVtexRepository';

@injectable()
export class AddItemUseCase {
  constructor(
    @inject(RepositoryTypes.VtexRepository)
    private readonly vtexRepository: IVtexRepository,
  ) {}

  async execute(orderFormId: string, items: { id: string; quantity: number; seller: string }[]): Promise<unknown> {
    return this.vtexRepository.addItem(orderFormId, items);
  }
}

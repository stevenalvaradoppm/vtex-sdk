import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { RepositoryTypes } from '@/domain/entity/Types/RepositoryTypes';
import { IVtexRepository } from '@/domain/repository/Vtex/IVtexRepository';

@injectable()
export class SetShippingUseCase {
  constructor(
    @inject(RepositoryTypes.VtexRepository)
    private readonly vtexRepository: IVtexRepository,
  ) {}

  async execute(orderFormId: string, address: any): Promise<unknown> {
    return this.vtexRepository.setShipping(orderFormId, address);
  }
}

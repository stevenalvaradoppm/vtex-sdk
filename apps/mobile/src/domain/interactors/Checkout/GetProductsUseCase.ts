import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { RepositoryTypes } from '@/domain/entity/Types/RepositoryTypes';
import { IVtexRepository } from '@/domain/repository/Vtex/IVtexRepository';

@injectable()
export class GetProductsUseCase {
  constructor(
    @inject(RepositoryTypes.VtexRepository)
    private readonly vtexRepository: IVtexRepository,
  ) {}

  async execute(): Promise<unknown> {
    return this.vtexRepository.getProducts();
  }
}

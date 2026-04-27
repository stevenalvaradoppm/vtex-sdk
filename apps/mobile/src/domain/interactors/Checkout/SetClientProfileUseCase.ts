import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { RepositoryTypes } from '@/domain/entity/Types/RepositoryTypes';
import { IVtexRepository } from '@/domain/repository/Vtex/IVtexRepository';

@injectable()
export class SetClientProfileUseCase {
  constructor(
    @inject(RepositoryTypes.VtexRepository)
    private readonly vtexRepository: IVtexRepository,
  ) {}

  async execute(orderFormId: string, profile: any): Promise<unknown> {
    return this.vtexRepository.setClientProfile(orderFormId, profile);
  }
}

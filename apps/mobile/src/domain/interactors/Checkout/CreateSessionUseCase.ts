import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { RepositoryTypes } from '@/domain/entity/Types/RepositoryTypes';
import { IVtexRepository } from '@/domain/repository/Vtex/IVtexRepository';

@injectable()
export class CreateSessionUseCase {
  constructor(
    @inject(RepositoryTypes.VtexRepository)
    private readonly vtexRepository: IVtexRepository,
  ) {}

  async execute(email?: string): Promise<void> {
    return this.vtexRepository.createSession(email);
  }
}

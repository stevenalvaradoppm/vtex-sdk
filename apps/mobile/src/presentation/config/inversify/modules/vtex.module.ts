import { Container } from 'inversify';
import { RepositoryTypes } from '@/domain/entity/Types/RepositoryTypes';
import { UseCaseTypes } from '@/domain/entity/Types/UseCaseTypes';
import { IVtexRepository } from '@/domain/repository/Vtex/IVtexRepository';
import { VtexRepository } from '@/data/Repository/VtexRepository';
import { CreateSessionUseCase } from '@/domain/interactors/Checkout/CreateSessionUseCase';
import { CreateOrderFormUseCase } from '@/domain/interactors/Checkout/CreateOrderFormUseCase';
import { GetProductsUseCase } from '@/domain/interactors/Checkout/GetProductsUseCase';
import { AddItemUseCase } from '@/domain/interactors/Checkout/AddItemUseCase';
import { SetShippingUseCase } from '@/domain/interactors/Checkout/SetShippingUseCase';
import { SetClientProfileUseCase } from '@/domain/interactors/Checkout/SetClientProfileUseCase';

export function registerVtexModule(container: Container): void {
  // Repository
  container
    .bind<IVtexRepository>(RepositoryTypes.VtexRepository)
    .to(VtexRepository);

  // Use Cases (matching the 6-step flow)
  container.bind<CreateSessionUseCase>(UseCaseTypes.CreateSessionUseCase).to(CreateSessionUseCase);
  container.bind<CreateOrderFormUseCase>(UseCaseTypes.CreateOrderFormUseCase).to(CreateOrderFormUseCase);
  container.bind<GetProductsUseCase>(UseCaseTypes.GetProductsUseCase).to(GetProductsUseCase);
  container.bind<AddItemUseCase>(UseCaseTypes.AddItemUseCase).to(AddItemUseCase);
  container.bind<SetShippingUseCase>(UseCaseTypes.SetShippingUseCase).to(SetShippingUseCase);
  container.bind<SetClientProfileUseCase>(UseCaseTypes.SetClientProfileUseCase).to(SetClientProfileUseCase);
}

import { Container } from 'inversify';
import { registerVtexModule } from './modules/vtex.module';

const container = new Container();

registerVtexModule(container);

export default container;

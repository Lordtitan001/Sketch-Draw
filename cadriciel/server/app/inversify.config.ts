import { Container } from 'inversify';
import { Application } from './app';
import { DrawingController } from './controllers/drawing.controller';
import { Server } from './server';
import { DrawingService } from './services/drawing.service';
import Types from './types';
import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();
    container.bind(Types.Server).to(Server);
    container.bind(Types.Application).to(Application);

    container.bind(Types.DrawingController).to(DrawingController);
    container.bind(Types.DrawingService).to(DrawingService);
    container.bind(Types.EmailController).to(EmailController);
    container.bind(Types.EmailService).to(EmailService);
    return container;
};

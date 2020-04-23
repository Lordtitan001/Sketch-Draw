import * as http from 'http';
import { inject, injectable } from 'inversify';

import { Application } from './app';
import Types from './types';

@injectable()
export class Server {
    private readonly appPort: string | number | boolean = this.normalizePort(process.env.PORT || '3000');
    private readonly baseDix: number = 10;
    private server: http.Server;
    constructor(@inject(Types.Application) private application: Application) {
    }

    init(): void {
        this.application.app.set('port', this.appPort);

        this.server = http.createServer(this.application.app);
        this.server.listen(this.appPort);
        this.server.on('error', (error: NodeJS.ErrnoException) => this.onError(error).then(() => process.exit(1)));
        this.server.on('listening', () => this.onListening());
    }

    private normalizePort(val: number | string): number | string | boolean {
        const port: number = typeof val === 'string' ? parseInt(val, this.baseDix) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }

    private async onError(error: NodeJS.ErrnoException): Promise<void> {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind: string = typeof this.appPort === 'string' ? 'Pipe ' + this.appPort : 'Port ' + this.appPort;
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                break;
            default:
                console.error('Connexion error');
        }
        return new Promise((resolve) => {resolve(); });
    }

    private onListening(): void {
        const addr = this.server.address();
        // tslint:disable-next-line:no-non-null-assertion
        const bind: string = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr!.port}`;
        // tslint:disable-next-line:no-console
        console.log(`Listening on ${bind}`);
    }
}

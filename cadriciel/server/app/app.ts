import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { inject, injectable } from 'inversify';
import * as mongo from 'mongodb';
import * as logger from 'morgan';
import { DrawingController } from './controllers/drawing.controller';
import { EmailController } from './controllers/email.controller';
import Types from './types';

const URI = 'mongodb+srv://kevin:kevin@cluster0-4tl8u.mongodb.net/test?retryWrites=true&w=majority';
@injectable()
export class Application {
    private readonly internalError: number = 500;
    app: express.Application;
    URI: string;
    mongoClient: mongo.MongoClient;
    constructor(

        @inject(Types.DrawingController) private drawingController: DrawingController,
        @inject(Types.EmailController) private emailController: EmailController,
    ) {
        this.app = express();
        this.config();
        dotenv.config();
        this.bindRoutes();
        this.URI = URI;
        mongo.connect(this.URI).then((client) => {
            this.mongoClient = client;
            console.log('is connected', this.mongoClient.isConnected());
        });
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json({ limit: 'none' }));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    bindRoutes(): void {
        this.app.use('/api/drawing', this.drawingController.router);
        this.app.use('/api/email', this.emailController.router);
        this.errorHandling();
    }

    private errorHandling(): void {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            res.status(this.internalError);
            res.send({
                message: err.message,
                error: err,
            });
        });
    }
}

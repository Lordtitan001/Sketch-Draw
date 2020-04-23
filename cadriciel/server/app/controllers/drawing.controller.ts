import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { DrawingService } from '../services/drawing.service';
import Types from '../types';
@injectable()
export class DrawingController {

    router: Router;
    constructor(@inject(Types.DrawingService) private drawingService: DrawingService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            res.send(this.drawingService.dataArray);
        });

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            this.drawingService.saveToDataBase(req.body).then((response) => {
                res.send(response);
            });
        });
        this.router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
            this.drawingService.delete(req.params.id)
            .then((response) => {
                res.send(response);
            });
        });
    }
}

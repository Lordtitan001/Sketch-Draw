import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { EmailData } from '../../../common/communication/draw';
import { EmailService } from '../services/email.service';
import Types from '../types';
const errors = { first: 422, second: 429, third: 500, zero: 0 };

@injectable()
export class EmailController {
    router: Router;
    constructor(@inject(Types.EmailService) private emailService: EmailService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.post('/', (req: Request, response: Response, next: NextFunction) => {
            const emailData = req.body.emailData as EmailData;
            this.emailService.getData(emailData)
                .then((res) => {
                    const message = 'Courriel envoyé avec succes';
                    response.json({message});
                })
                .catch((error) => {
                    let message = '';
                    switch (error.response.status) {
                        case errors.first:
                            message = "Erreur: L'adresse courriel entrée ne peut etre atteinte. Veuillez verifier le courriel.";
                            break;
                        case errors.third:
                            message = 'Nous éprouvons des difficultés à envoyer le courriel.';
                            break;
                        default:
                            message = "Impossible d'envoyer le courriel.";
                            break;
                    }
                    response.json({message});
                }); 

        });
    }
}

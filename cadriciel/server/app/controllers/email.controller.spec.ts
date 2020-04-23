// tslint:disable no-string-literal
// tslint:disable prefer-const
// tslint:disable no-magic-numbers

import { expect } from 'chai';
import 'reflect-metadata';
import * as supertest from 'supertest';
import { testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import Types from '../types';
import { EmailController } from './email.controller';
describe('EmailController', () => {
    const HTTP_STATUS_OK = 200;
    let controller: EmailController;
    let app: Express.Application;

    it('test post request', (done: Mocha.Done) => {
        setTimeout(async () => {
            const [container, sandbox] = await testingContainer();
            container.rebind(Types.EmailService).toConstantValue({
                getData: sandbox.stub().resolves(Promise.resolve()),
            });
            controller = container.get(Types.EmailController);
            app = container.get<Application>(Types.Application).app;
            controller['configureRouter']();

            supertest(app)
                .post('/api/email')
                .then((response) => {
                    expect(response.status).to.equal(HTTP_STATUS_OK);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        }, 100);

    });

    it('test post request with error 422',  (done: Mocha.Done) => {
        setTimeout(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.EmailService).toConstantValue({
            getData: sandbox.stub().rejects({response: {status: 422}}),
        });
        controller = container.get(Types.EmailController);
        app = container.get<Application>(Types.Application).app;
        controller['configureRouter']();
        supertest(app)
            .post('/api/email')
            .then((response) => {
                expect(response.body.message)
                    .to.equal("Erreur: L'adresse courriel entrée ne peut etre atteinte. Veuillez verifier le courriel.");
                done();
            })
            .catch((error) => {
                done(error);
            });
        }, 100);
    });

    it('test post request with error 500',  (done: Mocha.Done) => {
        setTimeout(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.EmailService).toConstantValue({
            getData: sandbox.stub().rejects({response: {status: 500}}),
        });
        controller = container.get(Types.EmailController);
        app = container.get<Application>(Types.Application).app;
        controller['configureRouter']();
        supertest(app)
            .post('/api/email')
            .then((response) => {
                expect(response.body.message)
                    .to.equal('Nous éprouvons des difficultés à envoyer le courriel.');
                done();
            })
            .catch((error) => {
                done(error);
            });
        }, 100);
    });

    it('test post request with error 429',  (done: Mocha.Done) => {
        setTimeout(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.EmailService).toConstantValue({
            getData: sandbox.stub().rejects({response: {status: 429}}),
        });
        controller = container.get(Types.EmailController);
        app = container.get<Application>(Types.Application).app;
        controller['configureRouter']();
        supertest(app)
            .post('/api/email')
            .then((response) => {
                expect(response.body.message)
                    .to.equal("Impossible d'envoyer le courriel.");
                done();
            })
            .catch((error) => {
                done(error);
            });
        }, 100);
    });
});

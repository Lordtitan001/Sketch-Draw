// tslint:disable no-string-literal
// tslint:disable prefer-const

import { expect } from 'chai';
import 'reflect-metadata';
import * as supertest from 'supertest';
import { testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import Types from '../types';
import { DrawingController } from './drawing.controller';
describe('DrawingController', () => {
    const HTTP_STATUS_OK = 200;
    let controller: DrawingController;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.DrawingService).toConstantValue({
            saveToDataBase: sandbox.stub().resolves(Promise.resolve()),
            delete: sandbox.stub().resolves(Promise.resolve(true)),
        });
        controller = container.get(Types.DrawingController);
        app = container.get<Application>(Types.Application).app;
        controller['configureRouter']();
    });

    it('test get request', (done: Mocha.Done) => {
        supertest(app).get('/api/drawing')
            .then((response) => {
                expect(response.status).to.equal(HTTP_STATUS_OK);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it('test post request', (done: Mocha.Done) => {
        supertest(app)
            .post('/api/drawing')
            .then((response) => {
                expect(response.status).to.equal(HTTP_STATUS_OK);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it('test delete request', (done: Mocha.Done) => {
        supertest(app)
            .delete('/api/drawing/123456789012')
            .then((response) => {
                expect(response.status).to.equal(HTTP_STATUS_OK);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});

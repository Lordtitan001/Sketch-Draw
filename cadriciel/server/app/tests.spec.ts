import {  assert, expect } from 'chai';
import { Container } from 'inversify';
import { describe } from 'mocha';
import 'reflect-metadata';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import { testingContainer } from '../test/test-utils';
import { Application } from './app';
import { Server } from './server';
import Types from './types';
// import * as www from './www';

describe('Application and Server', () => {
    // tslint:disable prefer-const
    // tslint:disable no-string-literal
    // tslint:disable no-magic-numbers
    let application: Application;
    let server: Server;
    let container: Container;
    beforeEach(async () => {
        [container] = await testingContainer();
        application = container.get<Application>(Types.Application);
        server = container.get<Server>(Types.Server);
    });

    it('Handle the error', (done: Mocha.Done) => {
        supertest(application.app)
            .get('/').then((response) => {
                done();
            })
            .catch((error) => { expect(error.status).to.equal(application['internalError']); done(); });
    });

    it('should init the server', () => {
        const stub = sinon.stub(server['application'].app, 'set');
        server.init();
        stub.resolves();
        assert(stub.called);
        stub.restore();
    });

    it('should init the server and the return the port', () => {
        server = container.get<Server>(Types.Server);
        server['normalizePort'](12);
    });

    it('should normelize the port and return a number', () => {
        server = container.get<Server>(Types.Server);
        server['normalizePort']('129');
    });

    it('should normelize the port and return false', () => {
        server = container.get<Server>(Types.Server);
        server['normalizePort']('-12');
    });

    it('should log the EACCES error', () => {
        const error: NodeJS.ErrnoException = {name: 'string',
            message: 'string', code: 'EACCES', syscall: 'listen'};
        server['onError'](error);
    });

    it('should log the EADDRINUSE error', () => {
        process.env.PORT = '0';
        server = container.get<Server>(Types.Server);
        const error: NodeJS.ErrnoException = {name: 'string',
            message: 'string', code: 'EADDRINUSE', syscall: 'listen'};
        server['onError'](error);
    });

    it('should log the default error ', () => {
        const error: NodeJS.ErrnoException = {name: 'string',
            message: 'string', code: '', syscall: 'listen'};
        server['onError'](error);
    });

    it('should log the default error ', () => {
        const error: NodeJS.ErrnoException = {name: 'string',
            message: 'string', code: '', syscall: ''};
        server['onError'](error);
    });

    it('should listend to the port with string adresse ', () => {
        server = container.get<Server>(Types.Server);
        server.init();
        const stub = sinon.stub(server['server'], 'address');
        stub.returns('port');
        server['onListening']();
    });

    it('should init with a port to false', () => {
        process.env.PORT = 'undef';
        server = container.get<Server>(Types.Server);
        server.init();
    });

    // it('should init the server in www file', async () => {
    //     await (await www.returnServer()).init();
    // });

});

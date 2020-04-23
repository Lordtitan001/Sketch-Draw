// tslint:disable-next-line: no-magic-numbers
// tslint:disable no-string-literal
import { assert, expect } from 'chai';
import { ObjectId } from 'mongodb';
import 'reflect-metadata';
import * as sinon from 'sinon';
import { Drawing } from '../../../common/drawing';
import { testingContainer } from '../../test/test-utils';
import types from '../types';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let service: DrawingService;
    const timeout = 300;
    let id: number;
    // tslint:disable-next-line: only-arrow-functions
    function randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    before(() => {
        // tslint:disable-next-line: no-magic-numbers
        id = randomIntFromInterval(112645678913, 512645678912);
    });

    after(async () => {
        await service['collection'].deleteMany({});
    });

    beforeEach(async () => {
        const [container] = await testingContainer();
        service = container.get<DrawingService>(types.DrawingService);
        service['dataBase'] = 'test';
        await service.init();
        await service['collection'].deleteMany({});
    });

    it('should save data to mongo', (done: Mocha.Done) => {
        setTimeout(async () => {
            const spy2 = sinon.spy(service, 'loadFromDataBase');
            const spy = sinon.spy(service['collection'], 'insertOne');
            await service.saveToDataBase({ Draw: new Drawing(), _id: id.toString(), Tags: [] })
                .then(async () => {
                    assert(spy.called);
                    assert(spy2.called);
                    const length = await (await service.loadFromDataBase()).length;
                    expect(length).to.equal(1);
                    spy.restore();
                    spy2.restore();
                    done();
                })
                .catch((error) => {
                    spy.restore();
                    spy2.restore();
                    done(error);
                });
        }, timeout);
    });

    it('should delete to mongo DB', (done: Mocha.Done) => {
        setTimeout(async () => {
            const spy = sinon.spy(service, 'deleteOne');
            await service.delete(id.toString()).then((value) => {
                expect(spy.callCount).equal(1);
                spy.restore();
                done();
            }).catch((error) => { spy.restore(); done(error); });
        }, timeout);
    });

    it('should call deleteOne from collection', (done: Mocha.Done) => {
        setTimeout(async () => {
            const spy = sinon.spy(service['collection'], 'deleteOne');
            const spy2 = sinon.spy(service, 'loadFromDataBase');
            const toDelete = { _id: new ObjectId(id.toString()) };
            await service['deleteOne'](toDelete).then(async (value) => {
                expect(spy.callCount).equal(1);
                assert(spy2.called);
                const length = await (await service.loadFromDataBase()).length;
                expect(length).to.equal(0);
                spy.restore();
                spy2.restore();
                done();
            })
                .catch((error) => {
                    spy.restore();
                    spy2.restore();
                    done(error);
                });
        }, timeout);
    });

    it('should load all from database', (done: Mocha.Done) => {
        setTimeout(async () => {
            await service.saveToDataBase({ Draw: new Drawing(), _id: id.toString(), Tags: [] });
            await service.saveToDataBase({ Draw: new Drawing(), _id: (id + 1).toString(), Tags: [] });
            await service.loadFromDataBase().then(async (value) => {
                expect(value.length).to.equal(2);
                done();
            })
                .catch((error) => {
                    done(error);
                });
        }, timeout);
    });

});

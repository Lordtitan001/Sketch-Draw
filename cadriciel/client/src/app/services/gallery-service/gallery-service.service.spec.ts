// tslint:disable: no-string-literal
// tslint:disable: no-empty
// tslint:disable: no-magic-numbers
import { Overlay } from '@angular/cdk/overlay';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { async, TestBed } from '@angular/core/testing';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { Draw } from '../../../../../common/communication/draw';
import { Drawing } from '../../../../../common/drawing';
import { SaveDrawingService } from '../saveDrawing/save-drawing.service';
import { GalleryServiceService } from './gallery-service.service';

describe('GalleryServiceService', () => {
    let service: GalleryServiceService;
    const time = 300;
    beforeEach(() => TestBed.configureTestingModule({
        providers: [SaveDrawingService, MatSnackBar, HttpClient, HttpHandler, Overlay]
    }));

    beforeEach(() => {
        service = TestBed.get(GalleryServiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all the images during initialisation', async(() => {

        const value = 0;
        const promise = Promise.resolve(true);
        const getAllSpy = spyOn(service, 'getAllImageFromDataBase')
            .and.returnValue(promise);
        service.init();
        expect(getAllSpy)
            .toHaveBeenCalled();
        setTimeout(() => {
            expect(service.tagList.length).toEqual(value);
        }, time);

    }));

    it('should get all the images from save service and resolve', async(() => {
        const draw: Draw = {
            _id: '',
            Tags: ['he', 'hi', 'bro'],
            Draw: new Drawing(undefined, undefined, undefined, undefined, ['he', 'hi', 'bro'])
        };
        const draw2: Draw = {
            _id: '99',
            Tags: ['he', 'hello'],
            Draw: new Drawing(undefined, undefined, undefined, undefined, ['he', 'hello'])
        };

        const drawList: Draw[] = [draw, draw2];
        const promise = Promise.resolve(drawList);
        const getDrawinglSpy = spyOn(service['saveService'], 'getDrawing').and
            .returnValue(promise);

        service['checkDrawing'] = jasmine.createSpy('checkDrawinglSpy');
        service.getAllImageFromDataBase();
        expect(getDrawinglSpy).toHaveBeenCalled();
        setTimeout(() => {
            expect(service['checkDrawing']).toHaveBeenCalled();
        }, time);

    }));

    it('should get all the images from save service and getDrawing reject with 0', async(() => {

        const promise = Promise.reject({ status: 0 });
        const openPopUpSpy = spyOn(service, 'openPopUp');
        const getDrawingSpy = spyOn(service['saveService'], 'getDrawing').and
            .returnValue(promise);
        service.getAllImageFromDataBase();

        expect(getDrawingSpy).toHaveBeenCalled();
        setTimeout(() => {
            expect(service['message']).toEqual('');
            expect(openPopUpSpy).toHaveBeenCalled();
            expect(service.docLoaded).toBeDefined();
        }, time);

    }));

    it('should get all the images from save service and  getDrawing reject with 200', async(() => {

        const promise = Promise.reject({ status: 200 });
        const openPopUpSpy = spyOn(service, 'openPopUp');
        const getDrawingSpy = spyOn(service['saveService'], 'getDrawing').and
            .returnValue(promise);
        service.getAllImageFromDataBase();
        expect(getDrawingSpy).toHaveBeenCalled();
        setTimeout(() => {
            expect(service['message']).toEqual('');
            expect(openPopUpSpy).toHaveBeenCalled();
        }, time);

    }));

    it('should delete one image, reload all the images from database and deleteDrawing resolve', async(() => {
        const getAll = spyOn(service, 'getAllImageFromDataBase');
        const getDrawingSpy = spyOn(service['saveService'], 'deleteDrawing')
            .and
            .returnValue(Promise.resolve(true));
        service.deleteDrawing('id');
        expect(getDrawingSpy).toHaveBeenCalled();
        setTimeout(() => {
            expect(getAll).toHaveBeenCalled();
        }, time);

    }));

    it('should delete one image, reload all the images from database and deleteDrawing reject', async(() => {
        const getAll = spyOn(service, 'getAllImageFromDataBase');
        const getDrawingSpy = spyOn(service['saveService'], 'deleteDrawing')
            .and
            .returnValue(Promise.reject({}));
        service.deleteDrawing('id').catch((error) => { });
        expect(getDrawingSpy).toHaveBeenCalled();
        setTimeout(() => {
            expect(getAll).not.toHaveBeenCalled();
        }, time);

    }));

    it('should open the pop up with a message an action', () => {
        const toExecute = () => { return; };
        const open = spyOn(service['snackBar'], 'openFromComponent');
        service.openPopUp(toExecute, 'message', 'action');
        expect(open).toHaveBeenCalledWith(PopupComponent,
            {
                duration: 2000,
                data: {
                    action: 'action',
                    message: 'message',
                    function: toExecute
                }
            });
    });

    it('should check if array is empty  and show the message', () => {
        const open = spyOn(service, 'openPopUp');
        service.drawList = [];
        service['checkDrawing']();
        expect(open).toHaveBeenCalled();
    });

    it('should check if array is empty and not show the message', () => {
        const open = spyOn(service, 'openPopUp');
        service.drawList = [{ _id: '', Tags: [''], Draw: new Drawing() }];
        service['checkDrawing']();
        expect(open).not.toHaveBeenCalled();
    });

    it('should filter elemets with tags', () => {
        const draw: Draw = {
            _id: '',
            Tags: ['he', 'hi', 'bro'],
            Draw: new Drawing(undefined, undefined, undefined, undefined, ['he', 'hi', 'bro'])
        };
        const draw2: Draw = {
            _id: '99',
            Tags: ['he', 'hello'],
            Draw: new Drawing(undefined, undefined, undefined, undefined, ['he', 'hello'])
        };

        const drawList: Draw[] = [draw, draw2];
        service['filter'](drawList);
        expect(service.tagList.length).toEqual(4);
    });

});

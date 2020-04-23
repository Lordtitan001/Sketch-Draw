import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Color } from 'src/app/Models/color';
import { Draw } from '../../../../../common/communication/draw';
import { Drawing } from '../../../../../common/drawing';
import { SaveDrawingService } from './save-drawing.service';
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
describe('SaveDrawingService', () => {
    let service: SaveDrawingService;
    const url = 'http://localhost:3000/api/drawing/';
    const draw: Draw = {
        _id: '', Tags: ['he', 'hi', 'bro'],
        Draw: new Drawing(undefined, undefined, undefined, undefined, ['he', 'hi', 'bro'])
    };
    const draw2: Draw = {
        _id: '99', Tags: ['he', 'hello'],
        Draw: new Drawing(undefined, undefined, undefined, undefined, ['he', 'hello'])
    };
    const drawList: Draw[] = [draw, draw2];
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                SaveDrawingService,
            ],
        });
    });

    beforeEach(() => {
        service = TestBed.get(SaveDrawingService);
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.svg.setAttribute('height', '500');
        service['drawService'].elements.svg.setAttribute('width', '500');
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('saveDrawing should save the drawing', async(inject([HttpTestingController, SaveDrawingService],
        (httpClient: HttpTestingController, saveDrawingService: SaveDrawingService) => {
            const mockResponse = 'This is the res';
            saveDrawingService.saveDrawing()
                .subscribe((value) => {
                    expect(value).toEqual(mockResponse);
                });
            const mock = httpClient.expectOne(url);
            expect(mock.cancelled).toBeFalsy();
            expect(mock.request.responseType).toEqual('text');
            mock.flush(mockResponse);
            httpClient.verify();
        })));

    it('should init draw without name', () => {
        service.saveDrawing('');
        expect(service.drawing.nom).toEqual('Sans nom');
    });

    it('should delete the drawing', async(inject([HttpTestingController, SaveDrawingService],
        (httpClient: HttpTestingController, saveDrawingService: SaveDrawingService) => {
            const mockResponse = true;
            const id = 'id';
            saveDrawingService.deleteDrawing(id)
                .then(async (value) => {
                    expect(value).toEqual(mockResponse);
                });
            const mock = httpClient.expectOne(url + '/' + id);
            expect(mock.cancelled).toBeFalsy();
            mock.event(new HttpResponse<boolean>({ body: true }));
            httpClient.verify();
        })));

    it('should not delete the drawing and return error', async(inject([HttpTestingController, SaveDrawingService],
        (httpClient: HttpTestingController, saveDrawingService: SaveDrawingService) => {
            const id = 'id';
            const error = new ErrorEvent('http');
            saveDrawingService.deleteDrawing(id)
                .then((value) => { return; },
                    (err) => {
                        expect(err).toBeTruthy();
                    });
            const mock = httpClient.expectOne(url + '/' + id);
            mock.error(error);
            httpClient.verify();
        })));

    it('setDrawing create the drawing to save', () => {
        service['drawService'].surfaceList = [];
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const grid = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const preview = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        grid.id = 'grid';
        preview.id = 'preview';
        const svg = service['drawService'].elements.svg;
        svg.innerHTML = 'html';
        svg.appendChild(grid);
        svg.appendChild(preview);
        svg.setAttribute('width', '10');
        svg.setAttribute('height', '10');
        service['newService'].backgroundColor = new Color(100, 100, 100);
        service.setDrawing();
        expect(service.drawing.svgDimensions).toEqual(['10', '10']);
        expect(service.drawing.surfaceList).toEqual([]);
        expect(service.drawing.backgroundColor.getColor()).toEqual(new Color(100, 100, 100).getColor());
    });

    it('getAllDrawings not should get all drawings and reject', async(inject([HttpTestingController, SaveDrawingService],
        (httpClient: HttpTestingController, saveDrawingService: SaveDrawingService) => {
            const error = new ErrorEvent('http');
            saveDrawingService.getAllDrawings()
                .then((value) => { return; },
                    (err) => {
                        expect(err).toBeTruthy();
                    });
            const mock = httpClient.expectOne(url);
            mock.error(error);
            httpClient.verify();
        })));

    it('should get all the drawing', async(inject([HttpTestingController, SaveDrawingService],
        (httpClient: HttpTestingController, saveDrawingService: SaveDrawingService) => {
            const mockResponse = [];
            saveDrawingService.getAllDrawings()
                .then(async (value) => {
                    expect(value).toEqual(mockResponse);
                });
            const mock = httpClient.expectOne(url);
            expect(mock.cancelled).toBeFalsy();
            mock.flush(mockResponse);
            httpClient.verify();
        })));

    it('should get all the drawing with tags[] empty', async(inject([HttpTestingController, SaveDrawingService],
        (httpClient: HttpTestingController, saveDrawingService: SaveDrawingService) => {
            const mockResponse = drawList;
            saveDrawingService.getDrawing()
                .then(async (value) => {
                    expect(value).toEqual(mockResponse);
                });
            const mock = httpClient.expectOne(url);
            expect(mock.cancelled).toBeFalsy();
            mock.flush(mockResponse);
            httpClient.verify();
        })));

    it('should get all the drawing but not from the database with status 200', () => {
        const httpError = { status: 200 };
        spyOn(service, 'getAllDrawings').and.returnValue(Promise.reject(httpError));
        service.getDrawing()
            .then((value) => { return; },
                (value) => {
                    expect(value).toEqual([]);
                },
                )
            .catch(() => { return; });
        expect().nothing();
    });

    it('should get all the drawing but not from the database with status 0', () => {
        const httpError = { status: 0 };
        spyOn(service, 'getAllDrawings').and.returnValue(Promise.reject(httpError));
        service.getDrawing()
            .then((value) => { return; },
                (value) => {
                    expect(value).toEqual([]);
                },
                )
            .catch(() => { return; });
        expect().nothing();
    });

    it('should return all drawing', () => {
        const list = service.findDrawings(drawList, []);
        expect(list).toEqual(drawList);
    });

    it('should return all drawing with tags', () => {
        const list = service.findDrawings(drawList, ['hello']);
        expect(list).toEqual([draw2]);
    });
});

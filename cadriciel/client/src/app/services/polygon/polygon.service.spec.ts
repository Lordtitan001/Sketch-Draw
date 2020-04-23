// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any
// tslint:disable: max-file-line-count
import { TestBed } from '@angular/core/testing';
import { strokeTypeEnum } from 'src/app/Models/enums';
import { Point } from 'src/app/Models/shapes/point';
import { Polygon } from 'src/app/Models/shapes/polygon';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { PolygonService } from './polygon.service';

describe('PolygonService', () => {

    let service: PolygonService;

    beforeEach(() => TestBed.configureTestingModule({
        providers: [DrawingServiceService, ColorPickerService]
    }));

    beforeEach(() => {
        service = TestBed.get(PolygonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        const point = new Point(0, 0);
        expect(service['polygon'].origin).toEqual(point);
    });

    it('testing initialisation--(function) the polygon setting should be done', () => {
        service['drawService'].surfaceList[service['drawService'].indexList] = new Polygon();
        service['drawService'].selectedTools.sides = 4;
        const clickOne = new MouseEvent('click', { clientX: 200, clientY: 200 });
        service['mouseDefinded'] = false;
        service['drawService'].selectedTools.stroke = 'red';
        service['drawService'].selectedTools.fill = 'orange';
        spyOn<any>(service, 'setStrokeColor');
        const point = new Point(200, 200);
        service['initialisation'](clickOne);
        expect(service['mouseDefinded']).toEqual(false);
        expect(service['setStrokeColor']).toHaveBeenCalled();
        expect(service['polygon'].angle).toEqual(2 * Math.PI / 4);
        expect(service['polygon'].origin).toEqual(point);
        expect(service['polygon'].sides).toEqual(4);
        expect( service['drawService'].surfaceList[ service['drawService'].indexList].fill).toEqual('orange');
        expect( service['drawService'].surfaceList[ service['drawService'].indexList].stroke).toEqual('red');

    });

    it('testing initPolygon--function all functions to draw polygon shloiud be used', () => {
        service['drawService'].selectedTools.sides = 4;
        const clickOne = new MouseEvent('click', { clientX: 200, clientY: 200 });
        service['mouseDefinded'] = true;
        service['polygon'].origin = new Point(100, 150);
        service['polygon'].height = 4;
        service['polygon'].width = 4;
        service['drawService'].visualisation = 'Testing';
        spyOn<any>(service, 'computeRadius');
        spyOn<any>(service, 'computeCenter');
        spyOn<any>(service, 'findPoints');
        spyOn<any>(service, 'makePolygon');
        const squarePath = ` M ${100} ${150} h
        ${100} v ${50} h ${-100} Z`;
        const point = new Point(200, 200);
        service['currentPos'] = new Point(4, 4);
        service['initPolygon'](clickOne);
        expect(service['polygon'].width).toEqual(100);
        expect(service['polygon'].height).toEqual(50);
        expect(service['trueHeight']).toEqual(50);
        expect(service['currentPos']).toEqual(point);
        expect(service['computeRadius']).toHaveBeenCalled();
        expect(service['computeCenter']).toHaveBeenCalled();
        expect(service['findPoints']).toHaveBeenCalled();

        expect(service['makePolygon']).toHaveBeenCalled();
        expect(service['drawService'].visualisation).toEqual(squarePath);
    });

    it('testing mouseUp--function drawing should be finished', () => {
        service['canDraw'] = true;
        service['mouseDefinded'] = true;
        service['hasMoved'] = true;
        spyOn<any>(service, 'initialisation');
        spyOn<any>(service, 'initPolygon');

        const clickOne = new MouseEvent('click', { clientX: 200, clientY: 200 });

        service.mouseMove(clickOne);
        expect(service['hasMoved']).toEqual(true);

        expect(service['initialisation']).not.toHaveBeenCalled();
        expect(service['initPolygon']).toHaveBeenCalledWith(clickOne);
    });

    it('testing mouseUp--function nothing should happened' , () => {
        service['canDraw'] = false;
        service['mouseDefinded'] = true;
        service['hasMoved'] = false;
        const clickOne = new MouseEvent('click', { clientX: 200, clientY: 200 });
        spyOn<any>(service, 'initialisation');
        spyOn<any>(service, 'initPolygon');
        service.mouseMove(clickOne);
        expect(service['hasMoved']).toEqual(false);
        expect(service['initialisation']).not.toHaveBeenCalled();
        expect(service['initPolygon']).not.toHaveBeenCalledWith(clickOne);
    });

    it('testing mouseUp--function initialisation of Polygon must be done', () => {
        service['canDraw'] = true;
        service['mouseDefinded'] = false;
        service['hasMoved'] = true;
        spyOn<any>(service, 'initialisation');
        spyOn<any>(service, 'initPolygon');
        const clickOne = new MouseEvent('click', { clientX: 200, clientY: 200 });
        service.mouseMove(clickOne);
        expect(service['hasMoved']).toEqual(true);
        expect(service['initialisation']).not.toHaveBeenCalled();
        expect(service['initPolygon']).not.toHaveBeenCalledWith(clickOne);
    });

    it('testing mouseUp--function indexList must be increase', () => {
        service['canDraw'] = true;
        service['mouseDefinded'] = false;
        service['hasMoved'] = false;
        service['drawService'].surfaceList.length = 9;
        service['drawService'].indexList = 4;
        spyOn<any>(service, 'initialisation');
        spyOn<any>(service, 'initPolygon');
        const clickOne = new MouseEvent('click', { clientX: 200, clientY: 200 });
        service.mouseMove(clickOne);
        expect(service['initialisation']).toHaveBeenCalled();
        expect(service['initPolygon']).not.toHaveBeenCalledWith(clickOne);
        expect(service['hasMoved']).toEqual(true);
        expect(service['drawService'].indexList).toEqual(5);
        expect(service['hasMoved']).toEqual(true);
    });

    it('testing mouseUp--function indexList should not be changed', () => {
        service['canDraw'] = true;
        service['mouseDefinded'] = false;
        service['hasMoved'] = false;
        service['drawService'].surfaceList.length = 3;
        service['drawService'].indexList = 4;
        spyOn<any>(service, 'initialisation');
        spyOn<any>(service, 'initPolygon');
        const clickOne = new MouseEvent('click', { clientX: 200, clientY: 200 });
        service.mouseMove(clickOne);
        expect(service['initialisation']).toHaveBeenCalled();
        expect(service['initPolygon']).not.toHaveBeenCalledWith(clickOne);
        expect(service['hasMoved']).toEqual(true);
        expect(service['drawService'].indexList).toEqual(4);
    });

    it('testing mouseUp--function nothing should happen', () => {
        service['canDraw'] = true;
        service['mouseDefinded'] = true;
        service['hasMoved'] = false;
        service['drawService'].surfaceList.length = 3;
        service['drawService'].indexList = 4;
        spyOn<any>(service, 'initialisation');
        spyOn<any>(service, 'initPolygon');
        const clickOne = new MouseEvent('click', { clientX: 200, clientY: 200 });
        service.mouseMove(clickOne);
        expect(service['initialisation']).toHaveBeenCalled();
        expect(service['initPolygon']).not.toHaveBeenCalledWith(clickOne);
        expect(service['hasMoved']).toEqual(true);
        expect(service[ 'drawService' ].indexList).toEqual(4);
    });

    it('testing mouseUp--function the draw must be updated and the undoButton too', () => {
        service['mouseDefinded'] = true;
        service['drawService'].visualisation = 'Testing';
        service['drawService'].indexList = 5;
        service.mouseUp();

        expect(service['mouseDefinded']).toEqual(false);
        expect(service['drawService'].indexList).toEqual(5);
        expect(service['drawService'].visualisation).toEqual('');
    });

    it('testing pairCenter--function center of pair Polygon must be the center of the square', () => {
        service['polygon'].sides = 10;
        service['radius'] = 5;
        service['beforeX'] = 8;
        service['pairCenter']();
        expect(service['beforeX']).toEqual(5);
    });

    it('testing pairCenter--function when sides equals ', () => {
        service['polygon'].sides = 6;
        service['radius'] = 5;
        service['beforeX'] = 8;
        service['pairCenter']();
        expect(service['beforeX']).toEqual(5);
    });

    it('testing pairCenter--function radius must and initialized and the center should not change', () => {
        service['polygon'].sides = 8;
        service['radius'] = 5;
        service['beforeX'] = 8;
        service['pairCenter']();
        expect(service['beforeX']).not.toEqual(5);
    });

    it('testing computeRadius--function center should calculate depending on the parity', () => {
        service['polygon'].sides = 8;
        spyOn<any>(service, 'pairRadius');
        spyOn<any>(service, 'impairRadius');
        service['computeRadius']();
        expect(service['pairRadius']).toHaveBeenCalled();
        expect(service['impairRadius']).not.toHaveBeenCalled();
    });

    it('testing computeRadius--function center should calculate depending on impair side', () => {
        service['polygon'].sides = 5;
        spyOn<any>(service, 'pairRadius');
        spyOn<any>(service, 'impairRadius');
        service['computeRadius']();
        expect(service['pairRadius']).not.toHaveBeenCalled();
        expect(service['impairRadius']).toHaveBeenCalled();
    });

    it('testing pairRadius--function when sides != 6 or sides!=10', () => {
        service['polygon'].sides = 4;
        service['trueHeight'] = 6;
        service['pairRadius']();
        expect(service['radius']).toEqual(3);
    });

    it('testing pairRadius--function radius must be changed ', () => {
        service['polygon'].sides = 6;
        service['trueHeight'] = 6;
        service['polygon'].height = 10;
        service['polygon'].width = 8;
        const expectedRadius = Math.abs(service['trueHeight'] / 2 / Math.sin(Math.PI / 2 - service['polygon'].angle / 2));
        service['pairRadius']();
        expect(service['radius']).toEqual(expectedRadius);
    });

    it('testing pairRadius--function pair radius for standard pair sides must be calculated', () => {
        service['polygon'].sides = 10;
        service['trueHeight'] = 6;
        service['polygon'].height = 10;
        service['polygon'].width = 8;
        const expectedRadius = Math.abs(service['trueHeight'] / 2 / Math.sin(Math.PI / 2 - service['polygon'].angle / 2));
        service['pairRadius']();
        expect(service['radius']).toEqual(expectedRadius);
    });

    it('testing makePolygon--function all points must be in  the list of Polygon', () => {
        service['polygon'].sides = 3;
        service['drawService'].surfaceList = [];
        service['drawService'].surfaceList[service['drawService'].indexList] = new Polygon();
        service['drawService'].indexList = 0;
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(1, 2));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(8, 6));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(96, 80));
        const expectedPath = 'M 1 2 L 8 6 L 96 80  Z';
        service['makePolygon']();
        expect(service['drawService'].surfaceList[service['drawService'].indexList].d).toEqual(expectedPath);
    });

    it('testing impairRadius--function  impair radius for side 3', () => {
        service['polygon'].sides = 3;
        service['polygon'].height = 5;
        service['polygon'].width = 10;
        service['trueHeight'] = 12;
        const expectedRadius = service['trueHeight'] / (1 + Math.cos(service['polygon'].angle / 2));
        service['impairRadius']();
        expect(service['radius']).toEqual(expectedRadius);
    });

    it('testing impairRadius--function radius change when height > width', () => {
        service['polygon'].sides = 3;
        service['polygon'].height = 55;
        service['polygon'].width = 10;
        service['trueHeight'] = 12;
        const expectedRadius = service['trueHeight'] /
        (2 * Math.cos(Math.PI / 2 - service.DECALAGE_IMPAIR[service['polygon'].sides - 1] * service['polygon'].angle));
        service['impairRadius']();
        expect(service['radius']).toEqual(expectedRadius);
    });

    it('testing computeCenter--function center calculated is for impair side', () => {
        service['polygon'].sides = 3;
        spyOn<any>(service, 'standardCenter');
        spyOn<any>(service, 'particularCenter');

        service['computeCenter']();
        expect(service['particularCenter']).toHaveBeenCalled();
        expect(service['standardCenter']).not.toHaveBeenCalled();
    });

    it('testing computeCenter--function center calculated is for pair side', () => {
        service['polygon'].sides = 4;
        spyOn<any>(service, 'standardCenter');
        spyOn<any>(service, 'particularCenter');

        service['computeCenter']();
        expect(service['particularCenter']).not.toHaveBeenCalled();
        expect(service['standardCenter']).toHaveBeenCalled();
    });

    it('testing standardCenter--function center is the center of the standard square', () => {
        service['radius'] = 2;
        service['currentPos'] = new Point(4, 8);
        service['polygon'].origin = new Point(2, 2);
        const expectedCenterX = 4;
        const expectedCenterY = 4;
        const point = new Point(expectedCenterX, expectedCenterY);
        service['standardCenter']();
        expect(service['polygon'].center).toEqual(point);
    });

    it('testing standardCenter--center should be the center of the square', () => {
        service['radius'] = 2;
        service['currentPos'] = new Point(2, 2);
        service['polygon'].origin = new Point(8, 4);
        const expectedCenterX = 6;
        const expectedCenterY = 2;
        const point = new Point(expectedCenterX, expectedCenterY);
        service['standardCenter']();
        expect(service['polygon'].center).toEqual(point);
    });

    it('testing standardCenter--function center depend on particular side(6)', () => {
        service['radius'] = 2;
        service['trueHeight'] = 3;
        service['currentPos'] = new Point(2, 2);
        service['polygon'].origin = new Point(8, 4);
        service['polygon'].sides = 6;
        spyOn<any>(service, 'pairCenter');
        spyOn<any>(service, 'impairCenter');
        service['beforeX'] = 1;
        const expectedCenterX = 7;
        const expectedCenterY = 3;
        const point = new Point(expectedCenterX, expectedCenterY);
        service['particularCenter']();
        expect(service['polygon'].center).toEqual(point);
        expect(service['pairCenter']).toHaveBeenCalled();
        expect(service['impairCenter']).not.toHaveBeenCalled();
    });

    it('testing standardCenter--function center depend on particular side(5)', () => {
        service['radius'] = 2;
        service['trueHeight'] = 3;
        service['currentPos'] = new Point(8, 4);
        service['polygon'].origin = new Point(2, 2);
        service['polygon'].sides = 5;
        spyOn<any>(service, 'pairCenter');
        spyOn<any>(service, 'impairCenter');
        service['beforeX'] = 1;
        const expectedCenterX = 3;
        const expectedCenterY = 4;
        const point = new Point(expectedCenterX, expectedCenterY);
        service['particularCenter']();
        expect(service['polygon'].center).toEqual(point);
        expect(service['pairCenter']).not.toHaveBeenCalled();
        expect(service['impairCenter']).toHaveBeenCalled();

    });

    it('testing impairCenter--function impair center must not be apply to pair sides', () => {
        service['radius'] = 2;
        service['polygon'].sides = 6;
        const expectedBeforeX = Math.abs(service['radius'] *
            Math.cos(Math.PI / 2 - service.DECALAGE_IMPAIR[service['polygon'].sides - 1] * service['polygon'].angle));
        service['impairCenter']();
        expect(service['beforeX']).toEqual(expectedBeforeX);

    });

    it('testing impairCenter--function center depend on particular side(3)', () => {
        service['radius'] = 2;
        service['polygon'].sides = 3;
        const expectedBeforeX = Math.abs(service['radius'] * Math.cos(Math.PI / 2 - service['polygon'].angle / 2));
        service['impairCenter']();
        expect(service['beforeX']).toEqual(expectedBeforeX);
    });

    it('testing setStrokeColor--function only the contour must have a color', () => {
        service['drawService'].selectedTools.strokeType = strokeTypeEnum.Contour;
        service['drawService'].selectedTools.fill = 'black';
        service['drawService'].selectedTools.stroke = 'yellow';
        spyOn<any>(service['pickerService'].secondaryColor, 'getColor').and.callFake(
            () => {
                return ('red');
            });
        service['setStrokeColor']();
        expect(service['drawService'].selectedTools.fill).toEqual('none');
        expect(service['drawService'].selectedTools.stroke).toEqual('red');

    });

    it('testing setStrokeColor--function only the interiror should have color', () => {
        service['drawService'].selectedTools.strokeType = strokeTypeEnum.Full;
        service['drawService'].selectedTools.fill = 'black';
        service['drawService'].selectedTools.stroke = 'yellow';
        spyOn<any>(service['pickerService'].primaryColor, 'getColor').and.callFake(
            () => {
                return ('red');
            });
        service['setStrokeColor']();
        expect(service['drawService'].selectedTools.fill).toEqual('red');
        expect(service['drawService'].selectedTools.stroke).toEqual('none');

    });

    it('testing setStrokeColor--function the whole draw must have color', () => {
        service['drawService'].selectedTools.strokeType = strokeTypeEnum.FullWithContour;
        service['drawService'].selectedTools.fill = 'black';
        service['drawService'].selectedTools.stroke = 'yellow';
        spyOn<any>(service['pickerService'].primaryColor, 'getColor').and.callFake(
            () => {
                return ('red');
            });
        spyOn<any>(service['pickerService'].secondaryColor, 'getColor').and.callFake(
            () => {
                return ('green');
            });

        service['setStrokeColor']();
        expect(service['drawService'].selectedTools.fill).toEqual('red');
        expect(service['drawService'].selectedTools.stroke).toEqual('green');

    });

    it('testing setStrokeColor--function nothing on the polygon should colored', () => {
        service['drawService'].selectedTools.strokeType = strokeTypeEnum.Any;
        service['drawService'].selectedTools.fill = 'black';
        service['drawService'].selectedTools.stroke = 'yellow';
        spyOn<any>(service['pickerService'].primaryColor, 'getColor').and.callFake(
            () => {
                return ('red');
            });
        spyOn<any>(service['pickerService'].secondaryColor, 'getColor').and.callFake(
            () => {
                return ('green');
            });

        service['setStrokeColor'] ();
        expect(service['drawService'].selectedTools.fill).toEqual('black');
        expect(service['drawService'].selectedTools.stroke).toEqual('yellow');

    });

    it('testing alignDown--function ajust the draw when height >width', () => {
        service['radius'] = 2;
        service['polygon'].sides = 3;
        service['currentPos'] = new Point(1, 0);
        service['polygon'].origin = new Point(10, 10);
        service['polygon'].height = 20;
        service['polygon'].width = 10;
        service['drawService'].surfaceList = [];
        service['drawService'].surfaceList[service['drawService'].indexList] = new Polygon();
        service['drawService'].indexList = 0;
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 20));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 30));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(20, 50));
        const toDedeuct = service['polygon'].origin.y -
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList[Math.round(service['polygon'].sides / 2)].y;
        service['alignDown']();
        const tabPoints = service['drawService'].surfaceList[service['drawService'].indexList].pointsList;
        expect(tabPoints[0].y).toEqual(20 + toDedeuct);
        expect(tabPoints[1].y).toEqual(30 + toDedeuct);
        expect(tabPoints[2].y).toEqual(50 + toDedeuct);
    });

    it('testing alignDown--function ajust the draw  normally', () => {
        service['radius'] = 2;
        service['polygon'].sides = 3;
        service['currentPos'] = new Point(10, 10);
        service['polygon'].origin = new Point(1, 0);
        service['drawService'].surfaceList = [];
        service['drawService'].surfaceList[service['drawService'].indexList] = new Polygon();
        service['drawService'].indexList = 0;
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 20));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 30));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(20, 50));
        const toDedeuct = service['polygon'].origin.y -
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList[Math.round(service['polygon'].sides / 2)].y;
        service['alignDown']();
        const tabPoints = service['drawService'].surfaceList[service['drawService'].indexList].pointsList;
        expect(tabPoints[0].y).not.toEqual(20 - toDedeuct);
        expect(tabPoints[1].y).not.toEqual(30 - toDedeuct);
        expect(tabPoints[2].y).not.toEqual(50 - toDedeuct);

    });

    it('testing alignParticular--function particular sides must be in the rectangle(height>width)', () => {
        service['radius'] = 2;
        service['polygon'].sides = 6;
        service['currentPos'] = new Point(10, 10);
        service['polygon'].origin = new Point(1, 0);
        service['polygon'].height = 20;
        service['polygon'].width = 10;
        service['drawService'].surfaceList = [];
        service['drawService'].surfaceList[service['drawService'].indexList] = new Polygon();
        service['drawService'].indexList = 0;
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 20));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 30));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(20, 50));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 20));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 30));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(20, 50));

        const toDeduct = - Math.abs(service['currentPos'].x -
            service['drawService'].surfaceList[service['drawService'].indexList].pointsList[2].x);
        service['alignParticular']();
        const tabPoints = service['drawService'].surfaceList[service['drawService'].indexList].pointsList;
        expect(tabPoints[0].x).toEqual(10 + toDeduct);
        expect(tabPoints[1].x).toEqual(10 + toDeduct);
        expect(tabPoints[2].x).toEqual(20 + toDeduct);
        expect(tabPoints[0].x).toEqual(10 + toDeduct);
        expect(tabPoints[1].x).toEqual(10 + toDeduct);
        expect(tabPoints[2].x).toEqual(20 + toDeduct);
    });

    it('testing alignParticular--function particular sides must be in the rectangle', () => {
        service['radius'] = 2;
        service['polygon'].sides = 6;
        service['currentPos'] = new Point(1, 0);
        service['polygon'].origin = new Point(10, 10);
        service['drawService'].surfaceList = [];
        service['drawService'].surfaceList[service['drawService'].indexList] = new Polygon();
        service['drawService'].indexList = 0;
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 20));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 30));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(20, 50));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 20));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(10, 30));
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(new Point(20, 50));

        const toDeduct = Math.abs(service['currentPos'].x -
            service['drawService'].surfaceList[service['drawService'].indexList].pointsList[service['polygon'].sides - 2].x);
        service['alignParticular']();
        const tabPoints = service['drawService'].surfaceList[service['drawService'].indexList].pointsList;
        expect(tabPoints[0].x).toEqual(10 + toDeduct);
        expect(tabPoints[1].x).toEqual(10 + toDeduct);
        expect(tabPoints[2].x).toEqual(20 + toDeduct);
        expect(tabPoints[0].x).toEqual(10 + toDeduct);
        expect(tabPoints[1].x).toEqual(10 + toDeduct);
        expect(tabPoints[2].x).toEqual(20 + toDeduct);

    });

    it('testing findPoints--function all the points of the polygon must be calculated and must aligned ', () => {
        service['drawService'].surfaceList[service['drawService'].indexList] = new Polygon();
        service['polygon'].sides = 5;
        service['radius'] = 10;
        service['currentPos'] = new Point(1, 0);
        service['polygon'].origin = new Point(10, 10);
        service['polygon'].height = 20;
        service['polygon'].width = 10;
        service['polygon'].center = new Point(4, 4);
        spyOn<any>(service, 'alignDown');
        spyOn<any>(service, 'alignParticular');
        service['findPoints']();
        const tabPoints = service['drawService'].surfaceList[service['drawService'].indexList].pointsList;
        expect(tabPoints.length).toEqual(5);
        expect(service['alignDown']).toHaveBeenCalled();
        expect(service['alignParticular']).not.toHaveBeenCalled();
    });

    it('testing findPoints--function all the points of the polygon must be calculated', () => {
        service['drawService'].surfaceList[service['drawService'].indexList] = new Polygon();
        service['polygon'].sides = 6;
        service['radius'] = 10;
        service['currentPos'] = new Point(1, 30);
        service['polygon'].origin = new Point(10, 10);
        service['polygon'].height = 20;
        service['polygon'].width = 10;
        service['polygon'].center = new Point(4, 4);
        spyOn<any>(service, 'alignDown');
        spyOn<any>(service, 'alignParticular');
        service['findPoints']();
        const tabPoints = service['drawService'].surfaceList[service['drawService'].indexList].pointsList;
        expect(tabPoints.length).toEqual(6);
        expect(service['alignDown']).not.toHaveBeenCalled();
        expect(service['alignParticular']).toHaveBeenCalled();
    });

    it('testing mouseLeave--function the draw must deleted', () => {
        service['canDraw'] = true;
        service['hasMoved'] = true;
        service['drawService'].visualisation = 'Testing';
        service['drawService'].indexList = 5;
        service.mouseLeave();
        expect(service['canDraw']).toEqual(false);
        expect(service['hasMoved']).toEqual(false);
        expect(service['drawService'].visualisation).toEqual('');
        expect(service['drawService'].indexList).toEqual(4);

    });

    it('testing mouseLeave--function nothing should happened ', () => {
        service['canDraw'] = false;
        service['hasMoved'] = true;
        service['drawService'].visualisation = 'Testing';
        service['drawService'].indexList = 5;
        service.mouseLeave();
        expect(service['canDraw']).toEqual(false);
        expect(service['hasMoved']).toEqual(false);
        expect(service['drawService'].visualisation).toEqual('');
        expect(service['drawService'].indexList).toEqual(5);

    });

    it('testing mouseLeave--function the draw must be saved and visualisation must disappear' +
        'and the undoRedo must update', () => {
        service['canDraw'] = false;
        service['hasMoved'] = true;
        service['mouseDefinded'] = true;
        spyOn<any>(service['undoRedoService'], 'update');
        service['drawService'].visualisation = 'Testing';
        service.mouseUp();
        expect(service['undoRedoService'].update).toHaveBeenCalled();
        expect(service['mouseDefinded']).toEqual(false);
        expect(service['hasMoved']).toEqual(false);
        expect(service['drawService'].visualisation).toEqual('');

    });

    it('testing mouseUp--function  the draw must be saved and visualisation must disappear', () => {
        service['canDraw'] = false;
        service['hasMoved'] = false;
        service['mouseDefinded'] = true;
        spyOn<any>(service['undoRedoService'], 'update');
        service['drawService'].visualisation = 'Testing';
        service.mouseUp();
        expect(service['undoRedoService'].update).not.toHaveBeenCalled();
        expect(service['mouseDefinded']).toEqual(false);
        expect(service['hasMoved']).toEqual(false);
        expect(service['drawService'].visualisation).toEqual('');

    });

    it('testing mouseDown--function the drawing of the polygon can happened', () => {
        service['canDraw'] = false;
        service['hasMoved'] = true;
        service['mouseDefinded'] = false;
        service.mouseDown();
        expect(service['canDraw']).toEqual(true);
        expect( service['hasMoved']).toEqual(false);
        expect(service['mouseDefinded']).toEqual(true);
});
});

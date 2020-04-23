
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any

import { TestBed } from '@angular/core/testing';
import { EnumTool } from 'src/app/Models/enums';
import { Path } from 'src/app/Models/shapes/path';
import { Point } from 'src/app/Models/shapes/point';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { LineService } from './line.service';

describe('LineService', () => {
    let service: LineService;

    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [DrawingServiceService, ColorPickerService],
        }),
    );

    beforeEach(() => {
        service = TestBed.get(LineService);
        service['undoRedoService'].update = jasmine.createSpy('update').and.callFake((args) => {
            return ;
          });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('visualisation should be empty', () => {
        service['canDraw'] = true;
        const event = new KeyboardEvent('keypress', {
            code: 'ESCAPE',
        });
        window.dispatchEvent(event);
        expect(service['drawService'].visualisation).toBe('');
    });

    const simulateMakeline = () => {
        service['drawService'].enumTool = EnumTool.Line;
        spyOn<any>(service, 'addPoint');
    };
    const clickOne = new MouseEvent('click', { clientX: 200, clientY: 200 });
    it('# First point should be created with mouseDown without jonctions', () => {
        simulateMakeline();
        expect(service['isTheFirstPoint']).toBe(false);
        // tslint:disable-next-line: no-unused-expression
        service['drawService'].selectedTools.withJonctions === false;
        service.mouseDown(clickOne);
        expect(service['canDraw']).toBe(true);
        expect(service['isTheFirstPoint']).toBe(true);
        expect(service['addPoint']).toHaveBeenCalled();
        expect(service['isMouseDefinded']).toBe(true);
    });

    it('point should be created with mouseDown without jonctions', () => {
        simulateMakeline();
        service['isTheFirstPoint'] = true;
        service['isMouseDefinded'] = false;
        service.mouseDown(clickOne);

        expect(service['canDraw']).toBe(true);
        expect(service['addPoint']).toHaveBeenCalledWith(clickOne.clientX, clickOne.clientY, `L ${clickOne.clientX} ${clickOne.clientY}`);
        expect(service['isMouseDefinded']).toBe(false);
    });

    it('indexList sould not be increased', () => {
        simulateMakeline();
        service['isShiftActived'] = false;
        service['isTheFirstPoint'] = true;
        service['isMouseDefinded'] = false;
        service['drawService'].indexList = 9;
        service['drawService'].surfaceList.length = 6;
        service['drawService'].indexList = 9;
        service.mouseDown(clickOne);

        expect(service['canDraw']).toBe(true);
        expect(service['drawService'].indexList).toEqual(9);
        expect(service['addPoint']).toHaveBeenCalledWith(clickOne.clientX, clickOne.clientY, `L ${clickOne.clientX} ${clickOne.clientY}`);
        expect(service['isMouseDefinded']).toBe(false);
    });
    it('testing (mouseDown) indexList sould be increased', () => {
        simulateMakeline();
        service['isShiftActived'] = false;
        service['isTheFirstPoint'] = true;
        service['isMouseDefinded'] = false;
        service['drawService'].indexList = 9;
        service['drawService'].surfaceList.length = 9;
        service['drawService'].indexList = 6;

        service.mouseDown(clickOne);

        expect(service['canDraw']).toBe(true);
        expect(service['drawService'].indexList).toEqual(6);
        expect(service['addPoint']).toHaveBeenCalledWith(clickOne.clientX, clickOne.clientY, `L ${clickOne.clientX} ${clickOne.clientY}`);
        expect(service['isMouseDefinded']).toBe(false);
    });
    it('testing (mouseDown) with this.drawService.surfaceList.length > this.drawService.indexList', () => {
        simulateMakeline();
        service['isShiftActived'] = false;
        service['isTheFirstPoint'] = false;
        service['isMouseDefinded'] = false;
        service['drawService'].surfaceList[service['drawService'].indexList] = new Path();
        service['drawService'].indexList = 0;
        service['drawService'].surfaceList.length = 1;
        service['drawService'].indexList = 0;
        service.mouseDown(clickOne);

        expect(service['canDraw']).toBe(true);
        expect(service['drawService'].indexList).toEqual(1);
        expect(service['addPoint']).toHaveBeenCalledWith(clickOne.clientX, clickOne.clientY, '');
        expect(service['isMouseDefinded']).toBe(true);
    });

    it('Point should be add when Shift is activeted', () => {
        simulateMakeline();
        service['isTheFirstPoint'] = true;
        service['isShiftActived'] = true;
        service['drawService'].indexList = 9;

        spyOn<any>(service, 'findAlign').and.callFake(() => {
            return new Point(4, 5);
        });

        service.mouseDown(clickOne);
        expect(service['canDraw']).toBe(true);
        expect(service['addPoint']).toHaveBeenCalledWith(4, 5, 'L 4 5');
        expect(service['isMouseDefinded']).toBe(false);
    });

    it('testing--(mouseDown). none point should have been add', () => {
        service['drawService'].enumTool = EnumTool.Grid;
        spyOn<any>(service, 'addPoint');
        expect(service['isTheFirstPoint']).toBe(false);
        service.mouseDown(clickOne);
        expect(service['isTheFirstPoint']).toBe(true);
        expect(service['addPoint']).not.toHaveBeenCalledWith
        (clickOne.clientX, clickOne.clientY, `L ${clickOne.clientX} ${clickOne.clientY}`);
        expect(service['isMouseDefinded']).toBe(true);
    });

    it('testing--(mouseDown). none point should have been add without jonctions', () => {
        service['drawService'].enumTool = EnumTool.Line;
        service['drawService'].selectedTools.withJonctions = false;
        spyOn<any>(service, 'addPoint');
        expect(service['isTheFirstPoint']).toBe(false);
        service.mouseDown(clickOne);
        expect(service['isTheFirstPoint']).toBe(true);
        expect(service['addPoint']).not.toHaveBeenCalledWith(clickOne.clientX, clickOne.clientY, '');
        expect(service['isMouseDefinded']).toBe(true);
    });

    it(' testing--(addPoint) A point should have been add in the list', () => {
        service['drawService'].selectedTools.withJonctions = false;

        service['drawService'].surfaceList[service['drawService'].indexList] = new Path();
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        const oldValue = service['drawService'].surfaceList[service['drawService'].indexList].d;
        service['addPoint'](clickOne.clientX, clickOne.clientY, `M ${clickOne.clientX} ${clickOne.clientY}`);
        expect(service['drawService'].surfaceList[service['drawService'].indexList].currentPoint).toBe(service['mousePoint']);
        expect(service['drawService'].surfaceList[service['drawService'].indexList].d).
        toEqual(oldValue + `M ${clickOne.clientX} ${clickOne.clientY}`);
        expect(service['drawService'].surfaceList[0].pointPaths.length).toBe(1);
    });

    it('testing--(addPoint) A point should have been add with jonctionsin the list', () => {
        service['drawService'].selectedTools.withJonctions = true;
        service['drawService'].surfaceList[service['drawService'].indexList] = new Path();
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['addPoint'](clickOne.clientX, clickOne.clientY, `M ${clickOne.clientX} ${clickOne.clientY}`);
        expect(service['drawService'].surfaceList[service['drawService'].indexList].currentPoint).toBe(service['mousePoint']);
        expect(service['drawService'].surfaceList[0].pointPaths.length).toBe(1);
    });

    it('testing mouseDblclick -- the line should be ended', () => {
        service['drawService'].enumTool = EnumTool.Line;
        service['canDraw'] = true;
        service['isShiftActived'] = true;
        service['mousePoint'] = new Point(50, 50);
        spyOn<any>(service, 'deleteLastSegment');
        service['drawService'].surfaceList[service['drawService'].indexList] = new Path();

        const point = new Point(3, 3);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths = [];
        service['drawService'].surfaceList[0].pointsList.push(point);
        service.mouseDblclick(clickOne);
        expect(service['deleteLastSegment']).toHaveBeenCalledWith();
        expect(service['drawService'].visualisation).toBe('');
        expect(service['canDraw']).toBe(false);
    });
    it('testing mouseDblclick --the line should be ended at beginning', () => {
        service['drawService'].enumTool = EnumTool.Line;

        service['canDraw'] = true;
        service['isShiftActived'] = true;
        service['mousePoint'] = new Point(20, 20);
        spyOn<any>(service, 'deleteLastSegment');
        service['drawService'].surfaceList[service['drawService'].indexList] = new Path();

        const point = new Point(23, 23);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [] ;
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths = [] ;
        service['drawService'].surfaceList[0].pointsList.push(point);
        service['drawService'].surfaceList[0].pointsList.push(point);
        service.mouseDblclick(clickOne);
        expect(service['deleteLastSegment']).toHaveBeenCalledWith();
        expect(service['drawService'].visualisation).toBe('');
        expect(service['canDraw']).toBe(false);
    });

    it('testing mouseDblclick the line should be ended at beginning when the ShiftKey is not down', () => {
        service['drawService'].enumTool = EnumTool.Line;
        service['canDraw'] = true;
        service['isShiftActived'] = false;
        service['mousePoint'] = new Point(50, 50);

        spyOn<any>(service, 'deleteLastSegment');
        service['drawService'].surfaceList[service['drawService'].indexList] = new Path();
        const point = new Point(3, 3);
        service['drawService'].surfaceList[0].pointsList = [];
        service['drawService'].surfaceList[0].pointPaths = [];
        service['drawService'].surfaceList[0].pointsList.push(point);
        service['drawService'].surfaceList[0].pointsList.push(point);
        service.mouseDblclick(clickOne);
        expect(service['deleteLastSegment']).not.toHaveBeenCalledWith();
        expect(service['drawService'].visualisation).toBe('');
        expect(service['canDraw']).toBe(false);
    });

    it('testing mouseDblclick the line should be ended at beginning when the ShiftKey is down', () => {
        service['canDraw'] = true;
        service['isShiftActived'] = false;
        service['mousePoint'] = new Point(50, 50);
        service['drawService'].visualisation = 'it was activated';
        spyOn<any>(service, 'deleteLastSegment');
        service['drawService'].surfaceList[service['drawService'].indexList] = new Path();
        const point = new Point(3, 3);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths = [];
        service['drawService'].surfaceList[0].pointsList.push(point);
        service['drawService'].surfaceList[0].pointsList.push(point);
        service.mouseDblclick(clickOne);
        expect(service['deleteLastSegment']).not.toHaveBeenCalledWith();
        expect(service['drawService'].visualisation).toBe('');
        expect(service['canDraw']).toBe(false);
    });

    it(' testing endlineWithoutEvent -- All the move should have been sttoped', () => {
        service['canDraw'] = true;
        service['isMouseDefinded'] = true;
        service['drawService'].indexList = 2;
        service['drawService'].surfaceList[service['drawService'].indexList] = new Path();
        service['endlineWithoutEvent']();
        service['mousePoint'] = new Point(50, 50);

        expect(service['drawService'].visualisation).toBe('');
        expect(service['drawService'].indexList).toBe(2);
        expect(service['isTheFirstPoint']).toBe(false);
        expect(service['isMouseDefinded']).toBe(false);
        expect(service['canDraw']).toBe(false);
    });

    it('testing endlineWithoutEvent -- All the move should have been sttoped when the preview was on', () => {
        service['canDraw'] = false;
        service['isMouseDefinded'] = true;
        service['isTheFirstPoint'] = true;
        service['drawService'].indexList = 2;
        service['drawService'].visualisation = 'preview was actived';

        service['endlineWithoutEvent']();

        expect(service['drawService'].visualisation).toBe('preview was actived');
        expect(service['drawService'].indexList).toBe(2);
        expect(service['isTheFirstPoint']).toBe(true);
        expect(service['isMouseDefinded']).toBe(true);
        expect(service['canDraw']).toBe(false);
    });

    const simulateRemoveLine = () => {
        service['isTheFirstPoint'] = true;
        service['isMouseDefinded'] = true;
        service['drawService'].surfaceList = [];
        service['drawService'].surfaceList.push(new Path());
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths = [];

        service['drawService'].surfaceList[0].pointsList.push(new Point(200, 200));
        service['drawService'].surfaceList[0].pointsList.push(new Point(200, 200));
        service['drawService'].surfaceList[0].pointsList.push(new Point(200, 200));

        service['drawService'].surfaceList[0].pointPaths.push('clickOne');
        service['drawService'].surfaceList[0].pointPaths.push('clickTwo');
        service['drawService'].surfaceList[0].pointPaths.push('clickThree');
    };
    it('testing removeHoleLine -- The hole line should have been removed', () => {
        simulateRemoveLine();
        service['drawService'].selectedTools.withJonctions = true;
        service['removeHoleLine']();
        expect(service['isTheFirstPoint']).toBe(false);
        expect(service['isMouseDefinded']).toBe(false);
        expect(service['drawService'].surfaceList.length).toBe(0);
    });

    it('testing removeHoleLine --The hole line should have been removed wile contains Jontions', () => {
        simulateRemoveLine();
        service['drawService'].surfaceList[service['drawService'].indexList].jonctionsPaths = [];

        service['drawService'].surfaceList[service['drawService'].indexList].jonctionsPaths.push('testOne');
        service['drawService'].surfaceList[service['drawService'].indexList].jonctionsPaths.push('testTwo');
        service['jonctionsString'] = 'testOnetestTwo';

        service['drawService'].selectedTools.withJonctions = false;
        service['removeHoleLine']();
        expect(service['isTheFirstPoint']).toBe(false);
        expect(service['isMouseDefinded']).toBe(false);
        expect(service['drawService'].surfaceList.length).toBe(0);
    });

    it('testing actualPoint -- the last should have been returned', () => {
        service['mousePoint'] = new Point(10, 100);
        service['drawService'].surfaceList.push(new Path());
        const firstClick = new Point(200, 200);
        const secondClick = new Point(500, 400);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(firstClick);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(secondClick);

        service['actualPoint']();

        expect(service['actualPoint']().y).toEqual(secondClick.y);
    });

    const simulateAligns = () => {
        service['mousePoint'] = new Point(10, 100);
        service['drawService'].surfaceList.push(new Path());
        const firstClick = new Point(200, 200);
        spyOn<any>(service, 'actualPoint').and.callFake(() => {
            return new Point(200, 200);
        });
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(firstClick);
    };
    it('testing alignOnX -- the next point must have the same x of the last point', () => {
        simulateAligns();
        service['alignOnX']();
        const point = new Point(10, 200);
        expect(service['alignOnX']().x).toEqual(point.x);
        expect(service['alignOnX']().y).toEqual(point.y);
    });
    it('testing alignOnY-- the next point must have the same y of the last point', () => {
        simulateAligns();
        service['alignOnY']();
        const point = new Point(200, 100);
        expect(service['alignOnY']().x).toEqual(point.x);
        expect(service['alignOnY']().y).toEqual(point.y);
    });

    it('testing alignOn45 -- next should be aligned on 45 degree ', () => {
        simulateAligns();
        const deltaX = service['mousePoint'].x - service['actualPoint']().x;
        const deltaY = service['mousePoint'].y - service['actualPoint']().y;
        const correctY = deltaX + service['actualPoint']().y;
        service['alignOn45'](deltaX, deltaY);
        const point = new Point(10, correctY);
        expect(service['alignOn45'](deltaX, deltaY).x).toEqual(point.x);
        expect(service['alignOn45'](deltaX, deltaY).y).toEqual(point.y);
    });

    it('testing findSector-- All the positions possible must be in ', () => {
        service['mousePoint'] = new Point(10, 100);
        service['drawService'].surfaceList.push(new Path());
        const firstClick = new Point(200, 200);
        const secondClick = new Point(500, 400);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(firstClick);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(secondClick);

        const temp = service['findSector']();
        expect(temp).toBe(2);
        service['mousePoint'] = new Point(600, 100);
        const temp2 = service['findSector']();
        expect(temp2).toBe(1);
        service['mousePoint'] = new Point(600, 800);
        const temp3 = service['findSector']();
        expect(temp3).toBe(4);
        service['mousePoint'] = new Point(100, 800);
        const temp4 = service['findSector']();
        expect(temp4).toBe(3);
        service['mousePoint'] = new Point(500, 400);
        const temp5 = service['findSector']();
        expect(temp5).toBe(4);
    });

    it('testing computeY -- the new must optimised for the 45 degree', () => {
        service['mousePoint'] = new Point(10, 100);
        service['drawService'].surfaceList.push(new Path());
        const firstClick = new Point(200, 200);
        const secondClick = new Point(500, 400);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];

        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(firstClick);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(secondClick);

        service['mousePoint'] = new Point(600, 100);
        const temp2 = service['computeY'](100, -300);
        expect(temp2).toBe(-100 + 400);

        service['mousePoint'] = new Point(100, 800);
        const temp4 = service['findSector']();
        expect(temp4).toBe(3);

        service['mousePoint'] = new Point(400, 800);
        const temp5 = service['computeY'](-100, 400);
        expect(temp5).toBe(100 + 400);
    });

    const simulateDeleteLastSegment = () => {
        service['isTheFirstPoint'] = true;
        service['mousePoint'] = new Point(10, 100);
        service['drawService'].surfaceList.push(new Path());
        const firstClick = new Point(200, 200);
        const secondClick = new Point(500, 400);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(firstClick);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(secondClick);
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths.push('firstClick');
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths.push('secondClick');
        service['drawService'].surfaceList[service['drawService'].indexList].d = 'firstClicksecondClick';
    };

    it('testing deleteLastSegment -- the last point should have been removed', () => {
        simulateDeleteLastSegment();

        service['drawService'].selectedTools.withJonctions = false;

        service['deleteLastSegment']();

        expect(service['drawService'].surfaceList[service['drawService'].indexList].pointsList.length).toBe(1);
        expect(service['drawService'].surfaceList[service['drawService'].indexList].d).toBe('firstClick');
        expect(service['drawService'].visualisation).toEqual(`M ${200} ${200} ${10}
      ${100}`);
    });

    it('testing deleteLastSegment -- none point should have been removed', () => {
        service['isTheFirstPoint'] = true;
        service['drawService'].selectedTools.withJonctions = true;
        service['mousePoint'] = new Point(10, 100);
        service['drawService'].indexList = 0;
        service['drawService'].surfaceList.push(new Path());
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        const firstClick = new Point(200, 200);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(firstClick);
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths.push('clickOne');
        service['deleteLastSegment']();
    });

    it('testing keyUp-- next point should have aligned by shift event', () => {
        service['canDraw'] = true;
        service['isShiftActived'] = true;
        service['isTheFirstPoint'] = true;

        spyOn<any>(service, 'alignWithoutShift');

        const event = new KeyboardEvent('keyup', {
            key: 'Shift',
        });
        service.keyUp(event);
        expect(service['isShiftActived']).toBe(false);
        expect(service['alignWithoutShift']).toHaveBeenCalled();
    });

    it('testing keyUp-- next point should have aligned normally ', () => {
        service['canDraw'] = true;
        service['isShiftActived'] = true;
        service['isTheFirstPoint'] = true;

        spyOn<any>(service, 'alignWithoutShift');

        const event = new KeyboardEvent('keyup', {
            key: 'Escape',
        });
        service.keyUp(event);
        expect(service['isShiftActived']).toBe(true);
        expect(service['alignWithoutShift']).not.toHaveBeenCalled();
    });

    it('testing keyUp-- none should have aligned', () => {
        service['canDraw'] = true;
        service['isShiftActived'] = true;
        service['isTheFirstPoint'] = false;

        spyOn<any>(service, 'alignWithoutShift');

        const event = new KeyboardEvent('keyup', {
            key: 'Shift',
        });
        service.keyUp(event);
        expect(service['isShiftActived']).toBe(false);
        expect(service['alignWithoutShift']).not.toHaveBeenCalled();
    });

    it('testing keyUp', () => {
        service['canDraw'] = false;
        service['isShiftActived'] = true;
        service['isTheFirstPoint'] = false;

        spyOn<any>(service, 'alignWithoutShift');

        const event = new KeyboardEvent('keyup', {
            key: 'Shift',
        });
        service.keyUp(event);
        expect(service['isShiftActived']).toBe(true);
        expect(service['alignWithoutShift']).not.toHaveBeenCalled();
    });

    it('testing alignWithoutShift', () => {
        service['mousePoint'] = new Point(10, 100);
        const line = new Path();
        line.pointsList = [new Point(1, 1), new Point(2, 2)];
        service['drawService'].surfaceList.push(line);
        spyOn<any>(service, 'pointsNumber').and.callFake(() => 2);
        service['alignWithoutShift']();
        expect(service['drawService'].visualisation).toEqual('M 2 2 L 10 100');
    });

    it('testing alignWhenShift -- Point should be align when the shift is active', () => {
        service['mousePoint'] = new Point(10, 100);
        service['drawService'].surfaceList.push(new Path());
        const firstClick = new Point(200, 200);
        const secondClick = new Point(250, 200);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointPaths = [];
        service['drawService'].surfaceList[0].pointsList.push(firstClick);
        service['drawService'].surfaceList[0].pointsList.push(secondClick);
        service['drawService'].surfaceList[0].pointPaths.push('firstClick');
        service['drawService'].surfaceList[0].pointPaths.push('secondClick');

        spyOn<any>(service, 'findAlign').and.callFake(() => {
            return new Point(10, 10);
        });

        spyOn<any>(service, 'actualPoint').and.callFake(() => {
            return new Point(250, 200);
        });
        service['alignWhenShift']();
        expect(service['drawService'].visualisation).toEqual(`M 250 200 L
    10 10`);
        expect(service['actualPoint']).toHaveBeenCalled();

        expect(service['findAlign']).toHaveBeenCalled();
    });

    const simulatemouseMove = () => {
        service['mousePoint'] = new Point(0, 0);
        spyOn<any>(service, 'alignWithoutShift');

        spyOn<any>(service, 'alignWhenShift');
    };

    it('testing startDraW with all true', () => {
        service['canDraw'] = true;
        service['isMouseDefinded'] = true;
        service['isShiftActived'] = true;
        simulatemouseMove();
        const point = new MouseEvent('mousemove', { clientX: 10, clientY: 20 });
        const pointTest = new Point(10, 20);
        service.mouseMove(point);
        expect(service['mousePoint'].x).toEqual(pointTest.x);
        expect(service['mousePoint'].y).toEqual(pointTest.y);
        expect(service['alignWithoutShift']).not.toHaveBeenCalled();
        expect(service['alignWhenShift']).toHaveBeenCalled();
    });

    it('testing startDraW with canDraw false', () => {
        service['canDraw'] = false;
        service['isMouseDefinded'] = true;
        service['isShiftActived'] = true;
        service['mousePoint'] = new Point(0, 0);
        spyOn<any>(service, 'alignWithoutShift');
        spyOn<any>(service, 'alignWhenShift');

        const point = new MouseEvent('mousemove', { clientX: 10, clientY: 20 });
        const pointTest = new Point(10, 20);
        service.mouseMove(point);
        expect(service['mousePoint']).not.toEqual(pointTest);
        expect(service['alignWithoutShift']).not.toHaveBeenCalled();
        expect(service['alignWhenShift']).not.toHaveBeenCalled();
    });

    it('testing startDraW with isShitActived false', () => {
        service['canDraw'] = true;
        service['isMouseDefinded'] = true;
        service['isShiftActived'] = false;
        simulatemouseMove();

        const point = new MouseEvent('mousemove', { clientX: 10, clientY: 20 });
        const pointTest = new Point(10, 20);
        service.mouseMove(point);
        expect(service['mousePoint'].x).toEqual(pointTest.x);
        expect(service['mousePoint'].y).toEqual(pointTest.y);
        expect(service['alignWithoutShift']).toHaveBeenCalled();
        expect(service['alignWhenShift']).not.toHaveBeenCalled();
    });

    it('testing startDraW with isShitActived true', () => {
        service['canDraw'] = true;
        service['isMouseDefinded'] = true;
        service['isShiftActived'] = true;
        simulatemouseMove();

        const point = new MouseEvent('mousemove', { clientX: 10, clientY: 20 });
        const pointTest = new Point(10, 20);
        service.mouseMove(point);
        expect(service['mousePoint'].x).toEqual(pointTest.x);
        expect(service['mousePoint'].y).toEqual(pointTest.y);
        expect(service['alignWithoutShift']).not.toHaveBeenCalled();
        expect(service['alignWhenShift']).toHaveBeenCalled();
    });

    it('testing startDraW with isMouseDefinded false', () => {
        service['canDraw'] = true;
        service['isMouseDefinded'] = false;
        service['isShiftActived'] = false;
        simulatemouseMove();

        const point = new MouseEvent('mousemove', { clientX: 10, clientY: 20 });
        const pointTest = new Point(10, 20);
        service.mouseMove(point);
        expect(service['mousePoint'].x).toEqual(pointTest.x);
        expect(service['mousePoint'].y).toEqual(pointTest.y);
        expect(service['alignWithoutShift']).not.toHaveBeenCalled();
        expect(service['alignWhenShift']).not.toHaveBeenCalled();
    });

    // service.keysEvents(keyShift)

    const keyBackspace = new KeyboardEvent('keydown', {
        key: 'Backspace',
    });
    const keyEscape = new KeyboardEvent('keydown', {
        key: 'Escape',
    });

    const keyShift = new KeyboardEvent('keydown', {
        key: 'Shift',
    });

    const simulateKeyEvents = () => {
        spyOn<any>(service, 'deleteLastSegment');
        spyOn<any>(service, 'removeHoleLine');
        spyOn<any>(service, 'findAlign');
        spyOn<any>(service, 'alignWhenShift');
        service['drawService'].surfaceList.push(new Path());
    };

    it('testing keyDown-- Line should changed depending on the event ', () => {
        service['canDraw'] = true;
        service['isTheFirstPoint'] = true;

        simulateKeyEvents();
        service.keyDown(keyBackspace);
        expect(service['deleteLastSegment']).toHaveBeenCalled();

        service['isTheFirstPoint'] = false;
        service.keyDown(keyShift);
        expect(service['findAlign']).not.toHaveBeenCalled();
        expect(service['alignWhenShift']).not.toHaveBeenCalled();

        service['isTheFirstPoint'] = true;

        service.keyDown(keyEscape);
        expect(service['removeHoleLine']).toHaveBeenCalled();

        service.keyDown(keyShift);
        expect(service['findAlign']).toHaveBeenCalled();
        expect(service['alignWhenShift']).toHaveBeenCalled();
    });

    it('testing keyDown Line should not changed', () => {
        service['canDraw'] = true;
        service['isTheFirstPoint'] = false;

        simulateKeyEvents();
        service.keyDown(keyEscape);
        expect(service['deleteLastSegment']).not.toHaveBeenCalled();
        expect(service['removeHoleLine']).not.toHaveBeenCalled();
        service.keyDown(keyShift);
        expect(service['findAlign']).not.toHaveBeenCalled();
        expect(service['alignWhenShift']).not.toHaveBeenCalled();
    });

    it('testing keyDown when ther is no event keyevent', () => {
        service['canDraw'] = false;
        service['isTheFirstPoint'] = false;
        simulateKeyEvents();
        service.keyDown(keyShift);

        expect(service['deleteLastSegment']).not.toHaveBeenCalled();
        expect(service['removeHoleLine']).not.toHaveBeenCalled();
        expect(service['findAlign']).not.toHaveBeenCalled();
        expect(service['alignWhenShift']).not.toHaveBeenCalled();
    });

    const simulatefindAlign = () => {
        spyOn<any>(service, 'alignOnX');
        spyOn<any>(service, 'alignOn45');
        spyOn<any>(service, 'alignOnY');

        service['drawService'].surfaceList.push(new Path());
        const firstClick = new Point(10, 20);
        const secondClick = new Point(200, 200);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList = [];
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(firstClick);
        service['drawService'].surfaceList[service['drawService'].indexList].pointsList.push(secondClick);
    };

    it('testing findAlign the perfect align should have been found', () => {
        simulatefindAlign();
        service['mousePoint'] = new Point(300, 100);
        service['findAlign']();
        expect(service['alignOnX']).not.toHaveBeenCalled();
        service['mousePoint'] = new Point(300, 190);
        service['findAlign']();
        expect(service['alignOnX']).toHaveBeenCalled();
        expect(service['alignOn45']).not.toHaveBeenCalled();
    });

    it('testing findAlign none align should have been done', () => {
        service['mousePoint'] = new Point(300, 100);
        simulatefindAlign();
        service['mousePoint'] = new Point(300, 102);
        service['findAlign']();
        expect(service['alignOn45']).toHaveBeenCalled();
        expect(service['alignOnX']).not.toHaveBeenCalled();
    });

    it('testing findAlign - the Point should been align on Y', () => {
        simulatefindAlign();
        service['mousePoint'] = new Point(250, 20);
        service['findAlign']();
        expect(service['alignOnY']).toHaveBeenCalled();
        expect(service['alignOn45']).not.toHaveBeenCalled();
    });

    it('testing findAlign - the Point should been align on 45 degree', () => {
        simulatefindAlign();
        service['mousePoint'] = new Point(150, 140);
        service['findAlign']();
        expect(service['alignOnY']).not.toHaveBeenCalled();
        expect(service['alignOn45']).toHaveBeenCalled();
    });

    it('testing mouseLeave All actions should have been stoped ', () => {
        service['canDraw'] = true;
        spyOn<any>(service, 'endlineWithoutEvent');
        service['drawService'].enumTool = EnumTool.Line;
        service['lineCount'] = 9;
        service['drawService'].surfaceList.push(new Path());
        service.mouseLeave();
        expect(service['canDraw']).toBe(false);
        expect(service['undoRedoService'].update).toHaveBeenCalled();
        expect(service['endlineWithoutEvent']).toHaveBeenCalled();
    });

    it('testing findAlign with mouseLeave ', () => {
        service['canDraw'] = true;
        spyOn<any>(service, 'endlineWithoutEvent');
        service['drawService'].enumTool = EnumTool.Line;
        service['drawService'].surfaceList.push(new Path());
        service['drawService'].surfaceList[0].d = '';
        service['lineCount'] = 1;
        service.mouseLeave();
        expect(service['canDraw']).toBe(false);
        expect(service['undoRedoService'].update).not.toHaveBeenCalled();
    });

    it('testing mouseLeave nothing should happened', () => {
        service['canDraw'] = false;
        spyOn<any>(service, 'endlineWithoutEvent');
        service['drawService'].enumTool = EnumTool.Line;
        service['drawService'].surfaceList.push(new Path());
        service['drawService'].surfaceList[0].d = '';
        service.mouseLeave();
        expect(service['canDraw']).toBe(false);
        expect(service['endlineWithoutEvent']).not.toHaveBeenCalled();
    });

    it('testing findAlign outside of the line ', () => {
        service['canDraw'] = true;
        service['drawService'].surfaceList.push(new Path());
        service.mouseLeave();
        expect(service['canDraw']).toBe(false);
    });

    it('testing the mouseUp fonction', () => {
        service['canDraw'] = true;
        service['drawService'].enumTool = EnumTool.Polygone;
        spyOn<any>(service, 'endlineWithoutEvent');
        service.mouseUp();
        expect(service['endlineWithoutEvent']).toHaveBeenCalled();
    });
    it('testing the mouseUp fonction', () => {
        service['canDraw'] = true;
        service['drawService'].enumTool = EnumTool.Line;
        spyOn<any>(service, 'endlineWithoutEvent');
        service.mouseUp();
        expect(service['endlineWithoutEvent']).not.toHaveBeenCalled();
    });

    it('testing the reset fonction', () => {
        service['isTheFirstPoint'] = true;
        service['mousePoint'] = new Point(5, 6);
        service['drawService'].visualisation = 'testing ';
        service['isMouseDefinded'] = true;
        service['isShiftActived'] = true;
        service['jonctionsString'] = '';
        service['canDraw'] = true;
        service.reset();
        expect(service['isTheFirstPoint']).toEqual(false);
        const point = new Point(0, 0);
        expect(service['mousePoint'].x).toEqual(point.x);
        expect(service['mousePoint'].y).toEqual(point.y);
        expect(service['drawService'].visualisation).toEqual('');
        expect(service['isMouseDefinded']).toEqual(false);
        expect(service['isShiftActived']).toEqual(false);
        expect(service['jonctionsString']).toEqual('');
        expect(service['canDraw']).toEqual(false);
    });
// tslint:disable-next-line: max-file-line-count
});

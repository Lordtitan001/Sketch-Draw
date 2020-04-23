// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any

import { TestBed } from '@angular/core/testing';
import { Path } from 'src/app/Models/shapes/path';
import { Point } from 'src/app/Models/shapes/point';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';
import { SelectionMoveService } from './selection-move.service';

describe('SelectionMoveService', () => {
    let service: SelectionMoveService;

    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [DrawingServiceService, UndoRedoService],
        }),
    );

    beforeEach(() => {
        service = TestBed.get(SelectionMoveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('keyUp should be call and set right bool value (scenario 1: true)', () => {
        const key = new KeyboardEvent('keydown', {
            key: 'ArrowRight',
        });
        service.keyUp(key);
        expect(service['mapEvent'][key.code]).toEqual(true);
    });

    it('keyUp should be call and set right boolean value (scenario 2: false)', () => {
        const key = new KeyboardEvent('keyup', {
            key: 'ArrowRight',
        });
        service['mapEvent'][key.code] = true;
        service.keyUp(key);
        expect(service['mapEvent'][key.code]).toEqual(false);
    });

    it('mouseMove should moveSelection depending on the position in indicated on moves', () => {
        const event = new MouseEvent('click', { clientX: 200, clientY: 200 });
        spyOn(event, 'preventDefault');
        spyOn(service, 'moveSelection');
        spyOn(service, 'mouseMoveSelection');
        service['canDraw'] = true;
        service['dragState'].isDraging = true;
        service.mouseMove(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(service.mouseMoveSelection).not.toHaveBeenCalled();
        expect(service.moveSelection).toHaveBeenCalled();
    });
    it('mouseMove should mouseMoveSelection depending on the position in indicated on moves', () => {
        const event = new MouseEvent('click', { clientX: 200, clientY: 200 });
        spyOn(event, 'preventDefault');
        spyOn(service, 'moveSelection');
        spyOn(service, 'mouseMoveSelection');
        service['canDraw'] = true;
        service['dragState'].isDraging = false;
        service.mouseMove(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(service.mouseMoveSelection).toHaveBeenCalled();
        expect(service.moveSelection).not.toHaveBeenCalled();
    });
    it('mouseMove shouldn"t move selection when we are not allow to draw', () => {
        const event = new MouseEvent('click', { clientX: 200, clientY: 200 });
        spyOn(event, 'preventDefault');
        spyOn(service, 'moveSelection');
        spyOn(service, 'mouseMoveSelection');
        service['canDraw'] = false;
        service['dragState'].isDraging = false;
        service.mouseMove(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(service.mouseMoveSelection).not.toHaveBeenCalled();
        expect(service.moveSelection).not.toHaveBeenCalled();
    });

    it(' moveWithArrowKey souldn"t move anythingt when we are not able to move', () => {

        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };

        const select = service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const controle = service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const svg = service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const translate = new Point(2, 2);
        svg.appendChild(select);
        svg.appendChild(controle);
        select.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
        controle.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');

        const animate = new Animation();
        spyOn<any>(service['drawService'].elements.selectionElement, 'animate').and.returnValue(animate);
        spyOn<any>(service['drawService'].elements.controle, 'animate').and.returnValue(new Animation());
        service['canMove'] = false;
        service['moveWithArrowKey'](translate);
        expect(service['canMove']).toEqual(false);
        animate.dispatchEvent(new Event('finish', {}));
    });

    it(' moveWithArrowKey souldn"t move anythingt when we are not able to move with magnetism', () => {
        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };
        const select = service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const controle = service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const svg = service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const translate = new Point(2, 2);
        svg.appendChild(select);
        svg.appendChild(controle);
        select.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
        controle.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');

        const animate = new Animation();
        spyOn<any>(service['drawService'].elements.selectionElement, 'animate').and.returnValue(animate);
        spyOn<any>(service['drawService'].elements.controle, 'animate').and.returnValue(new Animation());
        service['canMove'] = false;
        service['magnetsim'].isActive = true;
        service['moveWithArrowKey'](translate);

        expect(service['canMove']).toEqual(false);
    });

    it('animateOnFinish should impose the fact that we can draw and turn on the animation', () => {
        const element  = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const sentence = 'testing';
        service['canMove'] = false;
        service['animateOnFinish'](element, sentence);
        expect(service['canMove']).toEqual(true);
    });

    it('moveWithArrowKey souldn"t move anything', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['canMove'] = false;
        service['selectArrowKey']();
        expect(service['canMove']).toEqual(false);
    });

    it('moveWithArrowKey  should move selection at right,left,up and down when we press all arrow key ', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['canMove'] = true;
        service['mapEvent'].ArrowRight = true;
        service['mapEvent'].ArrowLeft = true;
        service['mapEvent'].ArrowUp = true;
        service['mapEvent'].ArrowDown = true;
        spyOn<any>(service, 'moveWithArrowKey');
        const point = new Point(0, 0);

        service['selectArrowKey']();
        expect(service['canMove']).toEqual(false);
        expect(service['moveWithArrowKey']).toHaveBeenCalledWith(point);
    });

    it('moveWithArrowKey  should"t move selection when we don"t press arrow key', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['canMove'] = true;
        service['mapEvent'].ArrowRight = false;
        service['mapEvent'].ArrowLeft = false;
        service['mapEvent'].ArrowUp = false;
        service['mapEvent'].ArrowDown = false;
        spyOn<any>(service, 'moveWithArrowKey');
        const point = new Point(0, 0);

        service['selectArrowKey']();
        expect(service['canMove']).toEqual(true);
        expect(service['moveWithArrowKey']).not.toHaveBeenCalledWith(point);
    });

    it('moveSelection should move the selection depending the mouse position with last if true', () => {
        const event = new MouseEvent('click', { clientX: 200, clientY: 200 });
        service['dragState'].origin = new Point(5, 5);
        service['dragState'].nextPoint = new Point(78, 5);
        const point1 = new Point(78, 5);
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['selectionArray'].listSelected = [];
        service['drawService'].elements.selectionElement.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
        service['drawService'].elements.controle.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
        service['selectionArray'].listSelected.push(service['drawService'].elements.selectionElement);
        service['selectionArray'].listSelected.push(service['drawService'].elements.controle);
        const point2 = new Point(200, 200);
        service['dragState'].hasSelected = false;
        service['translate'] = 'testing';
        service['canPaste'] = true;
        service['pasteMove'] = false;
        service.moveSelection(event);
        expect(service['dragState'].origin).toEqual(point1);
        expect(service['dragState'].nextPoint.x).toEqual(point2.x);
        expect(service['dragState'].nextPoint.y).toEqual(point2.y);
        expect(service['dragState'].hasSelected).toEqual(true);
        expect(service['translate']).toEqual('testing');
        expect(service['pasteMove']).toBe(true);
    });

    it('moveSelection should apply the point translation', () => {
        const event = new MouseEvent('click', { clientX: 10, clientY: 10 });
        service['dragState'].nextPoint = new Point(0, 0);
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element1.id = '2';
        element1.setAttribute('transform', '');
        service['selectionArray'].listSelected = [];
        service['selectionArray'].listSelected.push(element1);
        service['drawService'].surfaceList = [];
        const path1 = new Path();
        path1.id = 2;
        service['drawService'].surfaceList.push(path1);
        service['addTranslation'] = jasmine.createSpy('trans').and.returnValue('translate(10 10)');
        service.moveSelection(event);
        expect(path1.transform).toEqual('translate(10 10) ');
    });

    it('moveSelection shouldn move selection whithout applying the transformation ', () => {
        const event = new MouseEvent('click', { clientX: 10, clientY: 10 });
        service['dragState'].nextPoint = new Point(0, 0);
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element1.id = '1';
        element1.setAttribute('transform', '');
        service['selectionArray'].listSelected = [];
        service['selectionArray'].listSelected.push(element1);
        service['drawService'].surfaceList = [];
        const path1 = new Path();
        path1.id = 2;
        service['drawService'].surfaceList.push(path1);
        service['addTranslation'] = jasmine.createSpy('trans').and.returnValue('');
        service.moveSelection(event);
        expect(path1.transform).toEqual('translate(0 0) rotate(0 0 0)');
    });

    it('moveSelection should apply the point translation with magnetism', () => {
        const event = new MouseEvent('click', { clientX: 10, clientY: 10 });
        service['dragState'].nextPoint = new Point(0, 0);
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element1.id = '2';
        element1.setAttribute('transform', '');
        service['selectionArray'].listSelected = [];
        service['selectionArray'].listSelected.push(element1);
        service['drawService'].surfaceList = [];
        const path1 = new Path();
        path1.id = 2;
        service['magnetsim'].isActive = true;
        service['magnetsim'].findPointToTranslate = jasmine.createSpy('findPointToTranslate');
        service['drawService'].surfaceList.push(path1);
        service['addTranslation'] = jasmine.createSpy('trans').and.returnValue('translate(10 10)');
        service.moveSelection(event);
        expect(path1.transform).toEqual('translate(10 10) ');
        expect(service['magnetsim'].findPointToTranslate).toHaveBeenCalled();
    });

    it('should get the center of th element', () => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const point = service['getCenter'](element);
        expect(point).toBeTruthy();
    });

    it('should add the rotation value to a specific point', () => {
        const rotate = 'rotate(0 0 0)';
        const center = new Point(10, 10);
        const next = service['addRotation'](rotate, Math.PI, center);
        expect(next).toEqual('rotate(0 10 10)');
    });

    it('should call rotate selection on wheel event scroll up with deltaY > 0', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const spy = service['rotateSelection'] = jasmine.createSpy('spy');
        const event = new WheelEvent('wheel', {
            deltaY: 2
        });
        service['mouseWheel'](event);
        expect(spy).toHaveBeenCalled();
    });

    it('should call rotate selection on wheel event scroll down', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const spy = service['rotateSelection'] = jasmine.createSpy('spy');
        const event = new WheelEvent('wheel', {deltaY: -2});
        service['mouseWheel'](event);
        expect(spy).toHaveBeenCalled();
    });

    it('should translate and rotate a specific element', () => {
        const element = service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const transform = service['translateAndRotate'](new Point(10, 10), 'translate(0 0)', 'rotate(0 0 0)', element, 0);
        expect(transform).toEqual('translate(120 20) rotate(-180 0 0)');
    });

    it('should rotate a specific element around the center of the selection', () => {
        const select = service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const controle = service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        select.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
        controle.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
        select.id = '10';
        controle.id = 'controle';
        const path = new Path();
        path.id = 10;
        service['drawService'].surfaceList.push(path);
        service['oldCenter'] = new Point(0, 0);
        const event = new WheelEvent('wheel', {deltaY: -2});
        const spy = service['translateAndRotate'] = jasmine.createSpy('spy').and.returnValue('translate(120 20) rotate(-180 0 0)');

        service['rotateSelection'](1, event);
        expect(spy).toHaveBeenCalled();
    });

    it('should rotate a specific element around the center of the element', () => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
        element.id = '10';
        service['selectionArray'].listSelected = [];
        service['selectionArray'].listSelected.push(element);
        const path = new Path();
        path.id = 10;
        service['mapEvent'].ShiftLeft = true;
        service['mapEvent'].AltLeft = true;
        service['drawService'].surfaceList.push(path);
        service['oldCenter'] = new Point(0, 0);
        const event = new WheelEvent('wheel', {deltaY: -2, shiftKey: true, altKey: true});
        const spy = service['createSelectionRectWithArray'] = jasmine.createSpy('spy');
        const spy2 = service['getTransAndRotate'] = jasmine.createSpy('spy2').and.returnValue(['translate(0 0)', 'rotate(0 0 0)']);

        service['rotateSelection'](1, event);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

// tslint:disable-next-line: max-file-line-count
});

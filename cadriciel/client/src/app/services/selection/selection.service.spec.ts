// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any

import { TestBed } from '@angular/core/testing';
import { Point } from 'src/app/Models/shapes/point';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';
import { SelectionService } from './selection.service';

describe('SelectionService', () => {
    let service: SelectionService;
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [DrawingServiceService, UndoRedoService],
        }),
    );

    beforeEach(() => {
        service = TestBed.get(SelectionService);
        service['undoRedoService'].update = jasmine.createSpy('update').and.callFake((args) => {
            return ;
          });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        const event = new MouseEvent('contextmenu');
        window.dispatchEvent(event);
    });

    it('testing mouseLeave the visualisation and the selection must disappear  ', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };
        service['drawService'].visualisation = 'Testing';
        service['origin'].x = 5;
        service['origin'].y = 8;
        service['canDraw'] = true;
        service['minPoint'] = new Point(5, 5);
        service['dimension'] = { width: 5, height: 5 };
        service['dragState'].isDraging = true;
        const point = new Point(0, 0);
        service.mouseLeave();
        expect(service['drawService'].visualisation).toEqual('');
        expect(service['origin'].x).toEqual(0);
        expect(service['origin'].y).toEqual(0);
        expect(service['canDraw']).toEqual(false);
        expect(service['minPoint']).toEqual(point);
        expect(service['dimension']).toEqual({ width: 0, height: 0 });
        expect(service['dragState'].isDraging).toEqual(false);
    });

    it('testing mouseUp visualisation should disappear but the selection appears' +
        'next is selection is ready', () => {
        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };
        service['drawService'].visualisation = 'Testing';
        service['origin'] = new Point(5, 8);
        service['dragState'].nextPoint = new Point(5, 5);
        service['dragState'].origin = new Point(5, 5);
        service['canDraw'] = true;
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element1.id = '2';
        element1.setAttribute('transform', '');
        element2.id = '2';
        element2.setAttribute('transform', '');
        service['selectionArray'].listSelected.push(element1);
        service['selectionArray'].listSelected.push(element2);
        spyOn(service['selectionArray'].listSelected, 'pop');
        service['dragState'].isDraging = true;
        const point = new Point(0, 0);
        service.mouseUp();
        expect(service['drawService'].visualisation).toEqual('');
        expect(service['dragState'].origin).toEqual(point);
        expect(service['canDraw']).toEqual(false);
        expect(service['dragState'].nextPoint).toEqual(point);
        expect(service['dimension']).toEqual({ width: 0, height: 0 });
        expect(service['dragState'].isDraging).toEqual(false);
    });

    it('testing mouseUp visualisation should disappear but the selection appears', () => {
        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };
        service['drawService'].visualisation = 'Testing';
        service['dragState'].origin = new Point(5, 5);
        service['dragState'].nextPoint = new Point(5, 5);
        service['canDraw'] = true;
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['selectionArray'].listSelected = [];
        service['selectionArray'].tempSelected = [];
        service['selectionArray'].listSelected.push(element1);
        service['selectionArray'].listSelected.push(element2);
        spyOn(service['selectionArray'].listSelected, 'pop');
        service['dragState'].isDraging = false;
        const point = new Point(0, 0);
        service.mouseUp();
        expect(service['drawService'].visualisation).toEqual('');
        expect(service['dragState'].origin).toEqual(point);
        expect(service['canDraw']).toEqual(false);
        expect(service['dragState'].nextPoint).toEqual(point);
        expect(service['dimension']).toEqual({ width: 0, height: 0 });
        expect(service['dragState'].isDraging).toEqual(false);
        expect(service['selectionArray'].listSelected.pop).not.toHaveBeenCalledTimes(2);
    });

    it('testing mouseDownPath settings for the selection', () => {
        service['dragState'].nextPoint = new Point(5, 5);
        service['canDraw'] = false;
        service['dragState'].isDraging = false;
        // const point = new Point(0, 0);
        const click = new MouseEvent('click', { clientX: 200, clientY: 200 });
        service.mouseDownPath(click);
        expect(service['origin'].x).toEqual(click.offsetX);
        expect(service['origin'].y).toEqual(click.offsetY);
        expect(service['canDraw']).toEqual(true);
    });
    it('testing reset everything should be initialise again and nothing appears', () => {
        service['drawService'].visualisation = 'Testing';
        service['origin'] = new Point(5, 5);
        service['minPoint'] = new Point(5, 5);
        service['canDraw'] = true;
        service['dimension'] = { width: 5, height: 5 };
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const point = new Point(0, 0);
        spyOn(service['drawService'].elements.selectionElement, 'setAttribute');
        spyOn(service['drawService'].elements.controle, 'setAttribute');

        service.reset();
        expect(service['drawService'].visualisation).toEqual('');
        expect(service['origin']).toEqual(point);
        expect(service['minPoint']).toEqual(point);
        expect(service['canDraw']).toEqual(false);
        expect(service['drawService'].elements.controle.setAttribute).toHaveBeenCalled();
        expect(service['drawService'].elements.selectionElement.setAttribute).toHaveBeenCalled();
    });

    it('testing mouseDown nothing should appears', () => {
        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        service['selectionArray'].listSelected.push(element1);
        service['selectionArray'].listSelected.push(element2);
        service['selectionArray'].tempSelected.push(element1);
        service['selectionArray'].tempSelected.push(element2);

        service['leftClick'] = false;
        service['canDraw'] = false;
        service['origin'] = new Point(4, 4);
        service['dragState'].isDraging = false;
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 6});
        // Object.defineProperty(click, 'target', service['drawService'].elements.selectionElement);
        spyOn(click, 'preventDefault');
        service.mouseDown(click);
        expect(click.preventDefault).toHaveBeenCalled();
        expect(service['dragState'].isDraging).toEqual(false);

    });

    it('testing mouseDown, leftClick equals true. the Selection is activated and must appears', () => {
        service['selectionArray'] = {
            listSelected : [], tempSelected: [], tempArray: []
        };
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['selectionArray'].listSelected.push(element1);
        service['selectionArray'].listSelected.push(element2);
        service['selectionArray'].tempSelected.push(element1);
        service['selectionArray'].tempSelected.push(element2);

        service['leftClick'] = true;
        service['canDraw'] = false;
        service['origin'] = new Point(4, 4);
        service['dragState'].isDraging = false;
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 0});
        Object.defineProperty(click, 'target', {value: service['drawService'].elements.selectionElement, enumerable: true});

        service['drawService'].elements.selectionElement.dispatchEvent(click);
        const point1 = new Point(10, 10);

        spyOn(click, 'preventDefault');

        service.mouseDown(click);
        // service['dragState'].isDraging = true;
        expect(click.preventDefault).toHaveBeenCalled();
        expect(service['dragState'].isDraging).toEqual(true);
        expect(service['leftClick']).toEqual(true);
        expect(service['canDraw']).toEqual(true);
        expect(service['origin']).toEqual(point1);
        expect(service['dragState'].origin.x).toEqual(point1.x);
        expect(service['dragState'].nextPoint.x).toEqual(point1.x);
        expect(service['dragState'].origin.y).toEqual(point1.y);
        expect(service['dragState'].nextPoint.y).toEqual(point1.y);

    });

    it('testing mouseDown with leftClick equals true ' +
    'and nothing is dragged', () => {
        service['selectionArray'] = {
            listSelected : [], tempSelected: [], tempArray: []
        };
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['selectionArray'].tempSelected.push(element2);
        service['selectionArray'].listSelected.push(element1);
        service['selectionArray'].listSelected.push(element2);
        service['selectionArray'].tempSelected.push(element1);

        service['leftClick'] = true;
        service['canDraw'] = false;
        service['origin'] = new Point(4, 4);
        service['dragState'].isDraging = false;
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 0});
        Object.defineProperty(click, 'target', {value: service['drawService'].elements.svg, enumerable: true});

        service['drawService'].elements.selectionElement.dispatchEvent(click);
        const point1 = new Point(10, 10);

        spyOn(click, 'preventDefault');
        spyOn(service['drawService'].elements.selectionElement, 'setAttribute');

        service.mouseDown(click);
        expect(click.preventDefault).toHaveBeenCalled();
        expect(service['dragState'].isDraging).toEqual(false);
        expect(service['leftClick']).toEqual(true);
        expect(service['canDraw']).toEqual(true);
        expect(service['origin']).toEqual(point1);
    });

    it('testing mouseDown with leftClick equals true ' +
    'and nothing is dragged and nothing is selected', () => {
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 0});
        service['selectionArray'] = {
            listSelected : [], tempSelected: [], tempArray: []
        };
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element1.id = '10';
        element1.style.stroke = '2';
        element1.setAttribute('d', 'M 0 0, L 20 20');
        service['drawService'].elements.svg.appendChild(element1);
        service['drawService'].elements.svg.id = 'svg';
        document.body.appendChild(service['drawService'].elements.svg);
        document.elementFromPoint = jasmine.createSpy('element').and.returnValue(element1);
        service['selectionArray'].listSelected.push(element1);
        service['leftClick'] = true;
        service['canDraw'] = false;
        service['origin'] = new Point(4, 4);
        service['dragState'].isDraging = true;

        Object.defineProperty(click, 'target', {value: service['drawService'].elements.selectionElement, enumerable: true});

        service['drawService'].elements.selectionElement.dispatchEvent(click);
        spyOn(click, 'preventDefault');
        spyOn(service['drawService'].elements.selectionElement, 'setAttribute');

        service.mouseDown(click);
        expect(click.preventDefault).toHaveBeenCalled();

    });

    it('testing createSelectionRectWithArray with array with some elements' +
        'slectioon box should appears', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['selectionArray'].listSelected = [
            document.createElementNS('http://www.w3.org/2000/svg', 'path')
        ];
        service['selectionArray'].listSelected[0] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['minPoint'] = new Point (4, 4);

        const point1 = new Point(0, 0);

        spyOn(service, 'createRect');

        service.createSelectionRectWithArray();
        expect(service['minPoint']).toEqual(point1);
        expect(service.createRect).toHaveBeenCalledWith(point1);
    });

    it('testing createSelectionRectWithArray with empty array' +
        'sel;ection box must not appears', () => {
        service['selectionArray'] = {
            listSelected : [], tempSelected: [], tempArray: []
        };
        spyOn(service, 'createRect');
        service.createSelectionRectWithArray();
        expect(service.createRect).toHaveBeenCalled();
    });

    it('#createSelectionRectWithArray should create the rectangle '
        + 'even if listSelection is empty', () => {
        service['selectionArray'] = {
            listSelected : [
                document.createElementNS('http://www.w3.org/2000/svg', 'path')
            ],
            tempSelected: [],
            tempArray: []
        };

        spyOn(service, 'createRect');
        service.createSelectionRectWithArray();
        expect(service.createRect).toHaveBeenCalled();
    });

    it('testing selectAll all thge elements must selected', () => {
        service['selectionArray'] = {
            listSelected : [], tempSelected: [], tempArray: []
        };
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        spyOn(service, 'createControlePoint');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        spyOn<any>(service['drawService'].elements.svg, 'getBoundingClientRect').and.callFake(() => {
            return new DOMRect(20, 20, 20, 20);
        });
        service.selectAll();
        expect(service['drawService'].elements.svg.getBoundingClientRect).toHaveBeenCalled();
        expect(service.createControlePoint).toHaveBeenCalled();
    });

    it('testing createControlePoint the controle point must appears', () => {
        service['selectionArray'] = {
            listSelected : [], tempSelected: [], tempArray: []
        };
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        spyOn(service['drawService'].elements.controle, 'setAttribute');
        service['minPoint'] = new Point(10, 10);
        service['dimension'] = { width: 10, height: 10 };
        service.createControlePoint(service['minPoint'], service['dimension']);
        service['selectionArray'].listSelected.length = 0;
        expect(service['drawService'].elements.controle.setAttribute).toHaveBeenCalledTimes(3);
    });

    it('testing mouseMoveSelection all elements selected must move and follow the controle point', () => {
        service['selectionArray'] = {
            listSelected : [], tempSelected: [], tempArray: []
        };
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['leftClick'] = true;
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.domRect = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        spyOn(service, 'createSelectionRect');
        spyOn(service, 'createDeselectionRect');
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 0});
        service.mouseMoveSelection(click);
        expect(service.createSelectionRect).toHaveBeenCalled();
        expect(service.createDeselectionRect).not.toHaveBeenCalled();
    });

    it('testing mouseMoveSelection ellemets must no moved', () => {
        service['selectionArray'] = {
            listSelected : [], tempSelected: [], tempArray: []
        };
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['leftClick'] = false;
        spyOn(service, 'createSelectionRect');
        spyOn(service, 'createDeselectionRect');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.domRect = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        spyOn<any>(service['drawService'].elements.svg, 'getBoundingClientRect').and.callFake(() => {
            return new DOMRect(20, 20, 20, 20);
        });
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 0});
        service.mouseMoveSelection(click);
        expect(service.createSelectionRect).not.toHaveBeenCalled();
        expect(service.createDeselectionRect).toHaveBeenCalled();
    });

    it('testing--createRect box for selection must appears', () => {
        service['selectionArray'] = {
            listSelected : [], tempSelected: [], tempArray: []
        };
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        element1.setAttribute('width', '2');
        element1.setAttribute('height', '10');
        service['selectionArray'].listSelected.push(element1);
        service['leftClick'] = false;
        service ['minPoint'] = new Point(30, 30);
        spyOn(service, 'createControlePoint');
        spyOn(service['drawService'].elements.selectionElement, 'setAttribute');
        spyOn(service['drawService'].elements.controle, 'setAttribute');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.domRect = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        const click = new Point(10, 10);
        service.createRect(click);
        expect(service.createControlePoint).toHaveBeenCalled();
        expect(service['drawService'].elements.selectionElement.setAttribute).toHaveBeenCalledTimes(4);
        expect(service['drawService'].elements.controle.setAttribute).toHaveBeenCalledTimes(1);
        expect(service['minPoint'].x).toEqual(0);
        expect(service['minPoint'].y).toEqual(0);
        expect(click.x).toEqual(10);
        expect(click.y).toEqual(10);

    });

    it('testing--createRect box for selection must be align with the maxPointx', () => {
        service['selectionArray'] = {
            listSelected : [], tempSelected: [], tempArray: []
        };
        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        element1.setAttribute('width', '2');
        element1.setAttribute('height', '10');
        service['selectionArray'].listSelected.push(element1);
        service['leftClick'] = false;
        service ['minPoint'] = new Point(-30, -30);
        spyOn(service, 'createControlePoint');
        spyOn(service['drawService'].elements.selectionElement, 'setAttribute');
        spyOn(service['drawService'].elements.controle, 'setAttribute');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.domRect = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        const click = new Point(-10, -10);
        service.createRect(click);
        expect(service.createControlePoint).toHaveBeenCalled();
        expect(service['drawService'].elements.selectionElement.setAttribute).toHaveBeenCalledTimes(4);
        expect(service['drawService'].elements.controle.setAttribute).toHaveBeenCalledTimes(1);
        expect(service['minPoint'].x).toEqual(-30);
        expect(service['minPoint'].y).toEqual(-30);
        expect(click.x).toEqual(0);
        expect(click.y).toEqual(0);

    });

    it('testing mouseClickPath when elements selected moving stop moving', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };
        spyOn(service, 'createDeselectionRect');
        service['dragState'].isDraging = true;
        service['dragState'].hasSelected = true;

        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 0});
        service.mouseClickPath(click);

    });
    it('mouseClickPath shouldn"t selected elements when anything is under the mouse pointer ', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };
        spyOn(service, 'createDeselectionRect');
        spyOn(service['drawService'].elements.selectionElement, 'setAttribute');

        service['dragState'].isDraging = true;
        service['dragState'].hasSelected = false;
        service['leftClick']  = false;
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 0});
        service.mouseClickPath(click);
        expect(service['drawService'].elements.selectionElement.setAttribute).toHaveBeenCalledTimes(6);
        expect(service['leftClick']).toEqual(true);
    });

    it('mouseClickPath should selected elements under the mouse pointer ', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };
        service['selectionArray'].listSelected.push(service['drawService'].elements.selectionElement);
        service['selectionArray'].tempSelected.push(service['drawService'].elements.selectionElement);

        spyOn(service, 'createDeselectionRect');
        spyOn(service['drawService'].elements.selectionElement, 'setAttribute');
        spyOn(service['selectionArray'].listSelected, 'push');
        spyOn(service['selectionArray'].tempSelected, 'push');
        spyOn(service['selectionArray'].listSelected, 'splice');
        spyOn(service['selectionArray'].tempSelected, 'splice');
        spyOn(service, 'createSelectionRectWithArray');

        service['dragState'].isDraging = true;
        service['dragState'].hasSelected = false;
        service['leftClick']  = true;
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 4});
        service.mouseClickPath(click);
        expect(service['drawService'].elements.selectionElement.setAttribute).toHaveBeenCalled();
        expect(service.createSelectionRectWithArray).toHaveBeenCalledTimes(1);
        expect(service['leftClick']).toEqual(false);

    });

    it('mouseClickPath should take the path when we use leftclick ', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };

        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element1.id = 'svg';
        element1.style.stroke = '2';
        element1.setAttribute('d', 'M 0 0, L 20 20');
        service['drawService'].elements.svg.appendChild(element1);
        service['drawService'].elements.svg.id = 'svg';
        document.body.appendChild(service['drawService'].elements.svg);
        document.elementFromPoint = jasmine.createSpy('element').and.returnValue(element1);

        service['selectionArray'].listSelected.push(element1);

        service['dragState'].isDraging = true;
        service['dragState'].hasSelected = false;
        service['leftClick']  = true;
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 4});
        service.mouseClickPath(click);
        expect(service['leftClick']).toEqual(false);
    });

    it('testing mouseClickPath leftClick equal false ', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };

        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element1.id = 'svg';
        element1.style.stroke = '2';
        element1.setAttribute('d', 'M 0 0, L 20 20');
        service['drawService'].elements.svg.appendChild(element1);
        service['drawService'].elements.svg.id = 'svg';
        document.body.appendChild(service['drawService'].elements.svg);
        document.elementFromPoint = jasmine.createSpy('element').and.returnValue(element1);
        service['dragState'].isDraging = true;
        service['dragState'].hasSelected = false;
        service['leftClick']  = true;
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 4});
        service.mouseClickPath(click);
        expect(service['leftClick']).toEqual(false);
    });

    it('testing mouseClickPath leftClick equal false ', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };

        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element1.id = 'svg';
        element1.style.stroke = '2';
        element1.setAttribute('d', 'M 0 0, L 20 20');
        service['drawService'].elements.svg.appendChild(element1);
        service['drawService'].elements.svg.id = 'svg';
        document.body.appendChild(service['drawService'].elements.svg);
        document.elementFromPoint = jasmine.createSpy('element').and.returnValue(element1);
        service['dragState'].isDraging = true;
        service['dragState'].hasSelected = false;
        service['leftClick']  = false;
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 0});
        service.mouseClickPath(click);
        expect(service['leftClick']).toEqual(true);
    });

    it('testing mouseClickPath leftClick equal false ', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };

        const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element1.id = 'svg';
        element1.style.stroke = '2';
        element1.setAttribute('d', 'M 0 0, L 20 20');
        service['drawService'].elements.svg.appendChild(element1);
        service['drawService'].elements.svg.id = 'svg';
        document.body.appendChild(service['drawService'].elements.svg);
        document.elementFromPoint = jasmine.createSpy('element').and.returnValue(element1);

        service['dragState'].isDraging = true;
        service['dragState'].hasSelected = false;
        service['leftClick']  = true;
        const click = new MouseEvent('click', { clientX: 10, clientY: 10, button: 4});
        service.mouseClickPath(click);
        expect(service['leftClick']).toEqual(false);
    });

    it('createDeselectionRect should setting for for right can be done  ', () => {
        const select = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const controle =  document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const element =  document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const svg =  document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const element2 =  document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const element3 =  document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const element4 =  document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const element5 =  document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const element6 =  document.createElementNS('http://www.w3.org/2000/svg', 'path');

        element.id = '10';
        element2.id = '11';
        element3.id = '12';
        element4.id = '13';
        element5.id = '14';
        element6.id = '15';
        select.id = 'selection';
        controle.id = 'controle';

        document.body.appendChild(svg);
        svg.appendChild(select);
        svg.appendChild(controle);
        svg.appendChild(element);
        svg.appendChild(element2);
        svg.appendChild(element3);
        svg.appendChild(element4);
        service['selectionArray'] = {
            listSelected : [element, element2, element6],
            tempSelected: [element2, element3, controle, select, element5],
            tempArray: []
        };
        spyOn(service, 'createSelectionRectWithArray');
        const tab: NodeListOf<SVGElement>  = svg.querySelectorAll('path') as NodeListOf<SVGElement>;
        service.createDeselectionRect(tab);
        expect(service.createSelectionRectWithArray).toHaveBeenCalled();
        expect(service.createSelectionRectWithArray).toHaveBeenCalled();
    });

    it('createDeselectionRect should work on the path', () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        document.body.appendChild(service['drawService'].elements.selectionElement);
        document.body.appendChild(service['drawService'].elements.controle);
        service['drawService'].elements.selectionElement.id = 'selection';
        service['drawService'].elements.controle.id = '';

        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };
        spyOn(service, 'createRect');
        const tab: NodeListOf<SVGElement>  = document.querySelectorAll('path') as NodeListOf<SVGElement>;
        service.createSelectionRect(tab);
        expect(service.createRect).toHaveBeenCalled();

    });

    it('testing create selectionRect with empty list ' , () => {
        service['drawService'].elements.selectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        service['drawService'].elements.selectionElement.id = 'selection';
        service['drawService'].elements.controle.id = '';

        service['selectionArray'] = {
            listSelected : [],
            tempSelected: [],
            tempArray: []
        };
        spyOn(service, 'createRect');
        spyOn( service['selectionArray'].listSelected, 'push');
        const tab: NodeListOf<SVGElement>  = document.querySelectorAll('path') as NodeListOf<SVGElement>;
        service.createSelectionRect(tab);
        expect(service.createRect).toHaveBeenCalled();

    });

// tslint:disable-next-line: max-file-line-count
});

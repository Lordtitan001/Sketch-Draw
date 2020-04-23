// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any

import { TestBed } from '@angular/core/testing';
import { Path } from 'src/app/Models/shapes/path';
import { PenService } from './pen.service';

describe('PenService', () => {
  let service: PenService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(PenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('reset should reset the attributes', () => {
    service['canDraw'] = true;
    service['hasLeft'] = true;
    service['rotate'] = true;
    service['angle'] = 15;
    service.reset();
    expect(service['canDraw']).toBe(false);
    expect(service['hasLeft']).toBe(false);
    expect(service['rotate']).toBe(false);
    expect(service['angle']).toBe(0);
  });

  it('keyup should set the right event with true for keydown', () => {
    const event = new KeyboardEvent('keydown', {
      code: 'ArrowRight',
    });
    event.preventDefault = jasmine.createSpy('preventDefault');
    service['keyUp'](event);

    expect(service['mapEvent'][event.code]).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('keyup should set the right event with false for keydown', () => {
    const event = new KeyboardEvent('keyup', {
      code: 'ArrowRight',
    });
    event.preventDefault = jasmine.createSpy('preventDefault');
    service['keyUp'](event);

    expect(service['mapEvent'][event.code]).toBe(false);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('keyDown should set the right event with true for keydown', () => {
    const event = new KeyboardEvent('keydown', {
      code: 'ArrowRight',
    });
    event.preventDefault = jasmine.createSpy('preventDefault');
    service['keyDown'](event);

    expect(service['mapEvent'][event.code]).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('keyDown should set the right event with false for keydown', () => {
    const event = new KeyboardEvent('keyup', {
      code: 'ArrowRight',
    });
    event.preventDefault = jasmine.createSpy('preventDefault');
    service['keyDown'](event);

    expect(service['mapEvent'][event.code]).toBe(false);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('mouseDown should go into first if', () => {
    const event = new MouseEvent('click', {
      clientX : 20,
      clientY : 20
    });
    service['drawService'].surfaceList.length = 2;
    service['drawService'].indexList = 1;
    service['canDraw'] = false;
    service['hasLeft'] = true;
    service['mouseDown'](event);
    expect(service['drawService'].indexList).toBe(2);
    expect(service['canDraw']).toBe(true);
    expect(service['hasLeft']).toBe(false);
  });

  it('mouseDown should not go into first if', () => {
    const event = new MouseEvent('click', {
      clientX : 20,
      clientY : 20
    });
    service['drawService'].surfaceList.length = 1;
    service['drawService'].indexList = 1;
    service['canDraw'] = false;
    service['hasLeft'] = true;
    service['mouseDown'](event);
    expect(service['drawService'].indexList).toBe(1);
    expect(service['canDraw']).toBe(true);
    expect(service['hasLeft']).toBe(false);
  });

  it('mouseWheel should set the right attributes with both if statements true', () => {
    const event = new WheelEvent('move', {
      clientX : 25,
      clientY : 40,
      deltaY: 10
    });
    service['mapEvent'].AltLeft = true;
    service['mapEvent'].AltRight = true;
    service['rotate'] = false;
    event.preventDefault = jasmine.createSpy('preventDefault');
    service['drawService'].elements.eraserElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement;
    service['drawService'].elements.eraserElement.setAttribute = jasmine.createSpy('setAttribute');
    service['mouseWheel'](event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(service['rotate']).toBe(true);
    expect(service['drawService'].elements.eraserElement.setAttribute).toHaveBeenCalled();
  });

  it('mouseWheel should set the right attributes with both if statements false', () => {
    const event = new WheelEvent('move', {
      clientX : 25,
      clientY : 40,
      deltaY: 0
    });
    service['mapEvent'].AltLeft = false;
    service['mapEvent'].AltRight = false;
    service['rotate'] = false;
    event.preventDefault = jasmine.createSpy('preventDefault');
    service['drawService'].elements.eraserElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGElement;
    service['drawService'].elements.eraserElement.setAttribute = jasmine.createSpy('setAttribute');
    service['mouseWheel'](event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(service['rotate']).toBe(true);
    expect(service['drawService'].elements.eraserElement.setAttribute).toHaveBeenCalled();
  });

  it('draw should not go into first if statement and set the right attributes', () => {
    const event = new MouseEvent('move', {
      clientX : 25,
      clientY : 40
    });
    const index = 1;
    service['rotate'] = false;
    service['colorPicker'].primaryColor.getColor = jasmine.createSpy('getColor');
    service['drawService'].surfaceList[index] = new Path();
    service['draw'](event, index);

    expect(service['rotate']).toBe(false);
    expect(service['colorPicker'].primaryColor.getColor).toHaveBeenCalled();
  });

  it('draw should go into first if statement but not into second', () => {
    const event = new MouseEvent('move', {
      clientX : 25,
      clientY : 40
    });
    const index = 1;
    service['drawService'].surfaceList.length = 2;
    service['drawService'].indexList = 2;
    service['rotate'] = true;
    service['drawService'].surfaceList.push = jasmine.createSpy('push');
    service['colorPicker'].primaryColor.getColor = jasmine.createSpy('getColor');
    service['drawService'].surfaceList[index] = new Path();
    service['draw'](event, index);

    expect(service['rotate']).toBe(false);
    expect(service['colorPicker'].primaryColor.getColor).toHaveBeenCalled();
    expect(service['drawService'].surfaceList.push).toHaveBeenCalled();
    expect(service['drawService'].indexList).toBe(2);
  });

  it('draw should go into first and second if statements', () => {
    const event = new MouseEvent('move', {
      clientX : 25,
      clientY : 40
    });
    const index = 1;
    service['drawService'].surfaceList.length = 2;
    service['drawService'].indexList = 1;
    service['rotate'] = true;
    service['drawService'].surfaceList.push = jasmine.createSpy('push');
    service['colorPicker'].primaryColor.getColor = jasmine.createSpy('getColor');
    service['drawService'].surfaceList[index] = new Path();
    service['draw'](event, index);

    expect(service['rotate']).toBe(false);
    expect(service['colorPicker'].primaryColor.getColor).toHaveBeenCalled();
    expect(service['drawService'].surfaceList.push).toHaveBeenCalled();
    expect(service['drawService'].indexList).toBe(2);
  });

  it('mouseClick should set the right attributes with if statement true', () => {
    service['hasLeft'] = false;
    service['canDraw'] = true;
    service['undoRedoService'].update = jasmine.createSpy('update');
    service.mouseClick();

    expect(service['canDraw']).toBe(false);
    expect(service['undoRedoService'].update).toHaveBeenCalled();
  });

  it('mouseClick should set the right attributes with if statement false', () => {
    service['hasLeft'] = true;
    service['canDraw'] = false;
    service.mouseClick();

    expect().nothing();
  });

});

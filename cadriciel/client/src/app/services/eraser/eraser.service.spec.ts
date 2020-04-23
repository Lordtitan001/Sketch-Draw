  // tslint:disable: no-string-literal
  // tslint:disable: no-magic-numbers
  import { async, TestBed } from '@angular/core/testing';
  import { Path } from 'src/app/Models/shapes/path';
  import { DrawingServiceService } from '../drawing/drawing-service.service';
  import { UndoRedoService } from '../undoRedo/undo-redo.service';
  import { EraserService } from './eraser.service';

  let service: EraserService;
  let event: MouseEvent;
  describe('EraserService', () => {
    beforeEach(() => TestBed.configureTestingModule({
      providers: [DrawingServiceService, UndoRedoService]
    }));

    beforeEach(() => {
      service = TestBed.get(EraserService);
      event = new MouseEvent('mouseup', { clientX: 100, clientY: 100 });
      service['undoRedoService'].update = jasmine.createSpy('update').and.callFake((args) => {
        return ;
      });
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should reset service', () => {
      service['elementsUnder'] = new Map();
      service['drawService'].elements.selectionElement
      = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const svg =  service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      element.id = '10';
      service['elementsUnder'].set('10', 'black');
      element.setAttribute = jasmine.createSpy('element').and.callFake(() => '');
      document.body.appendChild(svg);
      svg.appendChild(element);
      svg.appendChild(service['drawService'].elements.selectionElement);
      service['intersection'] = svg.querySelectorAll('path');
      service.reset();
      expect(service['drawService'].paths.eraser.d).toEqual('');
    });

    it('deleteSelected should not delete the element ', () => {
      service['drawService'].surfaceList.push(new Path());
      service['elementsUnder'].set('10', 'blue');
      service['elementsUnder'].set('11', 'black');
      service['deleteSelected']();
      expect(service['drawService'].surfaceList.length).toEqual(1);
    });

    it('deleteSelected should delete the element ', () => {
      const path = new Path();
      path.id = 10;
      service['drawService'].surfaceList.push(path);
      service['elementsUnder'].set('10', 'blue ðŸ”µ');
      service['deleteSelected']();
      expect(service['drawService'].surfaceList.length).toEqual(0);
    });

    it('should create erase rectangle, set the stroke to red and call not delete method  ', async(() => {
      service['drawService'].selectedTools.strokeWidth = '10';
      service['canDraw'] = false;
      const elementsUnder = new Map<string, string>();
      elementsUnder.set('10', 'rgb(255,0,0,0.5)');
      elementsUnder.set('11', 'rgb(255,0,0,0.5)');
      const svg = service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      element.id = '10';
      element.setAttributeNS('http://www.w3.org/2000/svg', 'stroke', 'rgb(255, 0, 0, 0.5)') ;
      svg.appendChild(element);
      document.body.appendChild(svg);
      const promise = Promise.resolve(elementsUnder);
      service['getListElementToErase'] = jasmine.createSpy('eraseSpy')
        .and.returnValue(promise);
      service['deleteSelected'] = jasmine.createSpy('deleteSpy');
      service.mouseMove(event);
      expect(service['deleteSelected']).not.toHaveBeenCalled();
      setTimeout(() => {
        expect(service['getListElementToErase']).toHaveBeenCalled();
        expect(service['drawService'].paths.eraser.d).toEqual(
          `M ${event.offsetX - 5} ${event.offsetY - 5} h ${10} v ${10} h ${-10} Z`
        );
      }, 500);
    }));
    it('should call delete method', () => {
      service['canDraw'] = true;
      const elementsUnder = new Map<string, string>();
      elementsUnder.set('10', 'rgb(255,0,0,0.5)');
      const svg = service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      element.id = '10';
      element.setAttributeNS('http://www.w3.org/2000/svg', 'stroke', 'rgb(255, 0, 0, 0.9)') ;
      svg.appendChild(element);
      document.body.appendChild(svg);

      const promise = Promise.resolve(elementsUnder);
      service['getListElementToErase'] = jasmine.createSpy('eraseSpy')
        .and.returnValue(promise);
      service['deleteSelected'] = jasmine.createSpy('deleteSelected');
      service.mouseMove(event);
      expect(service['deleteSelected']).toHaveBeenCalled();
    });

    it('should clear the eraser', () => {
      service['reset'] = jasmine.createSpy('reset');
      service.mouseLeave();
      expect(service['reset']).toHaveBeenCalled();
    });

    it('should scan the rectangle and get all elements', () => {
      service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      service['drawService'].elements.eraserElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      service['scanRectangle']();
      expect().nothing();
    });

    it('should scan the rectangle and remove all the elements inside', () => {
      const svg = service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      service['drawService'].elements.eraserElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const eraser = service['drawService'].elements.eraserElement;
      service['erase'] = jasmine.createSpy('erase').and.callFake(() => true);
      svg.appendChild(eraser);
      eraser.setAttribute('d', 'M 10 10 L 20 20');
      eraser.setAttribute('stroke-width', '2');
      document.body.appendChild(svg);
      const spy = spyOn(service['drawService'].elements.eraserElement, 'getBoundingClientRect').and.callThrough();
      service['scanRectangle']();
      expect(spy).toHaveBeenCalled();
      expect().nothing();
    });

    it('should scan the rectangle and remove all the elements inside and call undo redo', () => {
      const svg = service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      service['drawService'].elements.eraserElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const eraser = service['drawService'].elements.eraserElement;
      svg.appendChild(eraser);
      eraser.setAttribute('d', 'M 10 10 L 20 20');
      eraser.setAttribute('stroke-width', '2');
      document.body.appendChild(svg);
      const spy = spyOn(service['drawService'].elements.eraserElement, 'getBoundingClientRect').and.callThrough();
      service['erase'] = jasmine.createSpy('erase').and.returnValue(true);
      service['scanRectangle']();
      expect(spy).toHaveBeenCalled();
    });

    it('should stop to draw when mouse up', () => {
      service['canDraw'] = true;
      service.mouseUp();
      expect(service['canDraw']).toEqual(false);
    });

    it('should stop to draw when mouse up and call undo redo', () => {
      service['canDraw'] = true;
      service['changed'] = true;
      service.mouseUp();
      expect(service['changed']).toEqual(false);
    });

    it(' mouseDown should scan  rectantangle', () => {
      service['scanRectangle'] = jasmine.createSpy('scan');
      service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      service['drawService'].elements.eraserElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      service.mouseDown();
      expect(service['canDraw']).toEqual(true);
      expect(service['scanRectangle']).toHaveBeenCalled();
    });

    it(' erase should remove the selected element', () => {
      const path = new Path();
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.id = 1;
      element.id = '1';
      service['drawService'].surfaceList.push(path);
      service['erase'](element);
      expect(service['drawService'].surfaceList.length).toBe(0);
    });

    it(' erase not should remove the selected element', () => {
      const path = new Path();
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.id = 2;
      element.id = '1';
      service['drawService'].surfaceList.push(path);
      service['erase'](element);
      expect(service['undoRedoService'].update).not.toHaveBeenCalled();
      expect(service['drawService'].surfaceList.length).toBe(1);
    });

    it(' erase not should remove the svg element', () => {
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      element.id = 'svg';
      service['erase'](element);
      expect(service['undoRedoService'].update).not.toHaveBeenCalled();
    });

    it('should get the list of elements to erase', async(async () => {
      const svg = service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      service['drawService'].elements.eraserElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const eraser = service['drawService'].elements.eraserElement;

      eraser.id = 'eraser';
      element.id = '10';
      svg.id = 'svg';
      svg.appendChild(eraser);
      svg.appendChild(element);
      eraser.setAttribute('d', 'M 10 10 L 20 20');
      element.setAttribute('d', 'M 10 10 L 20 20');
      eraser.setAttribute('stroke-width', '2');
      element.setAttribute('stroke-width', '2');
      document.body.appendChild(svg);

      service['elementsUnder'] = new Map<string, string> ();
      service['elementsUnder'].set('10', 'rgb(255,0,0,0.5)');
      service['elementsUnder'].set('11', 'rgb(255,0,0,0.5)');

      await service['getListElementToErase']();
      expect(element.getAttribute('stroke')).toEqual('rgb(255,0,0,0.5)');
    }));

    it('should get the list of elements to erase', async(async () => {
      const svg = service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      service['drawService'].elements.eraserElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const eraser = service['drawService'].elements.eraserElement;

      eraser.id = 'eraser';
      element.id = 'none';
      svg.id = 'none';
      svg.appendChild(eraser);
      svg.appendChild(element);
      eraser.setAttribute('d', 'M 30 30 L 20 20');
      element.setAttribute('d', 'M 10 10 L 20 20');
      eraser.setAttribute('stroke-width', '2');
      element.setAttribute('stroke-width', '2');
      document.body.appendChild(svg);

      service['elementsUnder'] = new Map<string, string> ();
      service['elementsUnder'].set('10', 'rgb(255,0,0,0.5)');
      service['elementsUnder'].set('11', 'rgb(255,0,0,0.5)');

      await service['getListElementToErase']();
      expect(element.getAttribute('stroke')).toEqual(null);
    }));

  });

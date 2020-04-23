import { TestBed } from '@angular/core/testing';

import { Color } from 'src/app/Models/color';
import { PipetteService } from './pipette.service';
// tslint:disable no-string-literal
// tslint:disable no-magic-numbers
describe('PipetteService', () => {
  let service: PipetteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(PipetteService);
    const drawService = service['drawService'];
    drawService.elements.canvas = document.createElement('canvas');
    drawService.elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    drawService.elements.svg.setAttribute('height', '500');
    drawService.elements.svg.setAttribute('width', '500');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Context should not be undefined after drawImage call', () => {
    service['drawImage']();
    expect(service['ctx']).toBeTruthy();
  });

  it('mouseDow should work', () => {
    const event = new MouseEvent('mouseDown');

    service['pickColor'] = jasmine.createSpy('pickColor');

    service.mouseDown(event);
    expect(service['pickColor']).toHaveBeenCalled();
  });

  it('mouseMove should work', () => {
    service['drawImage'] = jasmine.createSpy('pickColor');

    service.mouseMove();
    expect(service['drawImage']).toHaveBeenCalled();
  });

  it('The general primary color can be updated by the pickColor method', (done: DoneFn) => {
    const event = {
      offsetX: 10,
      offsetY: 20,
      button: 0
    } as unknown as MouseEvent;
    setTimeout(() => {
      service['drawImage']();
      service['pickColor'](event);
      expect(service['colorPickerService'].primaryColor).toEqual(new Color(0, 0, 0, 0));
      done();
    }, 100 );
  });

  it('The general secondary color can be updated by the pickColor method', (done: DoneFn) => {
    const event = {
      offsetX: 10,
      offsetY: 20,
      button: 2
    } as unknown as MouseEvent;
    setTimeout(() => {
      service['drawImage']();
      service['pickColor'](event);
      expect(service['colorPickerService'].secondaryColor).toEqual(new Color(0, 0, 0, 0));
      done();
    }, 100 );
  });

});

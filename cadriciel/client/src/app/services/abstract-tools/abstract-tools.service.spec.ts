import { TestBed } from '@angular/core/testing';

import { AbstractToolsService } from './abstract-tools.service';

describe('AbstractToolsService', () => {
  let service: AbstractToolsService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AbstractToolsService]
  }));

  beforeEach(() => {
    service = TestBed.get(AbstractToolsService);
  });

  it('should be created', () => {

    expect(service).toBeTruthy();
  });

  it('mouseClick should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseClick(event);
    expect().nothing();
  });

  it('mouseDown should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseDown(event);
    expect().nothing();
  });

  it('mouseMove should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseMove(event);
    expect().nothing();
  });

  it('mouseUp should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseUp(event);
    expect().nothing();
  });

  it('mouseLeave should work', () => {
    service.mouseLeave();
    expect().nothing();
  });

  it('keyUp should work', () => {
    const event = new KeyboardEvent('keyup');
    service.keyUp(event);
    expect().nothing();
  });

  it('keyDown should work', () => {
    const event = new KeyboardEvent('keyup');
    service.keyDown(event);
    expect().nothing();
  });

  it('mouseDblclick should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseDblclick(event);
    expect().nothing();
  });

  it('mouseDownPath should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseDownPath(event);
    expect().nothing();
  });

  it('mouseClickPath should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseClickPath(event);
    expect().nothing();
  });

  it('mouseDownControle should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseDownControle(event);
    expect().nothing();
  });

  it('mouseDownSelection should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseDownSelection(event);
    expect().nothing();
  });

  it('mouseOverPath should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseOverPath(event);
    expect().nothing();
  });

  it('mouseDownControle should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseDownControle(event);
    expect().nothing();
  });

  it('mouseLeavePath should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseLeavePath(event);
    expect().nothing();
  });

  it('mouseUpPath should work', () => {
    const event = new MouseEvent('mouseup');
    service.mouseUpPath(event);
    expect().nothing();
  });

  it('init should work', () => {
    service.init();
    expect().nothing();
  });

  it('reset should work', () => {
    service.reset();
    expect().nothing();
  });
});

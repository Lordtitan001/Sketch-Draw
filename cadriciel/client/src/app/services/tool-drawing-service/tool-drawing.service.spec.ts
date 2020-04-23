import { TestBed } from '@angular/core/testing';
import { Color } from 'src/app/Models/color';
import { EnumTool, Textures } from 'src/app/Models/enums';
import { Brush } from 'src/app/Models/tools/brush';
import { Pencil } from 'src/app/Models/tools/pencil';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { ToolDrawingService } from './tool-drawing.service';
// tslint:disable no-string-literal
describe('ToolDrawingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawingServiceService]
    });
  });

  it('should be created', () => {
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    expect(service).toBeTruthy();
  });

  it('reset() should stop the draw', () => {
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['hasLeft'] = true;
    service['canDraw'] = true;
    service.reset();
    expect(service['canDraw']).toBe(false);
    expect(service['hasLeft']).toBe(false);
  });

  it('test mouseLeave()', () => {
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    const spy = spyOn(service['undoRedoService'], 'update');
    service['canDraw'] = true;
    service['hasLeft'] = false;
    service.mouseLeave();
    expect(service['canDraw']).toBe(false);
    expect(service['hasLeft']).toBe(true);
    expect(spy).toHaveBeenCalled();

    service['hasLeft'] = false;
    service.mouseLeave();
    expect(service['hasLeft']).toBe(false);
  });

  it('test mousedown when surfaceList.length > indexList', () => {
    const event = new MouseEvent('mousedown');
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['drawService'].surfaceList.push(new Pencil());
    service['drawService'].indexList = 0;
    service['drawService'].selectedTools.enumTool = EnumTool.Brush;
    service.mouseDown(event);
    expect(service['canDraw']).toBe(true);
    expect(service['hasLeft']).toBe(false);
    expect(service['drawService'].indexList).toBe(1);
    expect(service['drawService'].surfaceList[1]).toBeDefined();
  });

  it('test mousedown when surfaceList.length === indexList', () => {
    const event = new MouseEvent('mousedown');
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['drawService'].selectedTools.enumTool = EnumTool.Pencil;
    service['drawService'].surfaceList.push(new Pencil());
    service['drawService'].indexList = 1;
    service.mouseDown(event);
    expect(service['drawService'].surfaceList.length).toBe(2);
    expect(service['drawService'].indexList).toBe(1);
  });

  it('test mousedown when pencil is selected', () => {
    const event = new MouseEvent('mousedown');
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['drawService'].surfaceList = [];
    service['drawService'].enumTool = EnumTool.Pencil;
    service.mouseDown(event);
    expect(service['drawService'].surfaceList[0].enumTool).toBe(EnumTool.Pencil);
  });

  it('test mousedown when Brush is selected', () => {
    const event = new MouseEvent('mousedown');
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['drawService'].surfaceList = [];
    service['drawService'].enumTool = EnumTool.Brush;
    service.mouseDown(event);
    expect(service['drawService'].surfaceList[0].enumTool).toBe(EnumTool.Brush);
  });

  it('test mouseMove', () => {
    const event = new MouseEvent('mousemove');
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['canDraw'] = true;
    service['draw'] = jasmine.createSpy('drawSpy');
    service.mouseMove(event);
    expect(service['draw']).toHaveBeenCalled();
  });

  it('test mousemove with false', () => {
    const event = new MouseEvent('mousemove');
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['canDraw'] = false;
    service['draw'] = jasmine.createSpy('drawLineSpy');
    service.mouseMove(event);
    expect(service['draw']).not.toHaveBeenCalled();
  });

  it('test mouse click if canDraw is true an halLeft is false', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['canDraw'] = true;
    service['hasLeft'] = false;
    service['drawService'].enumTool = EnumTool.Pencil;
    service['drawService'].indexList = 0;
    service['draw'] = jasmine.createSpy('drawSpy').and.callFake(() => {return; });
    service['undoRedoService'].update = jasmine.createSpy('undoSpy');
    service.mouseClick(event);
    expect(service['draw']).toHaveBeenCalledWith(event, 0);
    expect( service['undoRedoService'].update).toHaveBeenCalled();
    expect(service['drawService'].surfaceList[0]).toBeDefined();

  });

  it('test mouse click if canDraw is true an halLeft is false', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['canDraw'] = true;
    service['hasLeft'] = false;
    service['drawService'].enumTool = EnumTool.Brush;
    service['drawService'].indexList = 0;
    service['draw'] = jasmine.createSpy('drawSpy').and.callFake(() => {return; });
    service['undoRedoService'].update = jasmine.createSpy('undoSpy');
    service.mouseClick(event);
    expect(service['draw']).toHaveBeenCalledWith(event, 0);
    expect( service['undoRedoService'].update).toHaveBeenCalled();
    expect(service['drawService'].surfaceList[0]).toBeDefined();

  });

  it('test click if canDraw is false', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['draw'] = jasmine.createSpy('drawSpy');
    service['hasLeft'] = false;
    service.mouseClick(event);
    expect(service['draw']).not.toHaveBeenCalled();

  });
  it('test click if hasLeft is true', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['draw'] = jasmine.createSpy('drawSpy');
    service['hasLeft'] = true;
    service['canDraw'] = true;
    service.mouseClick(event);
    expect(service['draw']).not.toHaveBeenCalled();

  });

  it('test draw function with brush', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['drawService'].surfaceList.push(new Brush());
    service['drawService'].selectedTools = new Brush();
    service['drawService'].selectedTools.texture = Textures.Texture1;
    service['drawService'].enumTool = EnumTool.Brush;
    const texture = Textures.Texture1.valueOf();
    service['draw'](event, 0);
    expect(service['drawService'].surfaceList[0].filter).toEqual(`url(#${texture})`);
  });

  it('test draw function with Pencil', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });
    const service: ToolDrawingService = TestBed.get(ToolDrawingService);
    service['drawService'].surfaceList.push(new Pencil());

    // tslint:disable-next-line: no-magic-numbers
    const couleur = new Color(100, 100, 100);
    service['colorPicker'].primaryColor = couleur;
    service['drawService'].selectedTools = new Pencil();

    service['draw'](event, 0);
    expect(service['drawService'].surfaceList[0].fill).toEqual('none');
    expect(service['drawService'].surfaceList[0].strokeLinecap).toEqual('round');
    expect(service['drawService'].surfaceList[0].strokeWidth).toEqual('2');
    expect(service['drawService'].surfaceList[0].strokeLinejoin).toEqual('round');
    expect(service['drawService'].surfaceList[0].stroke).toBe(couleur.getColor());
  });
});

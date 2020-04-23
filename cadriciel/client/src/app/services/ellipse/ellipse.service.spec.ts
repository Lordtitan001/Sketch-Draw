
import { TestBed } from '@angular/core/testing';
import { EnumTool } from 'src/app/Models/enums';
import { Path } from 'src/app/Models/shapes/path';
import { EllipseService } from './ellipse.service';
// tslint:disable: no-string-literal
// tslint:disable no-magic-numbers
describe('EllipseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    expect(service).toBeTruthy();
  });

  it('keydown should modify the Ellipse sizes with positive width and height', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const event = new KeyboardEvent('keydown', {
      shiftKey: true
    });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = true;
    service['isModified'] = false;
    service['drawService'].enumTool = EnumTool.Ellipse;
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['oldWidth'] = 140;
    service['oldHeight'] = 150;
    service.keyDown(event);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).not.toBe(' ');
  });

  it('keydown should modify the Ellipse sizes with negative width and height', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const event = new KeyboardEvent('keydown', {
      shiftKey: true
    });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = true;
    service['isModified'] = false;
    service['drawService'].enumTool = EnumTool.Ellipse;
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['oldWidth'] = -140;
    service['oldHeight'] = -150;
    service.keyDown(event);
    expect(service['isModified']).toBe(true);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).not.toBe(' ');
  });

  it('keydown should not modify the Ellipse sizes', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const event = new KeyboardEvent('keydown', {
      shiftKey: true
    });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = false;
    service['isModified'] = false;
    service['drawService'].enumTool = EnumTool.Ellipse;
    service['drawService'].surfaceList[service['drawService'].indexList].width = 100;
    service['drawService'].surfaceList[service['drawService'].indexList].height = 50;
    service.keyDown(event);
    expect(service['isModified']).toBe(false);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].width).toBe(100);
  });

  it('keyup should modify the Ellipse sizes', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const event = new KeyboardEvent('keyup');
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = true;
    service['isModified'] = true;
    service['drawService'].enumTool = EnumTool.Ellipse;
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['oldWidth'] = 100;
    service['oldHeight'] = 150;
    service.keyUp(event);
    expect(service['isModified']).toBe(false);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).not.toBe(' ');
  });

  it('keyup should not modify the Ellipse sizes', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const event = new KeyboardEvent('keyup');
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = false;
    service['isModified'] = true;
    service['drawService'].enumTool = EnumTool.Ellipse;
    service['oldWidth'] = 100;
    service['oldHeight'] = 150;
    service['drawService'].surfaceList[service['drawService'].indexList].width = 10;
    service['drawService'].surfaceList[service['drawService'].indexList].height = 20;
    service.keyUp(event);
    expect(service['isModified']).toBe(true);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].width).toBe(10);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].height).toBe(20);
  });

  it('setDimesions should set the right values when width and height for the Ellipse', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const event = new MouseEvent('click', {
      clientX: 200,
      clientY: 200
    });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].enumTool = EnumTool.Ellipse;
    service['canDraw'] = true;
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['setDimesions'](event);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).not.toBe(' ');
  });

  it('setDimesionsShift should set the right values when width and height positive and width < height', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const event = new MouseEvent('click', {
      clientX: 180,
      clientY: 200
    });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].enumTool = EnumTool.Ellipse;
    service['canDraw'] = true;
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['setDimesionsShift'](event);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).toBe(`M 50,115
    a 65,65 0 1,0 130,0,
    a 65,65 0 1,0 -130,0 `);
  });

  it('setDimesionsShift should set the right values when width and height negative', () => {
    const service: EllipseService = TestBed.get(EllipseService);
    const event = new MouseEvent('click', {
      clientX: 10,
      clientY: 20
    });
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].enumTool = EnumTool.Ellipse;
    service['canDraw'] = true;
    service['setDimesionsShift'](event);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).toBe(`M 50,35
    a -15,-15 0 1,0 -30,0,
    a -15,-15 0 1,0 30,0 `);
  });

});

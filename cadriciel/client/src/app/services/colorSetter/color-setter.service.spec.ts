
import { TestBed } from '@angular/core/testing';
import { Color } from 'src/app/Models/color';
import { TypeDessinEnum } from 'src/app/Models/enums';
import { Path } from 'src/app/Models/shapes/path';
import { ColorSetterService } from './color-setter.service';
// tslint:disable no-string-literal
let service: ColorSetterService;
describe('ColorSetterService', () => {
  beforeEach(() => {
    service = TestBed.get(ColorSetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#strokeShapeManager with RigthClick should update shape with stroke ', () => {
    const shape = new Path();
    service['colorPicker'].secondaryColor = new Color(0, 0, 0);
    shape.stroke = 'exist';
    spyOn(service['undoRedoService'], 'update');
    service['strokeShapeManager'](shape, true);
    expect(service['undoRedoService'].update).toHaveBeenCalled();
    expect(shape.stroke).toBe(service['colorPicker'].secondaryColor.getColor());
  });

  it('#strokeShapeManager with RigthClick should not update shape with no stroke ', () => {
    const shape = new Path();
    service['colorPicker'].secondaryColor = new Color();
    shape.stroke = 'none';
    spyOn(service['undoRedoService'], 'update');
    service['strokeShapeManager'](shape, true);
    expect(service['undoRedoService'].update).not.toHaveBeenCalled();
    expect(shape.stroke).toBe('none');
  });

  it('#strokeShapeManager with LeftClick should update shape with fill ', () => {
    const shape = new Path();
    service['colorPicker'].primaryColor = new Color();
    shape.fill = 'exist';
    spyOn(service['undoRedoService'], 'update');
    service['strokeShapeManager'](shape, false);
    expect(service['undoRedoService'].update).toHaveBeenCalled();
    expect(shape.fill).toBe(new Color().getColor());
  });

  it('#strokeShapeManager with LeftClick should not update shape with no fill', () => {
    const shape = new Path();
    service['colorPicker'].primaryColor = new Color();
    shape.fill = 'none';
    spyOn(service['undoRedoService'], 'update');
    service['strokeShapeManager'](shape, false);
    expect(service['undoRedoService'].update).not.toHaveBeenCalled();
    expect(shape.fill).toBe('none');
  });

  it('#mouseDownPath (right and left click) with CONTOUR shape should behave correctly', () => {
    const strokeSpy = jasmine.createSpy('strokeSpy', service['strokeShapeManager']);
    service['strokeShapeManager'] = strokeSpy;
    service['drawService'].surfaceList = [];
    const path: Path = new Path();
    path.id = 1;
    path.type = TypeDessinEnum.CONTOUR;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].surfaceList.push(path);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    document.body.appendChild(svg);

    service['element'] = svg;
    const click = document.createEvent('MouseEvent');
    click.initEvent('click');
    Object.defineProperty(click, 'target', {value: svg as SVGElement, writable: true});
    Object.defineProperty(click, 'button', {value : 2});
    spyOn(service['element'], 'getAttribute').and.returnValue('1');
    service.mouseDownPath(click);

    expect(service['element'].getAttribute).toHaveBeenCalled();
    expect(strokeSpy).toHaveBeenCalled();
    expect(strokeSpy.calls.mostRecent().args[0]).toEqual(path);
    expect(strokeSpy.calls.mostRecent().args[1]).toEqual(true);

    Object.defineProperty(click, 'button', {value : 0});
    service.mouseDownPath(click);
    expect(service['strokeShapeManager']).toHaveBeenCalled();
    expect(strokeSpy.calls.mostRecent().args[0]).toEqual(path);
    expect(strokeSpy.calls.mostRecent().args[1]).toEqual(false);
  });

  it('#mouseDownPath (wrong click value) with CONTOUR shape should behave correctly', () => {
    service['strokeShapeManager'] = jasmine.createSpy('strokeSpy');
    service['drawService'].surfaceList = [];
    const path: Path = new Path();
    path.id = 1;
    path.type = TypeDessinEnum.CONTOUR;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].surfaceList.push(path);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    document.body.appendChild(svg);

    service['element'] = svg;
    const click = document.createEvent('MouseEvent');
    click.initEvent('click');
    Object.defineProperty(click, 'target', {value: svg as SVGElement, writable: true});
    Object.defineProperty(click, 'button', {value : 3});
    spyOn(service['element'], 'getAttribute').and.returnValue('1');
    service.mouseDownPath(click);

    expect(service['element'].getAttribute).toHaveBeenCalled();
    expect(service['strokeShapeManager']).not.toHaveBeenCalled();
  });

  it('#mouseDownPath (left click) with no CONTOUR shape should behave correctly', () => {
    spyOn(service['colorPicker'].primaryColor, 'getColor').and.returnValue('rouge');
    spyOn(service['undoRedoService'], 'update');
    service['drawService'].surfaceList = [];
    const path: Path = new Path();
    path.id = 1;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].surfaceList.push(path);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    document.body.appendChild(svg);

    service['element'] = svg;
    const click = document.createEvent('MouseEvent');
    click.initEvent('click');
    Object.defineProperty(click, 'target', {value: svg as SVGElement, writable: true});
    Object.defineProperty(click, 'button', {value : 0});
    spyOn(service['element'], 'getAttribute').and.returnValue('1');
    service.mouseDownPath(click);

    expect(service['element'].getAttribute).toHaveBeenCalled();
    expect(service['colorPicker'].primaryColor.getColor).toHaveBeenCalled();
    expect(path.stroke).toEqual('rouge');
    expect(service['undoRedoService'].update).toHaveBeenCalled();
  });

  it('#mouseDownPath (right click) with no CONTOUR shape should behave correctly', () => {
    spyOn(service['colorPicker'].primaryColor, 'getColor').and.returnValue('rouge');
    spyOn(service['undoRedoService'], 'update');
    service['drawService'].surfaceList = [];
    const path: Path = new Path();
    path.id = 1;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].surfaceList.push(path);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    document.body.appendChild(svg);

    service['element'] = svg;
    const click = document.createEvent('MouseEvent');
    click.initEvent('click');
    Object.defineProperty(click, 'target', {value: svg as SVGElement, writable: true});
    Object.defineProperty(click, 'button', {value : 2});
    spyOn(service['element'], 'getAttribute').and.returnValue('1');
    service.mouseDownPath(click);

    expect(service['element'].getAttribute).toHaveBeenCalled();
    expect(service['colorPicker'].primaryColor.getColor).not.toHaveBeenCalled();
    expect(path.stroke).not.toEqual('rouge');
    expect(service['undoRedoService'].update).not.toHaveBeenCalled();
  });

  it('should update the hex color with an empty string', () => {
    const color = new Color();
    color.update('');
    expect(color.blueValue).toEqual(0);
    expect(color.redValue).toEqual(0);
    expect(color.greenValue).toEqual(0);
  });

});

import { TestBed } from '@angular/core/testing';

import { Color } from 'src/app/Models/color';
import { EnumTool } from 'src/app/Models/enums';
import { Path } from 'src/app/Models/shapes/path';
import { AerosolService } from './aerosol.service';
// tslint:disable no-string-literal
// tslint:disable no-magic-numbers
let service: AerosolService;
describe('AerosolService', () => {
  beforeEach(() => {
    service = TestBed.get(AerosolService);
    service['undoRedoService'].update = jasmine.createSpy('updateSpy').and.callFake((args: Color) => {
      return;
  });
});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('reset should reset the boolean attributes', () => {
    service['canDraw'] = true;
    service['hasLeft'] = true;
    service.reset();
    expect(service['canDraw']).toBe(false);
    expect(service['hasLeft']).toBe(false);
  });

  it('mouseLeave should set canDraw at false and hasLeft at true', () => {
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;
    service['canDraw'] = true;
    service['hasLeft'] = false;
    service.mouseLeave();
    expect(service['canDraw']).toBe(false);
    expect(service['hasLeft']).toBe(true);
  });

  it('mouseLeave shouldn"t do nothing', () => {
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;
    service.mouseLeave();
    expect(service['canDraw']).toBe(false);
    expect(service['hasLeft']).toBe(true);
  });
  it('mouseClick should drawSpay', () => {
    const event = new MouseEvent('mouseClick');
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;
    service['canDraw'] = true;
    service['hasLeft'] = false;
    service['draw'] = jasmine.createSpy('drawSpy');
    service.mouseClick(event);
    expect(service['canDraw']).toBe(false);
    expect(service['draw']).toHaveBeenCalled();
  });

  it('mouseClick shouldn"t drawSpay', () => {
    const event = new MouseEvent('mouseClick');
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;
    service['canDraw'] = false;
    service['hasLeft'] = true;
    service['draw'] = jasmine.createSpy('drawSpy');
    service.mouseClick(event);
    expect(service['canDraw']).toBe(false);
    expect(service['draw']).not.toHaveBeenCalled();
  });

  it('test mousedown when we are able to draw', () => {
    const event = new MouseEvent('mousedown');
    const path = new Path();
    const path2 = new Path();
    const path3 = new Path();
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;
    service['drawService'].surfaceList.push(path);
    service['drawService'].surfaceList.push(path2);
    service['drawService'].surfaceList.push(path3);
    service.mouseDown(event);
    expect(service['canDraw']).toBe(true);
    expect(service['drawService'].surfaceList.length).toBeGreaterThanOrEqual(3);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).not.toEqual('');
  });

  it('test mousedown when surfacelist.lenght > indexList', () => {
    const event = new MouseEvent('mousedown');

    service['drawService'].surfaceList.push(new Path());
    service['drawService'].indexList = 0;
    service['drawService'].indexList ++;
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;   service.mouseDown(event);
    expect(service['canDraw']).toBe(true);
    expect(service['drawService'].surfaceList.length).toBe(2);
    expect(service['drawService'].surfaceList[1]).toBeDefined();
  });

  it('test mouseMove when the user can draw', () => {
    const event = new MouseEvent('mousemove');
    service['canDraw'] = true;
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;
    service['draw'] = jasmine.createSpy('drawSpy');
    service.mouseMove(event);
    expect(service['draw']).toHaveBeenCalled();
  });

  it('test mouseMove when the user can"t draw ', () => {
    const event = new MouseEvent('mousemove');
    service['canDraw'] = false;
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;
    service['draw'] = jasmine.createSpy('drawSpy');
    service.mouseMove(event);
    expect(service['draw']).not.toHaveBeenCalled();
  });

  it('mouseUp should turn off the drawing', () => {

    service.mouseUp();
    expect(service['canDraw']).toBe(false);
  });

  it('test click if if not selected', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });
    service['drawService'].selectedTools = new Path();
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;
    service['draw'] = jasmine.createSpy('drawSpy');
    service.mouseMove(event);
    expect(service['draw']).not.toHaveBeenCalled();

  });

  it('test draw spray function', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });
    const path = new Path();
    service['drawService'].surfaceList.push(path);

    const couleur = new Color(100, 100, 100);
    service['colorPicker'].primaryColor = couleur;
    service['drawService'].selectedTools = new Path();

    service['drawService'].selectedTools.fill = 'none';
    service['drawService'].selectedTools.strokeLinecap = 'round';
    service['drawService'].selectedTools.strokeLinejoin = 'round';
    service['drawService'].selectedTools.speed = '10';

    service['draw'](event, 0);
    expect(service['drawService'].surfaceList[0].fill).toEqual('none');
    expect(service['drawService'].surfaceList[0].strokeLinecap).toEqual('round');
    expect(service['drawService'].surfaceList[0].speed).toEqual('10');
    expect(service['drawService'].surfaceList[0].strokeLinejoin).toEqual('round');
    expect(service['drawService'].surfaceList[0].stroke).toBe(couleur.getColor());
  });

  it('test ableToDraw if candraw is on', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });

    service['drawService'].selectedTools = new Path();
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;
    service['canDraw'] = false;
    service['draw'] = jasmine.createSpy('drawSpy');
    service.ableToDraw(event);
    expect(service['draw']).not.toHaveBeenCalled();
  });

  it('test ableToDraw if candraw is on', () => {
    const event = new MouseEvent('click', {
      clientX: 100,
      clientY: 100
    });

    service['drawService'].selectedTools = new Path();
    service['drawService'].selectedTools.enumTool = EnumTool.Aerosol;
    service['canDraw'] = false;
    service['draw'] = jasmine.createSpy('drawSpy');
    service.ableToDraw(event);
    expect(service['draw']).not.toHaveBeenCalled();
  });
});

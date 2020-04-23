import { TestBed } from '@angular/core/testing';
import { EnumTool } from 'src/app/Models/enums';
import { BasicObject } from 'src/app/Models/shapes/basic-object';
import { MapService } from '../maps/map.service';
import { DrawingServiceService } from './drawing-service.service';
// tslint:disable no-string-literal
describe('DrawingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers : [DrawingServiceService, MapService]
  }));

  it('should be created', () => {
    const service: DrawingServiceService = TestBed.get(DrawingServiceService);
    expect(service).toBeTruthy();
  });

  it('selectTool should select a tool', () => {
    const service: DrawingServiceService = TestBed.get(DrawingServiceService);
    service.enumTool = EnumTool.Pencil;
    service.selectTool();
    expect(service.selectedTools).toBeDefined();
  });

  it('getTools should get the current tool', () => {
    const service: DrawingServiceService = TestBed.get(DrawingServiceService);
    const select = service['maps'].toolsMap.get(EnumTool.Pencil);
    service.selectedTools = select ? select : new BasicObject();
    expect(service.selectedTools).toBe(service.getTools());

  });

  it('unselectTool should unselect the current tool', () => {
    const service: DrawingServiceService = TestBed.get(DrawingServiceService);
    const select = service['maps'].toolsMap.get(EnumTool.Pencil);
    service.selectedTools = select ? select : new BasicObject();
    service.unselectTool();
    expect(service.enumTool).toBe(0);
  });

  it('keyDown should fixe take the brush tool', () => {
    const service: DrawingServiceService = TestBed.get(DrawingServiceService);
    const e = new KeyboardEvent('keydown', {
      code : 'KeyW'
    });
    service.isModalOpen = false;
    service.keyDown(e);
    expect(service.enumTool).toEqual(EnumTool.Brush);
  });

  it('keyDown should fixe take the line', () => {
    const service: DrawingServiceService = TestBed.get(DrawingServiceService);

    const e = new KeyboardEvent('keydown', {
      code : 'KeyL'
    });
    service.isModalOpen = false;
    service.keyDown(e);
    expect(service.enumTool).toEqual(EnumTool.Line);
  });

  it('keyDown should fixe take nothing', () => {
    const service: DrawingServiceService = TestBed.get(DrawingServiceService);
    const e = new KeyboardEvent('keydown', {
      code : 'KeyL'
    });
    service.isModalOpen = true;
    service.keyDown(e);
    expect(service.enumTool).toEqual(EnumTool.Any);
  });

});

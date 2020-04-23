// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable no-any
import { TestBed } from '@angular/core/testing';

import { EnumTool, strokeTypeEnum } from 'src/app/Models/enums';
import { Path } from 'src/app/Models/shapes/path';
import { RectangleServiceService } from './rectangle-service.service';

let service: RectangleServiceService;
describe('RectangleServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [RectangleServiceService]
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(RectangleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('reset should reset the attributes to false', () => {
    service['canDraw'] = true;
    service['isModified'] = true;
    service['isInverted'] = true;
    service['isMoving'] = true;
    service['drawService'].visualisation = 'visual';
    service.reset();

    expect(service['canDraw']).toBe(false);
    expect(service['isModified']).toBe(false);
    expect(service['isInverted']).toBe(false);
    expect(service['isMoving']).toBe(false);
    expect(service['drawService'].visualisation).toBe('');
  });

  it('setStrokeType should set the right stroke type and call setStrokeColor', () => {
    const stroke: strokeTypeEnum = strokeTypeEnum.Contour;
    service.setStrokeType(stroke);

    expect(service['drawService'].selectedTools.strokeType).toBe(stroke);
  });

  it('mouseDown should set the canDraw attribute to true', () => {
    service['canDraw'] = false;
    service.mouseDown();
    expect(service['canDraw']).toBe(true);
  });

  it('setStrokeColor should set the stroke color to Contour', () => {
    service['drawService'].enumTool = EnumTool.Rectangle;
    const stroke: strokeTypeEnum = strokeTypeEnum.Contour;
    service.setStrokeType(stroke);

    expect(service['drawService'].selectedTools.fill).toBe('none');
    expect(service['drawService'].selectedTools.stroke).toBe('rgba(0 , 0 , 0 , 1)');
  });

  it('setStrokeColor should set the stroke color to Full', () => {
    service['drawService'].enumTool = EnumTool.Rectangle;
    const stroke: strokeTypeEnum = strokeTypeEnum.Full;
    service.setStrokeType(stroke);

    expect(service['drawService'].selectedTools.fill).toBe('rgba(0 , 0 , 0 , 1)');
    expect(service['drawService'].selectedTools.stroke).toBe('none');
  });

  it('setStrokeColor should set the stroke color to FullwithContour', () => {
    service['drawService'].enumTool = EnumTool.Rectangle;
    const stroke: strokeTypeEnum = strokeTypeEnum.FullWithContour;
    service.setStrokeType(stroke);

    expect(service['drawService'].selectedTools.fill).toBe('rgba(0 , 0 , 0 , 1)');
    expect(service['drawService'].selectedTools.stroke).toBe('rgba(0 , 0 , 0 , 1)');
  });

  it('setStrokeColor should set the stroke color to Any', () => {
    service['drawService'].enumTool = EnumTool.Rectangle;
    const stroke: strokeTypeEnum = strokeTypeEnum.Any;
    service.setStrokeType(stroke);

    expect().nothing();
  });

  it('mouseUp should set the attributes to false', () => {
    service['drawService'].visualisation = 'visualisation';
    service['canDraw'] = true;
    service['isModified'] = false;
    service['isMoving'] = true;
    service['undoRedoService'].update = jasmine.createSpy('update').and.callFake((args) => {
      return ;
    });
    service.mouseUp();

    expect(service['canDraw']).toBe(false);
    expect(service['isModified']).toBe(false);
    expect(service['isMoving']).toBe(false);
    expect(service['drawService'].visualisation).toBe('');
  });

  it('mouseUp should set the attributes to false and update the rectangle', () => {
    service['drawService'].visualisation = 'visualisation';
    service['canDraw'] = true;
    service['isModified'] = true;
    service['isMoving'] = true;
    const getUpdateSpy = spyOn(service['undoRedoService'], 'update');
    service.mouseUp();

    expect(service['canDraw']).toBe(false);
    expect(service['isModified']).toBe(false);
    expect(service['isMoving']).toBe(false);
    expect(service['drawService'].visualisation).toBe('');
    expect(getUpdateSpy).toHaveBeenCalled();
  });

  it('mouseUp should set the attributes to false and not update the rectangle', () => {
    service['drawService'].visualisation = 'visualisation';
    service['canDraw'] = true;
    service['isModified'] = true;
    service['isMoving'] = false;
    service.mouseUp();

    expect(service['canDraw']).toBe(false);
    expect(service['isModified']).toBe(false);
    expect(service['isMoving']).toBe(false);
    expect(service['drawService'].visualisation).toBe('');
  });

  it('keydown should modify the rectangle sizes with positive width and height', () => {
    const event = new KeyboardEvent('keydown', {
      shiftKey : true
    });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = true;
    service['isModified'] = false;
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['oldWidth'] = 140;
    service['oldHeight'] = 150;
    service.keyDown(event);
    expect(service['isModified']).toBe(true);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).toBe(' M 50 50 h 140 v 140 h -140 Z');
  });

  it('keydown should modify the rectangle sizes with negative width and height', () => {
    const event = new KeyboardEvent('keydown', {
      shiftKey : true
    });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = true;
    service['isModified'] = false;
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['oldWidth'] = -140;
    service['oldHeight'] = -150;
    service.keyDown(event);
    expect(service['isModified']).toBe(true);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).toBe(' M 50 50 h -140 v -140 h 140 Z');
  });

  it('keydown should not modify the rectangle sizes', () => {
    const event = new KeyboardEvent('keydown', {
      shiftKey : true
    });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = false;
    service['isModified'] = false;
    service['drawService'].enumTool = EnumTool.Rectangle;
    service['drawService'].surfaceList[service['drawService'].indexList].width = 100;
    service.keyDown(event);
    expect(service['isModified']).toBe(false);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].width).toBe(100);
  });

  it('keyup should modify the rectangle sizes', () => {
    const event = new KeyboardEvent('keyup');
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = true;
    service['isModified'] = true;
    service['drawService'].enumTool = EnumTool.Rectangle;
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['oldWidth'] = 100;
    service['oldHeight'] = 150;
    service.keyUp(event);
    expect(service['isModified']).toBe(false);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).toBe(' M 50 50 h 100 v 150 h -100 Z');
  });

  it('keyup should not modify the rectangle sizes', () => {
    const event = new KeyboardEvent('keyup');
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = false;
    service['isModified'] = true;
    service['drawService'].enumTool = EnumTool.Rectangle;
    service['oldWidth'] = 100;
    service['oldHeight'] = 150;
    service['drawService'].surfaceList[service['drawService'].indexList].width = 10;
    service['drawService'].surfaceList[service['drawService'].indexList].height = 20;
    service.keyUp(event);
    expect(service['isModified']).toBe(true);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].width).toBe(10);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].height).toBe(20);
  });

  it('mouseMove should do nothing', () => {
    const event = new MouseEvent('move', { });
    service['canDraw'] = false;
    service.mouseMove(event);
    expect().nothing();
  });

  it('mouseMove when isMoving is true and isModified is true', () => {
    const event = new MouseEvent('click', {
        clientX : 200,
        clientY : 200
      });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = true;
    service['isMoving'] = true;
    service['oldOriginX'] = 100;
    service['oldOriginY'] = 100;
    service['isModified'] = true;
    service.mouseMove(event);

    expect(service['oldHeight']).toBe(100);
    expect(service['oldWidth']).toBe(100);
  });

  it('mouseMove when isMoving is true and isModified is false', () => {
    const event = new MouseEvent('click', {
        clientX : 200,
        clientY : 200
      });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = true;
    service['isMoving'] = true;
    service['oldOriginX'] = 100;
    service['oldOriginY'] = 100;
    service['isModified'] = false;
    service.mouseMove(event);

    expect(service['oldHeight']).toBe(100);
    expect(service['oldWidth']).toBe(100);
  });

  it('mouseMove when isMoving is false and isModified is false and 1 > 2', () => {
    const event = new MouseEvent('click', {
        clientX : 200,
        clientY : 200
      });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = true;
    service['isMoving'] = false;
    service['oldOriginX'] = 100;
    service['oldOriginY'] = 100;
    service['isModified'] = true;
    service.mouseMove(event);
    expect(service['drawService'].indexList).toBe(1);
  });

  it('mouseMove when isMoving is false and isModified is false and 1 < 2', () => {
    const event = new MouseEvent('click', {
        clientX : 200,
        clientY : 200
      });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].surfaceList.length = 0;
    service['canDraw'] = true;
    service['isMoving'] = false;
    service['oldOriginX'] = 100;
    service['oldOriginY'] = 100;
    service['isModified'] = true;
    service.mouseMove(event);

    expect(service['drawService'].indexList).toBe(0);
  });

  it('setDimesions should set the right values when width and height for the rectangle', () => {
    const event = new MouseEvent('click', {
      clientX : 200,
      clientY : 200
    });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].enumTool = EnumTool.Rectangle;
    service['canDraw'] = true;
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['setDimesions'](event);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).toBe(' M 50 50 h 150 v 150 h -150 Z');
  });

  it('setDimesionsShift should set the right values when width and height positive', () => {
    const event = new MouseEvent('click', {
      clientX : 180,
      clientY : 200
    });
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].enumTool = EnumTool.Rectangle;
    service['canDraw'] = true;
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['setDimesionsShift'](event);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).toBe(' M 50 50 h 130 v 130 h -130 Z');
  });

  it('setDimesionsShift should set the right values when width and height negative', () => {
    const event = new MouseEvent('click', {
      clientX : 10,
      clientY : 20
    });
    service['oldOriginX'] = 50;
    service['oldOriginY'] = 50;
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].enumTool = EnumTool.Rectangle;
    service['canDraw'] = true;
    service['setDimesionsShift'](event);
    expect(service['drawService'].surfaceList[service['drawService'].indexList].d).toBe(' M 50 50 h -30 v -30 h 30 Z');
  });

  it('mouseLeave should modify attributs canDraw and pop rectangle', () => {
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = true;
    service['drawService'].enumTool = EnumTool.Rectangle;
    service['drawService'].indexList = 1;
    service.mouseLeave();
    expect(service['canDraw']).toBe(false);
    expect(service['drawService'].indexList).toBe(0);
  });

  it('mouseLeave should not modify attributs canDraw nor pop rectangle', () => {
    service['drawService'].indexList = 0;
    service['drawService'].surfaceList.push(new Path());
    service['canDraw'] = false;
    service['drawService'].enumTool = EnumTool.Brush;
    service['drawService'].indexList = 1;
    service.mouseLeave();
    expect(service['canDraw']).toBe(false);
    expect(service['drawService'].indexList).toBe(1);
  });
// tslint:disable-next-line: max-file-line-count
});

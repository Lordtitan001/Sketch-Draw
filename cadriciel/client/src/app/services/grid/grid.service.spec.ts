import { TestBed } from '@angular/core/testing';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { GridService } from './grid.service';
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
describe('GridService', () => {
  let service: GridService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [DrawingServiceService, ColorPickerService]

  }));

  beforeEach(() => {
    service = TestBed.get(GridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('testing resetFunction grid should not appear' , () => {
    service.reset();
    expect(service['drawService'].grid.gridContent).toEqual('');
  });

  it('testing makeGrid', () => {
    service['drawService'].grid.gridImage = 'grid_off';
    service.width = 10;
    service.height = 10;
    service.thickness = 5;

    service.makeGrid();
    const horizontalPath = ' M 0 0  L 10 0  M 0 5  L 10 5  M 0 10 ';
    const verticalPath = ' M 0 0  L 0 10  M 5 0  L 5 10  M 10 0 ';
    expect(service['drawService'].grid.gridImage).toEqual('grid_on');
    expect(service['drawService'].grid.gridContent).toEqual(horizontalPath + verticalPath);

  });

  it('testing changeSize with key- square size must dicrease.', () => {
    service['drawService'].grid.gridImage = 'grid_off';
    service.width = 300;
    service.height = 300;
    service.thickness = 72;
    spyOn(service, 'makeGrid');
    const keyEvent = new KeyboardEvent('keyup', {
      key: '-'
    });
    for (let i = 0; i < 5; i++) {
      service.changeSize(keyEvent);
    }
    expect(service.thickness).toEqual(50);
    expect(service.makeGrid).toHaveBeenCalledTimes(5);

  });

  it('testing changeSize with key+ square size must increase.', () => {
    service['drawService'].grid.gridImage = 'grid_off';
    service.width = 300;
    service.height = 300;
    service.thickness = 72;
    spyOn(service, 'makeGrid');
    const keyEvent = new KeyboardEvent('keyup', {
      key: '+'
    });
    for (let i = 0; i < 5; i++) {
      service.changeSize(keyEvent);
    }
    expect(service.thickness).toEqual(95);
    expect(service.makeGrid).toHaveBeenCalledTimes(5);

  });

});

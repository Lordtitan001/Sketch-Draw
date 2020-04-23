import { Color } from 'src/app/Models/color';
import { ColorPickerService } from './color-picker.service';
// tslint:disable : no-magic-numbers
let service: ColorPickerService;

describe('ColorPickerService', () => {
  beforeEach(() => {
    service = new ColorPickerService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#confirmBackgroundColor should return false if isTool is true', () => {
    service.isTool = true;
    expect(service.confirmBackGroundColor()).toBe(false);
  });

  it('#confirmBackgroundColor should return true if isTool is false', ( ) => {
    service.isTool = false;
    expect(service.confirmBackGroundColor()).toBe(true);
  });

  it('#confirmBackGroundColor should modify backgroundColor and previewColor if is isTool is false', () => {
    service.isTool = false;
    service.previewColor = new Color(10, 10, 10);
    service.backGroundColor = new Color(5, 5, 5);

    const returnValue: boolean = service.confirmBackGroundColor();
    expect(service.backGroundColor.getColor()).toBe(new Color(10, 10, 10).getColor());
    expect(service.previewColor.getColor()).toBe(new Color(0, 0, 0).getColor());
    expect(returnValue).toBe(true);
  });

  it('#confirmBackGroundColor should not modify backGroundColor and previewColor if isTool is true', () => {
    service.isTool = true;
    service.previewColor = new Color(10, 10, 10);
    service.backGroundColor = new Color(5, 5, 5);

    const returnValue: boolean = service.confirmBackGroundColor();
    expect(service.backGroundColor.getColor()).toBe(new Color(5, 5, 5).getColor());
    expect(service.previewColor.getColor()).toBe(new Color(10, 10, 10).getColor());
    expect(returnValue).toBe(false);
  });

  it('#confirmColor should modify primaryColor and secondaryColor and call updateLastUsedColor correctly', () => {
    service.previewColor = new Color(10, 10, 10);
    service.primaryColor = new Color(5, 5, 5);
    service.secondaryColor = new Color(15, 15, 15);
    spyOn(service, 'updateLastColorUsed');
    service.confirmColor(true);
    expect(service.primaryColor.getColor()).toBe(service.previewColor.getColor());
    expect(service.updateLastColorUsed).toHaveBeenCalledWith(service.primaryColor);
    service.confirmColor(false);
    expect(service.secondaryColor.getColor()).toBe(service.previewColor.getColor());
    expect(service.updateLastColorUsed).toHaveBeenCalledWith(service.secondaryColor);
  });

  it('#inverseColor should inverse primaryColor and secondaryColor and update correctly previewColor', () => {
    service.primaryColor = new Color(5, 5, 5);
    service.secondaryColor = new Color(10, 10, 10);
    service.isFirstColorSelected = true;
    service.inverseColor();
    expect(service.primaryColor.getColor()).toBe(new Color(10, 10, 10).getColor());
    expect(service.secondaryColor.getColor()).toBe(new Color(5, 5, 5).getColor());
    expect(service.previewColor.getColor()).toBe(new Color(10, 10, 10).getColor());

    service.primaryColor = new Color(5, 5, 5);
    service.secondaryColor = new Color(10, 10, 10);
    service.isFirstColorSelected = false;
    service.inverseColor();

    expect(service.primaryColor.getColor()).toBe(new Color(10, 10, 10).getColor());
    expect(service.secondaryColor.getColor()).toBe(new Color(5, 5, 5).getColor());
    expect(service.previewColor.getColor()).toBe(new Color(5, 5, 5).getColor());

  });

  it('#updateLastColorUsed should return false if we try to put an existing value ', () => {
    let expected: boolean = service.updateLastColorUsed(new Color(255, 0, 0, 1));
    expect(expected).toBe(false);
    expect(service.lastTenColors.length).toBe(10);
    expected = service.updateLastColorUsed(new Color(255, 0, 0, 0.5));
    expect(expected).toBe(false);
    expect(service.lastTenColors.length).toBe(10);
  });

  it('#updateLastColorUsed should add new colors', () => {
    let expected: boolean = service.updateLastColorUsed(new Color(255, 23, 19, 1));
    expect(expected).toBe(true);
    expect(service.lastTenColors.length).toBe(10);
    expect(service.lastTenColors[0].getColor()).toBe(new Color(255, 23, 19, 1).getColor());

    expected = service.updateLastColorUsed(new Color(255, 23, 39, 1));
    expect(expected).toBe(true);
    expect(service.lastTenColors.length).toBe(10);
    expect(service.lastTenColors[0].getColor()).toBe(new Color(255, 23, 39, 1).getColor());
    expect(service.lastTenColors[1].getColor()).toBe(new Color(255, 23, 19, 1).getColor());
  });

});

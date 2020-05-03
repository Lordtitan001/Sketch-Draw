import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, MatSliderModule } from '@angular/material';
import { Color } from 'src/app/Models/color';
import { ColorPickerService } from 'src/app/services/color-picker/color-picker.service';
import { FormControlService } from 'src/app/services/from-control/form-control.service';
import { ColorPickerComponent } from './color-picker.component';
// tslint:disable no-string-literal
// tslint:disable : no-magic-numbers
// tslint:disable : no-any
// tslint:disable : max-file-line-count
describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;

    const dialogMock = {
        close: () => {
            return;
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatSliderModule, ReactiveFormsModule, FormsModule, MatDialogModule],
            declarations: [ColorPickerComponent],
            providers: [ColorPickerService, FormControlService, { provide: MatDialogRef, useValue: dialogMock }, MatDialog,
                { provide: MAT_DIALOG_DATA, useValue: {} }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
        localStorage.clear();
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#afterViewInit should call makeRGCanevas et makeBCanvas', () => {
        component['makeRGCanvas'] = jasmine.createSpy('rgSpy');
        component['makeBCanvas'] = jasmine.createSpy('bSpy');
        component.ngAfterViewInit();

        expect(component['makeRGCanvas']).toHaveBeenCalled();
        expect(component['makeBCanvas']).toHaveBeenCalledWith(component['pickerService'].previewColor.blueValue);

    });

    it('#afterViewInit should do nothing on null value', () => {
        spyOn((component['rgCanevas'].nativeElement), 'getContext').and.callFake(() => {
            return null;
        }
        );
        component['makeRGCanvas'] = jasmine.createSpy('rgSpy');
        component['makeBCanvas'] = jasmine.createSpy('bSpy');
        component.ngAfterViewInit();
        expect(component['makeRGCanvas']).not.toHaveBeenCalled();
        expect(component['makeBCanvas']).not.toHaveBeenCalled();
    });

    it('#inverseColor should call pickerService.inverseColor() and canevasUpdate()', () => {
        spyOn(component['pickerService'], 'inverseColor');
        component['canevasUpdate'] = jasmine.createSpy('updateSpy');
        component['inverseColor']();
        expect(component['pickerService'].inverseColor).toHaveBeenCalled();
        expect(component['canevasUpdate']).toHaveBeenCalled();

    });

    it('#inverseColor (of the color object) should modify the opacity correctly ', () => {
        component['pickerService'].previewColor = new Color();
        let result = component['pickerService'].previewColor.inverseColor();
        let expected = 0.2;
        expect(result.opacityValue).toBe(expected);
        component['pickerService'].previewColor = new Color(10, 10, 10, 0.5);
        result = component['pickerService'].previewColor.inverseColor();
        expected = 1;
        expect(result.opacityValue).toBe(expected);
    });

    it('#getColorHex (of the color object) should transform the color values to string with always 6 caracters', () => {
        component['pickerService'].previewColor = new Color(0, 0, 0);
        let result = component['pickerService'].previewColor.getColorHex();
        expect(result.length).toBe(6);

        component['pickerService'].previewColor = new Color(0, 255, 0);
        result = component['pickerService'].previewColor.getColorHex();
        expect(result.length).toBe(6);

        component['pickerService'].previewColor = new Color(255, 0, 0);
        result = component['pickerService'].previewColor.getColorHex();
        expect(result.length).toBe(6);

        component['pickerService'].previewColor = new Color(0, 0, 255);
        result = component['pickerService'].previewColor.getColorHex();
        expect(result.length).toBe(6);
    });

    it('#update (of the color object) should update the color', () => {
        const color = new Color(0, 0, 0);
        color.update('FFFFFF');
        expect(color.redValue).toBe(255);
        expect(color.greenValue).toBe(255);
        expect(color.blueValue).toBe(255);

        color.update('000000');
        expect(color.redValue).toBe(0);
        expect(color.greenValue).toBe(0);
        expect(color.blueValue).toBe(0);

    });

    it('#setBackGroundColor should update the backGroundColor of newService', () => {
        component['newService'].backgroundColor = new Color(10, 10, 10);
        component['pickerService'].previewColor = new Color(15, 15, 15);
        component['setBackGroungColor']();
        expect(component['newService'].backgroundColor.getColor()).toBe(component['pickerService'].previewColor.getColor());
    });

    it('#makeRGCanevas should create and put an image in rgContext', () => {

        spyOn(component['rgContext'], 'putImageData');
        spyOn(component['rgContext'], 'createImageData').and.callFake(() => {
            return new ImageData(256, 256);
        }
        );
        component['makeRGCanvas']();
        expect(component['rgContext'].putImageData).toHaveBeenCalled();
        expect(component['rgContext'].createImageData).toHaveBeenCalled();
    });

    it('#makeBCanvas should call all his functions', () => {
        spyOn(component['bContext'], 'createImageData').and.callFake(() => {
            return new ImageData(30, 256);
        }
        );
        spyOn(component['bContext'], 'putImageData');
        spyOn(component['bContext'], 'beginPath');
        spyOn(component['bContext'], 'rect');
        spyOn(component['bContext'], 'stroke');
        spyOn(component['bContext'], 'closePath');

        component['makeBCanvas'](component['pickerService'].previewColor.blueValue);
        expect(component['bContext'].createImageData).toHaveBeenCalled();
        expect(component['bContext'].putImageData).toHaveBeenCalled();
        expect(component['bContext'].beginPath).toHaveBeenCalled();

        expect(component['bContext'].rect).toHaveBeenCalledWith
            (0, 255 - component['pickerService'].previewColor.blueValue - 5, 30, 10);
        expect(component['bContext'].stroke).toHaveBeenCalled();
        expect(component['bContext'].closePath).toHaveBeenCalled();
    });

    it('#canevasUpdate should call all his functions', () => {
        component['makeRGCanvas'] = jasmine.createSpy('rgSpy');
        component['makeBCanvas'] = jasmine.createSpy('bSpy');

        spyOn(component['rgContext'], 'putImageData');
        spyOn(component['rgContext'], 'getImageData').and.callFake(() => {
            return new ImageData(256, 256);
        }
        );

        component['canevasUpdate']();

        expect(component['makeRGCanvas']).toHaveBeenCalled();
        expect(component['rgContext'].putImageData).toHaveBeenCalled();
        expect(component['rgContext'].getImageData).toHaveBeenCalled();
        expect(component['makeBCanvas']).toHaveBeenCalledWith(component['pickerService'].previewColor.blueValue);

    });

    it('#onBloxClikc update correctly the colorPicker when the second parameter is false', () => {
        component['canevasUpdate'] = jasmine.createSpy('updateSpy');
        component['pickerService'].isFirstColorSelected = false;
        component['onBoxClick'](true, false, component['pickerService'].secondaryColor, component['pickerService'].primaryColor);

        expect(component['pickerService'].primaryColor.getColor()).
            toBe(component['pickerService'].secondaryColor.getColor());
        expect(component['canevasUpdate']).toHaveBeenCalled();
        expect(component['pickerService'].isFirstColorSelected).toBe(true);

    });

    it('#onBoxClick should update correctly the colorPicker when the second parameter is true', () => {
        component['canevasUpdate'] = jasmine.createSpy('updateSpy');
        component['pickerService'].isFirstColorSelected = true;
        component['pickerService'].primaryColor = new Color(10, 10, 10);
        component['onBoxClick'](false, true, component['pickerService'].secondaryColor,
            component['pickerService'].primaryColor);

        expect(component['pickerService'].previewColor.getColor()).toBe(component['pickerService'].secondaryColor.getColor());
        expect(component['canevasUpdate']).toHaveBeenCalled();
        expect(component['pickerService'].isFirstColorSelected).toBe(false);
        expect(component['pickerService'].primaryColor.getColor()).not.toBe(component['pickerService'].secondaryColor.getColor());
    });

    it('#confirmColor should call cofirmBackGroundColor(return true) and close the dialog ', () => {
        spyOn(component['pickerService'], 'confirmBackGroundColor').and.callFake(() => {
            return true;
        }
        );
        spyOn(component['pickerService'], 'confirmColor');
        spyOn(component['dialogRef'], 'close');

        component['confirmColor'](false);
        expect(component['pickerService'].confirmBackGroundColor).toHaveBeenCalled();
        expect(component['dialogRef'].close).toHaveBeenCalled();
        expect(component['pickerService']['confirmColor']).not.toHaveBeenCalled();

    });

    it('#confirmColor should call confirmBackGroundColor(return false) and call confirmColor', () => {
        spyOn(component['pickerService'], 'confirmBackGroundColor').and.callFake(() => {
            return false;
        }
        );
        spyOn(component['pickerService'], 'confirmColor');
        spyOn(component['dialogRef'], 'close');

        component['confirmColor'](true);
        expect(component['pickerService'].confirmBackGroundColor).toHaveBeenCalled();
        expect(component['pickerService']['confirmColor']).toHaveBeenCalledWith(true);
        component['confirmColor'](false);
        expect(component['pickerService'].confirmBackGroundColor).toHaveBeenCalled();
        expect(component['pickerService'].confirmColor).toHaveBeenCalledWith(false);
        expect(component['dialogRef'].close).toHaveBeenCalled();
    });

    it('#onMouseMove should updateValue redValue and greenValue and handle bad values when isCanevasOn is true', () => {
        component['canevasUpdate'] = jasmine.createSpy('updateSpy');

        component['pickerService'].isCanevasOn = true;
        component['pickerService'].isBlueSliderOn = false;
        let mouseMoveEvent: MouseEvent = new MouseEvent('mousemove', { clientX: 300, clientY: 300 });
        component['pickerService'].previewColor.greenValue = 0;
        component['pickerService'].previewColor.redValue = 0;
        component['pickerService'].previewColor.blueValue = 0;
        component['onMouseMove'](mouseMoveEvent);

        expect(component['pickerService'].previewColor.greenValue).toBe(255);
        expect(component['pickerService'].previewColor.redValue).toBe(255);
        expect(component['pickerService'].previewColor.blueValue).toBe(0);
        expect(component['canevasUpdate']).not.toHaveBeenCalled();

        mouseMoveEvent = new MouseEvent('mousemove', { clientX: 10, clientY: 10 });
        component['onMouseMove'](mouseMoveEvent);
        expect(component['pickerService'].previewColor.greenValue).toBe(10);
        expect(component['pickerService'].previewColor.redValue).toBe(10);
        expect(component['pickerService'].previewColor.blueValue).toBe(0);

        component['pickerService'].isCanevasOn = false;
        mouseMoveEvent = new MouseEvent('mousemove', { clientX: 212, clientY: 212 });
        component['onMouseMove'](mouseMoveEvent);
        expect(component['pickerService'].previewColor.greenValue).toBe(10);
        expect(component['pickerService'].previewColor.redValue).toBe(10);
        expect(component['pickerService'].previewColor.blueValue).toBe(0);
        expect(component['canevasUpdate']).not.toHaveBeenCalled();

    });

    it('#onMouseMove should update blueValue,call canevasUpdate when isBlueSliderOn is true', () => {
        component['canevasUpdate'] = jasmine.createSpy('updateSpy');
        component['pickerService'].isBlueSliderOn = true;
        component['pickerService'].isCanevasOn = false;
        component['pickerService'].previewColor = new Color(255, 255, 0);
        let mouseMoveEvent: MouseEvent = new MouseEvent('mousemove', { clientX: 212, clientY: 212 });
        component['onMouseMove'](mouseMoveEvent);

        expect(component['pickerService'].previewColor.greenValue).toBe(255);
        expect(component['pickerService'].previewColor.redValue).toBe(255);
        expect(component['pickerService'].previewColor.blueValue).toBe(255 - (212));
        expect(component['canevasUpdate']).toHaveBeenCalled();

        mouseMoveEvent = new MouseEvent('mousemove', { clientX: 10, clientY: 212 });
        component['onMouseMove'](mouseMoveEvent);
        expect(component['pickerService'].previewColor.greenValue).toBe(255);
        expect(component['pickerService'].previewColor.redValue).toBe(255);
        expect(component['pickerService'].previewColor.blueValue).toBe(255 - (212));
    });

    it('#update (of the color object) should convert properly HEX string to color value ', () => {
        component['pickerService'].previewColor.update('FFFFFF');
        expect(component['pickerService'].previewColor.getColor()).toBe(new Color(255, 255, 255).getColor());

        component['pickerService'].previewColor.update('000000');
        expect(component['pickerService'].previewColor.getColor()).toBe(new Color(0, 0, 0).getColor());
    });

    it('#setColor should do nothing if form is null', () => {
        spyOn<any>(component['formService'].formGroup, 'get').and.callFake(() => {
            return false;
        });

        component['canevasUpdate'] = jasmine.createSpy('updateSpy');
        component['setColor']();
        expect(component['canevasUpdate']).not.toHaveBeenCalled();
    });

    it('#setColor should call setValue only if the form has an error', () => {
        const formMock = {
            hasError: (e) => {
                return true;
            },
            setValue: (e) => {
                return;
            },
        };

        spyOn<any>(component['formService'].formGroup, 'get').and.callFake(() => {
            return formMock;
        }
        );
        spyOn(formMock, 'setValue');
        component['canevasUpdate'] = jasmine.createSpy('updateSpy');

        component['setColor']();
        expect(formMock.setValue).toHaveBeenCalled();
        expect(component['canevasUpdate']).not.toHaveBeenCalled();

    });

    it('#setColor sould call setValue,canevasUpdate and update if the form has no error ', () => {
        const formMock = {
            value: String,
            hasError: (e) => {
                return false;
            },
            setValue: (e) => {
                return;
            }
        };

        spyOn(component['pickerService'].previewColor, 'update').and.callFake(() => {
            return;
        });
        spyOn<any>(component['formService'].formGroup, 'get').and.callFake(() => {
            return formMock;
        }
        );

        spyOn(formMock, 'hasError');
        component['canevasUpdate'] = jasmine.createSpy('updateSpy');
        spyOn(formMock, 'setValue');

        component['setColor']();

        expect(component['pickerService'].previewColor.update).toHaveBeenCalled();
        expect(component['canevasUpdate']).toHaveBeenCalled();
        expect(formMock.hasError).toHaveBeenCalled();
        expect(formMock.setValue).toHaveBeenCalled();
    });
});

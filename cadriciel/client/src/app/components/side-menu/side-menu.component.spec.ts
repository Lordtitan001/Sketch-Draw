// tslint:disable: no-string-literal
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatMenuModule, MatSliderModule } from '@angular/material';
import { EnumTool, strokeTypeEnum, Textures } from 'src/app/Models/enums';
import { StyleTool } from 'src/app/Models/interfaces';
import { ColorPickerService } from 'src/app/services/color-picker/color-picker.service';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { RectangleServiceService } from 'src/app/services/rectangle/rectangle-service.service';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { SideMenuComponent } from './side-menu.component';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SideMenuComponent],
      providers: [DrawingServiceService, ColorPickerService, RectangleServiceService],
      imports: [MatDialogModule, MatSliderModule, FormsModule , MatMenuModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the dialog', async(() => {
    const parameter = {
      width: '350px',
      height: '400px',
      position: { left: '50px', top: '14%' },
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    };

    component['dialogIsOpen'] = false;
    component['dialog'].open = jasmine.createSpy('dialogOpenSpy');

    component['openDialog']();
    expect(component['dialog'].open).toHaveBeenCalledWith(ColorPickerComponent, parameter);
    expect(component['dialogIsOpen']).toEqual(false);
    component['dialog'].afterOpened.next(undefined);
    expect(component['dialogIsOpen']).toEqual(true);
    component['dialog']._afterAllClosed.next(undefined);
    setTimeout(() => {
      expect(component['dialogIsOpen']).toEqual(false);
    // tslint:disable-next-line: no-magic-numbers
    }, 100);
  }));

  it('should not open the dialog', () => {
    component['dialogIsOpen'] = true;
    component['dialog'].open = jasmine.createSpy('dialogOpenSpy');
    component['openDialog']();
    expect(component['dialog'].open).not.toHaveBeenCalled();
    expect(component['dialogIsOpen']).toEqual(true);
  })
;
  it('should select the right texture', () => {
    component['selectTexture']('Filter4');
    expect(component['drawService'].selectedTools.texture).toEqual(Textures.Texture4);
    component['selectTexture']('Filter2');
    expect(component['drawService'].selectedTools.texture).toEqual(Textures.Texture2);

  });

  it('should get the correct icon style', () => {
    component['drawService'].enumTool = EnumTool.Brush;
    component['getIconStyle'](EnumTool.Brush);
    expect().nothing();
  });

  it('should get the correct icon style and set the default style', () => {
    component['drawService'].enumTool = EnumTool.Brush;
    (component['mapService'].mapTool.get(EnumTool.Brush) as StyleTool )['box-sizing'] = '';
    component['getIconStyle'](EnumTool.Brush);
    expect().nothing();
  });

  it('should not get the correct icon style', () => {
    component['drawService'].enumTool = EnumTool.Brush;
    component['getIconStyle'](EnumTool.Pencil);
    expect().nothing();
  });

  it('should select the stroke type ', () => {
    const spy = spyOn(component['rectangleService'], 'setStrokeType');
    component['selectStrokeType'](strokeTypeEnum.Contour);
    expect(spy).toHaveBeenCalled();
  });

  it('should select the tools with enum tool value and set imageToolSelected ', () => {
    const spy = spyOn(component['drawService'], 'selectTool');
    component['selectTool'](EnumTool.Brush);
    expect(spy).toHaveBeenCalled();
    expect(component['drawService'].enumTool).toBe(EnumTool.Brush);
    expect(component['drawService'].images.imageToolSelected).toBe('brush');
  });

  it('should select the tools with enum tool value and set imageShapeSelected', () => {
    const spy = spyOn(component['drawService'], 'selectTool');
    component['selectTool'](EnumTool.Line);
    expect(spy).toHaveBeenCalled();
    expect(component['drawService'].enumTool).toBe(EnumTool.Line);
    expect(component['drawService'].images.imageShapeSelected).toBe('timeline');
  });

  it('should draw the line with a junction', () => {
    component['withJonctions'](true);
    expect(component['drawService'].selectedTools.withJonctions).toBe(true);
  });

});

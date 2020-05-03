// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatFormFieldModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { WindowSize } from 'src/app/Models/interfaces';
import { Data } from 'src/app/Models/modal-data';
import { ColorPickerService } from 'src/app/services/color-picker/color-picker.service';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { FormControlService } from 'src/app/services/from-control/form-control.service';
import { UndoRedoService } from 'src/app/services/undoRedo/undo-redo.service';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { DrawingModalComponent } from './drawing-modal.component';

describe('DrawingModalComponent', () => {
  let component: DrawingModalComponent;
  let fixture: ComponentFixture<DrawingModalComponent>;
  const parameter = {
    width: '400px',
    position: { left: '40%', top: '20%' },
    hasBackdrop: true,
    data: {
      name: 'Untitled',
      color: '',
      width: window.innerWidth,
      height: window.innerHeight,
      isDirty: false,
      isCreated: false
    }
  };

  const width = {
    setValue(value: number): void {
      return;
    }
  };
  const height = {
    setValue(value: number): void {
      return;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrawingModalComponent],
      providers: [FormControlService, DrawingServiceService, ColorPickerService, UndoRedoService, MatDialog,
        { provide: MAT_DIALOG_DATA, useValue: {} }],
      imports: [BrowserAnimationsModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingModalComponent);
    component = fixture.componentInstance;
    component['dialog'].closeAll = jasmine.createSpy('closeSpy');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute fonction OnNoclick', () => {
    component['dialog'].closeAll = jasmine.createSpy('closeSpy');
    component['onNoClick']();
    expect(component['dialog'].closeAll).toHaveBeenCalled();
    expect(component['newService'].isModalOpen).toEqual(false);
    expect(component['drawService'].isModalOpen).toEqual(false);
  });

  it('Fonction new Page', () => {
    component['dialog'].open = jasmine.createSpy('openSpy');
    component['onNoClick'] = jasmine.createSpy('noClickSpy');
    component['newPage']();
    expect(component['dialog'].closeAll).toHaveBeenCalled();
    expect(component['dialog'].open).toHaveBeenCalledWith(DrawingModalComponent, parameter);
    component['dialog']._afterAllClosed.next(undefined);
    setTimeout(() => {
      expect(component['colorPicker'].isTool).toEqual(true);
      expect(component['onNoClick']).toHaveBeenCalled();
    }, 100);

  });

  it('should execute fonction openDialog', () => {
    const parameter2 = {
      width: '350px',
      height: '400px',
      position: { left: '45%', top: '16%' },
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    };
    component['dialogIsOpen'] = false;
    spyOn(component['dialog'], 'open');
    component['openDialog']();
    expect(component['dialog'].open).toHaveBeenCalledWith(ColorPickerComponent, parameter2);
  });

  it('should switch in the differents case in onValueChange', () => {
    const val = component['formService'].formGroup.get('width');
    const val2 = component['formService'].formGroup.get('height');
    component['data'].width = 50;
    component['data'].height = 50;
    if (val) {
      val.setValue(10);
      component['onValueChange']('width');
      expect(component['data'].width).toEqual(10);
      expect(component['newService'].isLarger).toEqual(false);
    }
    if (val2) {
      val2.setValue(20);
      component['onValueChange']('height');
      expect(component['data'].height).toEqual(20);
      expect(component['newService'].isHigher).toEqual(false);
    }
    component['onValueChange']('width');
    expect(component['newService'].canResize).toEqual(false);

  });

  it('should switch in the differents else in onValueChange', () => {
    const val = component['formService'].formGroup.get('width');
    const val2 = component['formService'].formGroup.get('height');
    component['data'].width = 50;
    component['data'].height = 50;
    if (val) {
      val.setValue(-10);
      component['onValueChange']('width');
      expect(component['data'].width).toEqual(50);
      expect(component['newService'].isLarger).toEqual(false);
    }
    if (val2) {
      val2.setValue(-20);
      component['onValueChange']('height');
      expect(component['data'].height).toEqual(50);
      expect(component['newService'].isHigher).toEqual(false);
    }

  });

  it('should not make the switch', () => {
    component['formService'].formGroup.get = jasmine.createSpy('formSpy');
    component['onValueChange']('justATest');
    expect(component['formService'].formGroup.get).toHaveBeenCalledWith('justATest');
    expect(component['formService'].formGroup.get('justATest')).toBeUndefined();
  });

  it('should create a new design page', () => {
    component['data'] = new Data();
    component['dialog'].closeAll = jasmine.createSpy('closeSpy');
    component['newService'].reset = jasmine.createSpy('resetSpy');
    component['router'].navigate = jasmine.createSpy('navigateSpy');
    spyOn(component['router'], 'navigateByUrl').and.callFake(async () => {
      component['newService'].reset();
      component['router'].navigate(['home']);
      return Promise.resolve(true);
    });
    component['newDesign']();
    expect(component['data'].isCreated).toEqual(true);
    expect(component['newService'].modalData).toEqual(component['data']);
    expect(component['newService'].isHigher).toEqual(false);
    expect(component['newService'].isLarger).toEqual(false);
    expect(component['dialog'].closeAll).toHaveBeenCalled();
    expect(component['newService'].isModalOpen).toEqual(false);
    expect(component['drawService'].isModalOpen).toEqual(false);
    expect(component['newService'].reset).toHaveBeenCalled();
    expect(component['router'].navigate).toHaveBeenCalledWith(['home']);
  });

  it('should create execute and resize the window onInit', async(() => {

    spyOn<any>(component['formService'].formGroup, 'get')
      .and.callFake((value: string) => {
        return (value === 'height') ? height : width;
      });
    component.ngOnInit();
    const spy1 = spyOn(width, 'setValue');
    const spy2 = spyOn(height, 'setValue');
    expect(component['newService'].canResize).toEqual(true);
    const windowSize: WindowSize = { width: 10000, height: 10000};
    window.dispatchEvent(new Event('resize'));
    component['newService'].windowsEvent.next(windowSize);
    setTimeout(() => {
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    }, 100);
  }));

  it('should create execute and not resize the window onInit', () => {

    spyOn<any>(component['formService'].formGroup, 'get')
    .and.callFake((value: string) => {
      return (value === 'height') ? height : width;
    });
    component.ngOnInit();
    const windowSize: WindowSize = { width: 10000, height: 10000};
    window.dispatchEvent(new Event('resize'));
    component['newService'].canResize = false;
    component['newService'].windowsEvent.next(windowSize);
    expect().nothing();

  });

});

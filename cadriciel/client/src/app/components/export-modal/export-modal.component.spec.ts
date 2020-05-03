import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef,
  MatFormFieldModule, MatInput, MatInputModule, MatSnackBar, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { ExportationService } from 'src/app/services/exportation/exportation.service';
import { ExportModalComponent } from './export-modal.component';
import { FormBuilder } from '@angular/forms';
const element = {
  remove(): void {
    return;
  }
};
const drawService = {
  elements: {
    svg: {
      getAttribute(attr: string): string {
        return '20';
      },
      innerHTML: 'html',
      // tslint:disable-next-line: typedef
      getElementById(id: string) {
        return element;
      },
      style: {
        background : 'white'
      }
    }
  }
};

const exported = {
  onInit(): void {
    return;
  },
  reset(): void {
    return;
  },
  export: {
    sendByMail: true,
  },
  svgToImage(): void {
    return;
  },
  applyFilter(): string {
    return 'blur(1)';
  }
};

const dialog = {
  close(): void {
    return;
  }
};
// tslint:disable  no-string-literal
describe('ExportModalComponent', () => {
  let component: ExportModalComponent;
  let fixture: ComponentFixture<ExportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportModalComponent],
      providers: [{ provide: ExportationService, useValue: exported },
        { provide: DrawingServiceService, useValue: drawService },
        MatDialog, MatSnackBar, HttpClient, { provide: MatDialogRef, useValue: dialog }, MatInput, FormBuilder],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [BrowserAnimationsModule, MatDialogModule, MatSnackBarModule, MatInputModule, MatFormFieldModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('save should call the right functions', () => {
    component['exported'].svgToImage = jasmine.createSpy('svgToImage');
    component['dialogRef'].close = jasmine.createSpy('close');
    component['save']();

    expect(component['exported'].svgToImage).toHaveBeenCalled();
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

  it('onSendClick should call the right functions', () => {
    component['exported'].reset = jasmine.createSpy('reset');
    component['dialogRef'].close = jasmine.createSpy('close');
    component['onSendClick']();

    expect(component['exported'].reset).toHaveBeenCalled();
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

  it('onValueChange should call the right functions', () => {
    component['exported'].applyFilter = jasmine.createSpy('applyFilter');
    component['onValueChange']();

    expect(component['exported'].applyFilter).toHaveBeenCalled();
  });

});

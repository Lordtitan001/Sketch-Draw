import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarModule } from '@angular/material';
import { PopUpData } from 'src/app/Models/interfaces';
import { PopupComponent } from './popup.component';

const data: PopUpData = {
    action: 'Ok',
    message: 'Message',
    function: () => {return; }
};

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupComponent ],
      imports: [MatSnackBarModule],
      providers: [MatSnackBar, {provide: MAT_SNACK_BAR_DATA, useValue: data}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    // tslint:disable-next-line: no-string-literal
    expect(component['popUpData']).toBe(component['data']);
  });
});

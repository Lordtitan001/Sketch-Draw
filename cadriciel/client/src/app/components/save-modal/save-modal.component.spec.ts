import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2, Type } from '@angular/core';
import {
  MatChipInputEvent, MatChipsModule, MatDialog, MatDialogModule,
  MatFormFieldModule, MatInputModule, MatSnackBar, MatSnackBarModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, Subject } from 'rxjs';
import { GalleryServiceService } from 'src/app/services/gallery-service/gallery-service.service';
import { SaveDrawingService } from 'src/app/services/saveDrawing/save-drawing.service';
import { Drawing } from '../../../../../common/drawing';
import { SaveModalComponent } from './save-modal.component';
let ren: Renderer2;
let subject = new Subject<string>();
const saveService = {
  drawing: new Drawing(),
  async setDrawing(): Promise<string> {
    return Promise.resolve('');
  },
  saveDrawing(nom: string, tags: string[]): Observable<string> {
    return subject;
  }
};

const galeryService = {
  openPopUp(toExecute: CallableFunction, action: string, message: string): void {
    return;
  }
};

describe('SaveModalComponent', () => {
  let component: SaveModalComponent;
  let fixture: ComponentFixture<SaveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveModalComponent],
      providers: [{ provide: SaveDrawingService, useValue: saveService }, MatSnackBar,
      { provide: GalleryServiceService, useValue: galeryService }, MatDialog, HttpClient],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [MatDialogModule, BrowserAnimationsModule, MatChipsModule,
        MatSnackBarModule, MatInputModule, MatFormFieldModule, HttpClientModule]
    })
      .compileComponents();
  }));

  // tslint:disable no-string-literal
  // tslint:disable: no-magic-numbers

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveModalComponent);
    component = fixture.componentInstance;
    saveService.drawing = new Drawing();
    subject = new Subject<string>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('save should call afterSave ', async (() => {
    component['afterSave'] = jasmine.createSpy('afterSave');
    component['save']();
    subject.next('');
    setTimeout(() => {
      expect(component['afterSave']).toHaveBeenCalled();
    }, 1000);
  }));

  it('save should call afterSave ', async (() => {
    component['afterSave'] = jasmine.createSpy('afterSave');
    component['save']();
    subject.error({status: 250});
    setTimeout(() => {
      expect(component['afterSave']).toHaveBeenCalled();
    }, 1000);
  }));

  it('save should call afterSave and error 200', async (() => {
    component['afterSave'] = jasmine.createSpy('afterSave');
    component['save']();
    subject.error({status: 200});
    setTimeout(() => {
      expect(component['afterSave']).toHaveBeenCalled();
    }, 1000);
  }));

  it('save should call afterSave and error 0', async (() => {
    component['afterSave'] = jasmine.createSpy('afterSave');
    component['save']();
    subject.error({status: 0});
    setTimeout(() => {
      expect(component['afterSave']).toHaveBeenCalled();
    }, 1000);
  }));

  it('afterSave should call the right functions', () => {
    const resolveSpy = spyOn(Promise, 'resolve');
    const openSpy = spyOn(component['galeryService'], 'openPopUp');
    const message = 'message';
    const action = 'action';
    component['afterSave'](message, action);

    expect(openSpy).toHaveBeenCalled();
    expect(resolveSpy).toHaveBeenCalled();
  });

  it('checkTag first if statement true ', () => {
    const tag = 'nothing';
    component['saveData'].tags.length = 20;
    component['saveData'].message = 'nothing';
    component['checkTag'](tag);

    expect(component['saveData'].message).toBe('Nombre maximum de tags atteint');
  });

  it('checkTag second if statement true ', () => {
    const tag = 'nothingmkfmkxczmvlkncvlnxjnxljxvn';
    component['saveData'].tags.length = 2;
    component['saveData'].message = 'nothing';
    component['checkTag'](tag);

    expect(component['saveData'].message).toBe("Règles d'étiquettes non respectées");
  });

  it('checkTag for statement ', () => {
    const tag = 'nothingmkfmkxczmvlkncvlnxjnxljxvn';
    component['saveData'].message = 'nothing';
    component['saveData'].tags[0] = tag;
    component['checkTag'](tag);

    expect(component['saveData'].message).toBe('Etiquette deja saisie');
  });

  it('checkTag third if statement true ', () => {
    const tag = '';
    const value = component['checkTag'](tag);

    expect(value).toBe(false);
  });

  it('checkTag last if statement boolean = true ', () => {
    const tag = 're';
    component['saveData'].tags.length = 2;
    component['saveData'].message = 'nothing';
    component['checkTag'](tag);

    expect(component['saveData'].message).toBe('');
  });

  it('checkTag last if statement boolean = false ', () => {
    const tag = 'reallylongtaghahahahahahahahahah';
    component['saveData'].tags.length = 2;
    component['saveData'].message = 'nothing';
    const openSpy = spyOn(component['galeryService'], 'openPopUp');
    component['checkTag'](tag);

    expect(openSpy).toHaveBeenCalled();
  });

  it('add with if statement true', () => {
    ren = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    const event: MatChipInputEvent = ren.createElement('event');
    event.input = ren.createElement('input');
    event.value = 'yes';
    component['saveData'].tags.length = 2;
    const pushSpy = spyOn(component['saveData'].tags, 'push');
    component['add'](event);

    expect(pushSpy).toHaveBeenCalled();
  });

  it('add with if statement false', () => {
    ren = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    const event: MatChipInputEvent = ren.createElement('event');
    event.input = ren.createElement('input');
    event.value = 'yesthisislongasitcanget';
    component['saveData'].tags.length = 2;
    const pushSpy = spyOn(component['saveData'].tags, 'push');
    component['add'](event);

    expect(pushSpy).not.toHaveBeenCalled();
  });

  it('remove should do nothing with negative index', () => {
    const indexSpy = spyOn(component['saveData'].tags, 'findIndex');
    const tag = 'nothing';
    component['remove'](tag);

    expect(indexSpy).toHaveBeenCalled();
    expect().nothing();
  });

  it('remove should remove the index', () => {
    const indexSpy = spyOn(component['saveData'].tags, 'splice');
    const tag = 'nothing';
    component['saveData'].tags[0] = tag;
    component['remove'](tag);

    expect(indexSpy).toHaveBeenCalled();
  });

  it('addChip should call push', () => {
    const tag = 'nothing';
    component['saveData'].tags = [];
    component['saveData'].tags.push('blal');
    component['addChip'](tag);
    expect(component['saveData'].tags.length).toEqual(2);
  });

  it('addChip should call splice', () => {
    const indexSpy = spyOn(component['saveData'].tags, 'findIndex');
    const spliceSpy = spyOn(component['saveData'].tags, 'splice');
    const tag = 'nothing';
    component['saveData'].tags[0] = tag;
    component['addChip'](tag);

    expect(indexSpy).toHaveBeenCalled();
    expect(spliceSpy).toHaveBeenCalled();
  });

  it('close should close the dialog', () => {
    const dialogveSpy = spyOn(component['dialog'], 'closeAll');
    component['close']();

    expect(dialogveSpy).toHaveBeenCalled();
  });

});

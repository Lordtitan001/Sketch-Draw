import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material';
import { Router } from '@angular/router';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { NewProjectService } from 'src/app/services/new-project/new-project.service';
import { DrawingModalComponent } from '../drawing-modal/drawing-modal.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { EntryPointComponent } from './entry-point.component';
// tslint:disable no-magic-numbers
// tslint:disable  no-string-literal
describe('EntryPointComponent', () => {
  let component: EntryPointComponent;
  let fixture: ComponentFixture<EntryPointComponent>;
  const routerStub = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryPointComponent],
      providers: [DrawingServiceService, NewProjectService, MatDialog, { provide: Router, useValue: routerStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('continue should navigate to home', () => {
    component['continue']();
    const router = fixture.debugElement.injector.get(Router);
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('continue should navigate to path', () => {
    component['navigate']('home');
    const router = fixture.debugElement.injector.get(Router);
    expect(router.navigate).toHaveBeenCalledWith(['home']);
  });

  it('keyDown with ctrlKey and KeyO', () => {
    const event = new KeyboardEvent('keydown', {
      ctrlKey: true,
      code: 'KeyO'
    });
    window.dispatchEvent(event);
    component['openDrawingModal'] = jasmine.createSpy('openSpy');
    component['keyDown'](event);
    expect(component['openDrawingModal']).toHaveBeenCalled();
  });

  it('keyDown with ctrlKey and KeyG', () => {
    const event = new KeyboardEvent('keydown', {
      ctrlKey: true,
      code: 'KeyG'
    });
    window.dispatchEvent(event);
    component['openGalleryModal'] = jasmine.createSpy('openSpy');
    component['keyDown'](event);
    expect(component['openGalleryModal']).toHaveBeenCalled();
  });

  it('keyDown with ctrlKey and no KeyG or Key0', () => {
    const event = new KeyboardEvent('keydown', {
      ctrlKey: true,
      code: 'KeyF'
    });
    window.dispatchEvent(event);
    component['keyDown'](event);

    expect().nothing();
  });

  it('keyDown with no ctrlKey', () => {
    const event = new KeyboardEvent('keydown', {
      ctrlKey: false,
      code: 'KeyF'
    });
    window.dispatchEvent(event);
    component['keyDown'](event);

    expect().nothing();
  });

  it('openGalleryModal should open the dialog', () => {
    component['dialog'].open = jasmine.createSpy('openSpy');
    component['drawService'].isModalOpen = false;
    component['openGalleryModal']();
    expect(component['dialog'].open).toHaveBeenCalledWith(GalleryComponent, {
      hasBackdrop: true,
      width: '800px',
      height: '800px',
      panelClass: 'custom-gallery-container'
    });
    component['dialog']._afterAllClosed.next(undefined);
    setTimeout(() => {
      expect().nothing();
    }, 100);
  });

  it('openGalleryModal should not open the dialog', () => {
    component['dialog'].open = jasmine.createSpy('openSpy');
    component['drawService'].isModalOpen = true;
    component['openGalleryModal']();
    expect(component['dialog'].open).not.toHaveBeenCalledWith(GalleryComponent, {
      hasBackdrop: true,
      width: '800px',
      height: '800px',
    });
    component['dialog']._afterAllClosed.next(undefined);
    setTimeout(() => {
      expect().nothing();
    }, 100);
  });

  it('openDrawingModal should open the dialog', () => {
    component['dialog'].open = jasmine.createSpy('openSpy');
    component['pickerService'].isTool = false;
    component['drawService'].isModalOpen = false;
    component['openDrawingModal']();
    expect(component['dialog'].open).toHaveBeenCalledWith(DrawingModalComponent, {
      width: '30%',
      data: { name: 'Sans titre' }
    });
    component['dialog']._afterAllClosed.next(undefined);
    setTimeout(() => {
      expect().nothing();
    }, 100);
  });

  it('openDrawingModal should not open the dialog', () => {
    component['dialog'].open = jasmine.createSpy('openSpy');
    component['pickerService'].isTool = false;
    component['drawService'].isModalOpen = true;
    component['openDrawingModal']();
    expect(component['dialog'].open).not.toHaveBeenCalledWith(DrawingModalComponent, {
      width: '30%',
      data: { name: 'Sans titre' }
    });
    component['dialog']._afterAllClosed.next(undefined);
    setTimeout(() => {
      expect().nothing();
    }, 100);
  });

});

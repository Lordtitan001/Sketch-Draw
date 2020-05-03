// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { MatDialog, MatDialogModule, MatSnackBar, MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { Path } from 'src/app/Models/shapes/path';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { GalleryServiceService } from 'src/app/services/gallery-service/gallery-service.service';
import { NewProjectService } from 'src/app/services/new-project/new-project.service';
import { UndoRedoService } from 'src/app/services/undoRedo/undo-redo.service';
import { Drawing } from '../../../../../common/drawing';
import { GalleryCardComponent } from './gallery-card.component';

describe('GalleryCardComponent', () => {
  const time = 300;
  let component: GalleryCardComponent;
  let fixture: ComponentFixture<GalleryCardComponent>;
  let ren: Renderer2;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryCardComponent],
      providers: [DrawingServiceService, GalleryServiceService, MatDialog,
        MatSnackBar, NewProjectService, UndoRedoService, HttpClient, Renderer2],
      imports: [ MatSnackBarModule, MatDialogModule, RouterTestingModule.withRoutes([
        { path: 'dashboard', component: GalleryCardComponent},
        {path: 'home', component: GalleryCardComponent }, ]), HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryCardComponent);
    component = fixture.componentInstance;
    ren = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);

    component['drawing'] = {Draw: new Drawing(), _id: 'kevin', Tags: []};

    component['drawing'].Draw.svgDimensions = ['300', '150'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init all property', () => {
    component.ngOnInit();

    expect(component['property']).toEqual({
      scaleX: 1,
      scaleY: 1,
      transform: 'scale(1 1)',
      svgStyle: {},
    });
  });

  it('should delete the current drawing', async (() => {

    const spy = spyOn(component['galleryService'], 'openPopUp')
    .and.callFake((method, message, action) => {
      method();
    });

    const spy2 = spyOn(component['galleryService'], 'deleteDrawing')
    .and.returnValue(Promise.resolve(true));

    component['deleteDrawing']();

    expect(component['message']).toEqual('Voulez vous vraiment suprimmer ce dessin ?');
    expect(spy).toHaveBeenCalled();
    setTimeout(() => {
      expect(spy2).toHaveBeenCalled();
    }, time);
  }));

  it('should not delete the current drawing', async (() => {

    const spy = spyOn(component['galleryService'], 'openPopUp')
    .and.callFake((method, message, action) => {
      method();
    });

    spyOn(component['galleryService'], 'deleteDrawing')
    .and.returnValue(Promise.reject({status: 0}));

    component['deleteDrawing']();

    expect(spy).toHaveBeenCalled();
    setTimeout(() => {

      expect(component['message']).toEqual('Impossible de supprimer: Serveur déconnecté');
    }, time);
  }));

  it('should not delete the current drawing', async (() => {

    const spy = spyOn(component['galleryService'], 'openPopUp')
    .and.callFake((method, message, action) => {
      method();
    });

    spyOn(component['galleryService'], 'deleteDrawing')
    .and.returnValue(Promise.reject({status: 200}));

    component['deleteDrawing']();

    expect(spy).toHaveBeenCalled();
    setTimeout(() => {

      expect(component['message']).toEqual('Impossible de supprimer: Base de donnée déconnectée');
    }, time);
  }));

  it('should ask before continue the selected draw', () => {
    const spyObject = spyOn(Object, 'setPrototypeOf').and.callThrough();

    const spy = spyOn(component['galleryService'], 'openPopUp')
    .and.callFake((method, message, action) => {
      method();
    });

    component['drawService'].elements.svg = ren.createElement('svg', 'http://www.w3.org/2000/svg');

    component['drawing'].Draw.surfaceList = [new Path()];

    component['drawService'].surfaceList = [new Path()];

    component['continueDrawing']();

    expect(spy).toHaveBeenCalled();
    expect(spyObject).toHaveBeenCalledTimes(2);
  });

  it('should continue the selected draw', () => {

    const spy = spyOn(component['galleryService'], 'openPopUp');

    component['drawService'].elements.svg = ren.createElement('svg', 'http://www.w3.org/2000/svg');

    spyOn(component['router'], 'navigateByUrl').and.callFake(async () => {
      return Promise.resolve(true);
    });

    spyOn(component['router'], 'navigate').and.callFake(async ([]) => {
      return Promise.resolve(true);
    });

    component['continueDrawing']();

    expect(spy).not.toHaveBeenCalled();

  });
});

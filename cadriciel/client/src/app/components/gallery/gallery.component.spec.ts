
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatSnackBar, MatSnackBarModule } from '@angular/material';
import { GalleryServiceService } from 'src/app/services/gallery-service/gallery-service.service';
import { SaveDrawingService } from 'src/app/services/saveDrawing/save-drawing.service';
import { GalleryComponent } from './gallery.component';

// tslint:disable no-string-literal
describe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GalleryComponent],
            imports: [MatDialogModule, MatSnackBarModule, HttpClientModule],
            providers: [GalleryServiceService, MatDialog, SaveDrawingService, MatSnackBar, HttpClient],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add tag', () => {
        component['galleryService'].tagSelected = ['tag'];

        const spy = spyOn(component['galleryService'], 'getAllImageFromDataBase');

        component['selectTag']('tag2');

        expect(component['galleryService'].tagSelected).toEqual(['tag', 'tag2']);
        expect(spy).toHaveBeenCalled();
    });

    it('should remove tag', () => {

        component['galleryService'].tagSelected = ['tag'];

        const spy = spyOn(component['galleryService'], 'getAllImageFromDataBase');

        component['selectTag']('tag');

        expect(component['galleryService'].tagSelected).toEqual([]);
        expect(spy).toHaveBeenCalled();
    });

    it('should close all dialog', () => {

        const spy = spyOn(component['matDialog'], 'closeAll');

        component['close']();
        expect(spy).toHaveBeenCalled();
    });
});

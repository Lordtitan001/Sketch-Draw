import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DrawingModalComponent } from './components/drawing-modal/drawing-modal.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { ExportModalComponent } from './components/export-modal/export-modal.component';
import { GalleryCardComponent } from './components/gallery-card/gallery-card.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { MainComponent } from './components/main/main.component';
import { PopupComponent } from './components/popup/popup.component';
import { SaveModalComponent } from './components/save-modal/save-modal.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';
import { AbstractToolsService } from './services/abstract-tools/abstract-tools.service';
import { AerosolService } from './services/aerosol/aerosol.service';
import { ColorPickerService } from './services/color-picker/color-picker.service';
import { DrawingServiceService } from './services/drawing/drawing-service.service';
import { EllipseService } from './services/ellipse/ellipse.service';
import { ExportationService } from './services/exportation/exportation.service';
import { FormControlService } from './services/from-control/form-control.service';
import { GalleryServiceService } from './services/gallery-service/gallery-service.service';
import { LineService } from './services/line/line.service';
import { NewProjectService } from './services/new-project/new-project.service';
import { RectangleServiceService } from './services/rectangle/rectangle-service.service';
import { SelectedToolService } from './services/selected-tool/selected-tool.service';
import { ToolDrawingService } from './services/tool-drawing-service/tool-drawing.service';
import { UserManualService } from './services/user-manual/user-manual.service';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        DrawingComponent,
        EntryPointComponent,
        SideMenuComponent,
        MainComponent,
        EntryPointComponent,
        UserManualComponent,
        DrawingModalComponent,
        GalleryComponent,
        DrawingModalComponent,
        ColorPickerComponent,
        SaveModalComponent,
        ExportModalComponent,
        PopupComponent,
        GalleryCardComponent,
        ExportModalComponent
    ],
    entryComponents: [
        ColorPickerComponent,
        GalleryComponent,
        DrawingModalComponent,
        SaveModalComponent,
        PopupComponent,
        ExportModalComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
    ],
    providers: [
        DrawingServiceService,
        UserManualService,
        FormControlService,
        NewProjectService,
        ToolDrawingService,
        ColorPickerService,
        LineService,
        RectangleServiceService,
        EllipseService,
        AerosolService,
        SelectedToolService,
        ExportationService,
        GalleryServiceService,
        AbstractToolsService,
        SelectedToolService
    ],
    bootstrap: [AppComponent],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
    ]
})
export class AppModule {}

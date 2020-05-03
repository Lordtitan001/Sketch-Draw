import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatCardModule, MatCheckboxModule, MatChipsModule,
    MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule,
    MatProgressSpinnerModule, MatRadioModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule
} from '@angular/material';

@NgModule({
    imports: [MatDialogModule, MatFormFieldModule, MatButtonModule, MatSlideToggleModule,
        MatInputModule, MatSliderModule, MatMenuModule, MatIconModule, MatRadioModule,
        MatCardModule, MatCheckboxModule, MatChipsModule, MatSnackBarModule, MatProgressSpinnerModule],
    exports: [MatDialogModule, MatFormFieldModule, MatButtonModule, MatSlideToggleModule,
        MatCheckboxModule, MatInputModule, MatSliderModule, MatMenuModule, MatRadioModule,
        MatIconModule, MatCardModule, MatChipsModule, MatSnackBarModule, MatProgressSpinnerModule],
})

export class AngularMaterialModule { }

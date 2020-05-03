import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ColorPickerComponent } from 'src/app/components/color-picker/color-picker.component';
import { Color } from 'src/app/Models/color';
import { ModalData } from 'src/app/Models/interfaces';
import { ColorPickerService } from 'src/app/services/color-picker/color-picker.service';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { FormControlService } from 'src/app/services/from-control/form-control.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { NewProjectService } from 'src/app/services/new-project/new-project.service';
import { UndoRedoService } from 'src/app/services/undoRedo/undo-redo.service';
const maxRGB = 255;
const barSize = 50;
@Component({
  selector: 'app-drawing-modal',
  templateUrl: './drawing-modal.component.html',
  styleUrls: ['./drawing-modal.component.scss']
})
export class DrawingModalComponent implements OnInit {

  protected width: number;
  protected height: number;
  protected dialogIsOpen: boolean;
  constructor(
    private formService: FormControlService,
    private newService: NewProjectService,
    private drawService: DrawingServiceService,
    private colorPicker: ColorPickerService,
    private gridService: GridService,
    private router: Router,
    private dialog: MatDialog,
    private undoRedoService: UndoRedoService,
    private pickerService: ColorPickerService,
    @Inject(MAT_DIALOG_DATA) private data: ModalData
  ) {

    this.dialogIsOpen = false;
    this.width = 0;
    this.height = 0;
  }

  ngOnInit(): void {
    this.newService.canResize = true;
    const width = this.formService.formGroup.get('width') as AbstractControl;
    const height = this.formService.formGroup.get('height') as AbstractControl;
    this.newService.windowsEvent.subscribe((val) => {
      if (this.newService.canResize) {
        width.setValue(val.width);
        height.setValue(val.height);
      }
    });
    width.setValue(window.innerWidth - barSize);
    height.setValue(window.innerHeight);
    this.data.width = window.innerWidth - barSize;
    this.data.height = window.innerHeight;
  }

  protected onNoClick(): void {
    this.dialog.closeAll();
    this.drawService.isModalOpen = false;
  }

  protected newPage(): void {
    this.dialog.closeAll();
    this.colorPicker.isTool = false;
    this.dialog.open(DrawingModalComponent, {
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
    });
    this.dialog.afterAllClosed.subscribe((res) => {
      this.colorPicker.isTool = true;
      this.onNoClick();
    });
  }

  protected openDialog(): void {
    this.pickerService.previewColor = new Color (maxRGB, maxRGB, maxRGB);
    this.dialog.open(ColorPickerComponent, {
        width: '350px',
        height: '400px',
        position: { left: '45%', top: '16%' },
        hasBackdrop: true,
        panelClass: 'custom-dialog-container'
      });
  }

  ngOnDestroy(): void {
    this.pickerService.previewColor = new Color();
  }

  protected newDesign(): void {
    this.data.isCreated = true;
    this.newService.modalData = this.data;
    this.gridService.width =  this.data.width;
    this.gridService.height = this.data.height;
    this.newService.isHigher = (this.data.height > window.innerHeight);
    this.newService.isLarger = (this.data.width > window.innerWidth - barSize);
    this.onNoClick();
    this.router.navigateByUrl('/dashboard', { skipLocationChange: true }).then(() => {
      this.newService.reset();
      this.router.navigate(['home']);
      this.undoRedoService.initOnLoad();
    });

  }

  protected onValueChange(name: string): void {
    this.newService.canResize = false;
    const value = this.formService.formGroup.get(name) as AbstractControl;
    switch (name) {
      case 'width':
        if ((value.hasError(this.formService.errorMessages.width[0].type) ||
        value.hasError(this.formService.errorMessages.width[1].type))) {
          value.setValue(this.data.width);
        } else {
          this.data.width =  value.value;
          this.newService.isLarger = (this.data.width > window.innerWidth - barSize);
        }
        break;

      case 'height':
        if ((value.hasError(this.formService.errorMessages.height[0].type) ||
        value.hasError(this.formService.errorMessages.height[1].type))) {
          value.setValue(this.data.height);
        } else {
          this.data.height = value.value;
          this.newService.isHigher = (this.data.height > window.innerHeight);
        }
        break;
      default:
        break;
    }
  }
}

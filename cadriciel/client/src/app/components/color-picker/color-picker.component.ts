import { AfterViewInit,  Component, ElementRef,  HostListener,  Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog,  MatDialogRef, } from '@angular/material';
import { Color } from 'src/app/Models/color';
import { Pixel } from 'src/app/Models/enums';
import { ColorPickerService } from 'src/app/services/color-picker/color-picker.service';
import { NewProjectService } from 'src/app/services/new-project/new-project.service';
import { UndoRedoService } from 'src/app/services/undoRedo/undo-redo.service';
import { ModalData } from '../../Models/interfaces';
import { FormControlService } from '../../services/from-control/form-control.service';

const maxRGBValue = 255;
const sliderWidth = 30;
const heightCorrector = 5;
const sliderHeight = 10;

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})

export class ColorPickerComponent implements AfterViewInit {

  @ViewChild('canvasRef', { static: false }) private rgCanevas: ElementRef;
  @ViewChild('sliderRef', { static: false }) private bCanevas: ElementRef;
  private rgContext: CanvasRenderingContext2D;
  private bContext: CanvasRenderingContext2D;

  constructor(
    private pickerService: ColorPickerService,
    private formService: FormControlService,
    private dialogRef: MatDialogRef<ColorPickerComponent>,
    protected dialog: MatDialog,
    private newService: NewProjectService,
    private undoRedoService: UndoRedoService,
    @Inject(MAT_DIALOG_DATA) protected data: ModalData) { }

  @HostListener('mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    if (this.pickerService.isCanevasOn) {
      this.pickerService.previewColor.greenValue = ( event.offsetX > maxRGBValue) ? maxRGBValue : event.offsetX;
      this.pickerService.previewColor.redValue = (event.offsetY >= maxRGBValue) ? maxRGBValue : event.offsetY;
    } else if (this.pickerService.isBlueSliderOn) {
      this.pickerService.previewColor.blueValue = (maxRGBValue - (event.offsetY));
      this.canevasUpdate();
    }
  }

  protected setBackGroungColor(): void {
    this.newService.backgroundColor.copyColor(this.pickerService.previewColor);
    this.undoRedoService.update();
  }

  protected setColor(): void {
    const form = this.formService.formGroup.get('RGB');
    if (form) {
      if ( !form.hasError(this.formService.errorMessages.RGB[0].type)) {
        this.pickerService.previewColor.update(

          form.value);
        this.canevasUpdate(); }
      form.setValue(this.pickerService.previewColor.getColorHex());
    }
  }

  private makeRGCanvas(): void {
    const imgData = this.rgContext.createImageData(maxRGBValue, maxRGBValue);
    let i = 0;
    for (let x = 0; x < maxRGBValue; x++) {
      for (let y = 0; y < maxRGBValue; y++) {
        imgData.data[i + Pixel.r] = x;
        imgData.data[i + Pixel.g] = y;
        imgData.data[i + Pixel.b] = 0;
        imgData.data[i + Pixel.o] = maxRGBValue;
        i += Pixel.next;
      }
    }
    this.rgContext.putImageData(imgData, 0, 0);
  }

  ngAfterViewInit(): void {
    const tmpFirst = (this.rgCanevas.nativeElement as HTMLCanvasElement).getContext('2d');
    const tmpSecond = (this.bCanevas.nativeElement as HTMLCanvasElement).getContext('2d');
    if (tmpFirst != null && tmpSecond != null) {
      this.rgContext = tmpFirst;
      this.bContext = tmpSecond;

      this.makeRGCanvas();
      this.makeBCanvas(this.pickerService.previewColor.blueValue);
    }
  }

  protected confirmColor(isFirstColor: boolean): void {

    if (!this.pickerService.confirmBackGroundColor()) {
      this.pickerService.confirmColor(isFirstColor);
    }
    this.dialogRef.close();
  }

  private makeBCanvas(height: number): void {
    const imgData = this.bContext.createImageData(sliderWidth, maxRGBValue + 1);
    let i = 0;

    for (let x = 0; x < maxRGBValue; x++) {
      for (let y = 0; y < sliderWidth; y++) {
        imgData.data[i + Pixel.r] = 0;
        imgData.data[i + Pixel.g] = 0;
        imgData.data[i + Pixel.b] = maxRGBValue - x;
        imgData.data[i + Pixel.o] = maxRGBValue;
        i += Pixel.next;
      }
    }
    this.bContext.putImageData(imgData, 0, 0);
    this.bContext.beginPath();
    this.bContext.strokeStyle = 'white';
    this.bContext.lineWidth = Pixel.o;
    this.bContext.rect(0, maxRGBValue - height - heightCorrector, sliderWidth, sliderHeight);
    this.bContext.stroke();
    this.bContext.closePath();
  }

  private canevasUpdate(): void {
    this.makeRGCanvas();
    const imgData = this.rgContext.getImageData(0, 0, maxRGBValue + 1, maxRGBValue + 1);
    for (let i = 2; i < maxRGBValue * maxRGBValue * maxRGBValue; i += Pixel.next) {
      imgData.data[i] = this.pickerService.previewColor.blueValue;
    }
    this.rgContext.putImageData(imgData, 0, 0);
    this.makeBCanvas(this.pickerService.previewColor.blueValue);
  }

  protected inverseColor(): void {
    this.pickerService.inverseColor();
    this.canevasUpdate();
  }

  protected onBoxClick(isFirstColorSelected: boolean, isOnPreviewBoxs: boolean, newPreviewValue: Color,
                       colorToChange: Color): void {
    this.pickerService.isFirstColorSelected = isFirstColorSelected;
    this.pickerService.previewColor.copyColor(newPreviewValue);
    if (isOnPreviewBoxs) {
      this.canevasUpdate();
      return;
    }
    colorToChange.copyColor(newPreviewValue);
    this.canevasUpdate();
  }
}

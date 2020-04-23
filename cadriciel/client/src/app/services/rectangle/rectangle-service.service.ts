import { Injectable } from '@angular/core';
import { strokeTypeEnum, TypeDessinEnum } from 'src/app/Models/enums';
import { Path } from 'src/app/Models/shapes/path';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleServiceService extends AbstractToolsService {

  protected isModified: boolean;
  protected oldOriginX: number;
  protected oldOriginY: number;
  protected isInverted: boolean;
  protected isMoving: boolean;
  protected oldWidth: number;
  protected oldHeight: number;
  constructor(
    protected drawService: DrawingServiceService,
    protected pickerService: ColorPickerService,
    protected undoRedoService: UndoRedoService) {
    super();
    this.canDraw = false;
    this.isModified = false;
    this.isInverted = false;
    this.isMoving = false;
  }

  reset(): void {
    this.canDraw = false;
    this.isModified = false;
    this.isInverted = false;
    this.isMoving = false;
    this.drawService.visualisation = '';
  }

  mouseDown(): void {
    this.canDraw = true;
  }

  setStrokeType(stroke: strokeTypeEnum): void {
    this.drawService.selectedTools.strokeType = stroke;
    this.setStrokeColor();
  }

  protected setStrokeColor(): void {
    switch (this.drawService.selectedTools.strokeType) {
      case strokeTypeEnum.Contour:
        this.drawService.selectedTools.fill = 'none';
        this.drawService.selectedTools.stroke = this.pickerService.secondaryColor.getColor();
        break;
      case strokeTypeEnum.Full:
        this.drawService.selectedTools.fill = this.pickerService.primaryColor.getColor();
        this.drawService.selectedTools.stroke = 'none';
        break;
      case strokeTypeEnum.FullWithContour:
        this.drawService.selectedTools.fill = this.pickerService.primaryColor.getColor();
        this.drawService.selectedTools.stroke = this.pickerService.secondaryColor.getColor();
        break;
      case strokeTypeEnum.Any:
        break;
    }
  }

  mouseMove(event: MouseEvent): void {
    if (!this.canDraw) {
      return;
    }
    if (!this.isMoving) {
      if (this.drawService.surfaceList.length > this.drawService.indexList) {
        this.drawService.indexList++;
      }
      this.isMoving = true;
      const rect = new Path();
      this.setStrokeColor();
      rect.strokeType = this.drawService.getTools().strokeType;
      rect.strokeWidth = this.drawService.getTools().strokeWidth;
      rect.stroke = this.drawService.getTools().stroke;
      rect.fill = this.drawService.getTools().fill;
      rect.type = TypeDessinEnum.CONTOUR;

      rect.originX = event.offsetX;
      rect.originY = event.offsetY;

      this.drawService.surfaceList.push(rect);
      this.oldOriginX = rect.originX;
      this.oldOriginY = rect.originY;
    }
    const width = event.offsetX - this.oldOriginX;
    const height = event.offsetY - this.oldOriginY;
    this.oldHeight = height;
    this.oldWidth = width;

    (this.isModified) ? this.setDimesionsShift(event) : this.setDimesions(event);
  }

  keyDown(event: KeyboardEvent): void {
    if (event.shiftKey && !this.isModified && this.canDraw) {
      const max = Math.min(Math.abs(this.oldWidth), Math.abs(this.oldHeight));
      const width = (this.oldWidth < 0) ? - max : max;
      const height = (this.oldHeight < 0) ? - max : max;
      this.drawService.surfaceList[this.drawService.indexList].d =
        ` M ${this.oldOriginX} ${this.oldOriginY} h ${width} v ${height} h ${-width} Z`;
      this.isModified = true;
    }
  }

  keyUp(event: KeyboardEvent): void {
    if (!event.shiftKey && this.isModified && this.canDraw) {
      this.isModified = false;
      this.drawService.surfaceList[this.drawService.indexList].d =
        ` M ${this.oldOriginX} ${this.oldOriginY} h ${this.oldWidth} v ${this.oldHeight} h ${-this.oldWidth} Z`;
    }
  }

  mouseUp(): void {
    this.drawService.visualisation = '';
    if (this.isMoving) {
      this.undoRedoService.update();
    }
    this.canDraw = false;
    this.isModified = false;
    this.isMoving = false;
  }

  protected setDimesions(event: MouseEvent): void {
    const width = event.offsetX - this.oldOriginX;
    const height = event.offsetY - this.oldOriginY;
    this.drawService.surfaceList[this.drawService.indexList].d =
      ` M ${this.oldOriginX} ${this.oldOriginY} h ${width} v ${height} h ${-width} Z`;
  }

  protected setDimesionsShift(event: MouseEvent): void {
    let width = event.offsetX - this.oldOriginX;
    let height = event.offsetY - this.oldOriginY;

    const max = Math.min(Math.abs(width), Math.abs(height));
    width = (width < 0) ? - max : max;
    height = (height < 0) ? - max : max;
    this.drawService.surfaceList[this.drawService.indexList].d =
      ` M ${this.oldOriginX} ${this.oldOriginY} h ${width} v ${height} h ${-width} Z`;

  }

  mouseLeave(): void {
    if (this.canDraw) {
      this.drawService.surfaceList.pop();
      this.drawService.indexList--;
    }
    this.canDraw = false;
    this.isMoving = false;
    this.drawService.visualisation = '';
  }
}

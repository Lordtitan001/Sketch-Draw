import { Injectable } from '@angular/core';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { RectangleServiceService } from '../rectangle/rectangle-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class EllipseService extends RectangleServiceService {

  constructor(
    protected drawService: DrawingServiceService,
    protected pickerService: ColorPickerService,
    protected undoRedoService: UndoRedoService) {
    super(drawService, pickerService, undoRedoService);

  }

  keyDown(event: KeyboardEvent): void {
    if (event.shiftKey && !this.isModified && this.canDraw) {
      const min = Math.min(Math.abs(this.oldWidth), Math.abs(this.oldHeight));
      const width = (this.oldWidth < 0) ? - min : min;
      const height = (this.oldHeight < 0) ? - min : min;
      const raduisX = width / 2;
      const raduisY = height / 2;
      this.drawService.visualisation = `M ${this.oldOriginX} ${this.oldOriginY}
       h ${width} v ${height} h ${-width} Z`;
      this.drawService.surfaceList[this.drawService.indexList].d =
        `M ${this.oldOriginX},${this.oldOriginY + raduisY}
     a ${raduisX},${raduisY} 0 1,0 ${width},0,
     a ${raduisX},${raduisY} 0 1,0 ${- width},0 `;
      this.isModified = true;
    }
  }

  keyUp(event: KeyboardEvent): void {
    if (!event.shiftKey && this.isModified && this.canDraw) {
      this.isModified = false;
      const raduisX = this.oldWidth / 2;
      const raduisY = this.oldHeight / 2;
      this.drawService.visualisation = `M ${this.oldOriginX} ${this.oldOriginY}
      h ${this.oldWidth} v ${this.oldHeight} h ${-this.oldWidth} Z`;
      this.drawService.surfaceList[this.drawService.indexList].d =
        `M ${this.oldOriginX},${this.oldOriginY + raduisY}
     a ${raduisX},${raduisY} 0 1,0 ${this.oldWidth},0,
     a ${raduisX},${raduisY} 0 1,0 ${- this.oldWidth},0 `;
    }
  }

  protected setDimesions(event: MouseEvent): void {
    const width = event.offsetX - this.oldOriginX;
    const height = event.offsetY - this.oldOriginY;
    const raduisX = width / 2;
    const raduisY = height / 2;

    this.drawService.visualisation = `M ${this.oldOriginX} ${this.oldOriginY}
    h ${width} v ${height} h ${-width} Z`;
    this.drawService.surfaceList[this.drawService.indexList].d =
      `M ${this.oldOriginX},${this.oldOriginY + raduisY}
     a ${raduisX},${raduisY} 0 1,0 ${width},0,
     a ${raduisX},${raduisY} 0 1,0 ${- width},0 `;

  }

  protected setDimesionsShift(event: MouseEvent): void {
    let width = event.offsetX - this.oldOriginX;
    let height = event.offsetY - this.oldOriginY;

    const min = Math.min(Math.abs(width), Math.abs(height));
    width = (width < 0) ? - min : min;
    height = (height < 0) ? - min : min;
    const raduisX = width / 2;
    const raduisY = height / 2;
    this.drawService.visualisation = `M ${this.oldOriginX} ${this.oldOriginY}
    h ${width} v ${height} h ${-width} Z`;
    this.drawService.surfaceList[this.drawService.indexList].d =
      `M ${this.oldOriginX},${this.oldOriginY + raduisY}
    a ${raduisX},${raduisY} 0 1,0 ${width},0,
    a ${raduisX},${raduisY} 0 1,0 ${- width},0 `;
  }

}

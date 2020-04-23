import { Injectable } from '@angular/core';
import { TypeDessinEnum } from 'src/app/Models/enums';
import { Path } from 'src/app/Models/shapes/path';
import { Pen } from 'src/app/Models/tools/pen';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { ToolDrawingService } from '../tool-drawing-service/tool-drawing.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';
const maxAngle = 360;
const divider = 24;
const oposite = -1;
const size = 20;
@Injectable({
  providedIn: 'root'
})
export class PenService extends ToolDrawingService {
  private rotate: boolean;
  private angle: number;
  constructor(protected colorPicker: ColorPickerService,
              protected drawService: DrawingServiceService,
              protected undoRedoService: UndoRedoService) {
    super(colorPicker, drawService, undoRedoService);
    this.rotate = false;
    this.angle = 0;
  }

  reset(): void {
    this.canDraw = false;
    this.hasLeft = false;
    this.rotate = false;
    this.angle = 0;
  }
  keyUp(event: KeyboardEvent): void {
    event.preventDefault();
    this.mapEvent[event.code] = event.type === 'keydown';
  }

  keyDown(event: KeyboardEvent): void {
    event.preventDefault();
    this.mapEvent[event.code] = event.type === 'keydown';
  }

  mouseDown(event: MouseEvent): void {
    if (this.drawService.surfaceList.length > this.drawService.indexList) {
      this.drawService.indexList++;
    }

    this.drawService.surfaceList.push(new Pen());
    const index = this.drawService.indexList;
    const path = this.drawService.surfaceList[index];
    path.type = TypeDessinEnum.CLASSIQUE;
    path.d = `M ${event.offsetX} ${event.offsetY}`;
    this.canDraw = true;
    this.hasLeft = false;
  }

  mouseWheel(event: WheelEvent): void {
    event.preventDefault();
    console.log(this.mapEvent.AltLeft);
    const direction = (event.deltaY > 0 ) ? 1 : oposite;
    this.angle += (this.mapEvent.AltLeft || this.mapEvent.AltRight) ?
    (direction * Math.PI  * 2) / maxAngle : (2 * Math.PI * direction) / divider;
    this.rotate = true;
    this.drawService.elements.eraserElement.setAttribute('d',
    ` M ${event.offsetX} ${event.offsetY}
      L ${ event.offsetX - (size) * Math.cos(this.angle)} ${event.offsetY - (size) * Math.sin(this.angle)}
      L ${ event.offsetX + (size) * Math.cos(this.angle + Math.PI)} ${event.offsetY + (size) * Math.sin(this.angle + Math.PI)}`);
  }

  protected draw(event: MouseEvent, index: number): void {
    let path: Path;
    if (this.rotate) {
      if (this.drawService.surfaceList.length > this.drawService.indexList) {
        this.drawService.indexList++;
      }
      this.drawService.surfaceList.push(new Pen());
      path = this.drawService.surfaceList[this.drawService.surfaceList.length - 1];
      path.d = '';
    } else {
      path = this.drawService.surfaceList[index];
    }
    path.stroke = this.colorPicker.primaryColor.getColor();
    path.strokeWidth = '2';
    path.length = (this.drawService.selectedTools as Path).length;
    path.d += ` M ${event.offsetX} ${event.offsetY}
                L ${ event.offsetX - (path.length / 2) * Math.cos(this.angle)}
                  ${event.offsetY - (path.length / 2) * Math.sin(this.angle)}
                L ${ event.offsetX + (path.length / 2) * Math.cos(this.angle + Math.PI)}
                  ${event.offsetY + (path.length / 2) * Math.sin(this.angle + Math.PI)}`;
    this.rotate = false;
  }

  mouseClick(): void {
    if (!this.hasLeft && this.canDraw) {
      this.canDraw = false;
      this.undoRedoService.update();
    }
  }
}

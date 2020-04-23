import { Injectable } from '@angular/core';
import { EnumTool, TypeDessinEnum } from 'src/app/Models/enums';
import { Line } from 'src/app/Models/shapes/line';
import { Point } from 'src/app/Models/shapes/point';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';

const sector3 = 3;
const sector4 = 4;
const sector8 = 8;

@Injectable({
  providedIn: 'root'
})

export class LineService extends AbstractToolsService {
  private isTheFirstPoint: boolean;
  private mousePoint: Point;
  private isMouseDefinded: boolean;
  private isShiftActived: boolean;
  private lineCount: number;
  protected jonctionsString: string;

  constructor(private pickerService: ColorPickerService,
              private drawService: DrawingServiceService,
              private undoRedoService: UndoRedoService
  ) {
    super();
    this.isTheFirstPoint = false;
    this.mousePoint = new Point(0, 0);
    this.drawService.visualisation = '';
    this.isMouseDefinded = false;
    this.isShiftActived = false;
    this.jonctionsString = '';
    this.canDraw = false;
    this.lineCount = 0;
  }

  reset(): void {
    this.isTheFirstPoint = false;
    this.mousePoint = new Point(0, 0);
    this.drawService.visualisation = '';
    this.isMouseDefinded = false;
    this.isShiftActived = false;
    this.jonctionsString = '';
    this.canDraw = false;
    this.lineCount = 0 ;
  }

  mouseLeave(): void {
    if (this.canDraw) {
        if (this.lineCount > 1) {
          this.undoRedoService.update();
        }
        this.endlineWithoutEvent();
        this.canDraw = false;
    }
    this.lineCount = 0;
  }

  mouseDown(event: MouseEvent): void {
    console.log('MOUSE,DOwn');
    this.canDraw = true;
    this.lineCount ++;
    if (this.isShiftActived) {

      const point = this.findAlign();
      const tempPath = `L ${point.x} ${point.y}`;
      this.addPoint(point.x, point.y, tempPath);
      return;
    }

    if (this.isTheFirstPoint) {

      const tempPath = `L ${event.offsetX} ${event.offsetY}`;
      this.addPoint(event.offsetX, event.offsetY, tempPath);
      return;
    }
    this.isTheFirstPoint = true;
    if (this.drawService.surfaceList.length > this.drawService.indexList) {
      this.drawService.indexList++;
    }
    this.drawService.surfaceList.push(new Line());
    this.drawService.surfaceList[this.drawService.indexList].d = '';
    this.drawService.surfaceList[this.drawService.indexList].type = TypeDessinEnum.CLASSIQUE;
    const path = this.drawService.selectedTools.withJonctions === false ? `M ${event.offsetX} ${event.offsetY}` : '';
    this.addPoint(event.offsetX, event.offsetY, path);
    this.drawService.surfaceList[this.drawService.indexList].strokeWidth =
      this.drawService.selectedTools.strokeWidth;
    this.isMouseDefinded = true;
  }

  private addPoint(coordX: number, coordY: number, path: string): void {
    let pathToAdd = '';
    pathToAdd = this.drawService.selectedTools.withJonctions === false ? path :
      path + this.addJonctions(coordX, coordY);
    this.drawService.surfaceList[this.drawService.indexList].d += pathToAdd;
    this.drawService.surfaceList[this.drawService.indexList].currentPoint = this.mousePoint;
    this.drawService.surfaceList[this.drawService.indexList].stroke = this.pickerService.primaryColor.getColor();
    this.drawService.surfaceList[this.drawService.indexList].pointPaths.push(pathToAdd);
    this.drawService.surfaceList[this.drawService.indexList].pointsList.push(new Point(coordX, coordY));

  }

  private addJonctions(coordX: number, coordY: number): string {

    const raduis = this.drawService.selectedTools.strokeJonction;
    const jonctionPath = ` M ${coordX}, ${coordY} m -${raduis} 0 a ${raduis},${raduis} 0 1,0
      ${2 * raduis},0 a ${raduis},${raduis} 0 1,0 -${2 * raduis},0 M ${coordX}, ${coordY} `;
    this.drawService.surfaceList[this.drawService.indexList].fill = this.pickerService.primaryColor.getColor();
    return jonctionPath;
  }

  mouseUp(): void {
    if (this.drawService.enumTool !== EnumTool.Line) {
      this.endlineWithoutEvent();
    }
  }

  mouseDblclick(event: MouseEvent): void {
    this.drawService.visualisation = '';
    if (Math.abs(this.drawService.surfaceList[this.drawService.indexList].pointsList[0].x - this.mousePoint.x) <= sector3 &&
      Math.abs(this.drawService.surfaceList[this.drawService.indexList].pointsList[0].y - this.mousePoint.y) <= sector3) {
      this.deleteLastSegment();
      this.deleteLastSegment();
      this.drawService.surfaceList[this.drawService.indexList].d += 'Z';
    }
    this.drawService.surfaceList[this.drawService.indexList].currentPoint = this.mousePoint;

    this.drawService.surfaceList[this.drawService.indexList].pointsList.pop();
    this.drawService.surfaceList[this.drawService.indexList].pointPaths.pop();
    if (this.isShiftActived) {
      this.deleteLastSegment();
    }
    this.isTheFirstPoint = false;
    this.drawService.visualisation = '';
    this.isMouseDefinded = false;
    this.canDraw = false;
    this.isShiftActived = false;
    this.lineCount = 0;
    this.undoRedoService.update();
  }

  private endlineWithoutEvent(): void {
    if (this.canDraw) {
      this.drawService.visualisation = '';
      this.isTheFirstPoint = false;
      this.drawService.visualisation = '';
      this.isMouseDefinded = false;
      this.canDraw = false;
    }
    console.log(this.lineCount);
    if (this.lineCount > 1) {
      this.undoRedoService.update();
    }
    this.lineCount = 0;
  }

  mouseMove(event: MouseEvent): void {
    if (!this.canDraw) {
      this.endlineWithoutEvent();
      return;
    }
    this.mousePoint = new Point(event.offsetX, event.offsetY);
    if (this.isShiftActived) {
      this.alignWhenShift();
      return;
    }

    if (this.isMouseDefinded) {
      this.alignWithoutShift();
    }
  }

  keyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && this.canDraw) {
      this.deleteLastSegment();
    }

    if (event.key === 'Escape' && this.canDraw) {
      if (this.isTheFirstPoint) {
        this.drawService.surfaceList[this.drawService.indexList].d = '';
        this.drawService.visualisation = '';
        this.removeHoleLine();
      }
    }

    if (event.key === 'Shift' && this.canDraw) {
      this.isShiftActived = true;
      if (this.isTheFirstPoint) {
        this.findAlign();
        this.alignWhenShift();
      }
    }
  }

  keyUp(event: KeyboardEvent): void {
    if (event.key === 'Shift' && this.canDraw) {
      this.isShiftActived = false;
      if (this.isTheFirstPoint) {
        this.alignWithoutShift();
      }
    }
  }

  private alignWhenShift(): void {
    this.drawService.visualisation = `M ${this.actualPoint().x} ${this.actualPoint().y} L
    ${this.findAlign().x} ${this.findAlign().y}`;
  }

  private alignWithoutShift(): void {
    const point = this.drawService.surfaceList[this.drawService.indexList].pointsList[this.pointsNumber() - 1];
    this.drawService.visualisation = `M ${point.x} ${point.y} L ${this.mousePoint.x} ${this.mousePoint.y}`;
  }

  private findAlign(): Point {
    const position = this.mousePoint;
    const absDeltaX = Math.abs(position.x - this.actualPoint().x);
    const absDeltaY = Math.abs(position.y - this.actualPoint().y);
    const angle = Math.atan(absDeltaY / absDeltaX);

    if (absDeltaX > absDeltaY) {
      return (angle < Math.PI / sector8) ? (this.alignOnX()) :
        (this.alignOn45(position.x - this.actualPoint().x, position.y - this.actualPoint().y));

    } else if (absDeltaX < absDeltaY) {

      return (angle < (sector3 * Math.PI / sector8)) ?
          (this.alignOn45(position.x - this.actualPoint().x, position.y - this.actualPoint().y)) : (this.alignOnY());
    }
    return position;
  }

  private alignOnX(): Point {
    return new Point(this.mousePoint.x, this.actualPoint().y);
  }

  private alignOnY(): Point {
    return new Point(this.actualPoint().x, this.mousePoint.y);
  }

  private alignOn45(deltaX: number, deltaY: number): Point {
    return new Point(this.mousePoint.x, Number(this.computeY(deltaX, deltaY)));
  }

  private computeY(deltaX: number, deltaY: number): number {
    return ((this.findSector() === 1 || this.findSector() === sector3) ? (-deltaX + this.actualPoint().y) :
      (deltaX + this.actualPoint().y));
  }

  private findSector(): number {

    let value: number;
    if (this.mousePoint.x < this.actualPoint().x) {
      value = this.mousePoint.y < this.actualPoint().y ? 2 : sector3;
    } else {
      value = this.mousePoint.y < this.actualPoint().y ? 1 : sector4;
    }
    return value;
  }

  private deleteLastSegment(): void {
    if (this.isTheFirstPoint
      && this.pointsNumber() > 1) {
      this.drawService.surfaceList[this.drawService.indexList].pointsList.pop();
      const numberToDeduct = this.drawService.surfaceList[this.drawService.indexList].d.length
        - String(this.drawService.surfaceList[this.drawService.indexList].pointPaths.pop()).length;
      this.drawService.surfaceList[this.drawService.indexList].d =
        this.drawService.surfaceList[this.drawService.indexList].d.substr(0, numberToDeduct);
      this.drawService.visualisation = `M ${this.actualPoint().x} ${this.actualPoint().y} ${this.mousePoint.x}
      ${this.mousePoint.y}`;
    }
    this.lineCount -- ;
  }

  private actualPoint(): Point {
    const point = this.drawService.surfaceList[this.drawService.indexList].pointsList
    [this.drawService.surfaceList[this.drawService.indexList].pointsList.length - 1];
    this.drawService.surfaceList[this.drawService.indexList].currentPoint = point;
    return this.drawService.surfaceList[this.drawService.indexList].currentPoint;
  }

  private removeHoleLine(): void {
    this.isTheFirstPoint = false;
    this.isMouseDefinded = false;
    const totalPoints = this.pointsNumber();
    for (let j = 0; j < totalPoints; j++) {
      this.drawService.surfaceList[this.drawService.indexList].pointPaths.pop();
      this.drawService.surfaceList[this.drawService.indexList].pointsList.pop();
    }

    this.drawService.surfaceList.pop();
    this.drawService.indexList--;
    this.lineCount = 0;
  }

  private pointsNumber(): number {
    return (this.drawService.surfaceList[this.drawService.indexList].pointsList.length);
  }
}

import { Injectable } from '@angular/core';

import { Aerosol } from 'src/app/Models/shapes/aerosol';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { ToolDrawingService } from '../tool-drawing-service/tool-drawing.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';

const seconde = 1000;
const value = 50;
@Injectable({
  providedIn: 'root'
})
export class AerosolService extends ToolDrawingService {

  private pointGenerator: number;
  private interval: number;
  private event: MouseEvent;
  constructor(
    protected colorPicker: ColorPickerService,
    protected drawService: DrawingServiceService,
    protected undoRedoService: UndoRedoService) {
    super(colorPicker, drawService, undoRedoService);
    this.pointGenerator = value;
  }

  private generateRandomPoints(event: MouseEvent, indexbrushList: number): void {

    const R = parseInt(this.drawService.getTools().strokeWidth, 10);
    let randomPoints = '';
    for (let i = 0; i < this.pointGenerator; i++) {
      const a = Math.random() * 2 * Math.PI;
      const r = Math.sqrt((Math.random() * R * R));
      const x = event.offsetX + r * Math.cos(a);
      const y = event.offsetY + r * Math.sin(a);
      const radius = 0.5;
      randomPoints += `  M ${x},
      ${y} m -${radius} 0 a ${radius},${radius} 0 1,0 ${2 * radius},0
      a ${radius},${radius} 0 1,0 -${2 * radius},0 `;
    }
    this.drawService.surfaceList[indexbrushList].d += randomPoints;
  }

  protected draw(event: MouseEvent, indexbrushList: number): void {
     const path = this.drawService.surfaceList[indexbrushList];
     path.strokeLinecap = 'round';
     path.speed = this.drawService.getTools().speed;
     path.strokeLinejoin = 'round';
     path.stroke = this.colorPicker.primaryColor.getColor();
     path.strokeWidth = '0.5';
     this.generateRandomPoints(event, indexbrushList);
  }

  mouseMove(event: MouseEvent): void {
    this.event = event;
    if (this.canDraw) {
      this.canDraw = false;
      const speed = parseInt(this.drawService.getTools().speed, 10);
      this.interval = window.setInterval(() => {
        if (this.drawService.surfaceList.length > this.drawService.indexList) {
          this.drawService.indexList++;
        }
        this.drawService.surfaceList.push(new Aerosol());
        this.draw(this.event, this.drawService.indexList);
      }, seconde / (speed));
      this.draw(event, this.drawService.indexList);
    }
  }

  mouseLeave(): void {
    clearInterval(this.interval);
    this.canDraw = false;
    this.hasLeft = true;
  }

  mouseUp(): void {
    clearInterval(this.interval);
    this.canDraw = false;
    this.undoRedoService.update();
  }

  mouseDown(event: MouseEvent): void {
    this.event = event;
    if (this.drawService.surfaceList.length > this.drawService.indexList) {
      this.drawService.indexList++;
    }
    this.canDraw = true;
    this.hasLeft = false;
    this.drawService.surfaceList.push(new Aerosol());
    const speed = parseInt(this.drawService.getTools().speed, 10);
    this.interval = window.setInterval(() => {
      this.ableToDraw(event);
    }, seconde / speed);

  }
  ableToDraw(event: MouseEvent): void {
    if (this.canDraw) {
      this.draw(this.event, this.drawService.indexList);
    }
  }

}

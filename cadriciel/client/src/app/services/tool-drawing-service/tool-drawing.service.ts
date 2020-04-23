import { Injectable } from '@angular/core';
import { EnumTool, TypeDessinEnum } from 'src/app/Models/enums';
import { Path } from 'src/app/Models/shapes/path';
import { Brush } from 'src/app/Models/tools/brush';
import { Pencil } from 'src/app/Models/tools/pencil';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class ToolDrawingService extends AbstractToolsService {
  protected hasLeft: boolean;
  constructor(
    protected colorPicker: ColorPickerService,
    protected drawService: DrawingServiceService,
    protected undoRedoService: UndoRedoService) {
    super();
    this.canDraw = false;
    this.hasLeft = false;
  }

  reset(): void {
    this.canDraw = false;
    this.hasLeft = false;
  }

  protected draw(event: MouseEvent, indexbrushList: number): void {
    const path = this.drawService.surfaceList[indexbrushList];
    path.fill = this.drawService.getTools().fill;
    path.filter = (this.drawService.enumTool === EnumTool.Brush) ? `url(#${(this.drawService.getTools() as Path).texture.valueOf()})`
      : 'none';
    path.strokeLinecap = this.drawService.getTools().strokeLinecap;
    path.strokeWidth = this.drawService.getTools().strokeWidth;
    path.strokeLinejoin = 'round';
    path.stroke = this.colorPicker.primaryColor.getColor();
    const width = parseInt(this.drawService.getTools().strokeWidth, 10);
    path.d += ` m ${-width} ${-width} m ${width} ${width}`;
    path.d += ` L ${event.offsetX} ${event.offsetY}`;
    path.d += ` m ${width} ${width} m ${-width} ${-width}`;
  }

  mouseMove(event: MouseEvent): void {
    if (this.canDraw) {
      this.draw(event, this.drawService.indexList);
    }
    this.drawService.elements.eraserElement.setAttribute('d', '');
  }

  mouseDown(event: MouseEvent): void {
    if (this.drawService.surfaceList.length > this.drawService.indexList) {
      this.drawService.indexList++;
    }

    (this.drawService.enumTool === EnumTool.Brush) ? this.drawService.surfaceList.push(new Brush())
      : this.drawService.surfaceList.push(new Pencil());
    const index = this.drawService.indexList;
    const path = this.drawService.surfaceList[index];
    path.type = TypeDessinEnum.CLASSIQUE;
    const width = parseInt(this.drawService.getTools().strokeWidth, 10);
    path.d = `M ${event.offsetX} ${event.offsetY} m ${-width} ${-width}
    M ${event.offsetX} ${event.offsetY}`;
    this.canDraw = true;
    this.hasLeft = false;

  }

  mouseLeave(): void {
    if (this.canDraw) {
      this.canDraw = false;
      this.hasLeft = true;
      this.undoRedoService.update();
    }
  }

  mouseClick(event: MouseEvent): void {
    if (!this.hasLeft && this.canDraw) {
      this.canDraw = false;
      const path = (this.drawService.enumTool === EnumTool.Brush) ? new Brush() : new Pencil();
      this.drawService.surfaceList.push(path);
      this.drawService.surfaceList[this.drawService.indexList].d += ` M ${event.offsetX} ${event.offsetY} `;
      this.draw(event, this.drawService.indexList);
      const width = parseInt(this.drawService.getTools().strokeWidth, 10);
      this.drawService.surfaceList[this.drawService.indexList].d +=
        `m ${width} ${width} M ${event.offsetX} ${event.offsetY}`;
      this.drawService.indexList++;
      this.undoRedoService.update();
    }
  }
}

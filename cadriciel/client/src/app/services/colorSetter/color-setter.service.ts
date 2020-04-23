import { Injectable } from '@angular/core';
import { TypeDessinEnum } from 'src/app/Models/enums';
import { Path } from 'src/app/Models/shapes/path';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';

@Injectable({
  providedIn: 'root'
})
export class ColorSetterService extends AbstractToolsService {
  private element: SVGElement;
  constructor(private colorPicker: ColorPickerService, private drawService: DrawingServiceService,
              private undoRedoService: UndoRedoService) {
    super();
  }

  private strokeShapeManager(shape: Path, isRightClick: boolean): void {
    if (isRightClick) {
      if (shape.stroke !== 'none') {
        shape.stroke = this.colorPicker.secondaryColor.getColor();
        this.undoRedoService.update();
      }
    } else if (shape.fill !== 'none') {
      shape.fill = this.colorPicker.primaryColor.getColor();
      this.undoRedoService.update();
    }
  }

  mouseDownPath(event: MouseEvent): void {
    this.element = event.target as SVGElement;
    const id = (this.element.getAttribute('id'));
    for (const shape of this.drawService.surfaceList) {
      if (Number(id) !== shape.id) {
        continue;
      }
      if (shape.type === TypeDessinEnum.CONTOUR) {
        if (event.button === 2) {
          this.strokeShapeManager(shape, true);
        } else if (event.button === 0) {
          this.strokeShapeManager(shape, false);
        }
        return;
      }
      if (event.button === 0) {
        shape.stroke = this.colorPicker.primaryColor.getColor();
        this.undoRedoService.update();
        return;
      }

    }
  }
}

import { Injectable } from '@angular/core';
import { Color } from 'src/app/Models/color';
import { Path } from 'src/app/Models/shapes/path';
import { Drawing } from '../../../../../common/drawing';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { MapService } from '../maps/map.service';
import { NewProjectService } from '../new-project/new-project.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';

const tenBasix = 10 ;
@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {
  private currentDrawing: Drawing;
  isLoad: boolean;
  date: string;
  private newService: NewProjectService;
  constructor(private drawService: DrawingServiceService, private undoRedoService: UndoRedoService, private mapService: MapService) {
    this.undoRedoService.setAutoSave(this);
    this.currentDrawing = new Drawing();
    this.checkDrawing();
  }

  setNewService( newService: NewProjectService): void {
    this.newService = newService;
  }

  saveDrawing(): void {
    this. currentDrawing = new Drawing();
    this.currentDrawing.surfaceList = this.drawService.surfaceList;
    this.currentDrawing.backgroundColor = this.newService.backgroundColor;
    const svgDimensions: [string, string] =
    [this.newService.modalData.width.toString(tenBasix), this.newService.modalData.height.toString(tenBasix)];
    this.currentDrawing.svgDimensions = svgDimensions;
    localStorage.setItem('draw', JSON.stringify(this.currentDrawing));
    localStorage.setItem('date', new Date().toLocaleString());
  }

  saveUxDisplay(themeIcon: string): void {
    localStorage.setItem('help', JSON.stringify(this.mapService.helpChecked));
    themeIcon = themeIcon ===  'brightness_3' ? 'brightness_5' : 'brightness_3';
    localStorage.setItem('style', themeIcon);
  }

  setUxDisplay(): string {
    const help = localStorage.getItem('help');
    const style = localStorage.getItem('style');
    if (help !== null && style !== null) {
      this.mapService.helpChecked = JSON.parse(help as string);
      return style;
    }
    return '';
  }

  private checkDrawing(): void {
    this.isLoad = false;
    this.date = '';
    const currentDrawing = localStorage.getItem('draw');
    const date = localStorage.getItem('date');
    if (currentDrawing !== null && date !== null) {
      this.currentDrawing = JSON.parse(currentDrawing);
      this.date = 'Derniere ouverture : ' + date;
      this.isLoad = true;
      return;
    }
  }

  continueDraw(): void {
    if (this.isLoad) {
    Object.setPrototypeOf(this.currentDrawing.backgroundColor, Color.prototype);
    this.currentDrawing.surfaceList.forEach((path) => {
        Object.setPrototypeOf(path, Path.prototype);
      });
    this.drawService.surfaceList = this.currentDrawing.surfaceList;
    this.drawService.indexList = this.currentDrawing.surfaceList.length - 1;
    const dimension =  this.currentDrawing.svgDimensions;
    this.newService.modalData.width = parseInt(dimension[0], 10);
    this.newService.modalData.height = parseInt(dimension[1], 10);
    const color = this.currentDrawing.backgroundColor;
    this.newService.backgroundColor = new Color(color.redValue, color.greenValue, color.blueValue, color.opacityValue);
    this.undoRedoService.initOnLoad();
    }
  }
}

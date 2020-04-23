import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Color } from 'src/app/Models/color';
import { WindowSize } from 'src/app/Models/interfaces';
import { Data } from 'src/app/Models/modal-data';
import { AutoSaveService } from '../autoSave/auto-save.service';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';
const maxRGB = 255;
const side = 50;
@Injectable({
  providedIn: 'root'
})

export class NewProjectService {

  modalData: Data;
  canResize: boolean;
  isModalOpen: boolean;
  isLarger: boolean;
  isHigher: boolean;
  backgroundColor: Color;
  windowsEvent: Subject<WindowSize>;
  readonly sideBar: number;
  constructor(
    private pickerService: ColorPickerService,
    private drawService: DrawingServiceService,
    private autoSave: AutoSaveService,
    private undoRedo: UndoRedoService,
    private eventManager: EventManager) {
      this.autoSave.setNewService(this);
      this.undoRedo.setNewService(this);
      this.modalData = new Data ();
      this.modalData.width = window.innerWidth - side;
      this.modalData.height = window.innerHeight;
      this.canResize = false;
      this.isModalOpen = false;
      this.isLarger = false;
      this.isHigher = false;
      this.sideBar = side;
      this.backgroundColor = new Color(maxRGB, maxRGB, maxRGB);
      this.windowsEvent = new Subject<WindowSize>();
      this.eventManager.addGlobalEventListener('window', 'resize', this.windowsResize.bind(this));
      this.autoSave.continueDraw();
  }

  windowsResize(event: Event): void {
    const value = event.target as Window;
    const windowSize: WindowSize = {
      width: value.innerWidth - this.sideBar,
      height: value.innerHeight
    };
    this.windowsEvent.next(windowSize);
  }

  reset(): void {
    this.drawService.paths.selection.d = '';
    this.drawService.surfaceList = [];
    this.drawService.jonctions = [];
    this.drawService.indexList = 0;
    this.drawService.paths.controlePoint.d = '';
    this.backgroundColor.copyColor(this.pickerService.backGroundColor);
    this.pickerService.backGroundColor = new Color(maxRGB, maxRGB, maxRGB);
  }

}

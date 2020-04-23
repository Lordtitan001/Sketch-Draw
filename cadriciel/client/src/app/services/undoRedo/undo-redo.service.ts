
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Color } from 'src/app/Models/color';
import { ActionList, DataList } from 'src/app/Models/interfaces';
import { Path } from 'src/app/Models/shapes/path';
import { AutoSaveService } from '../autoSave/auto-save.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { NewProjectService } from '../new-project/new-project.service';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {
  actions: ActionList;
  private data: DataList;
  private surfaceListSub: Subject<[Path[], number, Color]>;
  private autoSave: AutoSaveService;
  private newService: NewProjectService;
  isNew: boolean;
  constructor(private drawService: DrawingServiceService) {
    this.actions = {
      lastActionsList : [[]],
      redoList : [[]],
    };
    this.data = {
      lastIndexList : [],
      lastColorList: [],
      redoColorList: [],
      redoIndexList: [],
    };
    this.data.lastIndexList.push(this.drawService.indexList);
    this.surfaceListSub = new Subject();
    this.initSubscribe();
    this.isNew = false;
 }

  undo(): void {
    this.actions.redoList.push( this.deepSurfaceCopy(this.actions.lastActionsList.pop() as Path[]));
    this.data.redoIndexList.push(this.data.lastIndexList.pop() as number);
    this.data.redoColorList.push(this.deepColorCopy(this.data.lastColorList.pop() as Color));
    this.surfaceListUpdate();
  }

  redo(): void {
    this.actions.lastActionsList.push(this.deepSurfaceCopy(this.actions.redoList.pop() as Path []));
    this.data.lastIndexList.push(this.data.redoIndexList.pop() as number);
    this.data.lastColorList.push(this.deepColorCopy(this.data.redoColorList.pop() as Color) );
    this.surfaceListUpdate();
    console.log('redo', this.drawService.surfaceList)
  }

  private surfaceListUpdate(): void {
    this.drawService.surfaceList = this.deepSurfaceCopy(this.actions.lastActionsList[this.actions.lastActionsList.length - 1]);
    this.drawService.indexList = this.data.lastIndexList[this.data.lastIndexList.length - 1];
    this.newService.backgroundColor = this.deepColorCopy(this.data.lastColorList[this.data.lastColorList.length - 1]);
    this.drawService.visualisation = '';
    this.drawService.elements.controle.setAttribute('d', '');
    this.drawService.elements.selectionElement.setAttribute('d', '');
    this.autoSave.saveDrawing();
  }

  private deepSurfaceCopy(surfaceList: Path[]): Path[] {
      const deepCopySurfaceList = surfaceList.map((path: Path) => path.copy());
      return deepCopySurfaceList;
  }

  update(): void {
    const surfaceList = this.deepSurfaceCopy(this.drawService.surfaceList);
    const color = this.deepColorCopy(this.newService.backgroundColor);
    this.surfaceListSub.next([surfaceList, this.drawService.indexList, color]);
    this.autoSave.saveDrawing();
    this.isNew = false;
    console.log('update', this.drawService.surfaceList)
  }

  setAutoSave(autoSave: AutoSaveService): void {
    this.autoSave = autoSave;
  }

  setNewService(newService: NewProjectService): void {
    this.newService = newService;
  }

  private initSubscribe(): void {
    this.surfaceListSub.subscribe((surfaceList: [Path[], number, Color]) => {
      this.actions.lastActionsList.push(surfaceList[0]);
      this.data.lastIndexList.push(surfaceList[1]);
      this.actions.redoList = [[]];
      this.data.redoIndexList = [];
      this.data.lastColorList.push(this.deepColorCopy(surfaceList[2]));
      this.data.redoColorList = [];
    });
  }

  private deepColorCopy(color: Color): Color {
    const newColor = new Color();
    newColor.copyColor(color);
    return newColor;
  }

  initOnLoad(): void {
    this.actions.lastActionsList = [[]];
    this.actions.lastActionsList[this.actions.lastActionsList.length - 1 ] = this.deepSurfaceCopy(this.drawService.surfaceList);
    this.data.lastIndexList =  [];
    this.data.lastIndexList.push(this.drawService.indexList);
    this.actions.redoList = [[]];
    this.data.redoIndexList = [];
    this.data.lastColorList[this.data.lastColorList.length - 1] = this.deepColorCopy(this.newService.backgroundColor);
    this.data.redoColorList = [];
    this.autoSave.saveDrawing();
  }

 }

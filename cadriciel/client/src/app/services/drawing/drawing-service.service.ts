import { Injectable } from '@angular/core';
import { EnumTool } from 'src/app/Models/enums';
import { DrawingElement, GridProperty, ImageSelected, SelectionPath } from 'src/app/Models/interfaces';
import { BasicObject } from 'src/app/Models/shapes/basic-object';
import { Path } from 'src/app/Models/shapes/path';
import { MapService } from '../maps/map.service';
const opacity = 0.5;
@Injectable({
  providedIn: 'root'
})
export class DrawingServiceService {

  selectedTools: BasicObject;
  surfaceList: Path[];
  jonctions: Path[];
  indexList: number;
  isModalOpen: boolean;
  elements: DrawingElement;
  enumTool: EnumTool = EnumTool.Any;
  visualisation: string;
  images: ImageSelected;
  grid: GridProperty;
  paths: SelectionPath;

  constructor(private maps: MapService) {
    this.indexList = 0;
    this.images = {
      imageToolSelected: 'create',
      imageShapeSelected: 'crop_3_2',
    };
    this.isModalOpen = false;
    this.jonctions = [];
    this.surfaceList = [];
    this.visualisation = '';
    this.paths = {
      selection: new Path(),
      eraser: new Path(),
      controlePoint: new Path()
    };
    this.grid = {
      gridImage: 'grid_off',
      gridContent: '',
      gridOpacity: opacity
    };
    this.selectedTools = new BasicObject();
    this.elements = {} as unknown as DrawingElement;
  }

  async keyDown(event: KeyboardEvent): Promise<boolean> {
    if (this.isModalOpen) {
      return Promise.resolve(false);
    }
    let test = false;
    const keyTool = this.maps.keyMapTool.get(event.code);
    const keyShape = this.maps.keyMapShape.get(event.code);
    if (keyShape) {
      this.images.imageShapeSelected = keyShape.imageName;
      this.enumTool = keyShape.enum;
      test = true;
    }
    if (keyTool) {
      this.images.imageToolSelected = keyTool.imageName;
      this.enumTool = keyTool.enum;
      test = true;
    }

    this.selectTool();
    return Promise.resolve(test);
  }

  unselectTool(): void {
    this.enumTool = EnumTool.Any;
    this.selectTool();
  }

  selectTool(): void {
    const selected = this.maps.toolsMap.get(this.enumTool);
    this.selectedTools = selected as Path;
  }

  getTools(): BasicObject {
    return this.selectedTools;
  }
}

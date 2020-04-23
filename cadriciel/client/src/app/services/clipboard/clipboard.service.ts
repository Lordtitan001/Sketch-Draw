import { Injectable } from '@angular/core';
import { Path } from 'src/app/Models/shapes/path';
import { Point } from 'src/app/Models/shapes/point';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { MagnetsimService } from '../magnetsim/magnetsim.service';
import { SelectionMoveService } from '../selection-move/selection-move.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';
const coordinate = 20;

@Injectable({
  providedIn: 'root',
})
export class ClipboardService extends SelectionMoveService {
  private copiedList: SVGElement[];
  private tempList: SVGElement[];
  private pathTab: Path[];
  private pasteOffset: number;
  private duplicateOffset: number;
  private isCut: boolean;
  private clipboardTab: SVGElement[];
  private cutTab: Path[];
  private pasteTime: number;
  private duplicationTime: number;

  constructor(protected drawService: DrawingServiceService, protected undoRedoService: UndoRedoService,
              protected magnetsim: MagnetsimService) {
    super(drawService, undoRedoService, magnetsim);
    this.copiedList = [];
    this.pathTab = [];
    this.tempList = [];
    this.cutTab = [];
    this.canPaste = false;
    this.pasteOffset = 0;
    this.duplicateOffset = 0;
    this.clipboardTab = [];
    this.isCut = false;
    this.duplicationTime = 0;
    this.pasteTime = 0;
  }
  keyDown(event: KeyboardEvent): void {
    event.preventDefault();
    this.mapEvent[event.code] = event.type === 'keydown';
    event.code === 'Backspace' ? this.deleteWithBackspace(event) : this.selectAction(event);
  }
  selectAction(event: KeyboardEvent): void {
    if ( event.ctrlKey && event.code === 'KeyA') {
      this.selectAll();
      return;
    }
    if (event.ctrlKey && event.code === 'KeyC') {
      this.stepToCopy(event);
      return;
    }
    if (event.ctrlKey && event.code === 'KeyD') {
      this.stepToDuplicate();
      return;
    }
    if (event.ctrlKey && event.code === 'KeyV') {
      this.stepToPaste();
      return;
    }
    if (event.ctrlKey && event.code === 'KeyX') {
      this.deleteWithBackspace(event);
      return;
    }
    this.selectArrowKey();
  }

  private stepToCopy(event: KeyboardEvent): void {
    this.pasteOffset = 0;
    this.pasteTime = 0;
    this.duplicationTime = 0;
    this.initialiseCopy(event);
    this.isCut = false;
  }
  private stepToDuplicate(): void {
    this.duplicateOffset += 2 * coordinate;
    this.duplicationTime++;
    this.copyElements(this.selectionArray.listSelected, this.duplicateOffset);
    this.drawElements(this.pathTab, this.duplicateOffset);
    this.cropDraw(this.duplicateOffset, this.duplicationTime, 'duplicate');
  }
  private stepToPaste(): void {
    this.pasteOffset += coordinate;
    this.pasteTime++;
    if (this.isCut) {
      const newTab: Path[] = [];
      for (const element of this.cutTab) {
        const newElement = element.copy();
        const newId = new Path();
        newElement.id = newId.id;
        newTab.push(newElement);
      }
      this.drawElements(newTab, this.pasteOffset);
      this.cropDraw(this.pasteOffset, this.pasteTime, 'paste');
      // console.log('Decalage', this.pasteOffset);
      // console.log('FOIS', this.pasteTime);
    }
    if (this.canPaste === true && !this.isCut) {
      this.copyElements(this.copiedList, this.pasteOffset);
      this.drawElements(this.pathTab, this.pasteOffset);
      this.cropDraw(this.pasteOffset, this.pasteTime, 'paste');
    }

}

  copyElements(tab: SVGElement[], offset: number): Path[] {
    this.pathTab = [];
    this.tempList = [];
    for (const element of tab) {
      const id = parseInt((element.getAttribute('id') as string), 10);
      const index = this.drawService.surfaceList.findIndex((path) => (path.id === id));
      const newElement = this.drawService.surfaceList[index].copy();
      newElement.transform = String (element.getAttribute('transform'));
      const newId = new Path();
      newElement.id = newId.id;
      this.pathTab.push(newElement);
    }
    return this.pathTab;
  }

  drawElements(tab: Path[], offset: number): void {

    for (const element of tab) {
      const tranform = this.getTransAndRotateFromPath(element);
      const translate = this.addTranslation({x: offset, y: offset}, tranform[0]);
      const newTransform = translate + ' ' + tranform[1];
      element.transform = newTransform;
      this.drawService.surfaceList.push(element);
      if (this.drawService.surfaceList.length > this.drawService.indexList) {
        this.drawService.indexList++;
      }
    }
    this.updateListSelected(tab);
    // console.log('right---', this.drawService.elements.controle.getBoundingClientRect().top);
  }
  updateListSelected(tab: Path[]): void {
    console.log(this.drawService.elements.svg);
    console.log('PATHHH---', this.drawService.elements.svg.getElementsByTagName('path'));
    setTimeout(() => {
      this.tempList = [];
      for (const element of tab) {
        this.tempList.push(this.drawService.elements.svg.getElementById(element.id.toString()) as SVGElement);
      }
      this.selectionArray.listSelected = this.tempList;
      this.createSelectionRectWithArray();
    }, 0);
  }
  private getTransAndRotateFromPath(element: Path): [string, string] {
    const transform = element.transform;
    const indexR = transform.search('rotate');
    const trans = (-indexR !== 1) ? transform.slice(0, indexR) : transform;
    const rotation = (-indexR !== 1) ? transform.slice(indexR) : '';
    return [trans, rotation];
  }

  private deleteWithBackspace(event: KeyboardEvent): void {
    this.cutTab = [];
    this.isCut = true;
    this.initialiseCopy(event);
    this.initialiseCut(this.copiedList, this.pasteOffset);
    this.copyElements(this.copiedList, this.pasteOffset);
    this.deleteDraw(this.selectionArray.listSelected);
  }
  private initialiseCopy(event: KeyboardEvent): void {
    this.clipboardTab = [];
    this.copiedList = [];
    for (const element of this.selectionArray.listSelected) {
      const newElem = element.cloneNode(true) as SVGElement;
      this.clipboardTab.push(newElem);
      this.copiedList.push(newElem);
      }
    this.pasteOffset = 0;
    this.canPaste = true;
    this.pasteMove = false;
  }
  private deleteDraw(tab: SVGElement[]): void {
    for (const element of tab) {
      const id = parseInt((element.getAttribute('id') as string), 10);
      const index = this.drawService.surfaceList.findIndex((path) => (path.id === id));
      this.drawService.surfaceList.splice(index, 1);
    }
    this.selectionArray.listSelected = [];
    this.undoRedoService.update();
    this.createSelectionRectWithArray();
  }
    private initialiseCut(tab: SVGElement[], offset: number): void {
    this.cutTab = [];
    for (const element of tab) {
      const id = parseInt((element.getAttribute('id') as string), 10);
      const index = this.drawService.surfaceList.findIndex((path) => (path.id === id));
      const newElement = this.drawService.surfaceList[index].copy();
      newElement.transform = String (element.getAttribute('transform'));
      const newId = new Path();
      newElement.id = newId.id;
      this.cutTab.push(newElement);
    }
  }
  private cropDraw(offset: number, time: number, type: string): void {
    console.log('TOP--', this.drawService.elements.controle.getBoundingClientRect().top);
    console.log('BOTTOM--', this.drawService.elements.controle.getBoundingClientRect().bottom);
    console.log('RIGHT--', this.drawService.elements.controle.getBoundingClientRect().right);
    console.log('LEFT--', this.drawService.elements.controle.getBoundingClientRect().left);
    // console.log('Width--', this.drawService.elements.svg.width.baseVal.value);
    // // console.log('HEIGHT--', this.drawService.elements.svg.height.baseVal.value);

    const isOut =
    this.drawService.elements.controle.getBoundingClientRect().bottom >  this.drawService.elements.svg.height.baseVal.value ||
    this.drawService.elements.controle.getBoundingClientRect().right >  this.drawService.elements.svg.width.baseVal.value ||
    this.drawService.elements.controle.getBoundingClientRect().top < 0 ||
    this.drawService.elements.controle.getBoundingClientRect( ).left < 0;
    if (isOut) {
      setTimeout(() => {
        const point = new Point(-offset, -offset);
        this.moveWithArrowKey(point);
      }, 0);
      if (type === 'paste') {
        this.pasteOffset = 0;
        this.pasteTime = 0;
      } else {
        this.duplicateOffset = 0;
        this.duplicationTime = 0;

      }

    }
    this.undoRedoService.update();
    console.log(this.drawService.surfaceList);
    console.log('OUTTTT---', isOut);
    // console.log('XXXXX---', this.drawService.elements.controle.getBoundingClientRect().x);
    // console.log('YYYY---', this.drawService.elements.controle.getBoundingClientRect().y);

  }

}

import { Injectable } from '@angular/core';
import { ControlePointElement, Dimension, DragState, SelectionArray } from 'src/app/Models/interfaces';
import { Path } from 'src/app/Models/shapes/path';
import { Point } from 'src/app/Models/shapes/point';
import { isNullOrUndefined } from 'util';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';
const side = 50;
const control = 10;
@Injectable({
  providedIn: 'root'
})
export class SelectionService extends AbstractToolsService {

  private origin: Point;
  private minPoint: Point;
  private ctrlPoint: number;
  private dimension: Dimension;
  protected selectionArray: SelectionArray;
  protected dragState: DragState;
  private leftClick: boolean;
  protected boundingMap: Map<string, DOMRect|ClientRect>;
  constructor(protected drawService: DrawingServiceService, protected undoRedoService: UndoRedoService) {
    super();
    this.boundingMap = new Map<string, DOMRect|ClientRect>();
    this.origin = new Point(0, 0);
    this.minPoint = new Point(0, 0);
    this.canDraw = false;
    this.side = side;
    this.ctrlPoint = control;
    this.dimension = { width: 0, height: 0 };
    this.selectionArray = { listSelected: [], tempArray: [], tempSelected: [] };
    this.dragState = { hasSelected: false, isDraging: false, origin: new Point(0, 0), nextPoint: new Point(0, 0) };
    window.oncontextmenu = () => {
      return false;
    };
  }

  mouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.leftClick = event.button === 0 ? true : false;
    this.origin.x = event.offsetX;
    this.origin.y = event.offsetY;
    this.canDraw = true;

    if (!this.leftClick) {
      return;
    }

    this.dragState.isDraging =
      (this.drawService.elements.selectionElement === event.target) ? true : false;
    if ((this.drawService.elements.svg === event.target)) {
      this.drawService.elements.selectionElement.setAttribute('d', '');
      this.drawService.elements.controle.setAttribute('d', '');
      this.drawService.elements.selectionElement.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
      this.drawService.elements.controle.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
      this.selectionArray.listSelected = [];
      this.selectionArray.tempSelected = [];
    }

    if (this.dragState.isDraging) {
      const owner = this.drawService.elements.svg.ownerDocument as Document;
      this.drawService.elements.selectionElement.setAttribute('pointer-events', 'none');
      const target = owner.elementFromPoint(event.clientX, event.clientY) as SVGElement;
      this.drawService.elements.selectionElement.setAttribute('pointer-events', 'all');
      const isSelected = (-this.selectionArray.listSelected.findIndex((elemment) => elemment.id === target.id) !== 1);
      if (target.id !== this.drawService.elements.svg.id && !isSelected) {
        this.selectionArray.listSelected = [];
        this.selectionArray.tempSelected = [];
        this.selectionArray.listSelected.push(target);
        this.createSelectionRectWithArray();
      }
      this.dragState.origin = { x: event.offsetX, y: event.offsetY };
      this.dragState.nextPoint = { x: event.offsetX, y: event.offsetY };
      this.selectionArray.listSelected.push(this.drawService.elements.selectionElement);
      this.selectionArray.listSelected.push(this.drawService.elements.controle);
      return;
    }

    this.drawService.elements.selectionElement.setAttribute('d', '');
    this.drawService.elements.controle.setAttribute('d', '');
    this.drawService.elements.selectionElement.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
    this.drawService.elements.controle.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
    this.drawService.paths.controlePoint = new Path();

  }

  mouseLeave(): void {
    this.drawService.visualisation = '';
    this.origin.x = 0;
    this.origin.y = 0;
    this.canDraw = false;
    this.minPoint = new Point(0, 0);
    this.dimension = { width: 0, height: 0 };
    this.dragState.isDraging = false;
    // this.reset();
  }

  mouseUp(): void {
    this.canDraw = false;
    this.drawService.visualisation = '';
    this.selectionArray.tempSelected = Object.assign([], this.selectionArray.listSelected);
    if (this.dragState.isDraging) {
      this.selectionArray.listSelected.pop();
      this.selectionArray.listSelected.pop();
    }
    this.dragState.origin = new Point(0, 0);
    this.dragState.nextPoint = new Point(0, 0);
    this.dragState.isDraging = false;
    // console.log('Selection------', this.selectionArray.listSelected);
    // console.log('Suarafce --- ', this.drawService.surfaceList[this.drawService.indexList].d);

  }

  mouseClickPath(event: MouseEvent): void {
    const action = () => {
      this.dragState.isDraging = false;
      this.dragState.hasSelected = false;
      this.undoRedoService.update();
    };

    if (this.dragState.hasSelected) {
      action();
      return;
    }

    this.drawService.elements.selectionElement.setAttribute('pointer-events', 'none');
    const eventTarget = (this.drawService.elements.svg.ownerDocument as Document)
      .elementFromPoint(event.clientX, event.clientY) as unknown as SVGElement;
    const target = this.drawService.elements.svg.getElementById(eventTarget.id) as SVGElement;

    this.drawService.elements.selectionElement.setAttribute('pointer-events', 'all');

    this.leftClick = event.button === 0 ? true : false;
    const index = this.selectionArray.listSelected.findIndex((value) => target === value);
    if (isNullOrUndefined(target)) {
      if (this.leftClick) {
        this.selectionArray.listSelected = [];
        this.selectionArray.tempSelected = [];
      }
      this.createSelectionRectWithArray();
      action();
      return;
    }
    if (!this.leftClick) {
      if (-index === 1) {
        this.selectionArray.listSelected.push(target);
        this.selectionArray.tempSelected.push(target);
      } else {
        this.selectionArray.listSelected.splice(index, 1);
        this.selectionArray.tempSelected.splice(index, 1);
      }
      this.createSelectionRectWithArray();
      action();
      return;
    }

    this.selectionArray.listSelected = [];
    this.selectionArray.tempSelected = [];
    this.selectionArray.listSelected.push(target);
    this.selectionArray.tempSelected.push(target);

    this.createSelectionRectWithArray();
    action();
  }
  mouseDownPath(event: MouseEvent): void {
    this.canDraw = true;
    this.origin.x = event.offsetX;
    this.origin.y = event.offsetY;
  }
  mouseMoveSelection(event: MouseEvent): void {
    const width = event.offsetX - this.origin.x;
    const height = event.offsetY - this.origin.y;
    const svg = this.drawService.elements.svg;
    const domRect = this.drawService.elements.domRect.getBoundingClientRect();
    const value = svg.createSVGRect();

    value.x = domRect.left - this.side;
    value.y = domRect.top;
    value.width = domRect.width;
    value.height = domRect.height;
    this.drawService.visualisation =
      `M ${this.origin.x} ${this.origin.y} h ${width} v ${height} h ${-width} Z`;

    this.leftClick ?
      this.createSelectionRect(svg.getIntersectionList(value, svg)) :
      this.createDeselectionRect(svg.getIntersectionList(value, svg));
  }

  reset(): void {
    this.drawService.visualisation = '';
    this.origin.x = 0;
    this.origin.y = 0;
    this.canDraw = false;
    this.minPoint = new Point(0, 0);
    this.dimension = { width: 0, height: 0 };
    this.drawService.elements.selectionElement.setAttribute('pointer-events', 'all');
    this.drawService.elements.selectionElement.setAttribute('d', '');
    this.drawService.elements.controle.setAttribute('d', '');
    this.selectionArray = { listSelected: [], tempArray: [], tempSelected: [] };
  }

  selectAll(): void {
    this.drawService.paths.controlePoint = new Path();
    const svg = this.drawService.elements.svg;
    const value = svg.createSVGRect();
    value.x = 0;
    value.y = 0;
    value.width = svg.getBoundingClientRect().width;
    value.height = svg.getBoundingClientRect().height;
    const controle = this.createSelectionRect(svg.getIntersectionList(value, svg));
    const dimension: Dimension = { width: controle.width, height: controle.height };
    this.createControlePoint(controle.minPoint, dimension);
  }

  createDeselectionRect(list: NodeListOf<SVGElement>): void {
    this.selectionArray.tempArray = [];
    list.forEach((element) => {
      this.selectionArray.tempArray.push(element);
    });

    this.selectionArray.tempArray.forEach((element) => {
      const index = this.selectionArray.listSelected.findIndex((value) => element === value);
      const index2 = this.selectionArray.tempSelected.findIndex((value) => element === value);
      const testElement = element.id !== 'selection' && element.id !== 'controle' && element.id !== 'preview';
      if (!testElement) {
        return true;
      }
      if (-index2 !== 1) {
        if (-index !== 1) {
          this.selectionArray.listSelected.splice(index, 1);
        }
        return true;
      }
      if (-index === 1) {
        this.selectionArray.listSelected.push(element);
        return true;
      }
      return true;
    });

    for (const element of this.selectionArray.tempSelected) {
      const testElement = element.id !== 'selection' && element.id !== 'controle' && element.id !== 'preview';
      const index = this.selectionArray.listSelected.findIndex((value) => element === value);
      const index2 = this.selectionArray.tempArray.findIndex((value) => element === value);
      if (-index === 1 && -index2 === 1 && testElement) {
        this.selectionArray.listSelected.push(element);
      }
    }

    for (const element of this.selectionArray.listSelected) {
      const index = this.selectionArray.tempSelected.findIndex((value) => element === value);
      const index2 = this.selectionArray.tempArray.findIndex((value) => element === value);
      if (-index === 1 && -index2 === 1) {
        this.selectionArray.listSelected.splice(this.selectionArray.listSelected.findIndex((value) => element === value), 1);
      }
    }
    this.drawService.paths.controlePoint = new Path();
    this.minPoint = new Point(0, 0);
    this.dimension = { width: 0, height: 0 };
    this.createSelectionRectWithArray();
  }

  createSelectionRectWithArray(): ControlePointElement {
    const maxPoint = new Point(0, 0);
    if (this.selectionArray.listSelected.length > 0) {
      const selected = this.selectionArray.listSelected[0].getBoundingClientRect();
      this.minPoint.x = selected.left;
      this.minPoint.y = selected.top;
      maxPoint.x = this.minPoint.x + selected.width;
      maxPoint.y = this.minPoint.y + selected.height;
    }
    return this.createRect(maxPoint);
  }

  createSelectionRect(list: NodeListOf<SVGElement>): ControlePointElement {
    this.selectionArray.listSelected = [];
    this.drawService.paths.controlePoint = new Path();
    this.minPoint = new Point(0, 0);
    this.dimension = { width: 0, height: 0 };
    const maxPoint = new Point(0, 0);
    if (list.item(0) && list.length > 0) {
      const selected = list.item(0).getBoundingClientRect();
      this.minPoint.x = selected.left;
      this.minPoint.y = selected.top;
      maxPoint.x = this.minPoint.x + selected.width;
      maxPoint.y = this.minPoint.y + selected.height;
      list.forEach((element) => {
        const areNotSelected = element.id !== 'selection' && element.id !== 'controle' && element.id !== 'preview';
        if (areNotSelected) {
          this.selectionArray.listSelected.push(element);
        }
      });

      this.selectionArray.tempSelected = Object.assign([], this.selectionArray.listSelected);
    }
    return this.createRect(maxPoint);
  }

  createRect(maxPoint: Point): ControlePointElement {
    this.selectionArray.listSelected.forEach((element) => {
      const box = element.getBoundingClientRect();
      this.boundingMap.set(element.id, box);
      this.minPoint.x = (this.minPoint.x > box.left) ? box.left : this.minPoint.x;
      this.minPoint.y = (this.minPoint.y > box.top) ? box.top : this.minPoint.y;
      maxPoint.x = (maxPoint.x < box.left + box.width) ? box.left + box.width : maxPoint.x;
      maxPoint.y = (maxPoint.y < box.top + box.height) ? box.top + box.height : maxPoint.y;
    });

    this.dimension = { width: maxPoint.x - this.minPoint.x, height: maxPoint.y - this.minPoint.y };
    this.drawService.elements.controle.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
    this.drawService.elements.selectionElement.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');

    const path = `M ${this.minPoint.x - this.side} ${this.minPoint.y}
    h ${this.dimension.width} v ${this.dimension.height} h ${-this.dimension.width} Z`;
    this.drawService.elements.selectionElement.setAttribute('fill', 'rgba(183, 209, 0, 0.03)');
    this.drawService.elements.selectionElement.setAttribute('stroke', 'rgba(233, 228, 240, 1)');
    (this.selectionArray.listSelected.length === 0) ?
    this.drawService.elements.selectionElement.setAttribute('d', '')
      : this.drawService.elements.selectionElement.setAttribute('d', path);
    this.createControlePoint(this.minPoint, this.dimension);

    return { minPoint: this.minPoint, width: this.dimension.width, height: this.dimension.height };
  }

  createControlePoint(minPoint: Point, dimension: Dimension): void {
    const point1 = new Point((minPoint.x - this.side) + dimension.width / 2, minPoint.y - control / 2);
    const point2 = new Point((minPoint.x - this.side) - control / 2, minPoint.y + dimension.height / 2);
    const point3 = new Point((minPoint.x - this.side) + dimension.width / 2, minPoint.y + dimension.height - control / 2);
    const point4 = new Point((minPoint.x - this.side) + dimension.width - control / 2, minPoint.y + dimension.height / 2);

    const path1 = new Path();
    path1.d = ` M ${point1.x} ${point1.y} h ${this.ctrlPoint} v ${this.ctrlPoint} h ${-this.ctrlPoint} Z`;
    path1.d += ` M ${point2.x} ${point2.y} h ${this.ctrlPoint} v ${this.ctrlPoint} h ${-this.ctrlPoint} Z`;
    path1.d += ` M ${point3.x} ${point3.y} h ${this.ctrlPoint} v ${this.ctrlPoint} h ${-this.ctrlPoint} Z`;
    path1.d += ` M ${point4.x} ${point4.y} h ${this.ctrlPoint} v ${this.ctrlPoint} h ${-this.ctrlPoint} Z`;

    (this.selectionArray.listSelected.length === 0) ? path1.d = '' : path1.d = path1.d;
    this.drawService.elements.controle.setAttribute('d', path1.d);
    this.drawService.elements.controle.setAttribute('stroke', path1.stroke);
    this.drawService.elements.controle.setAttribute('fill', 'rgba(233, 228, 240, 1)');
  }
}

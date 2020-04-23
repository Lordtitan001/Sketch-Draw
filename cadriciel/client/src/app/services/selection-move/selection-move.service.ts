import { Injectable } from '@angular/core';
import { Point } from 'src/app/Models/shapes/point';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { MagnetsimService } from '../magnetsim/magnetsim.service';
import { SelectionService } from '../selection/selection.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';
const increment = 3;
const divider = 12;
const maxAngle = 360;
const side = 50;
@Injectable({
  providedIn: 'root'
})
export class SelectionMoveService extends SelectionService {

  private canMove: boolean;
  private oldCenter: Point;
  protected canPaste: boolean;
  protected pasteMove: boolean;
  constructor(protected drawService: DrawingServiceService,
              protected undoRedoService: UndoRedoService,
              protected magnetsim: MagnetsimService) {
    super(drawService, undoRedoService);
    this.canMove = true;
  }

  keyUp(event: KeyboardEvent): void {
    event.preventDefault();
    this.mapEvent[event.code] = event.type === 'keydown';
  }

  mouseWheel(event: WheelEvent): void {
    event.preventDefault();
    const bounding = this.drawService.elements.selectionElement.getBoundingClientRect();
    const centerX = bounding.left + bounding.width / 2 - side;
    const centerY = bounding.top + bounding.height / 2;
    this.oldCenter = new Point(centerX, centerY);
    let direction = 1;
    direction *= (event.deltaY <= 0) ? direction : -direction;
    this.rotateSelection(direction, event);
  }

  protected moveWithArrowKey(translation: Point): void {
    this.selectionArray.listSelected.push(this.drawService.elements.selectionElement);
    this.selectionArray.listSelected.push(this.drawService.elements.controle);

    for (const value of this.selectionArray.listSelected) {
      const part = this.getTransAndRotate(value as SVGPathElement);
      const point = (this.magnetsim.isActive) ?
      this.magnetsim.findPointToTranslate(this.drawService.elements.selectionElement, translation, [translation.x, translation.y], true) :
      translation;
      const transform = this.addTranslation(point, part[0]) + ' ' + part[1];
      const animate = value.animate([], { delay: 100, iterations: 1 });
      animate.addEventListener('finish', () => {
        this.animateOnFinish(value, transform);
      });
      ///
      // const id = parseInt((value.getAttribute('id') as string), 10);
      // const index = this.drawService.surfaceList.findIndex((path) => (path.id === id));
      // this.drawService.surfaceList[index].transform = transform;
    }
    // this.translocateSelection(translation, this.selectionArray.listSelected);

    this.selectionArray.listSelected.pop();
    this.selectionArray.listSelected.pop();
  }
  // protected translocateSelection(translation: Point, tab: SVGElement[]): void  {
  //   for (const value of tab) {
  //     const part = this.getTransAndRotate(value as SVGPathElement);
  //     const transform = this.addTranslation(translation, part[0]) + ' ' + part[1];
  //     const animate = value.animate([], { delay: 100, iterations: 1 });
  //     animate.addEventListener('finish', () => {
  //       this.animateOnFinish(value, transform);
  //     });
  //   }

  // }
  private animateOnFinish(element: SVGElement, transform: string): void {
    this.canMove = true;
    element.setAttribute('transform', transform);
  }

  mouseMove(event: MouseEvent): void {
    event.preventDefault();
    if (!this.canDraw) {
      return;
    }
    (this.dragState.isDraging) ?
      this.moveSelection(event) : this.mouseMoveSelection(event);
  }

  moveSelection(event: MouseEvent): void {
    this.dragState.origin = this.dragState.nextPoint;
    this.dragState.nextPoint = { x: event.offsetX, y: event.offsetY };
    let point = new Point(this.dragState.nextPoint.x - this.dragState.origin.x, this.dragState.nextPoint.y - this.dragState.origin.y);
    this.dragState.hasSelected = true;
    point = (this.magnetsim.isActive) ?
        this.magnetsim.findPointToTranslate(this.drawService.elements.selectionElement, point, [event.offsetX, event.offsetY], false) :
        point;

    for (const value of this.selectionArray.listSelected) {
      const part = this.getTransAndRotate(value as SVGPathElement);
      const transform = this.addTranslation(point, part[0]) + ' ' + part[1];
      const id = parseInt((value.getAttribute('id') as string), 10);
      const index = this.drawService.surfaceList.findIndex((path) => (path.id === id));
      (-index !== 1) ? this.drawService.surfaceList[index].transform = `${transform}` : value.setAttribute('transform', `${transform}`);
    }
    if (this.canPaste && !this.pasteMove) {
      this.pasteMove = true;
    }
  }

  private getTransAndRotate(element: SVGPathElement): [string, string] {
    const transform = element.getAttribute('transform') as string;
    const indexR = transform.search('rotate');
    const trans = (-indexR !== 1) ? transform.slice(0, indexR) : transform;
    const rotation = (-indexR !== 1) ? transform.slice(indexR) : '';

    return [trans, rotation];
  }

  protected addTranslation(point: Point, translate: string): string {
    const values = translate.split('(')[1].split(')')[0].split(' ');
    const transX = parseFloat(values[0]);
    const transY = parseFloat(values[1]);
    return `translate(${transX + point.x} ${(transY + point.y)})`;
  }
  private addRotation(rotate: string, angleRad: number, center: Point): string {
    let rotation = '';
    const value = rotate.split('(')[1].split(')')[0].split(' ')[0];
    const va = parseFloat(value);
    angleRad -= Math.PI;
    rotation = `rotate(${(((angleRad * maxAngle) / (2 * Math.PI)) + va) % maxAngle} ${center.x} ${center.y})`;
    return rotation;
  }

  private translateAndRotate(center: Point, translate: string, rotate: string, element: SVGPathElement, angleRad: number): string {
    const elCenter = this.getCenter(element);
    const bounding = element.getBoundingClientRect();
    const centerX = bounding.left + bounding.width / 2 - side;
    const centerY = bounding.top + bounding.height / 2;
    const reduction = new Point(0, 0);
    const x = (centerX - center.x) * Math.cos(angleRad) - (centerY - center.y) * Math.sin(angleRad) - (center.x - centerX);
    const y = (centerX - center.x) * Math.sin(angleRad) + (centerY - center.y) * Math.cos(angleRad) - (center.y - centerY);
    reduction.x = -x;
    reduction.y = -y;

    const trans = this.addTranslation(reduction, translate);
    const rot = this.addRotation(rotate, angleRad, elCenter);

    return trans + ' ' + rot;
  }

  private rotateSelection(direction: number, event: WheelEvent): void {

    if (!(this.mapEvent.ShiftLeft || this.mapEvent.ShiftRight)) {
      this.selectionArray.listSelected.push(this.drawService.elements.selectionElement);
      this.selectionArray.listSelected.push(this.drawService.elements.controle);
    }

    let angleRad = (this.mapEvent.AltLeft || this.mapEvent.AltRight) ? direction * Math.PI * 2 / maxAngle : direction * Math.PI / divider;
    angleRad += Math.PI;

    for (const value of this.selectionArray.listSelected) {
      const part = this.getTransAndRotate(value as SVGPathElement);
      let transform = '';
      if ((this.mapEvent.ShiftLeft || this.mapEvent.ShiftRight)) {
        const center = this.getCenter(value as SVGPathElement);
        const rot = this.addRotation(part[1], angleRad, center);
        transform = part[0] + ' ' + rot;
      } else {
        transform = this.translateAndRotate(this.oldCenter, part[0], part[1], value as SVGPathElement, angleRad);
      }
      const id = parseInt((value.getAttribute('id') as string), 10);
      const index = this.drawService.surfaceList.findIndex((path) => (path.id === id));
      (-index !== 1) ? this.drawService.surfaceList[index].transform = `${transform}` : value.setAttribute('transform', `${transform}`);
    }
    if (!(this.mapEvent.ShiftLeft || this.mapEvent.ShiftRight)) {
      this.selectionArray.listSelected.pop();
      this.selectionArray.listSelected.pop();
      return;
    }
    this.createSelectionRectWithArray();
    return;
  }

  private getCenter(element: SVGPathElement): Point {
    const bounding = element.getBBox();
    const center = new Point(bounding.x + bounding.width / 2, bounding.y + bounding.height / 2);
    return center;
  }

  protected selectArrowKey(): void {
    if (!this.canMove) {
      return;
    }
    this.canMove = false;
    let move = false;
    const translation = new Point(0, 0);
    if (this.mapEvent.ArrowRight) {
      translation.x += increment;
      move = true;
    }
    if (this.mapEvent.ArrowLeft) {
      translation.x -= increment;
      move = true;
    }
    if (this.mapEvent.ArrowDown) {
      translation.y += increment;
      move = true;
    }
    if (this.mapEvent.ArrowUp) {
      translation.y -= increment;
      move = true;
    }

    if (move) {
      this.moveWithArrowKey(translation);
      return;
    }
    this.canMove = true;
  }

}

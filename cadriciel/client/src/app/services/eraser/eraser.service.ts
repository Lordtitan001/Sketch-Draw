import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';

const eraseOpacity = 0.75;
const increment = 3;

@Injectable({
  providedIn: 'root'
})
export class EraserService extends AbstractToolsService {
  private elementsUnder: Map<string, string>;
  private changed: boolean;
  constructor(private drawService: DrawingServiceService, private undoRedoService: UndoRedoService) {
    super();
    this.canDraw = false;
    this.changed = false;
    this.elementsUnder = new Map<string, string>();
  }

  reset(): void {
    this.drawService.paths.eraser.d = '';
    this.drawService.elements.selectionElement.setAttribute('d', '');
    this.elementsUnder.forEach((value, id) => {
      const element = this.drawService.elements.svg.getElementById(id) as Element;
      element.setAttribute('stroke', value);
    });

    this.elementsUnder = new Map<string, string>();
    this.changed = false;
  }

  private deleteSelected(): void {
    this.elementsUnder.forEach((strokeValue, id) => {
      const index = this.drawService.surfaceList.findIndex((path) => path.id.toString() === id);
      if (-index !== 1) {
        this.drawService.surfaceList.splice(index, 1);
        this.drawService.indexList--;
        this.changed = true;
      }
    });
  }

  mouseMove(event: MouseEvent): void {
    const width = this.drawService.selectedTools.strokeWidth as unknown as number;
    this.drawService.paths.eraser.d =
      `M ${event.offsetX - width / 2} ${event.offsetY - width / 2} h ${width} v ${width} h ${-width} Z`;
    this.getListElementToErase().then((elementsUnder) => {
      elementsUnder.forEach((value, id) => {
        const element = this.drawService.elements.svg.getElementById(id) as SVGElement;
        if (!isNullOrUndefined(element)) {
          let color = element.getAttribute('stroke') as string;
          color = color.toString();
          const opacity = parseFloat(color.split(', ')[increment].split(')')[0]);
          (opacity > eraseOpacity) ? element.setAttribute('stroke', 'rgb(255,0,0,0.5)')
            : element.setAttribute('stroke', 'rgba(255,0,0,1)');
        }
      });
      this.elementsUnder = elementsUnder;
    });
    if (this.canDraw) {
      this.deleteSelected();
    }
  }
  mouseLeave(): void {
    this.reset();
  }

  private scanRectangle(): void {
    const owner = (this.drawService.elements.svg.ownerDocument as Document);
    const domRect = this.drawService.elements.eraserElement.getBoundingClientRect();
    let changed = false;
    for (let index = domRect.left; index < domRect.width + domRect.left; index += 1) {
      for (let index2 = domRect.top; index2 < domRect.top + domRect.height; index2 += 1) {
        const eventTarget = owner.elementFromPoint(index, index2) as unknown as SVGElement;
        const erased = this.erase(eventTarget);
        changed = changed ? changed : erased;
      }
    }
    if (changed) {
      this.undoRedoService.update();
    }
  }

  private erase(eventTarget: SVGElement): boolean {
    if (eventTarget.id === 'svg') {
      return false;
    }
    const pos = this.drawService.surfaceList.findIndex((path) => (path.id.toString() === eventTarget.id));
    if (-pos !== 1) {
      this.drawService.surfaceList.splice(pos, 1);
      this.drawService.indexList--;
      return true;
    }
    return false;
  }

  mouseDown(): void {
    this.scanRectangle();
    this.canDraw = true;
  }

  mouseUp(): void {
    this.canDraw = false;
    if (this.changed ) {
      this.undoRedoService.update();
    }
    this.changed = false;
  }

  private async getListElementToErase(): Promise<Map<string, string>> {
    const elementsUnder = Object.assign(new Map<string, string>(), this.elementsUnder);
    const owner = (this.drawService.elements.svg.ownerDocument as Document);
    const domRect = this.drawService.elements.eraserElement.getBoundingClientRect();
    let index2 = domRect.top;

    this.elementsUnder.forEach((value, id) => {
      const element = this.drawService.elements.svg.getElementById(id);
      if (!isNullOrUndefined(element)) {
        element.setAttribute('stroke', value);
      }
    });

    return new Promise((resole) => {
      for (let index = domRect.left; index < domRect.width + domRect.left; index += increment) {
        const eventTarget = owner.elementFromPoint(index, domRect.top) as unknown as SVGElement;
        const eventTarget2 = owner.elementFromPoint(index, domRect.top + domRect.height) as unknown as SVGElement;
        const eventTarget3 = owner.elementFromPoint(domRect.left, index2) as unknown as SVGElement;
        const eventTarget4 = owner.elementFromPoint(domRect.left + domRect.width, index2) as unknown as SVGElement;

        if (eventTarget && eventTarget.id !== 'svg') {
          elementsUnder.set(eventTarget.id, eventTarget.getAttribute('stroke') as string);
        }
        if (eventTarget2 && eventTarget2.id !== 'svg') {
          elementsUnder.set(eventTarget2.id, eventTarget2.getAttribute('stroke') as string);
        }
        if (eventTarget3 && eventTarget3.id !== 'svg') {
          elementsUnder.set(eventTarget3.id, eventTarget3.getAttribute('stroke') as string);
        }
        if (eventTarget4 && eventTarget4.id !== 'svg') {
          elementsUnder.set(eventTarget4.id, eventTarget4.getAttribute('stroke') as string);
        }
        index2 += increment;
      }
      resole(elementsUnder);
    });

  }

}

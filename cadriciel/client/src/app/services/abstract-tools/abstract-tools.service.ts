import { Injectable } from '@angular/core';
import { SpecialKey } from 'src/app/Models/interfaces';

@Injectable({
  providedIn: 'root'
})

export class AbstractToolsService {
  protected canDraw: boolean;
  side: number;
  mapEvent: SpecialKey;
  constructor() {
    this.mapEvent = {
      ArrowRight: false, ArrowLeft: false, ArrowUp: false, ArrowDown: false,
      AltLeft: false, AltRight: false, ShiftLeft: false, ShiftRight: false
    };
  }
  mouseMove(event: MouseEvent): void {
    return;
  }
  mouseDown(event: MouseEvent): void {
    return;
  }
  mouseUp(event: MouseEvent): void {
    return;
  }
  mouseClick(event: MouseEvent): void {
    return;
  }
  mouseLeave(): void {
    return;
  }
  keyUp(event: KeyboardEvent): void {
    return;
  }
  keyDown(event: KeyboardEvent): void {
    return;
  }
  mouseDblclick(event: MouseEvent): void {
    return;
  }
  mouseDownPath(event: MouseEvent): void {
    return;
  }
  mouseClickPath(event: MouseEvent): void {
    return;
  }
  mouseDownControle(event: MouseEvent): void {
    return;
  }
  mouseDownSelection(event: MouseEvent): void {
    return;
  }
  mouseOverPath(event: MouseEvent): void {
    return;
  }
  mouseLeavePath(event: MouseEvent): void {
    return;
  }
  mouseUpPath(event: MouseEvent): void {
    return;
  }
  mouseWheel(event: MouseEvent): void {
    return;
  }
  reset(): void {
    return;
  }
  init(): void {
    return;
  }
}

import { Injectable } from '@angular/core';
import { Magnetsim } from 'src/app/Models/enums';
import { MagnetPosition } from 'src/app/Models/interfaces';
import { Point } from 'src/app/Models/shapes/point';
import { GridService } from '../grid/grid.service';
import { MapService } from '../maps/map.service';
const side = 50;
@Injectable({
  providedIn: 'root'
})
export class MagnetsimService {
  position: number;
  data: MagnetPosition;
  isActive: boolean;
  constructor(private mapService: MapService, private gridService: GridService) {
    this.position = Magnetsim.TopRight;
    this.data = { widthDivider: 0, heightDivider: 0 };
    this.isActive = false;
  }

  private findPoint(element: SVGPathElement): Point {
    const value = parseFloat(this.position.toString());
    this.data = this.mapService.magnetismMap.get(value) as MagnetPosition;

    const bbox = element.getBoundingClientRect();
    const x = bbox.left - side + ((this.data.widthDivider) ? (bbox.width / this.data.widthDivider) : 0);
    const y = bbox.top + ((this.data.heightDivider) ? bbox.height / this.data.heightDivider : 0);
    const position = new Point(x, y);
    return position;
  }

  private canMoveY(position2: number, direction: number, offset: number, position: number): boolean {
    let canMove = false;
    if (direction < 0) {
      if ((offset  < position) || (position > offset) && (position > offset - position2)) {
        canMove = true;
      }
    }

    if (direction > 0) {
      if ((offset  > position) || (position < offset) && ( offset + position2 > position)) {
        canMove = true;
      }
    }
    return canMove;
  }

  findPointToTranslate(element: SVGPathElement, next: Point, offset: [number, number], arraowKey: boolean): Point {
    const position = this.findPoint(element);
    const bbox = element.getBoundingClientRect();
    let moveX = false;
    let moveY = false;
    if (arraowKey) {
      moveX = true;
      moveY = true;
    } else {
      moveX = this.canMoveY(bbox.width, next.x, offset[0], bbox.left - side);
      moveY = this.canMoveY(bbox.top, next.y, offset[1], bbox.top);
    }
    const nextPoint = new Point(0, 0);
    for (let i = 0; i < this.gridService.width; i += this.gridService.thickness) {
      if (next.x === 0 && position.x === i) {
        break;
      }
      if (i > position.x && moveX ) {
        nextPoint.x = (next.x < 0) ? (i - 2 * this.gridService.thickness - position.x )
                      : ((i - position.x));

        break;
      }
    }

    for (let i = 0; i < this.gridService.height; i += this.gridService.thickness) {
      if (next.y === 0 && position.y === i) {
        break;
      }
      if (i > position.y && moveY) {
        nextPoint.y = (next.y < 0) ? (i - 2 * this.gridService.thickness - position.y) : (i - position.y);
        break;
      }
    }
    return nextPoint;
  }

}

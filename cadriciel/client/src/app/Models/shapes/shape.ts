import { isNullOrUndefined } from 'util';
import { strokeTypeEnum } from '../enums';
import { BasicObject } from './basic-object';
import { Point } from './point';

export class Shape extends BasicObject {

  static id: number;
  originX: number;
  originY: number;
  currentPoint: Point;
  pointsList: Point[];
  jonctionsPaths: string[];
  mouseClick: Point;
  pointPaths: string[];
  constructor() {
    super();
    if (isNullOrUndefined(Shape.id)) {
      Shape.id = 0;
    }
    this.originX = 0;
    this.originY = 0;
    this.strokeType = strokeTypeEnum.Any;
    this.sides = 0;
    Shape.id++;
  }
}

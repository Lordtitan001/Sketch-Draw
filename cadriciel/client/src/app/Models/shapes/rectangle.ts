import { Shape } from './shape';

import { EnumTool, strokeTypeEnum } from '../enums';

export class Rectangle extends Shape {
    width: number;
    height: number;
    id: number;
    constructor() {
      super();
      this.id = Shape.id;
      this.width = 0;
      this.height = 0;
      this.originX = 0;
      this.originY = 0;
      this.stroke = 'black';
      this.strokeWidth = '2';
      this.fill = 'transparent';
      this.strokeType = strokeTypeEnum.Contour;
      this.enumTool = EnumTool.Rectangle;
    }
  }

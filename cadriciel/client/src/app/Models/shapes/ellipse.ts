import { EnumTool, strokeTypeEnum } from '../enums';
import { Path } from './path';

export class Ellipse extends Path {
    constructor() {
      super();
      this.width = 0;
      this.height = 0;
      this.originX = 0;
      this.originY = 0;
      this.stroke = 'black';
      this.strokeWidth = '2';
      this.fill = 'transparent';
      this.strokeType = strokeTypeEnum.Contour;
      this.enumTool = EnumTool.Ellipse;
    }
  }

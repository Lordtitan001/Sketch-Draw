import { EnumTool } from '../enums';
import { Path } from '../shapes/path';

export class PaintBucket extends Path {
  constructor() {
    super();
    this.strokeWidth = 'none';
    this.fill = 'none';
    this.enumTool = EnumTool.PaintBucket;
    this.d = '';
    this.tolerence = '0';
  }
}

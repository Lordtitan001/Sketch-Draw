import { EnumTool } from '../enums';
import { Path } from '../shapes/path';
const size = 20;
export class Pen extends Path {
    constructor() {
        super();
        this.enumTool =  EnumTool.Pen;
        this.strokeWidth = 'none';
        this.fill = 'none';
        this.length = size;
    }
}

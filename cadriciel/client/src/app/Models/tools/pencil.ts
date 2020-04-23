import { EnumTool } from '../enums';
import { Path } from '../shapes/path';

export class Pencil extends Path {

    constructor() {
        super();
        this.enumTool =  EnumTool.Pencil;
        this.strokeWidth = '2';
        this.strokeLinecap = 'round';
        this.strokeLinejoin = 'round';
        this.fill = 'none';
    }
}

import { EnumTool, Textures } from '../enums';
import { Path } from '../shapes/path';

export class Brush extends Path {
    constructor() {
        super();
        this.enumTool =  EnumTool.Brush;
        this.strokeWidth = '10';
        this.strokeLinecap = 'round';
        this.strokeLinejoin = 'round';
        this.fill = 'none';
        this.texture = Textures.Texture1;
    }
}

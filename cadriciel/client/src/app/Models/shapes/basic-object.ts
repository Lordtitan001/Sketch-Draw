import { EnumTool, strokeTypeEnum, Textures } from '../enums';
import { Properties } from '../interfaces';

export class BasicObject implements Properties {
    stroke: string;
    strokeWidth: string;
    borderRadius: string;
    strokeType: strokeTypeEnum;
    strokeLinecap: string;
    strokeJonction: number;
    strokeLinejoin: string;
    speed: string;
    tolerence: string;
    fileRule: string;
    enumTool: EnumTool;
    fill: string;
    texture: Textures;
    withJonctions: boolean;
    sides: number;
    constructor() {
        this.stroke = 'none';
        this.strokeWidth = 'none';
        this.borderRadius = 'none';
        this.strokeLinecap = 'none';
        this.strokeJonction = 0;
        this.strokeLinejoin = 'none';
        this.fill = 'none';
        this.strokeType = strokeTypeEnum.Any;
        this.speed = 'none';
        this.texture = Textures.Default;
        this.fileRule = 'none';
        this.tolerence = 'none';
    }
}

import { EnumTool } from './enums';

export class KeyEnum {
    imageName: string;
    enum: EnumTool;
    constructor(imageName: string, enums: EnumTool) {
        this.imageName = imageName;
        this.enum = enums;
    }
}

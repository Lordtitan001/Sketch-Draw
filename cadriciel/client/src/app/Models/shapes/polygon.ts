import { strokeTypeEnum } from '../enums';
import { Path } from './path';
const side = 3;
export class Polygon  extends Path {
    constructor() {
        super();
        this.strokeWidth = '2';
        this.sides = side;
        this.strokeType = strokeTypeEnum.Contour;
    }
}

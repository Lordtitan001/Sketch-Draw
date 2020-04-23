
import { TypeDessinEnum } from '../enums';
import { Point } from './point';
import { Shape } from './shape';

export class Path extends Shape {
    d: string;
    filter: string;
    id: number;
    width: number;
    height: number;
    type: TypeDessinEnum;
    next: Point;
    transform: string;
    length: number;
    constructor() {
        super();
        this.id = Shape.id;
        this.stroke = 'black';
        this.strokeJonction = 2;
        this.width = 0;
        this.height = 0;
        this.type = TypeDessinEnum.NONE;
        this.next = new Point(0, 0);
        this.transform = 'translate(0 0) rotate(0 0 0)';
    }
    copy(): Path {
        const newPath = new Path();
        newPath.jonctionsPaths = this.jonctionsPaths;
        newPath.pointPaths =  this.pointPaths;
        newPath.pointsList = this.pointsList;
        newPath.d = this.d;
        newPath.filter = this.filter;
        newPath.id = this.id;
        newPath.stroke = this.stroke;
        newPath.strokeWidth = this.strokeWidth;
        newPath.fill = this.fill;
        newPath.strokeLinecap = this.strokeLinecap;
        newPath.strokeLinejoin = this.strokeLinejoin;
        newPath.withJonctions = this.withJonctions;
        newPath.strokeJonction = this.strokeJonction;
        newPath.width = this.width;
        newPath.height = this.height;
        newPath.type = this.type;
        newPath.transform = this.transform;
        newPath.fileRule = this.fileRule;
        return newPath;
    }

}

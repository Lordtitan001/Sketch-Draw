import { Point } from '../shapes/point';

export class PaintBucketData {
    queue: Point[];
    visited: Set<Point>;
    vsitedData: (boolean)[][];
    border: Set<Point>;
    borderData: Point[][];
    outline: Set<string>;
    svgWidth: number;
    svgHeight: number;
}

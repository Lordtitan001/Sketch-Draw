import { Injectable } from '@angular/core';
import { Color } from 'src/app/Models/color';
import { Index } from 'src/app/Models/enums';
import { Point } from 'src/app/Models/shapes/point';
import { PaintBucket } from 'src/app/Models/tools/paint-bucket';
import { PaintBucketData } from 'src/app/Models/tools/paint-bucket-data';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';
const maxRGBA = 255;
@Injectable({
  providedIn: 'root'
})
// http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
// https://developer.mozilla.org/fr/docs/Tutoriel_canvas/Pixel_manipulation_with_canvas
// https://rosettacode.org/wiki/Convex_hull#JavaScript
export class PaintBucketService extends AbstractToolsService {
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private data: PaintBucketData;
  private direction: number;
  private tolerance: number;
  constructor(
    protected colorPicker: ColorPickerService,
    protected drawService: DrawingServiceService,
    protected undoRedoService: UndoRedoService) {
    super();
    this.data = new PaintBucketData();
    this.data.borderData = [];
    this.tolerance = 0;
  }

  mouseDown(event: MouseEvent): void {

    const svg = this.drawService.elements.svg.cloneNode(true) as SVGSVGElement;
    svg.getElementById('grid').remove();
    svg.getElementById('preview').remove();
    const xml = (new XMLSerializer()).serializeToString(svg);
    this.ctx = this.drawService.elements.canvas.getContext('2d') as CanvasRenderingContext2D;
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(xml);
    const r1 = this.colorPicker.primaryColor.redValue;
    const g1 = this.colorPicker.primaryColor.greenValue;
    const b1 = this.colorPicker.primaryColor.blueValue;
    const a1 = this.colorPicker.primaryColor.opacityValue * maxRGBA;
    const newColor = new Color(r1, g1, b1, a1);

    img.onload = (() => {
      this.setData();
      this.ctx.drawImage(img, 0, 0, this.data.svgWidth, this.data.svgHeight);
      this.imageData = this.ctx.getImageData(0, 0, this.data.svgWidth, this.data.svgHeight);
      const startisPixelPos = (event.offsetY * this.data.svgWidth + event.offsetX) * Index.Four;
      const r2 = this.imageData.data[startisPixelPos];
      const g2 = this.imageData.data[startisPixelPos + Index.One];
      const b2 = this.imageData.data[startisPixelPos + Index.Two];
      const a2 = this.imageData.data[startisPixelPos + Index.Three];
      const targetColor = new Color(r2, g2, b2, a2);
      if (this.colorsMatch(targetColor, newColor)) {
        this.canDraw = false;
        return;
      }
      if (this.drawService.surfaceList.length > this.drawService.indexList) {
        this.drawService.indexList++;
      }
      this.canDraw = true;
      this.drawService.surfaceList.push(new PaintBucket());
      this.floodFill(new Point(event.offsetX, event.offsetY), targetColor, newColor);
      this.ctx.putImageData(this.imageData, 0, 0);
      this.findBorder();
      this.optimisePath();
      this.draw(this.drawService.indexList);

    });
  }

  mouseUp(): void {
    if (this.canDraw) {
      this.undoRedoService.update();
    }
  }

  private setData(): void {
    this.data.svgWidth = this.drawService.elements.svg.width.animVal.value;
    this.data.svgHeight = this.drawService.elements.svg.height.animVal.value;
    this.drawService.elements.canvas.width = this.data.svgWidth;
    this.drawService.elements.canvas.height = this.data.svgHeight;
    this.data.vsitedData = [];
    for (let x = 0; x < this.data.svgWidth; x++) {
      this.data.vsitedData[x] = [];
      for (let y = 0; y < this.data.svgHeight; y++) {
        this.data.vsitedData[x][y] = false;
      }
    }
  }
  private floodFill(startingPoint: Point, targetColor: Color, newColor: Color): void {
    this.data.queue = [startingPoint];
    this.data.visited = new Set();
    while (this.data.queue.length > 0) {
      const pointToVisit = this.data.queue.pop() as Point;
      this.data.visited.add(new Point(Number(pointToVisit.x), Number(pointToVisit.y)));
      const pixelPos = (pointToVisit.y * this.data.svgWidth + pointToVisit.x) * Index.Four;
      this.putColor(pixelPos, newColor);
      for (const neighbour of this.neighborsFour(pointToVisit)) {
        if (this.data.visited.has(new Point(Number(neighbour.x), Number(neighbour.y))) || !this.isValid(neighbour)) {
          continue;
        }
        const neighbourPixelPos = (neighbour.y * this.data.svgWidth + neighbour.x) * Index.Four;
        const pixelColor = this.getColor(neighbourPixelPos);
        if (!this.colorsMatch(targetColor, pixelColor)) {
          continue;
        }
        this.data.queue.push(neighbour);
      }
    }
  }
  private isValid(point: Point): boolean {
    return 0 <= point.x && point.x <= this.data.svgWidth - 1
      && 0 <= point.y && point.y <= this.data.svgHeight - 1;
  }
  private getColor(pixelPos: number): Color {
    const r = this.imageData.data[pixelPos];
    const g = this.imageData.data[pixelPos + Index.One];
    const b = this.imageData.data[pixelPos + Index.Two];
    const a = this.imageData.data[pixelPos + Index.Three];
    return (new Color(r, g, b, a));

  }
  private putColor(pixelPos: number, color: Color): void {
    this.imageData.data[pixelPos] = color.redValue;
    this.imageData.data[pixelPos + Index.One] = color.greenValue;
    this.imageData.data[pixelPos + Index.Two] = color.blueValue;
    this.imageData.data[pixelPos + Index.Three] = color.opacityValue;
  }
  private colorsMatch(color1: Color, color2: Color): boolean {

    return color1.redValue === color2.redValue
      && color1.greenValue === color2.greenValue
      && color1.blueValue === color2.blueValue
      && color1.opacityValue === color2.opacityValue;
  }
  private neighborsFour(point: Point): Point[] {
    const [x, y] = [point.x, point.y];
    return [
      new Point(x, y - Index.One),
      new Point(x, y + Index.One),
      new Point(x - Index.One, y),
      new Point(x + Index.One, y)
    ];
  }
  private neighborsEight(point: Point): Point[] {
    const [x, y] = [point.x, point.y];
    return [
      new Point(x - Index.One, y - Index.One),
      new Point(x, y - Index.One),
      new Point(x + Index.One, y - Index.One),
      new Point(x + Index.One, y),
      new Point(x + Index.One, y + Index.One),
      new Point(x, y + Index.One),
      new Point(x - Index.One, y + Index.One),
      new Point(x - Index.One, y)
    ];
  }
  private fillBorderData(pointData: Set<Point>): void {

    pointData.forEach((point) => {
      const x = point.x as number;
      const y = point.y as number;
      this.data.vsitedData[x][y] = true;
    });

  }
  private isOnBorder(x: number, y: number): boolean {

    if (this.data.vsitedData[x][y]) {
      const pixelPos = { x, y };
      const tempPixels: Point[] = this.neighborsFour(pixelPos);
      for (const pixel of tempPixels) {
        if (!this.isValid(pixel) || this.data.vsitedData[pixel.x][pixel.y] === false) {
          return true;
        }
      }
    }
    return false;
  }
  private findBorder(): void {
    this.fillBorderData(this.data.visited);
    this.data.border = new Set();
    this.data.outline = new Set();
    for (let x = 0; x < this.drawService.elements.svg.width.animVal.value; x++) {
      for (let y = 0; y < this.drawService.elements.svg.height.animVal.value; y++) {
        if (this.isOnBorder(x, y)) {
          this.data.border.add(new Point(x, y));
          this.data.outline.add(`${x},${y}`);
        }
      }
    }

  }
  private nextDirection(direction: number): number {
    return (direction + Index.One) % Index.Eight;
  }
  private findNextPixel(currentPixel: Point): Point {
    this.direction = (this.direction + Index.Six) % Index.Eight;
    const coordinatesAround = this.neighborsEight(currentPixel);
    for (let i = 0; i < Index.Eight; i++) {
      const pixelKey = `${coordinatesAround[this.direction].x},${coordinatesAround[this.direction].y}`;
      if (this.data.outline.has(pixelKey)) {
        return coordinatesAround[this.direction];
      }
      this.direction = this.nextDirection(this.direction);
    }

    return currentPixel;
  }
  private optimisePath(): void {
    this.data.borderData = [];
    while (this.data.outline.size > 0) {
      const outline: Point[] = [];
      this.direction = Index.Four;

      const coordinates = this.data.outline.keys().next().value.split(',');
      const firstPixel = new Point(Number(coordinates[0]), Number(coordinates[1]));

      outline.push(firstPixel);
      let currentPixel = this.findNextPixel(firstPixel);
      while (currentPixel.x !== firstPixel.x || currentPixel.y !== firstPixel.y) {
        outline.push(currentPixel);
        this.data.outline.delete(`${currentPixel.x},${currentPixel.y}`);
        const nextPixel = this.findNextPixel(currentPixel);
        if (nextPixel.x === currentPixel.x && nextPixel.y === currentPixel.y) {
          break;
        }
        currentPixel = this.findNextPixel(currentPixel);
      }
      this.data.outline.delete(`${firstPixel.x},${firstPixel.y}`);
      this.data.borderData.push(outline);
    }
  }
  private generatePath(pointData: Point[][]): string {
    let path = '';
    if (this.tolerance === Index.OneHundred) {
      path = ` M ${0} ${0} h ${this.data.svgWidth} v ${this.data.svgHeight} h ${-this.data.svgWidth} Z`;
      return path;
    }
    for (const outline of pointData) {
      let outlineString = `M ${outline[0].x},${outline[0].y} `;
      for (const pixel of outline) {
        outlineString += `L ${pixel.x},${pixel.y} `;
      }
      outlineString += 'Z ';
      path += outlineString;
    }
    return path;
  }
  private draw(indexbrushList: number): void {
    const path = this.drawService.surfaceList[indexbrushList];
    this.tolerance = parseInt(this.drawService.getTools().tolerence, 10);
    path.fill = this.colorPicker.primaryColor.getColor();
    path.fileRule = 'evenodd';
    path.stroke = 'none';
    path.d = this.generatePath(this.data.borderData);
  }

}

import { Injectable } from '@angular/core';
import { strokeTypeEnum, TypeDessinEnum } from 'src/app/Models/enums';
import { PolygonInterface } from 'src/app/Models/interfaces';
import { Point } from 'src/app/Models/shapes/point';
import { Polygon } from 'src/app/Models/shapes/polygon';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { UndoRedoService } from '../undoRedo/undo-redo.service';
const side3 = 3;
const side6 = 6;
const side4 = 4;
const side10 = 10;
@Injectable({
    providedIn: 'root',
})
export class PolygonService extends AbstractToolsService {
    private hasMoved: boolean;
    private radius: number;
    private currentPos: Point;
    private mouseDefinded: boolean;
    private trueHeight: number;
    private beforeX: number;
    private polygon: PolygonInterface;
    DECALAGE_IMPAIR: number[] = [];
    constructor(private pickerService: ColorPickerService,
                private drawService: DrawingServiceService,
                private undoRedoService: UndoRedoService) {
        super();
        this.hasMoved = false;
        this.mouseDefinded = false;
        this.polygon = {
            center: new Point(0, 0),
            angle: 0,
            width: 0,
            height: 0,
            sides: 0,
            origin: new Point(0, 0),
        };
        this.DECALAGE_IMPAIR = [1, 1, 1, 1, 1, 1, 2, 1, 2, 1, side3, 1];
    }

    mouseDown(): void {
        this.hasMoved = false;
        this.mouseDefinded = true;
        this.canDraw = true;
    }

    private setStrokeColor(): void {
        switch (this.drawService.selectedTools.strokeType) {
            case strokeTypeEnum.Contour:
                this.drawService.selectedTools.fill = 'none';
                this.drawService.selectedTools.stroke = this.pickerService.secondaryColor.getColor();
                break;
            case strokeTypeEnum.Full:
                this.drawService.selectedTools.fill = this.pickerService.primaryColor.getColor();
                this.drawService.selectedTools.stroke = 'none';
                break;
            case strokeTypeEnum.FullWithContour:
                this.drawService.selectedTools.fill = this.pickerService.primaryColor.getColor();
                this.drawService.selectedTools.stroke = this.pickerService.secondaryColor.getColor();
                break;
            case strokeTypeEnum.Any:
                break;
        }
    }

    private initialisation(event: MouseEvent): void {
        this.drawService.surfaceList.push(new Polygon());
        this.polygon.sides = this.drawService.selectedTools.sides;
        this.polygon.angle = (2 * Math.PI) / this.polygon.sides;

        this.polygon.origin = new Point(event.offsetX, event.offsetY);
        this.drawService.surfaceList[this.drawService.indexList].strokeWidth =
            this.drawService.selectedTools.strokeWidth;
        this.setStrokeColor();
        this.drawService.surfaceList[this.drawService.indexList].stroke = this.drawService.selectedTools.stroke;
        this.drawService.surfaceList[this.drawService.indexList].fill = this.drawService.selectedTools.fill;
        this.drawService.surfaceList[this.drawService.indexList].type = TypeDessinEnum.CONTOUR;

    }
    mouseMove(event: MouseEvent): void {
        if (!this.canDraw) {
            return;
        }
        if (!this.hasMoved) {
            if (this.drawService.surfaceList.length > this.drawService.indexList) {
                this.drawService.indexList++;
            }
            this.initialisation(event);
            this.hasMoved = true;
        } else if (this.mouseDefinded) {
            this.initPolygon(event);
        }
    }

    private initPolygon(event: MouseEvent): void {
        this.currentPos = new Point(event.offsetX, event.offsetY);
        this.polygon.width = event.offsetX - this.polygon.origin.x;
        this.polygon.height = event.offsetY - this.polygon.origin.y;
        this.drawService.visualisation = ` M ${this.polygon.origin.x} ${this.polygon.origin.y} h
        ${this.polygon.width} v ${this.polygon.height} h ${-this.polygon.width} Z`;
        this.trueHeight = Math.min(Math.abs(this.polygon.width), Math.abs(this.polygon.height));
        this.computeRadius();
        this.computeCenter();
        this.findPoints();
        this.makePolygon();

    }

    mouseUp(): void {
        this.drawService.visualisation = '';
        if (this.hasMoved) {
            this.undoRedoService.update();
        }
        this.mouseDefinded = false;
        this.hasMoved = false;
    }

    private makePolygon(): void {
        this.drawService.surfaceList[this.drawService.indexList].d =
            `M ${this.drawService.surfaceList[this.drawService.indexList].pointsList[0].x} ${
            this.drawService.surfaceList[this.drawService.indexList].pointsList[0].y
            } `;
        for (let i = 1; i < this.drawService.surfaceList[this.drawService.indexList].pointsList.length; i++) {
            this.drawService.surfaceList[this.drawService.indexList].d += `L ${
                this.drawService.surfaceList[this.drawService.indexList].pointsList[i].x
                } ${this.drawService.surfaceList[this.drawService.indexList].pointsList[i].y} `;
        }
        this.drawService.surfaceList[this.drawService.indexList].d += ' Z';
    }

    private computeRadius(): void {
        if (this.polygon.sides % 2 === 0) {
            this.pairRadius();
        } else {
            this.impairRadius();
        }
    }

    private impairRadius(): void {
        if (Math.abs(this.polygon.height) <= Math.abs(this.polygon.width)) {
            this.radius = this.trueHeight / (1 + Math.cos(this.polygon.angle / 2));
        } else {

            this.radius = this.trueHeight / (2 * Math.cos(Math.PI / 2 - this.DECALAGE_IMPAIR[this.polygon.sides - 1] * this.polygon.angle));
        }
    }

    private pairRadius(): void {
        this.radius = this.trueHeight / 2;
        if ((this.polygon.sides === side6 ||
            this.polygon.sides === side10) && (Math.abs(this.polygon.height) > Math.abs(this.polygon.width))) {
            this.radius = Math.abs(this.trueHeight / 2 / Math.sin(Math.PI / 2 - this.polygon.angle / 2));
        }
    }

    private computeCenter(): void {
        if (this.polygon.sides % side4 === 0) {
            this.standardCenter();
        } else {
            this.particularCenter();
        }
    }
    private particularCenter(): void {
        if (this.polygon.sides % 2 === 0) {
            this.pairCenter();
        } else {
            this.impairCenter();
        }
        this.polygon.center.x = this.currentPos.x - this.polygon.origin.x > 0 ? this.polygon.origin.x + this.beforeX :
        this.polygon.origin.x - this.beforeX;
        this.polygon.center.y =
            this.currentPos.y - this.polygon.origin.y < 0
                ? Math.abs(Math.max(this.polygon.origin.y, this.currentPos.y) - (this.trueHeight - this.radius))
                : this.radius + Math.min(this.polygon.origin.y, this.currentPos.y);
    }

    private standardCenter(): void {
        this.polygon.center.x = this.currentPos.x - this.polygon.origin.x > 0 ? this.polygon.origin.x + this.radius :
        this.polygon.origin.x - this.radius;

        this.polygon.center.y =
            this.currentPos.y - this.polygon.origin.y < 0
                ? this.polygon.origin.y - this.radius
                : this.radius + this.polygon.origin.y;
    }

    private  pairCenter(): void {
        if (this.polygon.sides === side10 || this.polygon.sides === side6) {
            this.beforeX = this.radius;
        }
    }

    private impairCenter(): void {

        if (this.polygon.sides !== side3) {
            this.beforeX = Math.abs(this.radius * Math.cos(Math.PI / 2 - this.DECALAGE_IMPAIR[this.polygon.sides - 1] *
                this.polygon.angle));
        } else {
            this.beforeX = Math.abs(this.radius * Math.cos(Math.PI / 2 - this.polygon.angle / 2)); // bien
        }
    }

    private findPoints(): void {
        this.drawService.surfaceList[this.drawService.indexList].pointsList = [];
        let firstPoint = new Point(this.polygon.center.x, this.polygon.center.y - this.radius);
        this.drawService.surfaceList[this.drawService.indexList].pointsList[0] = firstPoint;
        let totalPts = 1;
        let angle = this.polygon.angle - Math.PI / 2;

        for (let i = 1; i < this.polygon.sides; i++) {
            const newX = this.polygon.center.x + this.radius * Math.cos(angle);
            const newY = this.polygon.center.y + this.radius * Math.sin(angle);
            const point = new Point(newX, newY);
            this.drawService.surfaceList[this.drawService.indexList].pointsList.push(point);
            firstPoint = point;
            totalPts++;
            angle = totalPts * this.polygon.angle - Math.PI / 2;
        }
        if (this.currentPos.y < this.polygon.origin.y && (Math.abs(this.polygon.height) > Math.abs(this.polygon.width))) {
            this.alignDown();
        }
        if ((this.polygon.sides === side6 || this.polygon.sides === side10) &&
        (Math.abs(this.polygon.height) > Math.abs(this.polygon.width))) {
            this.alignParticular();
        }

    }

    private alignDown(): void {
        const toAdd = this.polygon.origin.y - this.drawService.surfaceList[this.drawService.indexList].
        pointsList[Math.round(this.polygon.sides / 2)].y;

        if (this.currentPos.y < this.polygon.origin.y && (Math.abs(this.polygon.height) > Math.abs(this.polygon.width))) {

            for (let i = 0; i < this.polygon.sides; i++) {
                this.drawService.surfaceList[this.drawService.indexList].pointsList[i].y += toAdd;
            }
        }
    }

    private alignParticular(): void {
        const toDeduct = this.currentPos.x > this.polygon.origin.x ?
            - Math.abs(this.currentPos.x - this.drawService.surfaceList[this.drawService.indexList].pointsList[2].x) :
            Math.abs(this.currentPos.x - this.drawService.surfaceList[this.drawService.indexList].pointsList[this.polygon.sides - 2].x);

        for (let i = 0; i < this.polygon.sides; i++) {
            this.drawService.surfaceList[this.drawService.indexList].pointsList[i].x += toDeduct;
        }
    }

    mouseLeave(): void {
        if (this.canDraw) {
            this.drawService.surfaceList.pop();
            this.drawService.indexList--;
        }
        this.canDraw = false;
        this.hasMoved = false;
        this.drawService.visualisation = '';
    }
}

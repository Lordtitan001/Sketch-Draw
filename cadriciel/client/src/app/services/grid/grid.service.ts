import { Injectable } from '@angular/core';
import { Point } from 'src/app/Models/shapes/point';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';

const initThickness = 32;
const addThickness = 5;
const maximumthickness = 100;
const minimumthickness = 30;

@Injectable({
    providedIn: 'root',
})
export class GridService extends AbstractToolsService {
    protected start: Point;
    width: number;
    height: number;
    thickness: number;
    private vertical: string;
    private horizontal: string;

    constructor(private drawService: DrawingServiceService) {
        super();
        this.start = new Point(0, 0);
        this.horizontal = ` M ${0} ${0} `;
        this.vertical = ` M ${0} ${0} `;
        this.thickness = initThickness;
    }
    reset(): void {
        this.drawService.grid.gridContent = '';
    }
    makeGrid(): void {
        let distance = 0;
        this.horizontal = ` M ${0} ${0} `;
        this.vertical = ` M ${0} ${0} `;
        for (let i = 0; i < this.width; i += this.thickness) {
            this.vertical += ` L ${distance} ${this.height} `;
            distance += this.thickness;
            this.vertical += ` M ${distance} ${0} `;
        }

        distance = 0;

        for (let i = 0; i < this.height; i += this.thickness) {
            this.horizontal += ` L ${this.width} ${distance} `;
            distance += this.thickness;
            this.horizontal += ` M ${0} ${distance} `;
        }
        this.drawService.grid.gridImage = 'grid_on';
        this.drawService.grid.gridContent = this.horizontal + this.vertical;
    }

    changeSize(event: KeyboardEvent): void {
        const toAdd = this.thickness % addThickness;
        if (event.key === '-' && this.thickness >= minimumthickness) {
            toAdd === 0 ? (this.thickness -= addThickness - toAdd) : (this.thickness -= toAdd);
        }
        if (event.key === '+' && this.thickness < maximumthickness - 2) {
            this.thickness += addThickness - toAdd;
        }
        this.makeGrid();
    }
}

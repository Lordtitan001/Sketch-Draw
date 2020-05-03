import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EnumElement, EnumTool, Textures } from 'src/app/Models/enums';
import { ColorPickerService } from 'src/app/services/color-picker/color-picker.service';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';

import { RectangleServiceService } from 'src/app/services/rectangle/rectangle-service.service';

import { ColorPickerComponent } from 'src/app/components/color-picker/color-picker.component';
import { StyleTool } from 'src/app/Models/interfaces';
import { AerosolService } from 'src/app/services/aerosol/aerosol.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { MagnetsimService } from 'src/app/services/magnetsim/magnetsim.service';
import { MapService } from 'src/app/services/maps/map.service';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
    @Input() protected isOpen: boolean;
    @Input() protected element: EnumElement;
    protected size: number;
    private parameter: object;
    private selectStyle: StyleTool;
    private dialogIsOpen: boolean;
    private selection: number;
    constructor(
        protected pickerService: ColorPickerService,
        protected aerosolService: AerosolService,
        protected gridService: GridService,
        private rectangleService: RectangleServiceService,
        private drawService: DrawingServiceService,
        private dialog: MatDialog,
        private mapService: MapService,
        private magnetService: MagnetsimService,
    ) {
        this.dialogIsOpen = false;
        this.selectStyle = {
            'box-sizing': 'border-box', 'border': '4px solid var(--text)',
            'margin': '3px', 'transition': 'none', 'cursor': 'default'
        };
        this.parameter = { width: '350px', height: '400px', position:
        { left: '50px', top: '14%' }, hasBackdrop: true, panelClass: 'custom-dialog-container' };
        this.selection = 0;
    }

    protected openDialog(): void {
        if (!this.dialogIsOpen) {
            this.dialog.open(ColorPickerComponent, this.parameter);
            this.dialog.afterOpened.subscribe((res) => {
                this.dialogIsOpen = true;
            });
            this.dialog.afterAllClosed.subscribe((res) => {
                this.dialogIsOpen = false;
            });
        }
    }

    protected getIconStyle(element: EnumTool): object {
        const value = this.mapService.mapTool.get(element) as object;
        if (this.drawService.enumTool === element) {
            value['box-sizing'] === 'none' ? this.mapService.mapTool.set(element, this.selectStyle) :
                this.mapService.mapTool.set(element, this.mapService.defaultStyle);
        }
        return this.mapService.mapTool.get(element) as object;
    }

    protected selectCorner(): void {
        this.magnetService.position = this.selection;
    }

    protected selectTexture(filter: string): void {
        const texture = this.mapService.textureMap.get(filter) as Textures;
        this.drawService.selectedTools.texture = texture;
    }

    protected selectTool(value: number): void {
        const image = this.mapService.mapIcon.get(value) as string;
        this.drawService.enumTool = value;
        this.drawService.selectTool();
        const tool = this.drawService.enumTool;
        const test = (tool === EnumTool.Line || tool === EnumTool.Rectangle) || tool === EnumTool.Polygone || tool === EnumTool.Ellipse;
        if (test) {
            this.drawService.images.imageShapeSelected = image;
            return;
        }
        this.drawService.images.imageToolSelected = image;
    }

    protected selectStrokeType(strokeType: number): void {
        this.rectangleService.setStrokeType(strokeType);
    }

    protected withJonctions(isJonctions: boolean): void {
        this.drawService.selectedTools.withJonctions = isJonctions;
    }

}

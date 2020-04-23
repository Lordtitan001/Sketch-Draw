import { Injectable } from '@angular/core';
import { EnumTool } from 'src/app/Models/enums';

import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { AerosolService } from '../aerosol/aerosol.service';
import { ClipboardService } from '../clipboard/clipboard.service';
import { ColorSetterService } from '../colorSetter/color-setter.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { EllipseService } from '../ellipse/ellipse.service';
import { EraserService } from '../eraser/eraser.service';
import { LineService } from '../line/line.service';
import { PaintBucketService } from '../paint-bucket/paint-bucket.service';
import { PenService } from '../pen/pen.service';
import { PipetteService } from '../pipette/pipette.service';
import { PolygonService } from '../polygon/polygon.service';
import { RectangleServiceService } from '../rectangle/rectangle-service.service';
// import { SelectionMoveService } from '../selection-move/selection-move.service';
import { ToolDrawingService } from '../tool-drawing-service/tool-drawing.service';

@Injectable({
  providedIn: 'root'
})
export class SelectedToolService {
  selectedService: AbstractToolsService;
  private serviceMap: Map<EnumTool, AbstractToolsService> = new Map<EnumTool, AbstractToolsService>();
  private lastService: AbstractToolsService;
  constructor(
    private drawingService: DrawingServiceService,
    private line: LineService,
    private rectService: RectangleServiceService,
    private toolService: ToolDrawingService,
    private selectionService: ClipboardService,
    private colorSetterService: ColorSetterService,
    private eraserService: EraserService,
    private aerosolService: AerosolService,
    private ellipseService: EllipseService,
    private pipetteService: PipetteService,
    private polygonService: PolygonService,
    private penService: PenService,
    private paintBucketService: PaintBucketService) {

    this.selectedService = new AbstractToolsService();
    this.lastService = new AbstractToolsService();
    this.serviceMap.set(EnumTool.Any, new AbstractToolsService());
    this.serviceMap.set(EnumTool.Pencil, this.toolService);
    this.serviceMap.set(EnumTool.Rectangle, this.rectService);
    this.serviceMap.set(EnumTool.Line, this.line);
    this.serviceMap.set(EnumTool.Brush, this.toolService);
    this.serviceMap.set(EnumTool.Selection, this.selectionService);
    this.serviceMap.set(EnumTool.ColorSetter, this.colorSetterService);
    this.serviceMap.set(EnumTool.Pipette, this.pipetteService);
    this.serviceMap.set(EnumTool.Eraser, this.eraserService);
    this.serviceMap.set(EnumTool.Ellipse, this.ellipseService);
    this.serviceMap.set(EnumTool.Aerosol, this.aerosolService);
    this.serviceMap.set(EnumTool.Polygone, this.polygonService);
    this.serviceMap.set(EnumTool.Pen, this.penService);
    this.serviceMap.set(EnumTool.PaintBucket, this.paintBucketService);
  }

  selecteService(enumTool: EnumTool): void {
    this.selectedService = this.serviceMap.get(enumTool) as AbstractToolsService;
  }

  getSelectService(): AbstractToolsService {
    this.selecteService(this.drawingService.enumTool);
    if (this.lastService !== this.selectedService) {
      this.lastService.reset();
      this.selectedService.init();
    }
    this.lastService = this.selectedService;
    return this.selectedService;
  }

}

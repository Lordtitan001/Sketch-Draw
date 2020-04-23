import { TestBed } from '@angular/core/testing';

import { EnumTool } from 'src/app/Models/enums';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { AerosolService } from '../aerosol/aerosol.service';
import { ColorSetterService } from '../colorSetter/color-setter.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { EllipseService } from '../ellipse/ellipse.service';
import { EraserService } from '../eraser/eraser.service';
import { LineService } from '../line/line.service';
import { PipetteService } from '../pipette/pipette.service';
import { PolygonService } from '../polygon/polygon.service';
import { RectangleServiceService } from '../rectangle/rectangle-service.service';
import { SelectionMoveService } from '../selection-move/selection-move.service';
import { ToolDrawingService } from '../tool-drawing-service/tool-drawing.service';
import { SelectedToolService } from './selected-tool.service';
// tslint:disable no-string-literal
describe('SelectedToolService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [SelectedToolService, DrawingServiceService, LineService, RectangleServiceService,
            ToolDrawingService, SelectionMoveService, ColorSetterService, EraserService,
            AerosolService, EllipseService, PipetteService, PolygonService]
    }));

    it('should be created', () => {
        const service: SelectedToolService = TestBed.get(SelectedToolService);
        expect(service).toBeTruthy();
    });

    it('should select the correct service and call init', () => {
        const service: SelectedToolService = TestBed.get(SelectedToolService);
        const spy = spyOn(service['toolService'], 'init');
        service['selecteService'](EnumTool.Brush);
        expect(service.selectedService).toBe(service['toolService']);
        expect(spy).toHaveBeenCalled();
    });

    it('should return the select service', () => {
        const service: SelectedToolService = TestBed.get(SelectedToolService);
        const spy = spyOn(service, 'selecteService');
        const spy2 = spyOn(service['lastService'], 'reset');
        service['lastService'] = TestBed.get(AbstractToolsService);
        service['selectedService'] = service['lastService'];
        service['getSelectService']();
        expect(spy).toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
    });

    it('should return the select service and reset', () => {
        const service: SelectedToolService = TestBed.get(SelectedToolService);
        const spy = spyOn(service, 'selecteService');
        service['lastService'] = TestBed.get(AbstractToolsService);
        service['selectedService'] = TestBed.get(ToolDrawingService);
        service['getSelectService']();
        expect(spy).toHaveBeenCalled();
    });
});

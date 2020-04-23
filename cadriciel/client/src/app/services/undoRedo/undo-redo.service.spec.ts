import { TestBed } from '@angular/core/testing';
import { Color } from 'src/app/Models/color';
import { Path } from 'src/app/Models/shapes/path';
import { NewProjectService } from '../new-project/new-project.service';
import { UndoRedoService } from './undo-redo.service';
// tslint:disable no-string-literal
let service: UndoRedoService;

describe('UndoRedoService', () => {
    beforeEach(() => {
        localStorage.clear();
        service = TestBed.get(UndoRedoService);
        const newService = TestBed.get(NewProjectService);
        service['newService'] = newService;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('style', 'border: 1px solid black');
        svg.setAttribute('d', 'test');
        svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
        document.body.appendChild(svg);
        service['drawService'].elements.controle = svg;
        service['drawService'].elements.selectionElement = svg as unknown as SVGPathElement;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#undo should call surfaceListUpdate and deepSurfaceCopy', () => {

        const surfaceList: Path[] = [new Path()];
        service.actions.lastActionsList.push(surfaceList);
        service['data'].lastColorList.push(new Color());
        service['data'].lastIndexList.push(0);
        service['deepSurfaceCopy'] = jasmine.createSpy('deepSpy');
        service['surfaceListUpdate'] = jasmine.createSpy('surfSpy');
        service.undo();
        expect(service['surfaceListUpdate']).toHaveBeenCalled();
        expect(service['deepSurfaceCopy']).toHaveBeenCalledWith(surfaceList);
    });

    it('#undo should push in redos lists and pop in lastActions lists', () => {
        spyOn(service.actions.redoList, 'push');
        spyOn(service['data'].redoIndexList, 'push');
        spyOn(service.actions.lastActionsList, 'pop');
        spyOn(service['data'].lastIndexList, 'pop');
        service['deepSurfaceCopy'] = jasmine.createSpy('deepSpy').and.callFake((args) => {
            return args;
        });
        service['deepColorCopy'] = jasmine.createSpy('deepColor').and.callFake((args: Color) => {
            return args;
        });
        service.undo();
        expect(service.actions.redoList.push).toHaveBeenCalled();
        expect(service['deepSurfaceCopy']).toHaveBeenCalled();
        expect(service['data'].redoIndexList.push).toHaveBeenCalled();
        expect(service.actions.lastActionsList.pop).toHaveBeenCalled();
        expect(service['data'].lastIndexList.pop).toHaveBeenCalled();
    });

    it('#redo should call surfaceListUpdate and deepSurfaceCopy', () => {
        const surfaceList: Path[] = [new Path()];
        service.actions.redoList.push(surfaceList);
        service['data'].redoIndexList.push(0);
        service['data'].redoColorList.push(new Color ());
        service['deepSurfaceCopy'] = jasmine.createSpy('deepSpy');
        service['surfaceListUpdate'] = jasmine.createSpy('surfSpy');
        service.redo();
        expect(service['surfaceListUpdate']).toHaveBeenCalled();
        expect(service['deepSurfaceCopy']).toHaveBeenCalledWith(surfaceList);
    });

    it('#redo should push in redos lists and pop in lastActions lists', () => {
        spyOn(service.actions.lastActionsList, 'push');
        spyOn(service['data'].lastIndexList, 'push');
        spyOn(service.actions.redoList, 'pop');
        spyOn(service['data'].redoIndexList, 'pop');
        service['deepSurfaceCopy'] = jasmine.createSpy('deepSpy').and.callFake((args) => {
            return args;
        });
        service['deepColorCopy'] = jasmine.createSpy('deepColor').and.callFake((args) => {
            return args;
        });
        service.redo();
        expect(service['deepSurfaceCopy']).toHaveBeenCalled();
        expect(service.actions.redoList.pop).toHaveBeenCalled();
        expect(service['data'].redoIndexList.pop).toHaveBeenCalled();
        expect(service.actions.lastActionsList.push).toHaveBeenCalled();
        expect(service['data'].lastIndexList.push).toHaveBeenCalled();
    });

    it('#update should call deepSurfaceCopy and surfaceListSub.next', () => {
        service['drawService'].surfaceList.push(new Path());
        service['drawService'].indexList = 2;
        service['newService'].backgroundColor = new Color();
        service['deepSurfaceCopy'] = jasmine.createSpy('deepSpy').and.callFake((args) => {
            return args;
        });
        service['deepColorCopy'] = jasmine.createSpy('deepColor').and.callFake((args) => {
            return args;
        });
        spyOn(service['surfaceListSub'], 'next');
        service.update();
        expect(service['deepSurfaceCopy']).toHaveBeenCalledWith(service['drawService'].surfaceList);
        expect(service['surfaceListSub'].next).toHaveBeenCalledWith([service['drawService'].surfaceList, service['drawService'].indexList,
        service['newService'].backgroundColor]);
    });

    it('#deepSurfaceCopy should call array.map', () => {
        const surfaceList: Path[] = [];
        surfaceList.push(new Path());
        spyOn(surfaceList, 'map');
        service['deepSurfaceCopy'](surfaceList);
        expect(surfaceList.map).toHaveBeenCalled();
    });

    it('#surfaceListUpdate should call deepSurfaceCopy and modify drawService', () => {
        service.actions.lastActionsList = [[]];
        service.actions.lastActionsList.push([new Path()]);
        service['drawService'].surfaceList = [];
        service['drawService'].surfaceList.push(new Path());
        service['data'].lastIndexList = [0];
        service['data'].lastColorList = [];
        service['data'].lastColorList.push(new Color());
        service['deepSurfaceCopy'] = jasmine.createSpy('deepSpy');

        service['surfaceListUpdate']();
        expect(service['deepSurfaceCopy']).toHaveBeenCalled();
        expect(service['drawService'].indexList).toBe(0);
    });

    it('#surfaceListUpdate should reset all the surfaceList visualisation elements', () => {
        const drawService = service['drawService'];
        drawService.elements.controle.setAttribute('d', 'TESTVALUE');
        drawService.elements.selectionElement.setAttribute('d', 'TESTVALUE');
        drawService.visualisation = 'TESTVALUE';
        service['deepColorCopy'] = jasmine.createSpy('deepColor').and.callFake((args) => {
            return ;
        });
        service['surfaceListUpdate']();
        expect(drawService.elements.controle.getAttribute('d')).toBe('');
        expect(drawService.elements.selectionElement.getAttribute('d')).toBe('');
        expect(drawService.visualisation).toBe('');
    });

    it('#initSubscribe surfaceListSub should call subscribe', () => {
        spyOn(service['surfaceListSub'], 'subscribe');
        service['initSubscribe']();
        // tslint:disable-next-line: deprecation
        expect(service['surfaceListSub'].subscribe).toHaveBeenCalled();
    });

    it('#surfaceListSub.next should modify lasts lists and to empty redos Lists', () => {
        spyOn(service.actions.lastActionsList, 'push');
        spyOn(service['data'].lastIndexList, 'push');
        service.actions.redoList.push([new Path()]);
        service['data'].redoIndexList.push(0);
        const surfaceList: Path[] = [new Path()];
        const nextArguments: [Path[], number, Color] = [surfaceList, 0, new Color()];
        service['surfaceListSub'].next(nextArguments);
        expect(service.actions.lastActionsList.push).toHaveBeenCalledWith(surfaceList);
        expect(service['data'].lastIndexList.push).toHaveBeenCalledWith(0);
        expect(service.actions.redoList.length).toBe(1);
        expect(service['data'].redoIndexList.length).toBe(0);
    });

    it('#initOnLoad should reinitialize all the lists and call deepSurfaceCopy', () => {
        service['drawService'].surfaceList = [];
        service['drawService'].surfaceList.push(new Path());
        service['deepSurfaceCopy'] = jasmine.createSpy('deepSpy').and.callFake((args) => {
            return args;
        });
        service.initOnLoad();
        expect(service.actions.lastActionsList.length).toEqual(1);
        expect(service['data'].lastIndexList.length).toEqual(1);
        expect(service['data'].redoIndexList.length).toEqual(0);
        expect(service.actions.redoList.length).toEqual(1);
        expect(service['deepSurfaceCopy']).toHaveBeenCalledWith(service['drawService'].surfaceList);
    });

    it('#deepColorCopy should return the deepCopy of the color', () => {
        const color = new Color(1, 1, 1);
        const result = service['deepColorCopy'](color);
        expect(result.getColor()).toEqual(color.getColor());
    });

    it('#deepSurfaceCopy should return the deepCopy of the surface', () => {
        service['drawService'].surfaceList = [];
        service['drawService'].surfaceList.push(new Path());
        const result = service['deepSurfaceCopy'](service['drawService'].surfaceList);
        expect(result).not.toBe(service['drawService'].surfaceList);
    });
});

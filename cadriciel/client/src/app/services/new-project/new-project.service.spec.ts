import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Color } from 'src/app/Models/color';
import { WindowSize } from 'src/app/Models/interfaces';
import { Path } from 'src/app/Models/shapes/path';
import { NewProjectService } from './new-project.service';
// tslint:disable no-string-literal
describe('NewProjectService', () => {

    beforeEach(() => TestBed.configureTestingModule({
        providers: [NewProjectService]
    }));

    beforeEach(() => {
       localStorage.clear();
    });

    it('should be created', () => {
        const service: NewProjectService = TestBed.get(NewProjectService);
        expect(service).toBeTruthy();
    });

    it('reset should reset the project', () => {
        const service: NewProjectService = TestBed.get(NewProjectService);
        service['drawService'].surfaceList = [new Path(), new Path()];
        service['drawService'].jonctions = [];
        service['drawService'].jonctions.push(new Path());
        // tslint:disable-next-line: no-magic-numbers
        service['pickerService'].backGroundColor = new Color(255, 255, 255);
        spyOn(service.backgroundColor, 'copyColor');

        service.reset();
        expect(service['drawService'].surfaceList).toEqual([]);
        expect(service['drawService'].jonctions.length).toBe(0);
        expect(service.backgroundColor.copyColor).toHaveBeenCalled();
        expect(service['pickerService'].backGroundColor.getColor()).toEqual('rgba(255 , 255 , 255 , 1)');
    });

    it('windows event have a new observable should reset the project', () => {
        const service: NewProjectService = TestBed.get(NewProjectService);
        service.windowsEvent = new Subject<WindowSize>();
        expect(service.windowsEvent).toEqual(new Subject<WindowSize>());
    });
});

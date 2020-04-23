import { TestBed } from '@angular/core/testing';
import { Color } from 'src/app/Models/color';
import { Path } from 'src/app/Models/shapes/path';
import { Drawing } from '../../../../../common/drawing';
import { NewProjectService } from '../new-project/new-project.service';
import { AutoSaveService } from './auto-save.service';
// tslint:disable no-string-literal
let service: AutoSaveService;
let newService: NewProjectService;
describe('AutoSaveService', () => {
  beforeEach(() => {
    service = TestBed.get(AutoSaveService);
    newService = TestBed.get(NewProjectService);
    service.setNewService(newService);
});

  it('should be created', () => {
    service = TestBed.get(AutoSaveService);
    expect(service).toBeTruthy();
  });

  it('#checkDrawing should update correctly isLoad', () => {
    localStorage.clear();
    service['checkDrawing']();
    expect(service['isLoad']).toBe(false);
    localStorage.setItem('draw', JSON.stringify(new Drawing()));
    localStorage.setItem('date', new Date().toLocaleString());
    service['checkDrawing']();
    expect(service['isLoad']).toBe(true);
  });

  it('#continueDraw should not update if isLoad is false', () => {
    service['isLoad'] = false;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].surfaceList.push(new Path());
    service['currentDrawing'] = new Drawing();
    service['newService'].backgroundColor = new Color(2, 2, 2);
    service.continueDraw();
    expect(service['newService'].backgroundColor).toEqual(new Color(2, 2, 2));
  });

  it('#continueDraw should update if isLoad is true', () => {
    const newDrawing: Drawing = new Drawing();
    service['isLoad'] = true;
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].surfaceList.push(new Path());
    service['newService'].backgroundColor = new Color(2, 2, 2);
    service['currentDrawing'] = newDrawing;
    service.continueDraw();
    expect(service['drawService'].surfaceList.length).toBe(0);
    expect(service['newService'].backgroundColor).toEqual(new Color(0, 0, 0));

    newDrawing.surfaceList.push(new Path());
    service.continueDraw();
    expect(service['drawService'].surfaceList.length).toBe(1);
    expect(service['newService'].backgroundColor).toEqual(new Color(0, 0, 0));
  });

  it('#saveDrawing should update correctly currentDrawing and localStorage', () => {
    localStorage.clear();
    service['drawService'].surfaceList = [];
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].surfaceList.push(new Path());
    service['drawService'].surfaceList.push(new Path());
    service['newService'].backgroundColor = new Color (2, 2, 2);
    service.saveDrawing();
    // tslint:disable-next-line: no-magic-numbers
    expect(service['currentDrawing'].surfaceList.length).toBe(3);
    expect(service['newService'].backgroundColor).toEqual(new Color (2, 2, 2));
    expect(localStorage.getItem('draw')).not.toBe(null);
    const savedDrawing: Drawing = JSON.parse(localStorage.getItem('draw') as string);
    // tslint:disable-next-line: no-magic-numbers
    expect(savedDrawing.surfaceList.length).toBe(3);
    expect(Object.setPrototypeOf(savedDrawing.backgroundColor, Color.prototype)).toEqual(new Color(2, 2, 2));
  });

  it('#setUxDisplay should update correctly the UX', () => {
    localStorage.clear();
    localStorage.setItem('help', JSON.stringify(true));
    localStorage.setItem('style', 'theme');
    let style = service.setUxDisplay();
    expect(style).toEqual('theme');

    localStorage.clear();
    style = service.setUxDisplay();
    expect(style).toEqual('');
  });

  it('#saveUxDisplay should save correctly the UX', () => {
    localStorage.clear();
    service.saveUxDisplay('brightness_3');
    let style = localStorage.getItem('style');
    const help = localStorage.getItem('help');
    expect(style).toEqual('brightness_5');
    expect(help).toEqual('true');

    service.saveUxDisplay('brightness_5');
    style = localStorage.getItem('style');
    expect(style).toEqual('brightness_3');
  });

});

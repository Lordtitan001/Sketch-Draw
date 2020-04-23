// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any
// tslint:disable: max-file-line-count
import { TestBed } from '@angular/core/testing';
import { Path } from 'src/app/Models/shapes/path';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
  let service: ClipboardService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [DrawingServiceService, ColorPickerService],

  }));

  beforeEach(() => {
    service = TestBed.get(ClipboardService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('draw should be deleted with Backspace ', () => {

    const event = new KeyboardEvent('keydown', {
      code: 'Backspace',
    });
    spyOn<any>(service, 'deleteWithBackspace');
    spyOn<any>(service, 'selectAction');
    service.keyDown(event);
    expect(service['deleteWithBackspace']).toHaveBeenCalled();
    expect(service.selectAction).not.toHaveBeenCalled();
  });
  it('draw should be edited with other Keys', () => {

    const event = new KeyboardEvent('keydown', {
      code: 'KeyC',
    });
    spyOn<any>(service, 'deleteWithBackspace');
    spyOn<any>(service, 'selectAction');
    service.keyDown(event);
    expect(service['deleteWithBackspace']).not.toHaveBeenCalled();
    expect(service.selectAction).toHaveBeenCalled();
  });
  it('All Elements should selectionned', () => {

    const event = new KeyboardEvent('keydown', {
      code: 'KeyA', ctrlKey: true,
    });
    spyOn<any>(service, 'stepToCopy');
    spyOn<any>(service, 'stepToDuplicate');
    spyOn<any>(service, 'stepToPaste');
    spyOn(service, 'selectAll');
    service.selectAction(event);
    expect(service.selectAll).toHaveBeenCalled();
  });

  it('All Steps to copy  should set', () => {

    const event = new KeyboardEvent('keydown', {
      code: 'KeyC', ctrlKey: true,
    });
    spyOn<any>(service, 'stepToCopy');
    spyOn<any>(service, 'stepToDuplicate');
    spyOn<any>(service, 'stepToPaste');
    spyOn(service, 'selectAll');
    service.selectAction(event);
    expect(service['stepToCopy']).toHaveBeenCalled();
  });
  it('All Steps to Duplicate  should set', () => {

    const event = new KeyboardEvent('keydown', {
      code: 'KeyD', ctrlKey: true,
    });
    spyOn<any>(service, 'stepToCopy');
    spyOn<any>(service, 'stepToDuplicate');
    spyOn<any>(service, 'stepToPaste');
    spyOn(service, 'selectAll');
    service.selectAction(event);
    expect(service['stepToDuplicate']).toHaveBeenCalled();
  });

  it('All Steps to Paste  should set', () => {

    const event = new KeyboardEvent('keydown', {
      code: 'KeyV', ctrlKey: true,
    });
    spyOn<any>(service, 'stepToCopy');
    spyOn<any>(service, 'stepToDuplicate');
    spyOn<any>(service, 'stepToPaste');
    spyOn(service, 'selectAll');
    service.selectAction(event);
    expect(service['stepToPaste']).toHaveBeenCalled();
  });
  it('Selection should disapear', () => {

    const event = new KeyboardEvent('keydown', {
      code: 'KeyX', ctrlKey: true,
    });
    spyOn<any>(service, 'stepToCopy');
    spyOn<any>(service, 'stepToDuplicate');
    spyOn<any>(service, 'stepToPaste');
    spyOn<any>(service, 'deleteWithBackspace');
    spyOn(service, 'selectAll');
    service.selectAction(event);
    expect(service['deleteWithBackspace']).toHaveBeenCalled();
  });
  it('All steps to Copy should be set ', () => {
    spyOn<any>(service, 'initialiseCopy');
    const event = new KeyboardEvent('keydown', {
      code: 'KeyC', ctrlKey: true,
    });
    service['stepToCopy'](event);
    expect(service['initialiseCopy']).toHaveBeenCalled();

  });
  it('All steps to Duplicate should be set ', () => {
    spyOn<any>(service, 'copyElements');
    spyOn<any>(service, 'drawElements');
    spyOn<any>(service, 'cropDraw');
    service['stepToDuplicate']();
    expect(service['copyElements']).toHaveBeenCalled();
    expect(service['drawElements']).toHaveBeenCalled();
    expect(service['cropDraw']).toHaveBeenCalled();

  });
  it('All steps to Paste When some Elements are already cut should be set ', () => {
    spyOn<any>(service, 'drawElements');
    spyOn<any>(service, 'cropDraw');
    service['canPaste'] = false;
    service['isCut'] = true;
    const path1 = new Path();
    path1.id = 9;
    service['drawService'].surfaceList.push(path1);
    // const path2 = new Path();
    service['cutTab'].push(path1);
    service['stepToPaste']();
    expect(service['drawElements']).toHaveBeenCalled();
    expect(service['cropDraw']).toHaveBeenCalled();
  });

  it('All steps to Paste  should be set ', () => {
    spyOn<any>(service, 'copyElements');
    spyOn<any>(service, 'drawElements');
    spyOn<any>(service, 'cropDraw');
    service['canPaste'] = true;
    service['isCut'] = false;
    const path1 = new Path();
    path1.id = 9;
    service['drawService'].surfaceList.push(path1);
    // const path2 = new Path();
    service['cutTab'].push(path1);
    service['stepToPaste']();
    expect(service['copyElements']).toHaveBeenCalled();
    expect(service['drawElements']).toHaveBeenCalled();
    expect(service['cropDraw']).toHaveBeenCalled();
  });

  it('Selection should move with ArrowKeys', () => {

    const event = new KeyboardEvent('keydown', {
      code: 'KeyX', ctrlKey: false,
    });
    spyOn<any>(service, 'stepToCopy');
    spyOn<any>(service, 'stepToDuplicate');
    spyOn<any>(service, 'stepToPaste');
    spyOn<any>(service, 'selectArrowKey');
    spyOn(service, 'selectAll');
    service.selectAction(event);
    expect(service['selectArrowKey']).toHaveBeenCalled();
  });

  it(' All path of  SVGElement should be in pathTab ', () => {
    service['pathTab'] = [];
    const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element1.setAttribute('id', '9');
    const path1 = new Path();
    path1.id = 9;
    service['drawService'].surfaceList.push(path1);
    const path2 = new Path();
    service['selectionArray'] = {
      listSelected : [],
      tempSelected: [],
      tempArray: [ ]
    };
    service['selectionArray'].listSelected.push(element1);
    service['pathTab'].push(path1);
    service['pathTab'].push(path2);
    service.copyElements(service['selectionArray'].listSelected, 2);
    expect(service['pathTab'].length).toEqual(1);
  });
  it(' All element of path must be the drawing surface ', () => {
    service['pathTab'] = [];
    const path1 = new Path();
    const path2 = new Path();
    service['selectionArray'] = {
      listSelected : [],
      tempSelected: [],
      tempArray: [ ]
    };
    spyOn<any>(service, 'updateListSelected');
    service['pathTab'].push(path1);
    service['pathTab'].push(path2);
    service.drawElements(service['pathTab'], 2);
    expect(service.updateListSelected).toHaveBeenCalled();
  });
  it(' None element should be drawn ', () => {
    service['pathTab'] = [];
    const path1 = new Path();
    const path2 = new Path();
    service['drawService'].surfaceList.length = 2;
    service['drawService'].indexList = 3;
    service['selectionArray'] = {
      listSelected : [],
      tempSelected: [],
      tempArray: [ ]
    };
    spyOn<any>(service, 'updateListSelected');
    service['pathTab'].push(path1);
    service['pathTab'].push(path2);
    service.drawElements(service['pathTab'], 2);
    expect(service.updateListSelected).toHaveBeenCalled();
  });
  it(' SelectionBox changed ', () => {
    service['selectionArray'].listSelected = [];
    service['pathTab'] = [];

    const path1 = new Path();
    const path2 = new Path();
    service['pathTab'].push(path1);
    service['pathTab'].push(path2);

    spyOn(service, 'createSelectionRectWithArray');
    setTimeout(() => {
      service.updateListSelected(service['pathTab']);
      expect(service.createSelectionRectWithArray).toHaveBeenCalled();
    }, 100);
  });
  it(' Attribut translate and rotate of transform of a path element should be separated', () => {
    const path1 = new Path();
    path1.transform = 'translate(0, 0) rotate(0, 0)';
    service['pathTab'].push(path1);
    service['getTransAndRotateFromPath'](path1);
    expect(service['getTransAndRotateFromPath'](path1)).toEqual(['translate(0, 0) ', 'rotate(0, 0)']);
  });
  it(' All steps of deleting a selection should be set ', () => {
    const event = new KeyboardEvent('keydown', {
      code: 'KeyX',
    });
    const path1 = new Path();
    service['cutTab'] = [path1] ;
    service['isCut'] = false;
    spyOn<any> (service, 'initialiseCopy');
    spyOn<any> (service, 'initialiseCut');
    spyOn(service, 'copyElements');
    spyOn<any> (service, 'deleteDraw');
    service['deleteWithBackspace'](event);
    expect(service['isCut']).toEqual(true);
    expect(service['cutTab'].length).toEqual(0);
    expect(service['initialiseCopy']).toHaveBeenCalled();
    expect(service['initialiseCut']).toHaveBeenCalled();
    expect(service.copyElements).toHaveBeenCalled();
    expect(service['deleteDraw']).toHaveBeenCalled();
  });
  it(' All steps of deleting a selection should be set ', () => {
    const event = new KeyboardEvent('keydown', {
      code: 'KeyX',
    });
    const path1 = new Path();
    service['cutTab'] = [path1] ;
    service['isCut'] = false;
    spyOn<any> (service, 'initialiseCopy');
    spyOn<any> (service, 'initialiseCut');
    spyOn(service, 'copyElements');
    spyOn<any> (service, 'deleteDraw');
    service['deleteWithBackspace'](event);
    expect(service['isCut']).toEqual(true);
    expect(service['cutTab'].length).toEqual(0);
    expect(service['initialiseCopy']).toHaveBeenCalled();
    expect(service['initialiseCut']).toHaveBeenCalled();
    expect(service.copyElements).toHaveBeenCalled();
    expect(service['deleteDraw']).toHaveBeenCalled();
  });
  it(' All steps to copy a SVGElement should be set', () => {
    const event = new KeyboardEvent('keydown', {
      code: 'KeyC',
    });
    service['pasteOffset'] = 2;
    service['canPaste'] = false;
    service['pasteMove'] = true;
    service['clipboardTab'] = [];
    service['copiedList'] = [];
    const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const element2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['clipboardTab'].push(element1);
    service['clipboardTab'].push(element2);
    service['copiedList'].push(element1);
    service['copiedList'].push(element2);
    service['selectionArray'].listSelected.push(element1);
    service['initialiseCopy'](event);
    expect(service['clipboardTab'].length).toEqual(1);
    expect(service['copiedList'].length).toEqual(1);
    expect(service['canPaste']).toEqual(true);
    expect(service['pasteMove']).toEqual(false);
  });

  it(' All Element of SVGElement should be deleted ', () => {
    const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element1.setAttribute('id', '90');
    const path1 = new Path();
    path1.id = 90;
    service['drawService'].surfaceList.push(path1);
    service['selectionArray'].listSelected.push(element1);
    spyOn<any>(service, 'createSelectionRectWithArray');

    spyOn<any>(service['undoRedoService'], 'update').and.callFake(() => {
           return ;
     });

    service['deleteDraw'](service['selectionArray'].listSelected);
    expect(service.createSelectionRectWithArray).toHaveBeenCalled();
    expect(service['selectionArray'].listSelected.length).toEqual(0);
  });

  it(' All Elements in the slected must deleted ', () => {
    service['cutTab'] = [];
    const path1 = new Path();
    path1.id = 90;
    path1.transform = 'test';
    service['drawService'].surfaceList.push(path1);
    service['cutTab'].push(path1);
    const element1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element1.setAttribute('id', '90');
    service['selectionArray'].listSelected.push(element1);
    spyOn<any>(service, 'createSelectionRectWithArray');
    service['initialiseCut'](service['selectionArray'].listSelected, 2);
    expect(service['cutTab'].length).toEqual(1);
  });
  // it(' All Elements paste dont change their places', () => {
  //   service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  //   service['pasteOffset'] = 5;
  //   service['cropDraw'](2, 1, 'paste');
  //   expect(service['pasteOffset']).not.toEqual(0);
  // });
  it(' All Elements paste should go back to the first place ', () => {
    service['drawService'].elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
    service['drawService'].elements.controle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['pasteOffset'] = 5;
    service['cropDraw'](2, 1, 'paste');
    expect(service['pasteOffset']).not.toEqual(0);
    spyOn<any>(service['drawService'].elements.svg, 'getBoundingClientRect').and.callFake(() => {
           const element = new DOMRect(20, 20, -20, -20);
           return element;
     });

    // const test: SVGSVGElement = {
    //   contentScriptType: '',
    //   contentStyleType: '2',
    //   height: {
    //     unitType: 2,
    //     value: 20,
    //     valueAsString: '20',
    //     valueInSpecifiedUnits: 20
    //   };
    //  };
    // const width: SVGLength = {
    //    unitType: 2,
    //    value: 20,
    //    valueAsString: '20',
    //    valueInSpecifiedUnits: 20
    //  };
    // service['drawService'].elements.svg.setAttribute('width', '')
    // service['drawService'].elements.svg.height.baseVal.value = 5;
    // service['cropDraw'](2, 1, 'paste');
  });

});


// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatSnackBar, MatSnackBarModule} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { EnumElement, EnumTool } from 'src/app/Models/enums';
import { WindowSize } from 'src/app/Models/interfaces';
import { Path } from 'src/app/Models/shapes/path';
import { AutoSaveService } from 'src/app/services/autoSave/auto-save.service';
import { ColorPickerService } from 'src/app/services/color-picker/color-picker.service';
import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { GalleryServiceService } from 'src/app/services/gallery-service/gallery-service.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { MagnetsimService } from 'src/app/services/magnetsim/magnetsim.service';
import { MapService } from 'src/app/services/maps/map.service';
import { NewProjectService } from 'src/app/services/new-project/new-project.service';
import { SelectedToolService } from 'src/app/services/selected-tool/selected-tool.service';
import { SelectionMoveService } from 'src/app/services/selection-move/selection-move.service';
import { UndoRedoService } from 'src/app/services/undoRedo/undo-redo.service';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let ren: Renderer2;
  const galleryMock = {
  openPopUp : () => ''
  };

  beforeEach(async(() => {
      TestBed.configureTestingModule({
      declarations: [MainComponent],
      providers: [MatDialog, SelectedToolService, SelectionMoveService,
        ColorPickerService, DrawingServiceService,
        NewProjectService, UndoRedoService, MapService, GridService,
        AutoSaveService , MagnetsimService, MatSnackBar, {provide : GalleryServiceService, useValue : galleryMock}],
      imports: [MatDialogModule, RouterTestingModule.withRoutes([]), MatSnackBarModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    ren = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    component = fixture.componentInstance;
    component['drawService'].elements.svg = ren.createElement('svg', 'http://www.w3.org/2000/svg');
    fixture.detectChanges();
    component['undoRedoService'].isNew = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set icon style', () => {
    component['resetSyle'] = jasmine.createSpy('resetSpy');
    component['selectedElement'] = EnumElement.Shape;
    component['getIconStyle'](EnumElement.Shape);
    expect(component['resetSyle']).toHaveBeenCalled();
  });

  it('should not set icon style', () => {
    component['resetSyle'] = jasmine.createSpy('resetSpy');
    component['selectedElement'] = EnumElement.Shape;
    component['getIconStyle'](EnumElement.Grid);
    expect(component['resetSyle']).not.toHaveBeenCalled();
  });

  it('should not set icon style', () => {
    component['mapElement'].forEach((value, key) => {
      value.background = 'blue';
    });
    component['resetSyle']();
    component['mapElement'].forEach((value, key) => {
      expect(value.background).toBe('none');
    });
  });

  it('should call openDialog with parameter', () => {
    component['openDialog'] = jasmine.createSpy('openDialogSpy');
    component['newPage']();
    expect(component['openDialog']).toHaveBeenCalledWith(component['drawService'].surfaceList.length > 0);
  });

  it('should call openDialog with parameter', () => {
    component['openDialog'] = jasmine.createSpy('openDialogSpy');
    component['newPage']();
    expect(component['openDialog']).
      toHaveBeenCalledWith(component['drawService'].surfaceList.length > 0);
  });

  it('should open the drawing modal dialog ans close the others', async(() => {
    component['dialog'].open = jasmine.createSpy('dialogOpenSpy');
    component['dialog'].closeAll = jasmine.createSpy('closeSpy');
    component['selecService'].selectedService.reset = jasmine.createSpy('resetSpy');
    component['drawService'].isModalOpen = false;

    component['openDialog'](true);

    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component['dialog'].closeAll).toHaveBeenCalled();
    expect(component['selecService'].selectedService.reset).toHaveBeenCalled();

    component['dialog']._afterAllClosed.next(undefined);
    setTimeout(() => {
      expect(component['colorPicker'].isTool).toEqual(true);
      expect(component['drawService'].isModalOpen).toEqual(false);
    }, 100);

  }));

  it('should not open the modal dialog', () => {
    component['drawService'].isModalOpen = true;
    component['openDialog'](true);
    expect(component['drawService'].isModalOpen).toBe(true);
    component['openSaveModal']();
    expect(component['drawService'].isModalOpen).toBe(true);
    component['openGalleryModal']();
    expect(component['drawService'].isModalOpen).toBe(true);
    component['openExportModal']();
    expect(component['drawService'].isModalOpen).toBe(true);
  });

  it('should open the save modal dialog ans close the others', async(() => {
    component['dialog'].open = jasmine.createSpy('dialogOpenSpy');
    component['dialog'].closeAll = jasmine.createSpy('closeSpy');
    component['selecService'].selectedService.reset = jasmine.createSpy('resetSpy');
    component['drawService'].isModalOpen = false;
    component['openSaveModal']();
    expect(component['dialog'].closeAll).toHaveBeenCalled();
    expect(component['selecService'].selectedService.reset).toHaveBeenCalled();
    expect(component['dialog'].open).toHaveBeenCalled();

    component['dialog']._afterAllClosed.next(undefined);
    setTimeout(() => {
      expect(component['drawService'].isModalOpen).toEqual(false);
    }, 100);
  }));

  it('should open the gallery modal dialog ans close the others', async(() => {
    component['dialog'].open = jasmine.createSpy('dialogOpenSpy');

    component['dialog'].closeAll = jasmine.createSpy('closeSpy');
    component['selecService'].selectedService.reset = jasmine.createSpy('resetSpy');
    component['drawService'].isModalOpen = false;
    component['openGalleryModal']();
    expect(component['dialog'].closeAll).toHaveBeenCalled();
    expect(component['selecService'].selectedService.reset).toHaveBeenCalled();
    expect(component['dialog'].open).toHaveBeenCalled();

    component['dialog']._afterAllClosed.next(undefined);
    setTimeout(() => {
      expect(component['drawService'].isModalOpen).toEqual(false);
    }, 100);
  }));

  it('should open the export modal dialog ans close the others', async(() => {
    component['dialog'].open = jasmine.createSpy('dialogOpenSpy');

    component['dialog'].closeAll = jasmine.createSpy('closeSpy');
    component['selecService'].selectedService.reset = jasmine.createSpy('resetSpy');
    component['drawService'].isModalOpen = false;
    component['openExportModal']();
    expect(component['dialog'].closeAll).toHaveBeenCalled();
    expect(component['selecService'].selectedService.reset).toHaveBeenCalled();
    expect(component['dialog'].open).toHaveBeenCalled();

    component['dialog']._afterAllClosed.next(undefined);
    setTimeout(() => {
      expect(component['drawService'].isModalOpen).toEqual(false);
    }, 100);
  }));

  it('should open with ctrKey and shift pressed the dialog', () => {

    component['undoRedoService'].undo = jasmine.createSpy('undoSpy');
    component['undoRedoService'].redo = jasmine.createSpy('redoSpy');

    const event = new KeyboardEvent('keydown', {
      code: 'KeyZ',
      ctrlKey: true,
      cancelable: true,
      shiftKey: false,
    });
    dispatchEvent(event);
    component['keyDown'](event);
    expect(component['undoRedoService'].undo).not.toHaveBeenCalledWith();

    const event3 = new KeyboardEvent('keydown', {
      code: 'KeyZ',
      ctrlKey: true,
      cancelable: true,
      shiftKey: true,
    });
    dispatchEvent(event3);
    component['keyDown'](event3);
    expect(component['undoRedoService'].redo).not.toHaveBeenCalledWith();

    component['undoRedoService'].actions.redoList.push([new Path()]);
    component['undoRedoService'].actions.redoList.push([new Path()]);
    const event2 = new KeyboardEvent('keydown', {
      code: 'KeyZ',
      ctrlKey: true,
      cancelable: true,
      shiftKey: true,
    });
    dispatchEvent(event2);
    component['keyDown'](event2);
    expect(component['undoRedoService'].redo).toHaveBeenCalledWith();

  });

  it('should open with ctrKey pressed the dialog', () => {
    component['undoRedoService'].actions.lastActionsList.push([new Path()]);
    component['undoRedoService'].actions.lastActionsList.push([new Path()]);
    const event = new KeyboardEvent('keydown', {
      code: 'KeyO',
      ctrlKey: true,
      cancelable: true
    });
    dispatchEvent(event);
    component['openDialog'] = jasmine.createSpy('openDialogSpy');
    component['openSaveModal'] = jasmine.createSpy('openSaveModalSpy');
    component['openExportModal'] = jasmine.createSpy('openExportModalSpy');
    component['openGalleryModal'] = jasmine.createSpy('openGalleryModalSpy');
    component['undoRedoService'].undo = jasmine.createSpy('undoSpy');

    component['keyDown'](event);
    expect(component['openDialog']).toHaveBeenCalledWith(false);

    const event2 = new KeyboardEvent('keydown', {
      code: 'KeyZ',
      ctrlKey: true,
      cancelable: true,
      shiftKey: false,
    });
    dispatchEvent(event2);
    component['keyDown'](event2);
    expect(component['undoRedoService'].undo).toHaveBeenCalledWith();

    const event3 = new KeyboardEvent('keydown', {
      code: 'KeyS',
      ctrlKey: true,
      cancelable: true
    });
    dispatchEvent(event3);
    component['keyDown'](event3);
    expect(component['openSaveModal']).toHaveBeenCalledWith();

    const event4 = new KeyboardEvent('keydown', {
      code: 'KeyE',
      ctrlKey: true,
      cancelable: true
    });
    dispatchEvent(event4);
    component['keyDown'](event4);
    expect(component['openExportModal']).toHaveBeenCalledWith();

    const event5 = new KeyboardEvent('keydown', {
      code: 'KeyG',
      ctrlKey: true,
      cancelable: true
    });
    dispatchEvent(event5);
    component['keyDown'](event5);
    expect(component['openGalleryModal']).toHaveBeenCalledWith();
  });

  it('should select the type and call the function', () => {
    component['setNavStyle'] = jasmine.createSpy('setNavStyleSpy');
    component['selectElement'](0);
    expect(component['selectedElement']).toEqual(0);
    expect(component['setNavStyle']).toHaveBeenCalled();
  });

  it('should user manual to be open', () => {
    component['router'].navigate = jasmine.createSpy('navigateSpy');
    component['openUserManual']();
    expect(component['router'].navigate).toHaveBeenCalled();
  });

  it('should open and close the side Menu', () => {
    component['lastElement'] = EnumElement.Select;
    component['selectedElement'] = EnumElement.Select;
    component['setNavStyle']();
    expect(component['closeSideMenu']).toEqual(true);

    component['lastElement'] = EnumElement.Shape;
    component['selectedElement'] = EnumElement.Any;
    component['setNavStyle']();
    expect(component['closeSideMenu']).toEqual(false);

  });

  it('should show or hide the grid', () => {
    component['gridSelected'] = true;
    component['gridService'].makeGrid = jasmine.createSpy('makeGridSpy');
    const event = new KeyboardEvent('keydown', {
      code: 'KeyG',
      cancelable: true,
    });
    dispatchEvent(event);
    component['keyDown'](event);
    expect(component['gridService'].makeGrid).not.toHaveBeenCalledWith();

    component['gridSelected'] = false;
    component['keyDown'](event);
    expect(component['gridService'].makeGrid).toHaveBeenCalledWith();
  });

  it('should increase or decrease the size of the grid when pressing + or -', () => {
    component['gridService'].changeSize = jasmine.createSpy('changeSizeSpy');
    component['gridSelected'] = false;
    const event2 = new KeyboardEvent('keydown', {
      cancelable: true,
      key: '+'
    });
    dispatchEvent(event2);
    component['keyDown'](event2);
    expect(component['gridService'].changeSize).not.toHaveBeenCalledWith(event2);

    component['gridSelected'] = true;

    const event = new KeyboardEvent('keydown', {
      cancelable: true,
      key: '-'
    });
    dispatchEvent(event);
    component['keyDown'](event);
    expect(component['gridService'].changeSize).toHaveBeenCalledWith(event);

  });

  it('should call selectElement whit key', async(() => {
    component['drawService'].keyDown = jasmine.createSpy('downSpy').and.returnValue(Promise.resolve(true));
    component['selectElementWithKey'] = jasmine.createSpy('selectSpy');
    const event2 = new KeyboardEvent('keydown', {});
    dispatchEvent(event2);
    component['keyDown'](event2);
    expect(component['drawService'].keyDown)
      .toHaveBeenCalledWith(event2);
    setTimeout(() => {
      expect(component['selectElementWithKey']).toHaveBeenCalled();
    }, 100);
  }));

  it('should not call selectElement whit key', async(() => {
    component['drawService'].keyDown = jasmine.createSpy('downSpy').and.returnValue(Promise.resolve(false));
    component['selectElementWithKey'] = jasmine.createSpy('selectSpy');
    const event2 = new KeyboardEvent('keydown', {});
    dispatchEvent(event2);
    component['keyDown'](event2);
    expect(component['drawService'].keyDown)
      .toHaveBeenCalledWith(event2);
    setTimeout(() => {
      expect(component['selectElementWithKey']).not.toHaveBeenCalled();
    }, 100);
  }));

  it('should set the styles', () => {
    component['setNavStyle']();
    if (component['closeSideMenu'] === true) {
      expect(component['ngStyle'].currentSvgStyle).toEqual({
        left: '50px',
        overflow: 'auto',
        backgroundColor: `${component['newService'].backgroundColor.inverseColor().getColor()}`,
        position: 'fixed',
        zIndex: '3',
        width: '100%',
        height: '100%',
        transition: ' 0.5s'
      });
      expect(component['ngStyle'].currentMenuStyle).toEqual({
        width: '0px',
        display: 'none',
      });

      expect(component['ngStyle'].currentBarStyle).toEqual({
        width: '50px',
      });
    } else {
      expect(component['ngStyle'].currentSvgStyle).toEqual({
        left: '350px',
        overflow: 'auto',
        backgroundColor: `${component['newService'].backgroundColor.inverseColor().getColor()}`,
        position: 'fixed',
        zIndex: '3',
        width: `${window.innerWidth - 350}px`,
        height: '100%',
        transition: ' 0.5s'
      });
      expect(component['ngStyle'].currentMenuStyle).toEqual({
        width: '300px',
        display: 'block',
      });

      expect(component['ngStyle'].currentBarStyle).toEqual({
        width: '350px',
      });
    }
    expect(component['lastElement']).toEqual(component['selectedElement']);
  });

  it('should set the svg style', () => {
    component['closeSideMenu'] = true;
    const windowSize: WindowSize = { width: 1000, height: 1000 };
    component['setSVGStyle'](windowSize);
    expect(component['ngStyle'].currentSvgStyle).toEqual({
      left: '50px',
      overflow: 'auto',
      backgroundColor: `${component['newService'].backgroundColor.inverseColor().getColor()}`,
      position: 'fixed',
      zIndex: '3',
      width: `${windowSize.width}px`,
      height: '100%'
    });

    component['closeSideMenu'] = false;
    component['setSVGStyle'](windowSize);
    expect(component['ngStyle'].currentSvgStyle).toEqual({
      left: '350px',
      overflow: 'auto',
      backgroundColor: `${component['newService'].backgroundColor.inverseColor().getColor()}`,
      position: 'fixed',
      zIndex: '3',
      width: `${windowSize.width}px`,
      height: '100%'
    });
  });

  it('should select element with keys and select Shape', () => {
    component['getIconStyle'] = jasmine.createSpy('spy');
    component['drawService'].enumTool = EnumTool.Line;
    component['selectElementWithKey']();

    expect(component['selectedElement']).toBe(EnumElement.Shape);
    expect(component['getIconStyle']).toHaveBeenCalledWith(EnumElement.Shape);
  });

  it('should select element with keys and select Tool', () => {
    component['getIconStyle'] = jasmine.createSpy('spy');
    component['drawService'].enumTool = EnumTool.Brush;
    component['selectElementWithKey']();

    expect(component['selectedElement']).toBe(EnumElement.Tool);
    expect(component['getIconStyle']).toHaveBeenCalledWith(EnumElement.Tool);
  });

  it('should switch to bright theme', () => {
    component['themeIcon'] = 'brightness_3';
    component['switchTeme']();
    expect(component['themeIcon']).toBe('brightness_5');
  });

  it('should switch to dark theme', () => {
    component['themeIcon'] = 'brightness_5';
    component['switchTeme']();
    expect(component['themeIcon']).toBe('brightness_3');
  });

  it('should try select a shape with the same image and found it', () => {
    component['selectedElement'] = EnumElement.Shape;
    component['drawService'].selectTool = jasmine.createSpy('spy');
    component['drawService'].images.imageShapeSelected = 'timeline';
    component['selectTool']();
    expect(component['drawService'].enumTool).toBe(EnumTool.Line);
    expect(component['drawService'].selectTool).toHaveBeenCalled();
  });

  it('should try select a shape with the same image and not found it', () => {
    component['selectedElement'] = EnumElement.Shape;
    component['drawService'].selectTool = jasmine.createSpy('spy');
    component['drawService'].images.imageShapeSelected = 'okok';
    component['selectTool']();
    expect(component['drawService'].enumTool).not.toBe(EnumTool.Line);
    expect(component['drawService'].selectTool).not.toHaveBeenCalled();
  });

  it('should try select a tool with the same image and found it', () => {
    component['selectedElement'] = EnumElement.Tool;
    component['drawService'].selectTool = jasmine.createSpy('spy');
    component['drawService'].images.imageToolSelected = 'brush';
    component['selectTool']();
    expect(component['drawService'].enumTool).toBe(EnumTool.Brush);
    expect(component['drawService'].selectTool).toHaveBeenCalled();
  });

  it('should try select a tool with the same image and not found it', () => {
    component['selectedElement'] = EnumElement.Tool;
    component['drawService'].selectTool = jasmine.createSpy('spy');
    component['drawService'].images.imageToolSelected = 'okok';
    component['selectTool']();
    expect(component['drawService'].enumTool).not.toBe(EnumTool.Brush);
    expect(component['drawService'].selectTool).not.toHaveBeenCalled();
  });

  it('should handle the event', async(() => {
    component['setSVGStyle'] = jasmine.createSpy('spy');
    const windowSize: WindowSize = { width: 1000, height: 1000 };
    window.dispatchEvent(new Event('resize'));
    component['newService'].windowsEvent.next(windowSize);
    setTimeout(() => {
      expect(component['setSVGStyle']).toHaveBeenCalled();
    }, 100);
  }));

  it('#helpChanged should update values correctly', () => {
    component['undoRedoService'].isNew = false;
    component['mapService'].helpChecked = false;
    spyOn(component['autoSave'], 'saveUxDisplay');
    component['helpChanged']();
    expect(component['autoSave'].saveUxDisplay).toHaveBeenCalled();
    expect(component['mapService'].helpChecked).toBe(true);
  });

  it('#constructor with themIcon = themeIcon ', () => {
    spyOn(component['autoSave'], 'setUxDisplay').and.returnValue('');
    fixture = TestBed.createComponent(MainComponent);
    ren = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect().nothing();
  });

  it('#testKeyEvent should modify magnetService with keyM', () => {
    component['drawService'].isModalOpen = false;
    component['magnetService'].isActive = false;
    component['iconMagnet'] = 'view_module';
    const event = new KeyboardEvent('keydown', {
      code: 'KeyM',
      ctrlKey: true,
      cancelable: true
    });
    dispatchEvent(event);
    component['testKeyEvent'](event);
    expect(component['magnetService'].isActive).toBe(true);
    expect(component['iconMagnet']).toEqual('dashboard');

    component['magnetService'].isActive = true;
    component['iconMagnet'] = '';
    dispatchEvent(event);
    component['testKeyEvent'](event);
    expect(component['iconMagnet']).toEqual('view_module');
    expect(component['magnetService'].isActive).toBe(false);
  });

// tslint:disable-next-line: max-file-line-count
});

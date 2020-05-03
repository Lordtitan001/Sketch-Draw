import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingServiceService } from 'src/app/services/drawing/drawing-service.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { NewProjectService } from 'src/app/services/new-project/new-project.service';
import { SelectedToolService } from 'src/app/services/selected-tool/selected-tool.service';
import { DrawingComponent } from './drawing.component';
// tslint:disable: no-string-literal

describe('DrawingComponentComponent', () => {
  let component: DrawingComponent;
  let fixture: ComponentFixture<DrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingComponent ],
      providers: [DrawingServiceService, NewProjectService, SelectedToolService, GridService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keyUp should call the proper functions ', () => {
    const event = new KeyboardEvent('keyup', {
      shiftKey : false
    });
    const getKeyUpSpy = spyOn(component['selecService'].getSelectService(), 'keyUp');
    component['keyUp'](event);

    expect(getKeyUpSpy).toHaveBeenCalled();

  });

  it('keyDown should call the proper functions ', () => {
    const event = new KeyboardEvent('keydown', {
        shiftKey : false
      });
    const getKeyDownSpy2 = spyOn(component['selecService'].getSelectService(), 'keyDown');
    component['keyDown'](event);
    expect(getKeyDownSpy2).toHaveBeenCalled();
  });

  it('mouseDblclick should call the proper function ', () => {
    const event = new MouseEvent('dbclick');
    const getDblClickSpy = spyOn(component['selecService'].getSelectService(), 'mouseDblclick');
    component['mouseDblclick'](event);

    expect(getDblClickSpy).toHaveBeenCalled();
  });

  it('mousemove should call the proper functions ', () => {
    const event = new MouseEvent('mousemove');
    const getMoveSpy = spyOn(component['selecService'].getSelectService(), 'mouseMove');
    component['mouseMove'](event);

    expect(getMoveSpy).toHaveBeenCalled();
  });

  it('mouseUp should call the proper function ', () => {
    const event = new MouseEvent('mouseup');
    const getUpSpy = spyOn(component['selecService'].getSelectService(), 'mouseUp');
    component['mouseUp'](event);

    expect(getUpSpy).toHaveBeenCalled();
  });

  it('mouseDown should call the proper functions ', () => {
    const event = new MouseEvent('mousedown');
    const getDownSpy = spyOn(component['selecService'].getSelectService(), 'mouseDown');
    component['mouseDown'](event);

    expect(getDownSpy).toHaveBeenCalled();
  });

  it('mouseleave should call the proper function ', () => {
    const getLeaveSpy = spyOn(component['selecService'].getSelectService(), 'mouseLeave');
    component['mouseLeave']();

    expect(getLeaveSpy).toHaveBeenCalled();
  });

  it('mouseclick should call the proper function ', () => {
    const event = new MouseEvent('click');
    const getClickSpy = spyOn(component['selecService'].getSelectService(), 'mouseClick');
    component['mouseClick'](event);

    expect(getClickSpy).toHaveBeenCalled();
  });

  it('mouseDownPath should call the proper function ', () => {
    const event = new MouseEvent('mousedown');
    const getDownPathSpy = spyOn(component['selecService'].getSelectService(), 'mouseDownPath');
    component['mouseDownPath'](event);

    expect(getDownPathSpy).toHaveBeenCalled();
  });

  it('mouseClickPath should call the proper function ', () => {
    const event = new MouseEvent('click');
    const getClickPathSpy = spyOn(component['selecService'].getSelectService(), 'mouseClickPath');
    component['mouseClickPath'](event);

    expect(getClickPathSpy).toHaveBeenCalled();
  });

  it('mouseDownControle should call the proper function ', () => {
    const event = new MouseEvent('mousedown');
    const getDownControlSpy = spyOn(component['selecService'].getSelectService(), 'mouseDownControle');
    component['mouseDownControle'](event);

    expect(getDownControlSpy).toHaveBeenCalled();
  });

  it('mouseDownSelection should call the proper function ', () => {
    const event = new MouseEvent('mousedown');
    const getDownSelectSpy = spyOn(component['selecService'].getSelectService(), 'mouseDownSelection');
    component.mouseDownSelection(event);

    expect(getDownSelectSpy).toHaveBeenCalled();
  });

  it('mouseOverPath should call the proper function ', () => {
    const event = new MouseEvent('mouseover');
    const getOverPathSpy = spyOn(component['selecService'].getSelectService(), 'mouseOverPath');
    component['mouseOverPath'](event);

    expect(getOverPathSpy).toHaveBeenCalled();
  });

  it('mouseLeavePath should call the proper function ', () => {
    const event = new MouseEvent('mouseleave');
    const getLeavePathSpy = spyOn(component['selecService'].getSelectService(), 'mouseLeavePath');
    component['mouseLeavePath'](event);

    expect(getLeavePathSpy).toHaveBeenCalled();
  });

  it('mouseUpPath should call the proper function ', () => {
    const event = new MouseEvent('mouseup');
    const getUpPathSpy = spyOn(component['selecService'].getSelectService(), 'mouseUpPath');
    component['mouseUpPath'](event);

    expect(getUpPathSpy).toHaveBeenCalled();
  });

});

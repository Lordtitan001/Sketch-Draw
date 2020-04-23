import { TestBed } from '@angular/core/testing';

import { Color } from 'src/app/Models/color';
import { Index } from 'src/app/Models/enums';
import { Point } from 'src/app/Models/shapes/point';
import { PaintBucket } from 'src/app/Models/tools/paint-bucket';
import { PaintBucketService } from './paint-bucket.service';
const maxRGBA = 255;
// tslint:disable:no-string-literal
describe('PaintBucketService', () => {
  let service: PaintBucketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(PaintBucketService);
    const drawService = service['drawService'];
    drawService.elements.canvas = document.createElement('canvas');
    drawService.elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    drawService.elements.svg.setAttribute('height', '500');
    drawService.elements.svg.setAttribute('width', '500');
    const grid = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const preview = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    grid.setAttribute('id', 'grid');
    preview.setAttribute('id', 'preview');
    drawService.elements.svg.appendChild(grid);
    drawService.elements.svg.appendChild(preview);
    service['undoRedoService'].update = jasmine.createSpy('update').and.callFake((args) => {
      return ;
    });

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isValid should accept point inside the surface', () => {
    service['data'].svgWidth = Index.OneHundred;
    service['data'].svgHeight = Index.OneHundred;
    const point = new Point(Index.Fifty, Index.Fifty);
    const isvalid = service['isValid'](point);
    expect(isvalid).toBe(true);
  });

  it('isValid should decline point outside the surface', () => {
    service['data'].svgWidth = Index.OneHundred;
    service['data'].svgHeight = Index.OneHundred;
    const point = new Point(Index.OneHundred + 1, Index.OneHundred + 1);
    const isvalid = service['isValid'](point);
    expect(isvalid).toBe(false);
  });

  // tslint:disable:no-magic-numbers
  it('getColor should take color data on a position', () => {
    service['data'].svgWidth = 500;
    service['data'].svgHeight = 500;
    const xml = (new XMLSerializer()).serializeToString(service['drawService'].elements.svg);
    service['ctx'] = service['drawService'].elements.canvas.getContext('2d') as CanvasRenderingContext2D;
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(xml);
    service['ctx'].drawImage(img, 0, 0, service['data'].svgWidth, service['data'].svgHeight);
    service['imageData'] = service['ctx'].getImageData(0, 0, service['data'].svgWidth, service['data'].svgHeight);
    const color = service['getColor'](Index.Zero);
    expect(color).toEqual(new Color(0, 0, 0, 0));
  });

  it('putColor should change color data on a position', () => {
    service['data'].svgWidth = 500;
    service['data'].svgHeight = 500;
    const xml = (new XMLSerializer()).serializeToString(service['drawService'].elements.svg);
    service['ctx'] = service['drawService'].elements.canvas.getContext('2d') as CanvasRenderingContext2D;
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(xml);
    service['ctx'].drawImage(img, 0, 0, service['data'].svgWidth, service['data'].svgHeight);
    service['imageData'] = service['ctx'].getImageData(0, 0, service['data'].svgWidth, service['data'].svgHeight);
    service['putColor'](Index.Zero, new Color(maxRGBA, maxRGBA, maxRGBA, maxRGBA));
    const color = service['getColor'](Index.Zero);
    expect(color).toEqual(new Color(maxRGBA, maxRGBA, maxRGBA, maxRGBA));
  });

  it('colorMatch should  compare two colors and verify the matching(story: false) )', () => {
    const color1 = new Color(maxRGBA, maxRGBA, maxRGBA, maxRGBA);
    const color2 = new Color(Index.Zero, Index.Zero, Index.Zero, Index.Zero);
    const colorMatch = service['colorsMatch'](color1, color2);
    expect(colorMatch).toEqual(false);
  });

  it('colorMatch should  compare two colors and verify the matching(story: true) )', () => {
    const color1 = new Color(maxRGBA, maxRGBA, maxRGBA, maxRGBA);
    const color2 = new Color(maxRGBA, maxRGBA, maxRGBA, maxRGBA);
    const colorMatch = service['colorsMatch'](color1, color2);
    expect(colorMatch).toEqual(true);
  });

  it('neighborsFour should  check four neighbors of a point (north,south,east, west) )', () => {
    const point = new Point(Index.Fifty, Index.Fifty);
    const neighbours = service['neighborsFour'](point);
    const neighboursData = [
      new Point(Index.Fifty, Index.Fifty - 1), new Point(Index.Fifty, Index.Fifty + 1),
      new Point(Index.Fifty - 1, Index.Fifty), new Point(Index.Fifty + 1, Index.Fifty)
    ];
    expect(neighbours).toEqual(neighboursData);
  });

  it('neighborsEight should  check eight neighbors of a point)', () => {
    const point = new Point(Index.Fifty, Index.Fifty);
    const neighbours = service['neighborsEight'](point);
    const neighboursData = [
      new Point(Index.Fifty - 1, Index.Fifty - 1), new Point(Index.Fifty, Index.Fifty - 1),
      new Point(Index.Fifty + 1, Index.Fifty - 1), new Point(Index.Fifty + 1, Index.Fifty),
      new Point(Index.Fifty + 1, Index.Fifty + 1), new Point(Index.Fifty, Index.Fifty + 1),
      new Point(Index.Fifty - 1, Index.Fifty + 1), new Point(Index.Fifty - 1, Index.Fifty)
    ];
    expect(neighbours).toEqual(neighboursData);
  });

  it('setData should fix data width, height , and initialise visitedDatat array)', () => {
    service['setData']();
    expect(service['data'].vsitedData[Index.Zero][Index.Zero]).toEqual(false);
    expect(service['data'].vsitedData[Index.Five][Index.Five]).toEqual(false);
  });

  it('fillBorderData should convert visited set to a 2d array)', () => {
    service['setData']();
    const visited = new Set<Point>();
    visited.add(new Point(Index.Zero, Index.Zero));
    visited.add(new Point(Index.Zero, Index.One));
    visited.add(new Point(Index.Zero, Index.Two));
    visited.add(new Point(Index.Three, Index.Zero));
    visited.add(new Point(Index.Three, Index.One));
    visited.add(new Point(Index.Three, Index.Two));
    service['fillBorderData'](visited);
    expect(service['data'].vsitedData[Index.Zero][Index.Zero]).toEqual(true);
    expect(service['data'].vsitedData[Index.Zero][Index.One]).toEqual(true);
    expect(service['data'].vsitedData[Index.Zero][Index.Two]).toEqual(true);
    expect(service['data'].vsitedData[Index.Three][Index.Zero]).toEqual(true);
    expect(service['data'].vsitedData[Index.Three][Index.One]).toEqual(true);
    expect(service['data'].vsitedData[Index.Three][Index.Two]).toEqual(true);
  });

  it('isOnBorder should determinate if a point is on border or not)', () => {
    service['setData']();
    const visited = new Set<Point>();
    visited.add(new Point(Index.Zero, Index.Zero));
    service['fillBorderData'](visited);
    const isOnBorder1 = service['isOnBorder'](Index.Zero, Index.Zero);
    const isOnBorder2 = service['isOnBorder'](Index.Zero, Index.Two);
    expect(isOnBorder1).toEqual(true);
    expect(isOnBorder2).toEqual(false);
  });

  it('findBorder should determinate all border point)', () => {
    service['setData']();
    service['data'].visited = new Set();
    service['data'].visited.add(new Point(Index.Zero, Index.Zero));
    service['findBorder']();
    expect(service['data'].outline.has('0,0')).toEqual(true);
  });

  it('nextDirection should determinate the next direction )', () => {
    const direction = service['nextDirection'](Index.OneHundred);
    expect(direction).toEqual(Index.Five);
  });

  it('findNextPixel should determinate the next point)', () => {

    service['direction'] = Index.Four;
    service['setData']();
    service['data'].visited = new Set();
    service['data'].visited.add(new Point(Index.Zero, Index.Zero));
    service['data'].visited.add(new Point(Index.Zero, Index.One));
    service['data'].visited.add(new Point(Index.Zero, Index.Two));
    service['findBorder']();
    const point1 = service['findNextPixel'](new Point(Index.Zero, Index.Zero));
    const point2 = service['findNextPixel'](new Point(Index.OneHundred, Index.OneHundred));
    expect(point1).toEqual(new Point(Index.Zero, Index.One));
    expect(point2).toEqual(new Point(Index.OneHundred, Index.OneHundred));
  });

  it('optimisePath should reduce borderPath )', () => {
    service['direction'] = Index.Four;
    service['setData']();
    service['data'].visited = new Set();
    service['data'].visited.add(new Point(Index.Zero, Index.Zero));
    service['data'].visited.add(new Point(Index.Zero, Index.One));
    service['data'].visited.add(new Point(Index.Zero, Index.Two));
    service['findBorder']();
    service['optimisePath']();
    expect(service['data'].outline.size).toEqual(Index.Zero);
  });

  it('generatePath should create path D attribute of svg and cover all the draw surface(tolerance=100) )', () => {
    service['data'].svgWidth = Index.OneHundred;
    service['data'].svgHeight = Index.OneHundred;
    service['tolerance'] = Index.OneHundred;
    const point1 = new Point(Index.Zero, Index.Zero);
    const point2 = new Point(Index.Zero, Index.One);
    const point3 = new Point(Index.Zero, Index.Two);
    const point4 = new Point(Index.Zero, Index.Three);
    const point5 = new Point(Index.Zero, Index.Four);

    const pointData = [[point1, point2, point3, point4, point5]];
    const path = service['generatePath'](pointData);
    const pathValue = ' M 0 0 h 100 v 100 h -100 Z';
    expect(path).toEqual(pathValue);
  });

  it('generatePath should create path D attribute of svg and cover the supposed path (toleerance < 100) )', () => {
    service['data'].svgWidth = Index.OneHundred;
    service['data'].svgHeight = Index.OneHundred;
    service['tolerance'] = Index.Zero;
    const point1 = new Point(Index.Zero, Index.Zero);
    const point2 = new Point(Index.Zero, Index.One);
    const point3 = new Point(Index.Zero, Index.Two);
    const point4 = new Point(Index.Zero, Index.Three);
    const point5 = new Point(Index.Zero, Index.Four);

    const pointData = [[point1, point2, point3, point4, point5]];
    const path = service['generatePath'](pointData);
    const pathValue = 'M 0,0 L 0,0 L 0,1 L 0,2 L 0,3 L 0,4 Z ';
    expect(path).toEqual(pathValue);
  });

  it('draw should draw )', () => {
    service['data'].svgWidth = Index.OneHundred;
    service['data'].svgHeight = Index.OneHundred;
    service['tolerance'] = Index.Zero;
    const point1 = new Point(Index.Zero, Index.Zero);
    const point2 = new Point(Index.Zero, Index.One);
    const point3 = new Point(Index.Zero, Index.Two);
    const point4 = new Point(Index.Zero, Index.Three);
    const point5 = new Point(Index.Zero, Index.Four);

    service['data'].borderData = [[point1, point2, point3, point4, point5]];
    service['colorPicker'].primaryColor = new Color(maxRGBA, maxRGBA, maxRGBA, maxRGBA);
    const path = new PaintBucket();
    service['drawService'].surfaceList.push(path);

    service['draw'](Index.Zero);
    expect(service['drawService'].surfaceList[Index.Zero].d).toBeDefined();
  });

  it('mouseUp should call udapte method', () => {
    service['canDraw'] = true;
    service.mouseUp();
    expect(service['canDraw']).toBe(true);
  });

  it('mouseUp shouldn"t call udapte method', () => {
    service['canDraw'] = false;
    service.mouseUp();
    expect(service['canDraw']).toBe(false);

  });

  it('floodFill should flood the drawing surface', () => {
    service['data'].svgWidth = 500;
    service['data'].svgHeight = 500;
    const xml = (new XMLSerializer()).serializeToString(service['drawService'].elements.svg);
    service['ctx'] = service['drawService'].elements.canvas.getContext('2d') as CanvasRenderingContext2D;
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(xml);
    service['ctx'].drawImage(img, 0, 0, service['data'].svgWidth, service['data'].svgHeight);
    service['imageData'] = service['ctx'].getImageData(0, 0, service['data'].svgWidth, service['data'].svgHeight);
    service['floodFill'](new Point(Index.Zero, Index.Zero), new Color(0, 0, 0, 0),
      new Color(maxRGBA, maxRGBA, maxRGBA, maxRGBA));
    expect(service['data'].queue.length).toBe(Index.Zero);
  });

  it('mouseDown should execute the algorithme', () => {
    const event = new MouseEvent('mousedown', {
      clientX: 100,
      clientY: 100
    });
    service['colorPicker'].primaryColor = new Color(maxRGBA, maxRGBA, maxRGBA, maxRGBA);
    const path = new PaintBucket();
    service['drawService'].surfaceList.push(path);
    service.mouseDown(event);
    expect(service['canDraw']).toBeUndefined();
  });

  it('mouseDown shouldn"t execute the algorithme and stop drawing', () => {
    const event = new MouseEvent('mousedown', {
      clientX: 100,
      clientY: 100
    });
    service['colorPicker'].primaryColor = new Color(0, 0, 0, 0);
    const path = new PaintBucket();
    service['drawService'].surfaceList.push(path);
    service.mouseDown(event);
    expect(service['canDraw']).toBeUndefined();
  });

});

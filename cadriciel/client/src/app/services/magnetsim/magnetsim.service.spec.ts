// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any

import { TestBed } from '@angular/core/testing';
import { MagnetPosition } from 'src/app/Models/interfaces';
import { Point } from 'src/app/Models/shapes/point';
import { MagnetsimService } from './magnetsim.service';

describe('MagnetsimService', () => {
  let service: MagnetsimService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(MagnetsimService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('findPoint with both if statements true', () => {
    const element = document.createElementNS('https://apireference.aspose.com/html/net/aspose.html.dom.svg', 'svg') as SVGPathElement;
    const bbox = new DOMRect(0, 0, 3, 4);
    const data: MagnetPosition = {widthDivider: 20, heightDivider: 20};
    spyOn(element, 'getBoundingClientRect').and.returnValue(bbox);
    spyOn(service['mapService'].magnetismMap, 'get').and.returnValue(data);
    const position: Point = service['findPoint'](element);

    expect(position).toBeTruthy();
  });

  it('findPoint with both if statements false', () => {
    const element = document.createElementNS('https://apireference.aspose.com/html/net/aspose.html.dom.svg', 'svg') as SVGPathElement;
    const bbox = new DOMRect(0, 0, 3, 4);
    const data: MagnetPosition = {widthDivider: 0, heightDivider: 0};
    spyOn(element, 'getBoundingClientRect').and.returnValue(bbox);
    spyOn(service['mapService'].magnetismMap, 'get').and.returnValue(data);
    const position: Point = service['findPoint'](element);

    expect(position).toBeTruthy();
  });

  it('canMoveY with first 2 if statements true, 2nd if statement (offset<position)', () => {
    const position2 = 0;
    const direction = -1;
    const offset = 1;
    const position = 2;
    const canMove: boolean = service['canMoveY'](position2, direction, offset, position);

    expect(canMove).toBe(true);
  });

  it('canMoveY with 1st if true and 2nd false, ', () => {
    const position2 = 3;
    const direction = -1;
    const offset = 4;
    const position = 3;
    const canMove: boolean = service['canMoveY'](position2, direction, offset, position);

    expect(canMove).toBe(false);
  });

  it('canMoveY with last 2 if statements true, ', () => {
    const position2 = 0;
    const direction = 1;
    const offset = 4;
    const position = 3;
    const canMove: boolean = service['canMoveY'](position2, direction, offset, position);

    expect(canMove).toBe(true);
  });

  it('canMoveY with second to last if true and last false, ', () => {
    const position2 = 0;
    const direction = 1;
    const offset = 3;
    const position = 4;
    const canMove: boolean = service['canMoveY'](position2, direction, offset, position);

    expect(canMove).toBe(false);
  });

  it('findPointToTranslate with next ifs true: 1st, 2nd, & 4th ', () => {
    const element = document.createElementNS('https://apireference.aspose.com/html/net/aspose.html.dom.svg', 'svg') as SVGPathElement;
    const next = new Point(0, 0);
    const offset: [number, number] = [0, 0];
    const arraowKey = true;
    const position = new Point(0, 0);
    spyOn<any>(service, 'findPoint').and.returnValue(position);
    service['gridService'].width = 1;
    service['gridService'].height = 1;
    service['gridService'].thickness = 1;
    let result: Point;
    result = service['findPointToTranslate'](element, next, offset, arraowKey);

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('findPointToTranslate with: 1st false, 2nd false, 3rd true?, 4th false, 5th true', () => {
    const element = document.createElementNS('https://apireference.aspose.com/html/net/aspose.html.dom.svg', 'svg') as SVGPathElement;
    const next = new Point(1, 1);
    const offset: [number, number] = [0, 0];
    const arraowKey = false;
    const position = new Point(0, 0);
    spyOn<any>(service, 'findPoint').and.returnValue(position);
    spyOn<any>(service, 'canMoveY').and.returnValue(true);
    service['gridService'].width = 2;
    service['gridService'].height = 2;
    service['gridService'].thickness = 1;
    let result: Point;
    result = service['findPointToTranslate'](element, next, offset, arraowKey);

    expect(result.x).toBe(1);
    expect(result.y).toBe(1);
  });

  it('findPointToTranslate with:  3rd true & 5th true, second part of each', () => {
    const element = document.createElementNS('https://apireference.aspose.com/html/net/aspose.html.dom.svg', 'svg') as SVGPathElement;
    const next = new Point(-1, -1);
    const offset: [number, number] = [0, 0];
    const arraowKey = false;
    const position = new Point(0, 0);
    spyOn<any>(service, 'findPoint').and.returnValue(position);
    spyOn<any>(service, 'canMoveY').and.returnValue(true);
    service['gridService'].width = 2;
    service['gridService'].height = 2;
    service['gridService'].thickness = 1;
    let result: Point;
    result = service['findPointToTranslate'](element, next, offset, arraowKey);

    expect(result.x).toBe(-1);
    expect(result.y).toBe(-1);
  });
});

import { TestBed } from '@angular/core/testing';
import { ExportationService } from './exportation.service';

  // tslint:disable no-string-literal
  // tslint:disable: no-magic-numbers
const element = {
  remove(): void {
    return;
  }
};

describe('ExportationService', () => {
  let service: ExportationService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ExportationService]
  }));

  beforeEach(() => {
    service = TestBed.get(ExportationService);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
    service.svg = svg;
    service['drawService'].elements.svg = svg;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onInit should initialise the necessary variables', () => {
    service.svg.getElementById = jasmine.createSpy('svg').and.returnValue(element);
    service.onInit();
    expect(service.svg.getElementById).toHaveBeenCalled();

  });

  it('applyFilter should apply the proper filters', () => {
    service.filter = document.createElement('HTMLSelectElement') as HTMLSelectElement;
    service.filter.value = 'Blur';

    const filter: string = service.applyFilter();
    expect(filter).toBe('Blur');
  });

  it('reset should reset the arguments', () => {
    service.reset();
    expect(service.export.fileName).toBe('image');
    expect(service.export.email).toBe('');
    expect(service.export.author).toBe('');
    expect(service.export.sendByMail).toBe(false);
  });

  it('svgToImage should clone the node and go in svg', () => { 
    service.extension = document.createElement('HTMLSelectElement') as HTMLSelectElement;
    service.extension.value = 'svg';
    service.select = document.createElement('HTMLAnchorElement') as HTMLAnchorElement;
    service.select.setAttribute = jasmine.createSpy('setAttribute');
    let sendEmail = true;
    service.svgToImage(sendEmail);

    expect(service.select.setAttribute).toHaveBeenCalled();
    expect().nothing();

  });

  it('svgToImage should not go in svg and enter img.onload but not if statement', () => { 
    service.extension = document.createElement('HTMLSelectElement') as HTMLSelectElement;
    service.extension.value = 'jpg';
    service.select = document.createElement('HTMLAnchorElement') as HTMLAnchorElement;
    service.canvas = document.createElement('HTMLCanvasElement') as HTMLCanvasElement;
    service.select.setAttribute = jasmine.createSpy('setAttribute');
    service.canvas.getContext = jasmine.createSpy('getContext').and.callFake(() => {
      return null;
    });
    let sendEmail = true;
    service.svgToImage(sendEmail);

    expect(service.select.setAttribute).not.toHaveBeenCalled();
    expect().nothing();

  });

  it('svgToImage should not go in svg and enter img.onload and if statement', () => { 
    service.extension = document.createElement('HTMLSelectElement') as HTMLSelectElement;
    service.extension.value = 'jpg';
    service.select = document.createElement('HTMLAnchorElement') as HTMLAnchorElement;
    service.canvas = document.createElement('HTMLCanvasElement') as HTMLCanvasElement;
    service.canvas.getContext = jasmine.createSpy('getContext').and.callFake(() => {
      return null;
    });
    let sendEmail = false;
    service.svgToImage(sendEmail);

    expect(service.previewStyle).toBe('none');
    expect().nothing();

  });

  it('svgToImage should not go in svg and enter img.onload and in if statement', () => { 
    const ctx = {
      filter: '',
      // tslint:disable-next-line: typedef
      drawImage(img: HTMLImageElement, zero: number, zero2: number) {
        return;
      }
    };

    service.extension = document.createElement('HTMLSelectElement') as HTMLSelectElement;
    service.extension.value = 'jpg';
    service.select = document.createElement('HTMLAnchorElement') as HTMLAnchorElement;
    service.canvas = document.createElement('HTMLCanvasElement') as HTMLCanvasElement;
    service.select.setAttribute = jasmine.createSpy('setAttribute');
    service.canvas.getContext = jasmine.createSpy('getContext').and.returnValue(ctx);
    service.canvas.toDataURL = jasmine.createSpy('James James Bond').and.returnValue('');
    let sendEmail = true;
    service.svgToImage(sendEmail);
    expect(service.select.setAttribute).not.toHaveBeenCalled();

  });

});

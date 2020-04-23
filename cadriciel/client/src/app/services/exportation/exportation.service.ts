import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Export } from 'src/app/Models/interfaces';
import { DrawingServiceService } from '../drawing/drawing-service.service';
// Nos sources : https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser
@Injectable({
  providedIn: 'root'
})
export class ExportationService {
  svg: SVGSVGElement;
  select: HTMLAnchorElement;
  canvas: HTMLCanvasElement;
  export: Export;
  filter: HTMLSelectElement;
  filterApplier: object;
  extension: HTMLSelectElement;
  previewStyle: string;
  imgData: string;
  private renderer: Renderer2;

  constructor(private drawService: DrawingServiceService, private rendererFactory: RendererFactory2) {
    this.export = {
      fileName: 'image',
      email: '',
      author: '',
      sendByMail: false
    };
    this.previewStyle = 'none';
    this.imgData = '';
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  onInit(): void {
    this.svg.getElementById('grid').remove();
    this.svg.getElementById('preview').remove();
    const xml = (new XMLSerializer()).serializeToString(this.svg);
    const image = new Image();
    image.src = 'data:image/svg+xml;base64,' + btoa(xml);
  }

  applyFilter(): string {
    return this.filter.value;
  }

  async svgToImage(sendByMail: boolean): Promise<string> {
    this.canvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
    const svg = this.drawService.elements.svg.cloneNode(true) as SVGSVGElement;
    svg.setAttribute('filter', this.previewStyle);
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(xml);
    this.imgData = btoa(xml);
    if (this.extension.value === 'svg') {
      this.select.setAttribute('href', img.src);
      this.select.setAttribute('download', this.export.fileName + '.' + this.extension.value);
      this.previewStyle = 'none';
      return Promise.resolve(this.imgData);
    }
    return new Promise((resolve) => {
      img.onload = () => {
        this.canvas.width = parseInt(this.drawService.elements.svg.getAttribute('width') as string, 10);
        this.canvas.height = parseInt(this.drawService.elements.svg.getAttribute('height') as string, 10);
        const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(img, 0, 0);
        const data = this.imgData = this.canvas.toDataURL();
        this.imgData = this.imgData.replace('data:image/png;base64,', '');
        if (!sendByMail) {
          this.select.setAttribute('href', data);
          this.select.setAttribute('download', this.export.fileName + '.' + this.extension.value);
          this.select.click();
          this.previewStyle = 'none';
        } else {
          resolve(this.imgData);
        }
      };
    });
  }

  reset(): void {
    this.export.fileName = 'image';
    this.export.email = '';
    this.export.author = '';
    this.export.sendByMail = false;
  }
}

import { Injectable } from '@angular/core';
import { Color } from 'src/app/Models/color';
import { Pixel } from 'src/app/Models/enums';
import { AbstractToolsService } from '../abstract-tools/abstract-tools.service';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DrawingServiceService } from '../drawing/drawing-service.service';
const maxRGB = 255;
@Injectable({
  providedIn: 'root'
})
/*
Nos sources:
http://www.graphicalweb.org/2010/papers/62-From_SVG_to_Canvas_and_Back/
https://developer.mozilla.org/fr/docs/Tutoriel_canvas/Pixel_manipulation_with_canvas
*/
export class PipetteService extends AbstractToolsService {
  private xml: string;
  private ctx: CanvasRenderingContext2D;
  constructor(private drawService: DrawingServiceService,
              public colorPickerService: ColorPickerService) {
    super();
    this.xml = '';
  }

  private drawImage(): void {
    const px = this.drawService.elements.svg.width.animVal.value;
    const py = this.drawService.elements.svg.height.animVal.value;

    this.xml = (new XMLSerializer()).serializeToString(this.drawService.elements.svg);
    this.drawService.elements.canvas.width = px;
    this.drawService.elements.canvas.height = py;
    this.ctx = this.drawService.elements.canvas.getContext('2d') as CanvasRenderingContext2D;
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(this.xml);
    this.ctx.drawImage(img, 0, 0, px, py);

  }

  private pickColor(event: MouseEvent): void {

    const x = event.offsetX;
    const y = event.offsetY;
    const pixel = this.ctx.getImageData(x, y, 1, 1);
    const data = pixel.data;
    const temp = new Color(data[Pixel.r] as number, data[Pixel.g] as number, data[Pixel.b] as number
      , (data[Pixel.o] / maxRGB) as number);
    const click = event.button.toString();
    if (click === '0') {
      this.colorPickerService.primaryColor = temp;
    }
    if (click === '2') {
      this.colorPickerService.secondaryColor = temp;
    }
    this.colorPickerService.updateLastColorUsed(temp);
  }
  mouseMove(): void {
    this.drawImage();
  }
  mouseDown(event: MouseEvent): void {
    this.pickColor(event);
  }

}

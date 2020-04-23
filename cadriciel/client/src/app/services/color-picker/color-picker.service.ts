import { Injectable } from '@angular/core';
import { Color } from '../../Models/color';
const maxRGB = 255;
const midRGB = 150;
@Injectable({
  providedIn: 'root'
})
export class ColorPickerService {

  primaryColor: Color;
  secondaryColor: Color;
  previewColor: Color;
  backGroundColor: Color;
  lastTenColors: Color[];

  isFirstColorSelected: boolean;
  isCanevasOn: boolean;
  isTool: boolean;
  isBlueSliderOn: boolean;

  constructor() {
    this.primaryColor = new Color();
    this.secondaryColor = new Color();
    this.previewColor = new Color();
    this.lastTenColors = [new Color(maxRGB, 0, 0, 1), new Color(0, maxRGB, 0, 1), new Color(0, 0, maxRGB, 1)
      , new Color(maxRGB, maxRGB, midRGB, 1), new Color(maxRGB, 0, maxRGB, 1),
    new Color(0, maxRGB, maxRGB, 1), new Color(maxRGB, maxRGB, maxRGB, 1), new Color(0, 0, midRGB, 1),
    new Color(midRGB, maxRGB, 0, 1), new Color(midRGB, 0, maxRGB, 1)];

    this.backGroundColor = new Color(maxRGB, maxRGB, maxRGB);
    this.isFirstColorSelected = true;
    this.isTool = true;
    this.isBlueSliderOn = false;
    this.isCanevasOn = false;

  }

  updateLastColorUsed(color: Color): boolean {
    for (const last of this.lastTenColors) {
      if (color.redValue === last.redValue &&
        color.blueValue === last.blueValue &&
        color.greenValue === last.greenValue) {
        return false;
      }
    }
    this.lastTenColors.pop();
    this.lastTenColors.unshift(color);
    return true;
  }

  inverseColor(): void {
    const tmp: Color = new Color();
    tmp.copyColor(this.primaryColor);
    this.primaryColor.copyColor(this.secondaryColor);
    this.secondaryColor.copyColor(tmp);
    this.isFirstColorSelected ? this.previewColor.copyColor(this.primaryColor) : this.previewColor.copyColor(this.secondaryColor);
  }

  confirmColor(isFirstColorSelected: boolean): void {
    const  color = new Color();
    if (isFirstColorSelected) {
      this.primaryColor.copyColor(this.previewColor);
      color.copyColor(this.primaryColor);
    } else {
      this.secondaryColor.copyColor(this.previewColor);
      color.copyColor(this.secondaryColor);
    }
    this.updateLastColorUsed(color);
  }

  confirmBackGroundColor(): boolean {
    if (!this.isTool) {
      this.backGroundColor.copyColor(this.previewColor);
      this.previewColor = new Color();
      return true;
    }
    return false;
  }
}

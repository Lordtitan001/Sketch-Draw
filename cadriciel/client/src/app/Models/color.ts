const radix = 16;
const firstOpacity = 0.2;
const testOpacity = 0.6;
const sixbytwo = 3;
const maxRGB = 255;

export class Color {
    redValue: number;
    greenValue: number;
    blueValue: number;
    opacityValue: number;
    constructor(red: number = 0, green: number = 0, blue: number = 0, opacity: number = 1) {
        this.redValue = red;
        this.greenValue = green;
        this.blueValue = blue;
        this.opacityValue = opacity;
    }

    getColor(): string {
        return `rgba(${this.redValue} , ${this.greenValue} , ${this.blueValue} , ${this.opacityValue})`;
    }

    getColorHex(): string {
        const r = (this.redValue.toString(radix).length === 1) ? '0' + this.redValue.toString(radix) : this.redValue.toString(radix);
        const v = (this.greenValue.toString(radix).length === 1) ? '0' + this.greenValue.toString(radix) : this.greenValue.toString(radix);
        const b = (this.blueValue.toString(radix).length === 1) ? '0' + this.blueValue.toString(radix) : this.blueValue.toString(radix);
        return `${r + v + b}`;
    }
    copyColor(color: Color): void {
        this.redValue = color.redValue;
        this.greenValue = color.greenValue;
        this.blueValue = color.blueValue;
        this.opacityValue = color.opacityValue;
    }

    inverseColor(): Color {
        const opacity = (this.opacityValue > testOpacity) ? firstOpacity : 1;
        return new Color(maxRGB - this.redValue, maxRGB - this.greenValue, maxRGB - this.blueValue, opacity);
    }

    update(hexValue: string): void {
        if (hexValue === '') {
            this.redValue = 0;
            this.blueValue = 0;
            this.greenValue = 0;
            return;
        }
        const argumentToRedValue = `0x${hexValue[0] + hexValue[1]})`;
        this.redValue = parseInt(argumentToRedValue, radix);
        const argumentToGreenValue = `0x${hexValue[2] + hexValue[sixbytwo]})`;
        this.greenValue = parseInt(argumentToGreenValue, radix);
        const argumentToBlueValue = `0x${hexValue[sixbytwo + 1] + hexValue[sixbytwo + 2]})`;
        this.blueValue = parseInt(argumentToBlueValue, radix);
    }
}

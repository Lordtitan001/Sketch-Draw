import { EnumTool } from '../enums';
import { Path } from './path';

export class Aerosol extends Path {
    constructor() {
      super();
      this.strokeWidth = '15';
      this.fill = 'transparent';
      this.enumTool = EnumTool.Aerosol;
      this.speed = '15';
      this.d = '';
    }
  }

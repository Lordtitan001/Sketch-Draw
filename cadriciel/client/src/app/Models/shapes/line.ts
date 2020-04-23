import { Path } from './path';

export class Line extends Path {
    constructor() {
      super();
      this.strokeWidth = '2';
      this.withJonctions = false;
      this.jonctionsPaths = [];
      this.pointPaths = [];
      this.pointsList = [];
    }
}

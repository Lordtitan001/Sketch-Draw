import { Color } from '../client/src/app/Models/color';
import { Path } from '../client/src/app/Models/shapes/path';

export class Drawing {
    nom: string;
    surfaceList: Path[];
    backgroundColor: Color;
    svgDimensions: [string, string];
    prev: string;
    tags: string [];

    constructor(nom: string = 'Sans nom', surfaceList: Path[] = [] , backgroundcolor: Color= new Color(),
                svgDimensions: [string, string] = ['0', '0'], tags: string[] = [] ) {
        this.surfaceList = surfaceList;
        this.backgroundColor = backgroundcolor;
        this.svgDimensions = svgDimensions;
        this.prev = '';
        this.nom = nom;
        this.tags = tags;
    }
}

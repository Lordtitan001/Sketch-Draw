import { Injectable } from '@angular/core';
import { EnumTool, Magnetsim, Textures } from 'src/app/Models/enums';
import { MagnetPosition, StyleTool } from 'src/app/Models/interfaces';
import { KeyEnum } from 'src/app/Models/key-list';
import { Aerosol } from 'src/app/Models/shapes/aerosol';
import { BasicObject } from 'src/app/Models/shapes/basic-object';
import { Ellipse } from 'src/app/Models/shapes/ellipse';
import { Line } from 'src/app/Models/shapes/line';
import { Path } from 'src/app/Models/shapes/path';
import { Polygon } from 'src/app/Models/shapes/polygon';
import { Rectangle } from 'src/app/Models/shapes/rectangle';
import { Brush } from 'src/app/Models/tools/brush';
import { Eraser } from 'src/app/Models/tools/eraser';
import { PaintBucket } from 'src/app/Models/tools/paint-bucket';
import { Pen } from 'src/app/Models/tools/pen';
import { Pencil } from 'src/app/Models/tools/pencil';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  textureMap: Map<string, Textures>;
  mapTool: Map<EnumTool, StyleTool>;
  mapIcon: Map<EnumTool, string>;
  defaultStyle: StyleTool;
  toolsMap: Map<EnumTool, BasicObject>;
  keyMapTool: Map<string, KeyEnum>;
  keyMapShape: Map<string, KeyEnum>;
  magnetismMap: Map<Magnetsim, MagnetPosition>;
  helpChecked: boolean;
  constructor() {
    this.defaultStyle = { 'box-sizing': 'none', 'border': '1px solid', 'margin': 'none', 'transition': 'none', 'cursor': 'pointer' };

    this.toolsMap = new Map<EnumTool, BasicObject>();
    this.keyMapTool = new Map<string, KeyEnum>();
    this.keyMapShape = new Map<string, KeyEnum>();
    this.textureMap = new Map<string, Textures>();
    this.mapTool = new Map<EnumTool, StyleTool>();
    this.mapIcon = new  Map<EnumTool, string>();
    this.magnetismMap = new Map<Magnetsim, MagnetPosition>();

    this.helpChecked = true;

    this.mapTool.set(EnumTool.Any, this.defaultStyle);
    this.mapTool.set(EnumTool.Pencil, this.defaultStyle);
    this.mapTool.set(EnumTool.Brush, this.defaultStyle);
    this.mapTool.set(EnumTool.Rectangle, this.defaultStyle);
    this.mapTool.set(EnumTool.Line, this.defaultStyle);
    this.mapTool.set(EnumTool.Ellipse, this.defaultStyle);
    this.mapTool.set(EnumTool.Aerosol, this.defaultStyle);
    this.mapTool.set(EnumTool.Selection, this.defaultStyle);
    this.mapTool.set(EnumTool.ColorSetter, this.defaultStyle);
    this.mapTool.set(EnumTool.Pipette, this.defaultStyle);
    this.mapTool.set(EnumTool.Eraser, this.defaultStyle);
    this.mapTool.set(EnumTool.Polygone, this.defaultStyle);
    this.mapTool.set(EnumTool.Pen, this.defaultStyle);
    this.mapTool.set(EnumTool.PaintBucket, this.defaultStyle);

    this.mapIcon.set(EnumTool.Pencil, 'create');
    this.mapIcon.set(EnumTool.Brush, 'brush');
    this.mapIcon.set(EnumTool.Rectangle, 'crop_3_2');
    this.mapIcon.set(EnumTool.Line, 'timeline');
    this.mapIcon.set(EnumTool.Ellipse, 'panorama_fish_eye');
    this.mapIcon.set(EnumTool.Aerosol, 'bubble_chart');
    this.mapIcon.set(EnumTool.Selection, 'border_style');
    this.mapIcon.set(EnumTool.ColorSetter, 'colorize');
    this.mapIcon.set(EnumTool.Pipette, 'invert_colors');
    this.mapIcon.set(EnumTool.Eraser, 'crop_portrait');
    this.mapIcon.set(EnumTool.Polygone, 'change_history');
    this.mapIcon.set(EnumTool.Pen, 'gesture');

    this.mapIcon.set(EnumTool.PaintBucket, 'format_color_fill');
    this.textureMap.set('Default', Textures.Default);
    this.textureMap.set('Filter1', Textures.Texture1);
    this.textureMap.set('Filter2', Textures.Texture2);
    this.textureMap.set('Filter3', Textures.Texture3);
    this.textureMap.set('Filter4', Textures.Texture4);
    this.textureMap.set('Filter5', Textures.Texture5);

    this.toolsMap.set(EnumTool.Any, new BasicObject());
    this.toolsMap.set(EnumTool.Pencil, new Pencil());
    this.toolsMap.set(EnumTool.Rectangle, new Rectangle());
    this.toolsMap.set(EnumTool.Line, new Line());
    this.toolsMap.set(EnumTool.Brush, new Brush());
    this.toolsMap.set(EnumTool.Ellipse, new Ellipse());
    this.toolsMap.set(EnumTool.Aerosol, new Aerosol());
    this.toolsMap.set(EnumTool.Polygone, new Polygon());
    this.toolsMap.set(EnumTool.Grid, new Path());
    this.toolsMap.set(EnumTool.Pen, new Pen());
    this.toolsMap.set(EnumTool.PaintBucket, new PaintBucket());

    this.keyMapTool.set('KeyW', new KeyEnum('brush', EnumTool.Brush));
    this.toolsMap.set(EnumTool.Selection, new BasicObject());
    this.toolsMap.set(EnumTool.ColorSetter, new BasicObject());
    this.toolsMap.set(EnumTool.Pipette, new BasicObject());
    this.toolsMap.set(EnumTool.Eraser, new Eraser());
    this.toolsMap.set(EnumTool.PaintBucket, new PaintBucket());

    this.keyMapTool.set('KeyW', new KeyEnum('brush', EnumTool.Brush));
    this.keyMapTool.set('KeyC', new KeyEnum('create', EnumTool.Pencil));
    this.keyMapTool.set('KeyS', new KeyEnum('border_style', EnumTool.Selection));
    this.keyMapTool.set('KeyR', new KeyEnum('colorize', EnumTool.ColorSetter));
    this.keyMapTool.set('KeyE', new KeyEnum('crop_portrait', EnumTool.Eraser));
    this.keyMapTool.set('KeyI', new KeyEnum('invert_colors', EnumTool.Pipette));
    this.keyMapTool.set('KeyE', new KeyEnum('crop_portrait', EnumTool.Eraser));
    this.keyMapTool.set('KeyA', new KeyEnum('bubble_chart ', EnumTool.Aerosol));
    this.keyMapTool.set('KeyP', new KeyEnum('gesture ', EnumTool.Pen));

    this.keyMapTool.set('KeyB', new KeyEnum('format_color_fill ', EnumTool.PaintBucket));
    this.keyMapShape.set('KeyL', new KeyEnum('timeline', EnumTool.Line));
    this.keyMapShape.set('Digit1', new KeyEnum('crop_3_2', EnumTool.Rectangle));
    this.keyMapShape.set('Digit2', new KeyEnum('panorama_fish_eye', EnumTool.Ellipse));
    this.keyMapShape.set('Digit3', new KeyEnum('change_history', EnumTool.Polygone));

    this.magnetismMap.set(Magnetsim.TopLeft, {widthDivider: 0, heightDivider: 0});
    this.magnetismMap.set(Magnetsim.TopRight, {widthDivider: 1, heightDivider: 0});
    this.magnetismMap.set(Magnetsim.BottomLeft, {widthDivider: 0, heightDivider: 1});
    this.magnetismMap.set(Magnetsim.BottomRight, {widthDivider: 1, heightDivider: 1});
    this.magnetismMap.set(Magnetsim.Center, {widthDivider: 2, heightDivider: 2});
    this.magnetismMap.set(Magnetsim.CenterBottom, {widthDivider: 2, heightDivider: 1});
    this.magnetismMap.set(Magnetsim.CenterTop, {widthDivider: 2, heightDivider: 0});
    this.magnetismMap.set(Magnetsim.CenterLeft, {widthDivider: 0, heightDivider: 2});
    this.magnetismMap.set(Magnetsim.CenterRight, {widthDivider: 1, heightDivider: 2});
  }
}

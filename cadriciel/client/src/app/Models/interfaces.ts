import { ProgressSpinnerMode, ThemePalette } from '@angular/material';
import { Color } from './color';
import { EnumTool, strokeTypeEnum, Textures } from './enums';
import { Path } from './shapes/path';
import { Point } from './shapes/point';

export interface Subject {
    name: string;
    text: string;
    img: string;
    index: number;
    category: number;
    explication: string;

}

export interface StyleIcon {
    background: string;
}
export interface SubjectCategories {
    none: Subject[];
    tools: Subject[];
    forms: Subject[];
    selections: Subject[];
    exportations: Subject[];
}
export interface Show {
    isShowTools: boolean;
    isShowForms: boolean;
    isShowExportations: boolean;
    isShowSelections: boolean;
}
export interface StyleTool {
    'box-sizing': string;
    border: string;
    margin: string;
    transition: string;
    cursor: string;
}

export interface Category {
    type: Subject[];
    index: number;

}
export interface Entry {
    name: string;
    path: string;
}

export interface Properties {
    stroke: string;
    strokeWidth: string;
    borderRadius: string;
    strokeType: strokeTypeEnum;
    strokeLinecap: string;
    strokeJonction: number;
    strokeLinejoin: string;
    enumTool: EnumTool;
    fill: string;
    texture: Textures;
    withJonctions: boolean;
    speed: string;
    tolerence: string;
    fileRule: string;
}

export interface ModalData {
    name: string;
    color: string;
    width: number;
    height: number;
    isDirty: boolean;
    isCreated: boolean;
}

export interface WindowSize {
    width: number;
    height: number;
}

export interface ControlePointElement {
    width: number;
    height: number;
    minPoint: Point;
}

export interface SelectionElement {
    width: number;
    height: number;
    minPoint: Point;
    maxPoint: Point;
}

export interface DragState {
    origin: Point;
    nextPoint: Point;
    isDraging: boolean;
    hasSelected: boolean;
}

export interface SelectionArray {
    listSelected: SVGElement[];
    tempSelected: SVGElement[];
    tempArray: SVGElement[];
}

export interface Dimension {
    width: number;
    height: number;
}
export interface Style {
    currentSvgStyle;
    currentMenuStyle;
    currentBarStyle;
}

export interface Spinner {
    color: ThemePalette;
    mode: ProgressSpinnerMode;
    value: number;
}

export interface SaveProperty {
    scaleX: number;
    scaleY: number;
    transform: string;
    svgStyle: object;
}

export interface Chip {
    isAddButtonOn: boolean;
    visible: boolean;
    selectable: boolean;
    removable: boolean;
    addOnBlur: boolean;
    separatorKeysCodes: number[];
}

export interface SaveData {
    name: string;
    message: string;
    tags: string[];
}

export interface PopUpData {
    action: string;
    message: string;
    function: CallableFunction;
}
export interface SpecialKey {
    ArrowRight: boolean;
    ArrowLeft: boolean;
    ArrowUp: boolean;
    ArrowDown: boolean;
    AltRight: boolean;
    AltLeft: boolean;
    ShiftRight: boolean;
    ShiftLeft: boolean;
}

export interface Error {
    type: string;
    message: string;
}

export interface ErrorMessages {
    width: Error[];
    height: Error[];
    RGB: Error[];
    author: Error[];
    email: Error[];
}

export interface Export {
    fileName: string;
    email: string;
    author: string;
    sendByMail: boolean;
}

export interface PolygonInterface {
    center: Point;
    angle: number;
    width: number;
    height: number;
    sides: number;
    origin: Point;
}

export interface DrawingElement {
    controle: SVGElement;
    eraserElement: SVGElement;
    domRect: SVGElement;
    svg: SVGSVGElement;
    selectionElement: SVGPathElement;
    canvas: HTMLCanvasElement;
}

export interface GridProperty {
    gridImage: string;
    gridContent: string;
    gridOpacity: number;
}

export interface ImageSelected {
    imageToolSelected: string;
    imageShapeSelected: string;
}

export interface SelectionPath {
    selection: Path;
    eraser: Path;
    controlePoint: Path;
}

export interface MagnetPosition {
    widthDivider: number;
    heightDivider: number;
}

export interface DataList {
    lastColorList: Color[];
    redoColorList: Color[];
    lastIndexList: number[];
    redoIndexList: number[];
}
export interface ActionList {
    lastActionsList: [Path[]];
    redoList: [Path[]];
}

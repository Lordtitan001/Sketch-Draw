export enum EnumTool {
    Any = 0,
    Pencil = 1,
    Brush = 2,
    Rectangle = 3,
    Line = 4,
    Ellipse = 5,
    Selection = 6,
    ColorSetter = 7,
    Eraser = 8,
    Aerosol = 9,
    Pipette = 10,
    Polygone = 11,
    Grid = 12,
    PaintBucket = 13,
    Pen = 14
}

export enum EnumElement {
    Select = 0,
    Tool = 1,
    Shape,
    Any,
    undo,
    redo,
    Grid = 8,
    Magnetsim = 9
}

export enum Magnetsim {
    TopLeft = 0,
    TopRight,
    BottomLeft,
    BottomRight,
    Center,
    CenterTop,
    CenterBottom,
    CenterLeft,
    CenterRight,
}

export enum Textures {
    Default = 'Default',
    Texture1 = 'Filter1',
    Texture2 = 'Filter2',
    Texture3 = 'Filter3',
    Texture4 = 'Filter4',
    Texture5 = 'Filter5',
}

export enum strokeTypeEnum {
    Contour = 0,
    Full = 1,
    FullWithContour = 2,
    Any = 3,
}
export enum CategoryEnum {
    NONE = 0,
    TOOLS = 1,
    FORMS = 2,
    SELECTIONS = 3,
    EXPORTATION = 4,
}

export enum TypeDessinEnum {
    NONE = 0,
    CLASSIQUE = 1,
    CONTOUR = 2,
}

export enum Pixel {
    r = 0,
    g,
    b,
    o,
    next
}

export enum CategorieSegmentation {
    NoneBegin = 0,
    NoneEnd = 3,
    ToolsBegin = 4,
    ToolsEnd = 10,
    FormsBegin = 11,
    FormsEnd = 13,
    SelectionsBegin = 14,
    SelectionsEnd = 17,
    ExportationBegin = 18,
    ExportationEnd = 19
}

export enum Index {
    Zero = 0,
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Fifty = 50,
    OneHundred = 100
}

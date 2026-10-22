declare module 'smiles-drawer' {
  export interface SmilesDrawerOptions {
    width?: number;
    height?: number;
    bondThickness?: number;
    bondLength?: number;
    shortBondLength?: number;
    bondSpacing?: number;
    atomVisualization?: 'default' | 'balls';
    isomeric?: boolean;
    debug?: boolean;
    terminalCarbons?: boolean;
    explicitHydrogens?: boolean;
    overlapSensitivity?: number;
    overlapResolutionIterations?: number;
    compactDrawing?: boolean;
    fontSizeLarge?: number;
    fontSizeSmall?: number;
    padding?: number;
    themes?: Record<string, any>;
    [key: string]: any;
  }

  export class Drawer {
    constructor(options?: SmilesDrawerOptions);
    draw(data: any, target: HTMLCanvasElement | string, themeName?: string, infoOnly?: boolean): void;
  }

  export class SvgDrawer {
    constructor(options?: SmilesDrawerOptions);
    draw(data: any, target: SVGElement | string, themeName?: string, infoOnly?: boolean): void;
  }

  export default class SmilesDrawer {
    static Version: string;
    static Drawer: typeof Drawer;
    static SvgDrawer: typeof SvgDrawer;
    static clean(smiles: string): string;
    static parse(
      smiles: string,
      successCallback: (tree: any) => void,
      errorCallback?: (err: any) => void
    ): void;
    static apply(
      options?: SmilesDrawerOptions,
      selector?: string,
      themeName?: string,
      onError?: (err: any) => void
    ): void;
  }
}

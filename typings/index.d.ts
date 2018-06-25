/// <reference types="core-js" />
/// <reference types="node" />
/// <reference types="marked" />
/// <reference types="prop-types" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react-transition-group" />
/// <reference types="@types/tinycolor2" />

export as namespace ReactUWP;

export interface CustomCSSProperties extends React.CSSProperties {
  "&:hover"?: React.CSSProperties;
  "&:active"?: React.CSSProperties;
  "&:visited"?: React.CSSProperties;
  "&:focus"?: React.CSSProperties;
  "&:disabled"?: React.CSSProperties;
  dynamicStyle?: React.CSSProperties;
}

export interface StyleClasses {
  style?: CustomCSSProperties;
  className?: string;
}

export interface ScrollRevealType {
  rootElm?: HTMLElement;
  animated?: boolean;
  setEnterStyle?: () => void;
  setLeaveStyle: () => void;
  props: {
    speed?: number;
    style?: React.CSSProperties;
    animatedStyle?: React.CSSProperties;
    children?: React.ReactElement<any>;
    topOffset?: number;
    bottomOffset?: number;
  }
}

export interface AcrylicTexture {
  tintColor?: string;
  tintOpacity?: number;
  blurSize?: number;
  noiseSize?: number;
  noiseOpacity?: number;
  background?: string;
}

export interface Sheet {
  CSSText?: string;
  className?: string;
  classNameWithHash?: string;
  id?: number;
}

export class StyleManager {
  globalClassName?: string;
  theme?: ReactUWP.ThemeType;
  themeId?: number;
  styleElement?: HTMLStyleElement;
  sheets?: {
    [key: string]: Sheet
  };
  styleDidUpdate?: () => void;
  CSSText?: string;
  addedCSSText?: {
    [key: string]: boolean;
  };

  constructor(config: {
    theme?: ReactUWP.ThemeType;
    globalClassName?: string;
    styleDidUpdate?: () => void;
  })

  setupTheme(theme?: ThemeType): void;

  setupStyleElement(): void;

  cleanStyleSheet(): void;

  style2CSSText(style: React.CSSProperties): string;

  sheetsToString(): string;

  addStyle(style: CustomCSSProperties, className?: string, callback?: () => void): Sheet;

  addStyleWithUpdate(style: CustomCSSProperties, className?: string): Sheet;

  addCSSText(CSSText: string, callback?: (shouldUpdate?: boolean) => void ): void;

  addCSSTextWithUpdate(CSSText: string): void;

  setStyleToManager(config?: {
    style?: CustomCSSProperties;
    className?: string;
  }, callback?: (theme?: ReactUWP.ThemeType) => StyleClasses): StyleClasses;

  setStylesToManager<T>(config?: {
    styles: T;
    className?: string;
  }, callback?: (theme?: ReactUWP.ThemeType) => { [P in keyof T]: StyleClasses }): { [P in keyof T]: StyleClasses };

  renderSheets(): void;

  updateStyleElement(textContent: string): void;
}

export interface ThemeType {
  themeName?: "dark" | "light";
  fonts?: {
    sansSerifFonts?: string;
    segoeMDL2Assets?: string;
  };
  styleManager?: StyleManager;
  scrollReveals?: ScrollRevealType[];
  scrollRevealListener?: (e?: Event) => void;

  useFluentDesign?: boolean;
  desktopBackgroundImage?: string;
  desktopBackground?: string;
  useInlineStyle?: boolean;

  haveAcrylicTextures?: boolean;
  acrylicTexture40?: AcrylicTexture;
  acrylicTexture60?: AcrylicTexture;
  acrylicTexture80?: AcrylicTexture;

  accent?: string;
  accentLighter1?: string;
  accentLighter2?: string;
  accentLighter3?: string;
  accentDarker1?: string;
  accentDarker2?: string;
  accentDarker3?: string;

  baseLow?: string;
  baseMediumLow?: string;
  baseMedium?: string;
  baseMediumHigh?: string;
  baseHigh?: string;

  altLow?: string;
  altMediumLow?: string;
  altMedium?: string;
  altMediumHigh?: string;
  altHigh?: string;

  listLow?: string;
  listMedium?: string;
  listAccentLow?: string;
  listAccentMedium?: string;
  listAccentHigh?: string;

  chromeLow?: string;
  chromeMediumLow?: string;
  chromeMedium?: string;
  chromeHigh?: string;

  chromeAltLow?: string;

  chromeDisabledLow?: string;
  chromeDisabledHigh?: string;

  chromeBlackLow?: string;
  chromeBlackMediumLow?: string;
  chromeBlackMedium?: string;
  chromeBlackHigh?: string;

  chromeWhite?: string;

  prefixStyle?: (style?: CustomCSSProperties) => React.CSSProperties;
  prepareStyle?: (config?: {
    style?: CustomCSSProperties;
    className?: string;
    extendsClassName?: string;
  }, callback?: (theme?: ReactUWP.ThemeType) => StyleClasses) => StyleClasses ;
  prepareStyles<T>(
    config?: {
      styles: T;
      className?: string;
    },
    callback?: (theme?: ReactUWP.ThemeType) => { [P in keyof T]: StyleClasses }
  ) : { [P in keyof T]: StyleClasses };
  classNames?: (...classNames: string[]) => string;

  isDarkTheme?: boolean;
  updateTheme?: (theme: ThemeType) => void;
  forceUpdateTheme?: (theme: ThemeType) => void;
  saveTheme?: (theme: ThemeType) => void;
  generateAcrylicTextures?: {
    (theme: ThemeType, themeCallback?: (theme?: ReactUWP.ThemeType) => void): ThemeType;
    callback?: (theme?: ReactUWP.ThemeType) => void;
  };

  toasts?:React.ReactElement<any>[];
  addToast?: (toast: React.ReactElement<any>, callback?: (toastId?: number) => void) => void;
  updateToast?: (toastId: number, toast: React.ReactElement<any>) => void;
  deleteToast?: (toastId: number) => void;

  typographyStyles?: {
    header?: React.CSSProperties;
    subHeader?: React.CSSProperties;

    title?: React.CSSProperties;
    subTitle?: React.CSSProperties;
    subTitleAlt?: React.CSSProperties;

    base?: React.CSSProperties;
    baseAlt?: React.CSSProperties;
    body?: React.CSSProperties;

    captionAlt?: React.CSSProperties;
    caption?: React.CSSProperties;
  };
  zIndex?: {
    listView?: number;
    calendarView?: number;
    flyout?: number;
    tooltip?: number;
    dropDownMenu?: number;
    commandBar?: number;
    contentDialog?: number;
    mediaPlayer?: number;
    header?: number;
    toast?: number;
  };
}

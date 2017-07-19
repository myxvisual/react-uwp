/// <reference types="core-js" />
/// <reference types="node" />
/// <reference types="marked" />
/// <reference types="prop-types" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react-transition-group" />
/// <reference types="@types/tinycolor2" />

export as namespace ReactUWP;

export interface ScrollReveal {
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

export interface ThemeType {
  themeName?: "dark" | "light";
  fonts?: {
    sansSerifFonts?: string;
    segoeMDL2Assets?: string;
  };
  styleManager?: any;
  scrollReveals?: ScrollReveal[];
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

  prepareStyles?: (style?: React.CSSProperties) => React.CSSProperties;
  isDarkTheme?: boolean;
  updateTheme?: (theme: ThemeType) => void;
  forceUpdateTheme?: (theme: ThemeType) => void;
  saveTheme?: (theme: ThemeType) => void;
  generateAcrylicTextures?: (theme: ThemeType, themeCallback?: (theme?: ReactUWP.ThemeType) => void) => ThemeType;

  toasts?: React.ReactNode[];
  addToast?: (toast: React.ReactNode) => void;
  updateToast?: (toastID: number, toast: React.ReactNode) => void;
  deleteToast?: (toastID: number) => void;

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

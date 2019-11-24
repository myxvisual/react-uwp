import * as tinycolor from "tinycolor2";
import prefixAll from "../utils/prefixAll";
import { Toast } from "../Toast";
import { StyleManager, CustomCSSProperties, StyleClasses } from "./StyleManager";
import generateAcrylicTexture from "./generateAcrylicTexture";
import { getAcrylicTextureStyle, AcrylicConfig, isSupportBackdropFilter } from "./getAcrylicTextureStyle";
import { getThemeBaseCSS } from "./getBaseCSSText";
export { getAcrylicTextureStyle };
export const fonts = {
  sansSerifFonts: "Segoe UI, Microsoft YaHei, Open Sans, sans-serif, Hiragino Sans GB, Arial, Lantinghei SC, STHeiti, WenQuanYi Micro Hei, SimSun",
  segoeMDL2Assets: "Segoe MDL2 Assets"
};
const supportedBackdropFilter = isSupportBackdropFilter();
export function darken(color: string, coefficient: number) {
  const hsl = tinycolor(color).toHsl();
  hsl.l = hsl.l * (1 - coefficient);
  return tinycolor(hsl).toRgbString();
}

export function lighten(color: string, coefficient: number) {
  const hsl = tinycolor(color).toHsl();
  hsl.l = hsl.l + (100 - hsl.l) * coefficient;
  return tinycolor(hsl).toRgbString();
}

export interface AcrylicTexture {
  style?: React.CSSProperties;
  tintColor?: string;
  tintOpacity?: number;
  blurSize?: number;
  noiseSize?: number;
  noiseOpacity?: number;
  background?: string;
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
  };
}

export interface ThemeConfig {
  themeName?: "dark" | "light";
  accent?: string;
  useFluentDesign?: boolean;
  desktopBackgroundImage?: string;
  acrylicConfig?: {
    blurSize?: number;
  };

  useInlineStyle?: boolean;
  userAgent?: string;
}

export type ThemeName = "dark" | "light";
const defaultAcrylicConfig: ThemeConfig["acrylicConfig"] = { blurSize: 24 };

export class Theme {
  themeName?: ThemeName;
  accent?: string;
  useFluentDesign?: boolean;
  userAgent?: string;
  useInlineStyle?: boolean;
  desktopBackgroundImage?: string;
  fonts?: {
    sansSerifFonts: string;
    segoeMDL2Assets: string;
  };

  styleManager?: StyleManager;
  scrollReveals?: ScrollRevealType[] = [];

  desktopBackground?: string;

  acrylicTextureCount?: number;
  haveAcrylicTextures?: boolean;
  acrylicTexture20?: AcrylicTexture;
  acrylicTexture40?: AcrylicTexture;
  acrylicTexture60?: AcrylicTexture;
  acrylicTexture80?: AcrylicTexture;
  acrylicTexture100?: AcrylicTexture;
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

  prefixStyle: (style?: CustomCSSProperties) => React.CSSProperties;
  prepareStyle: (config?: {
    style?: CustomCSSProperties;
    className?: string;
    extendsClassName?: string;
  }, callback?: (theme?: Theme) => StyleClasses) => StyleClasses ;
  prepareStyles: <T>(
    config?: {
      styles: T;
      className?: string;
    },
    callback?: (theme?: Theme) => { [P in keyof T]: StyleClasses }
  ) => { [P in keyof T]: StyleClasses };
  classNames?: (...classNames: string[]) => string;

  isDarkTheme?: boolean;

  removeThemeCSSText(theme: Theme) {
    this.styleManager.removeCSSText(getThemeBaseCSS(theme));
  }
  generateAcrylicTextures?: (themeCallback?: (theme?: Theme) => void) => void;

  toasts?: Map<Toast, boolean>;
  addToast?: (toast: Toast) => void;
  updateToast?: (toast: Toast) => void;
  removeToast?: (toast: Toast) => void;
  onToastsUpdate?: (toasts?: Toast[]) => void;

  updateTheme: (theme: Theme) => void;

  getAcrylicTextureStyle = getAcrylicTextureStyle;

  constructor(themeConfig?: ThemeConfig) {
    let {
      themeName,
      accent,
      useFluentDesign,
      userAgent,
      useInlineStyle,
      desktopBackgroundImage,
      acrylicConfig
    } = themeConfig || ({} as ThemeConfig);
    themeName = themeName || "dark";
    accent = accent || "#0078D7";
    useFluentDesign = useFluentDesign === void 0 ? false : useFluentDesign;
    useInlineStyle = useInlineStyle === void 0 ? false : useInlineStyle;
    acrylicConfig = acrylicConfig || defaultAcrylicConfig;
    acrylicConfig.blurSize = acrylicConfig.blurSize === void 0 ? defaultAcrylicConfig.blurSize : defaultAcrylicConfig.blurSize;
    const { blurSize } = acrylicConfig;

    const isDarkTheme = themeName === "dark";
    const baseHigh = isDarkTheme ? "#fff" : "#000";
    const altHigh = isDarkTheme ? "#000" : "#fff";
    const baseHighColor = tinycolor(baseHigh);
    const altHighColor = tinycolor(altHigh);
    const accentColor = tinycolor(accent);

    const altMediumLow = altHighColor.setAlpha(0.4).toRgbString();
    const altMedium = altHighColor.setAlpha(0.6).toRgbString();
    const altMediumHigh = altHighColor.setAlpha(0.8).toRgbString();

    // theme base config.
    Object.assign(this, {
      themeName,
      accent,
      useFluentDesign,
      userAgent,
      useInlineStyle,
      desktopBackgroundImage
    });

    // theme base styles.
    Object.assign(this, {
      themeName,
      fonts,
      useInlineStyle: Boolean(useInlineStyle),

      useFluentDesign,
      desktopBackground: `url(${desktopBackgroundImage}) no-repeat fixed top left / cover`,
      desktopBackgroundImage,

      haveAcrylicTextures: false,
      acrylicTextureCount: 0,
      acrylicTexture20: {},
      acrylicTexture40: {},
      acrylicTexture60: {},
      acrylicTexture80: {},
      acrylicTexture100: {},

      scrollReveals: [],

      accent,
      accentLighter1: lighten(accentColor.toHexString(), 0.5),
      accentLighter2: lighten(accentColor.toHexString(), 0.7),
      accentLighter3: lighten(accentColor.toHexString(), 0.9),
      accentDarker1: darken(accentColor.toHexString(), 0.5),
      accentDarker2: darken(accentColor.toHexString(), 0.7),
      accentDarker3: darken(accentColor.toHexString(), 0.9),

      baseLow: baseHighColor.setAlpha(0.2).toRgbString(),
      baseMediumLow: baseHighColor.setAlpha(0.4).toRgbString(),
      baseMedium: baseHighColor.setAlpha(0.6).toRgbString(),
      baseMediumHigh: baseHighColor.setAlpha(0.8).toRgbString(),
      baseHigh,

      altLow: altHighColor.setAlpha(0.2).toRgbString(),
      altMediumLow,
      altMedium,
      altMediumHigh,
      altHigh,

      listLow: baseHighColor.setAlpha(0.1).toRgbString(),
      listMedium: baseHighColor.setAlpha(0.2).toRgbString(),
      listAccentLow: accentColor.setAlpha(0.6).toRgbString(),
      listAccentMedium: accentColor.setAlpha(0.8).toRgbString(),
      listAccentHigh: accentColor.setAlpha(0.9).toRgbString(),

      chromeLow: isDarkTheme ? "#171717" : "#f2f2f2",
      chromeMediumLow: isDarkTheme ? "#2b2b2b" : "#f2f2f2",
      chromeMedium: isDarkTheme ? "#1f1f1f" : "#e6e6e6",
      chromeHigh: isDarkTheme ? "#767676" : "#ccc",

      chromeAltLow: isDarkTheme ? "#f2f2f2" : "#171717",
      chromeDisabledLow: isDarkTheme ? "#858585" : "#7a7a7a",
      chromeDisabledHigh: isDarkTheme ? "#333" : "#ccc",

      chromeBlackLow: tinycolor("#000").setAlpha(0.2).toRgbString(),
      chromeBlackMediumLow: tinycolor("#000").setAlpha(0.4).toRgbString(),
      chromeBlackMedium: tinycolor("#000").setAlpha(0.8).toRgbString(),
      chromeBlackHigh: "#000",
      chromeWhite: "#fff",

      isDarkTheme: isDarkTheme,

      typographyStyles: {
        header: {
          fontWeight: "lighter",
          fontSize: 46,
          lineHeight: "56px"
        },
        subHeader: {
          fontWeight: "lighter",
          fontSize: 34,
          lineHeight: "40px"
        },

        title: {
          fontWeight: "lighter",
          fontSize: 24,
          lineHeight: "28px"
        },
        subTitle: {
          fontWeight: "normal",
          fontSize: 20,
          lineHeight: "24px"
        },
        subTitleAlt: {
          fontWeight: "normal",
          fontSize: 18,
          lineHeight: "20px"
        },

        base: {
          fontWeight: 300,
          fontSize: 15,
          lineHeight: "20px"
        },
        baseAlt: {
          fontWeight: "bold",
          fontSize: 15,
          lineHeight: "20px"
        },
        body: {
          fontWeight: 200,
          fontSize: 15,
          lineHeight: "20px"
        },

        captionAlt: {
          fontWeight: "lighter",
          fontSize: 13,
          lineHeight: "16px"
        },
        caption: {
          fontWeight: "lighter",
          fontSize: 12,
          lineHeight: "14px"
        }
      },
      zIndex: {
        listView: 10,
        calendarView: 20,
        dropDownMenu: 102,
        commandBar: 200,
        tooltip: 201,
        flyout: 202,
        contentDialog: 300,
        header: 301,
        mediaPlayer: 2147483647,
        toast: 310
      }
    } as Partial<Theme>);

    // theme styleManager.
    this.styleManager = new StyleManager();
    Object.assign(this, {
      prefixStyle: prefixAll(userAgent),
      prepareStyle: (config) => {
        if (!this.styleManager) return;
        const { extendsClassName, ...managerConfig } = config;
        if (this.useInlineStyle) {
          if (extendsClassName) {
            managerConfig.className += ` ${extendsClassName}`;
          }
          return managerConfig;
        } else {
          const styleClasses = this.styleManager.setStyleToManager(managerConfig);
          if (extendsClassName) {
            styleClasses.className += ` ${extendsClassName}`;
          }
          return styleClasses;
        }
      },
      prepareStyles: (config) => {
        if (!this.styleManager) return;

        if (this.useInlineStyle) {
          const { styles } = config;
          const result: any = {};
          for (let key in styles) {
            result[key] = { style: styles[key] };
          }
          return result;
        } else {
          const styleClasses = this.styleManager.setStylesToManager(config as any);
          return styleClasses;
        }
      },

      classNames: (...classNames) => {
        return classNames.reduce((prev, curr) => prev + (curr ? ` ${curr}` : ""));
      }
    } as Theme);

    const acrylicTexture20Config: AcrylicConfig = {
      tintColor: this.altMediumHigh,
      blurSize
    };
    const acrylicTexture40Config: AcrylicConfig = {
      tintColor: this.altMedium,
      blurSize
    };
    const acrylicTexture60Config: AcrylicConfig = {
      tintColor: this.altMediumLow,
      blurSize
    };
    const acrylicTexture80Config: AcrylicConfig = {
      tintColor: this.altLow,
      blurSize
    };
    const acrylicTexture100Config: AcrylicConfig = {
      tintColor: "",
      blurSize
    };
    this.acrylicTexture20.style = getAcrylicTextureStyle(acrylicTexture20Config);
    this.acrylicTexture40.style = getAcrylicTextureStyle(acrylicTexture40Config);
    this.acrylicTexture60.style = getAcrylicTextureStyle(acrylicTexture60Config);
    this.acrylicTexture80.style = getAcrylicTextureStyle(acrylicTexture80Config);
    this.acrylicTexture100.style = getAcrylicTextureStyle(acrylicTexture100Config);
    this.acrylicTexture20.background = this.acrylicTexture20.style.background as string;
    this.acrylicTexture40.background = this.acrylicTexture40.style.background as string;
    this.acrylicTexture60.background = this.acrylicTexture60.style.background as string;
    this.acrylicTexture80.background = this.acrylicTexture80.style.background as string;
    this.acrylicTexture100.background = this.acrylicTexture100.style.background as string;

    // generateAcrylicTextures method.
    this.generateAcrylicTextures = (themeCallback?: (theme?: Theme) => void) => {
      if (supportedBackdropFilter) {
        return;
      }
      this.acrylicTextureCount = 0;

      const callback = (image: string, key: number) => {
        const background = `url(${image}) no-repeat fixed top left / cover`;
        if (key === 4) {
          this.acrylicTextureCount += 1;
          Object.assign(this.acrylicTexture40, {
            tintColor: acrylicTexture40Config.tintColor,
            style: { background },
            background,
            blurSize
          });
        }
        if (key === 6) {
          this.acrylicTextureCount += 1;
          Object.assign(this.acrylicTexture60, {
            tintColor: acrylicTexture60Config.tintColor,
            style: { background },
            background,
            blurSize
          });
        }
        if (key === 8) {
          this.acrylicTextureCount += 1;
          Object.assign(this.acrylicTexture80, {
            tintColor: acrylicTexture80Config.tintColor,
            style: { background },
            background,
            blurSize
          });
        }

        if (this.acrylicTextureCount === 3) {
          if (themeCallback) themeCallback(this);
        }
      };

      generateAcrylicTexture({
        image: this.desktopBackgroundImage,
        tintColor: this.chromeMediumLow,
        tintOpacity: 0.4,
        blurSize,
        callback: image => callback(image, 4)
      });
      generateAcrylicTexture({
        image: this.desktopBackgroundImage,
        tintColor: this.chromeLow,
        tintOpacity: 0.6,
        blurSize,
        callback: image => callback(image, 6)
      });
      generateAcrylicTexture({
        image: this.desktopBackgroundImage,
        tintColor: this.chromeLow,
        tintOpacity: 0.8,
        blurSize,
        callback: image => callback(image, 8)
      });
    };

    // toasts storage.
    Object.assign(this, {
      toasts: new Map<Toast, boolean>(),
      addToast: toast => {
        if (!this.toasts.has(toast)) {
          this.toasts.set(toast, true);
        }
        if (this.onToastsUpdate) {
          this.onToastsUpdate(Array.from(this.toasts.keys()));
        }
      },
      updateToast: toast => {
        if (this.toasts.has(toast)) {
          this.toasts.set(toast, true);
        }
        if (this.onToastsUpdate) {
          this.onToastsUpdate(Array.from(this.toasts.keys()));
        }
      },
      removeToast: toast => {
        if (this.toasts.has(toast)) {
          this.toasts.delete(toast);
        }
        if (this.onToastsUpdate) {
          this.onToastsUpdate(Array.from(this.toasts.keys()));
        }
      }
    } as Theme);
  }
}

export default function getTheme(themeConfig?: ThemeConfig): Theme {
  const theme = new Theme(themeConfig);

  return theme;
}

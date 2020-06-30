import * as tinyColor from "tinycolor2";
import * as createHash from "murmurhash-js/murmurhash3_gc";

import prefixAll from "./prefixAll";
import { Toast } from "../Toast";
import { StyleManager, CustomCSSProperties, StyleClasses } from "./StyleManager";
import generateAcrylicTexture from "./generateAcrylicTexture";
import { getAcrylicTextureStyle, AcrylicConfig, isSupportBackdropFilter } from "./getAcrylicTextureStyle";
import { WebGLRender, getNoiseFrag } from "../utils/WebGLRender";
import { getThemeBaseCSS, getBaseCSS } from "./getBaseCSSText";
import { DataProps as RevealConfig } from "../RevealEffect";

export { getThemeBaseCSS, getBaseCSS };
export { getAcrylicTextureStyle, isSupportBackdropFilter };

export const fonts = {
  sansSerifFonts: "Segoe UI, Microsoft YaHei, Open Sans, sans-serif, Hiragino Sans GB, Arial, Lantinghei SC, STHeiti, WenQuanYi Micro Hei, SimSun",
  segoeMDL2Assets: "Segoe MDL2 Assets"
};

export function darken(color: string, coefficient: number) {
  const hsl = tinyColor(color).toHsl();
  hsl.l = hsl.l * (1 - coefficient);
  return tinyColor(hsl).toRgbString();
}

export function lighten(color: string, coefficient: number) {
  const hsl = tinyColor(color).toHsl();
  hsl.l = hsl.l + (1 - hsl.l) * coefficient;
  return tinyColor(hsl).toRgbString();
}

export interface AcrylicTexture {
  style?: React.CSSProperties;
  background?: string;
  tintColor?: string;
  blurSize?: number;
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
  baseHigh?: string;
  altHigh?: string;
  useFluentDesign?: boolean;
  desktopBackgroundImage?: string;
  acrylicConfig?: {
    blurSize?: number;
  };
  materialBackground?: string;
  borderWidth?: number;
  revealConfig?: RevealConfig;

  useInlineStyle?: boolean;
}
type ThemeCallback = (theme?: Theme) => void;

export type ThemeName = "dark" | "light";
const defaultAcrylicConfig: ThemeConfig["acrylicConfig"] = { blurSize: 12 };

export class Theme {
  themeName?: ThemeName;
  accent?: string;
  useFluentDesign?: boolean;
  useInlineStyle?: boolean;
  desktopBackgroundImage?: string;
  fonts?: {
    sansSerifFonts: string;
    segoeMDL2Assets: string;
  };

  styleManager?: StyleManager;
  scrollReveals?: ScrollRevealType[] = [];

  revealConfig: RevealConfig;
  currHoverSize: number;
  revealGradientMap: Map<string, CanvasGradient> = new Map();
  revealEffectMap: Map<HTMLCanvasElement, RevealConfig> = new Map();
  hoverBorderCanvas: HTMLCanvasElement;
  addBorderCanvas(borderCanvas: HTMLCanvasElement, revealConfig: RevealConfig) {
    if (!this.revealEffectMap.get(borderCanvas)) {
      this.onAddBorderCanvas(borderCanvas, revealConfig);
    }
    this.revealEffectMap.set(borderCanvas, revealConfig);
  }
  removeBorderCanvas(borderCanvas: HTMLCanvasElement) {
    if (this.revealEffectMap.get(borderCanvas)) {
      this.onRemoveBorderCanvas(borderCanvas);
    }
    this.revealEffectMap.delete(borderCanvas);
  }
  onAddBorderCanvas(borderCanvas?: HTMLCanvasElement, revealConfig?: RevealConfig) {}
  onRemoveBorderCanvas(borderCanvas?: HTMLCanvasElement) {}

  desktopBackground?: string;

  borderWidth: number;

  acrylicTextureCount?: number;
  haveAcrylicTextures?: boolean;
  materialTexture?: string;
  materialBackground?: string;
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
  chromeAltMediumLow?: string;
  chromeAltMedium?: string;
  chromeAltHigh?: string;

  chromeBlack?: string;
  chromeBlackLow?: string;
  chromeBlackMediumLow?: string;
  chromeBlackMedium?: string;
  chromeBlackHigh?: string;

  chromeWhite?: string;
  chromeWhiteLow?: string;
  chromeWhiteMediumLow?: string;
  chromeWhiteMedium?: string;
  chromeWhiteHigh?: string;

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

  prefixStyle: <T>(style?: CustomCSSProperties & T) => React.CSSProperties;
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

  toasts?: Map<Toast, boolean>;
  addToast?: (toast: Toast) => void;
  updateToast?: (toast: Toast) => void;
  removeToast?: (toast: Toast) => void;
  onToastsUpdate?: (toasts?: Toast[]) => void;

  getRevealConfig(prevConfig?: RevealConfig, newConfig?: RevealConfig) {
    let defaultConfig: Required<RevealConfig> = {
      effectEnable: "both",
      hoverSize: 100,
      hoverColor: this.isDarkTheme ? this.baseLow : this.altLow,
      borderWidth: this.borderWidth,
      borderColor: this.isDarkTheme ? this.baseMediumHigh : this.altMediumHigh,
      effectRange: "all",
      observerResize: false,
      observerTransition: ""
    };

    if (prevConfig) {
      if (newConfig) {
        defaultConfig = { ...prevConfig } as Required<RevealConfig>;
      } else {
        newConfig = prevConfig;
      }
      for (let key in newConfig) {
        const value = newConfig[key];
        if (value !== void 0) {
          defaultConfig[key] = newConfig[key];
        }
      }
    }
    return defaultConfig;
  }

  updateTheme: (theme: Theme) => void;
  themeHash: number;
  themeClassName: string;

  getAcrylicTextureStyle = getAcrylicTextureStyle;

  generateAcrylicTextures?: (themeCallback?: (theme?: Theme) => void) => void;
  generateBackgroundTexture?: (themeCallback?: (theme?: Theme) => void) => void;

  getBackgroundFromTexture(texture: string) {
    return `url(${texture})`;
  }

  mergeAcrylicStyles(blurSize: number) {
    let { materialTexture, materialBackground } = this;
    let backgrounds: string[] = [];
    if (materialBackground) {
      backgrounds.push(materialBackground);
    }
    if (materialTexture) {
      backgrounds.push(this.getBackgroundFromTexture(materialTexture));
    }
    const background = backgrounds.join(", ");
    const acrylicTexture20Config: AcrylicConfig = {
      tintColor: this.useFluentDesign ? this.altMediumHigh : this.chromeLow,
      blurSize,
      background
    };
    const acrylicTexture40Config: AcrylicConfig = {
      tintColor: this.useFluentDesign ? this.altMedium : this.chromeMedium,
      blurSize,
      background
    };
    const acrylicTexture60Config: AcrylicConfig = {
      tintColor: this.useFluentDesign ? this.altMediumLow : this.chromeMediumLow,
      blurSize,
      background
    };
    const acrylicTexture80Config: AcrylicConfig = {
      tintColor: this.useFluentDesign ? this.altLow : this.chromeHigh,
      blurSize,
      background
    };
    const acrylicTexture100Config: AcrylicConfig = {
      tintColor: "rgba(0, 0, 0, 0)",
      blurSize,
      background
    };

    this.acrylicTexture20.style = getAcrylicTextureStyle(acrylicTexture20Config, this.useFluentDesign);
    this.acrylicTexture40.style = getAcrylicTextureStyle(acrylicTexture40Config, this.useFluentDesign);
    this.acrylicTexture60.style = getAcrylicTextureStyle(acrylicTexture60Config, this.useFluentDesign);
    this.acrylicTexture80.style = getAcrylicTextureStyle(acrylicTexture80Config, this.useFluentDesign);
    this.acrylicTexture100.style = getAcrylicTextureStyle(acrylicTexture100Config, this.useFluentDesign);

    this.acrylicTexture20.background = this.acrylicTexture20.style.background as string;
    this.acrylicTexture40.background = this.acrylicTexture40.style.background as string;
    this.acrylicTexture60.background = this.acrylicTexture60.style.background as string;
    this.acrylicTexture80.background = this.acrylicTexture80.style.background as string;
    this.acrylicTexture100.background = this.acrylicTexture100.style.background as string;

    return {
      acrylicTexture20Config,
      acrylicTexture40Config,
      acrylicTexture60Config,
      acrylicTexture80Config,
      acrylicTexture100Config
    };
  }

  constructor(themeConfig?: ThemeConfig) {
    themeConfig = themeConfig || {};
    let {
      themeName,
      accent,
      baseHigh,
      altHigh,
      useFluentDesign,
      useInlineStyle,
      desktopBackgroundImage,
      acrylicConfig,
      borderWidth,
      revealConfig,
      materialBackground
    } = themeConfig;
    themeName = themeName || "dark";
    accent = accent || "#0078D7";
    useFluentDesign = useFluentDesign === void 0 ? false : useFluentDesign;
    useInlineStyle = useInlineStyle === void 0 ? false : useInlineStyle;
    acrylicConfig = acrylicConfig || defaultAcrylicConfig;
    borderWidth = borderWidth === void 0 ? 2 : borderWidth;
    acrylicConfig.blurSize = acrylicConfig.blurSize === void 0 ? defaultAcrylicConfig.blurSize : defaultAcrylicConfig.blurSize;
    const { blurSize } = acrylicConfig;
    if (materialBackground) this.materialBackground = materialBackground;

    this.themeHash = createHash(JSON.stringify(themeConfig));
    this.themeClassName = `react-uwp-${this.themeHash}`;
    const isDarkTheme = themeName === "dark";

    const blackColor = "#000";
    const whiteColor = "#fff";
    if (!baseHigh) baseHigh = isDarkTheme ? whiteColor : blackColor;
    if (!altHigh) altHigh = isDarkTheme ? blackColor : whiteColor;
    const baseHighColor = tinyColor(baseHigh);
    const altHighColor = tinyColor(altHigh);
    const accentColor = tinyColor(accent);

    const altMediumLow = altHighColor.setAlpha(0.4).toRgbString();
    const altMedium = altHighColor.setAlpha(0.6).toRgbString();
    const altMediumHigh = altHighColor.setAlpha(0.8).toRgbString();

    // theme base config.
    Object.assign(this, {
      themeName,
      accent,
      useFluentDesign,
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
      borderWidth,

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

      chromeLow: isDarkTheme ? lighten(altHigh, .05) : darken(altHigh, .05),
      chromeMediumLow: isDarkTheme ? lighten(altHigh, .075) : darken(altHigh, .075),
      chromeMedium: isDarkTheme ? lighten(altHigh, .1) : darken(altHigh, .1),
      chromeHigh: isDarkTheme ? lighten(altHigh, .2) : darken(altHigh, .2),

      chromeAltLow: isDarkTheme ? darken(baseHigh, .05) : lighten(baseHigh, .05),
      chromeAltMediumLow: isDarkTheme ? darken(baseHigh, .075) : lighten(baseHigh, .075),
      chromeAltMedium: isDarkTheme ? darken(baseHigh, .1) : lighten(baseHigh, .1),
      chromeAltHigh: isDarkTheme ? darken(baseHigh, .2) : lighten(baseHigh, .2),

      chromeBlack: blackColor,
      chromeBlackLow: tinyColor(blackColor).setAlpha(0.2).toRgbString(),
      chromeBlackMediumLow: tinyColor(blackColor).setAlpha(0.4).toRgbString(),
      chromeBlackMedium: tinyColor(blackColor).setAlpha(0.8).toRgbString(),
      chromeBlackHigh: blackColor,

      // Added.
      chromeWhite: whiteColor,
      chromeWhiteLow: tinyColor(whiteColor).setAlpha(0.2).toRgbString(),
      chromeWhiteMediumLow: tinyColor(whiteColor).setAlpha(0.4).toRgbString(),
      chromeWhiteMedium: tinyColor(whiteColor).setAlpha(0.8).toRgbString(),
      chromeWhiteHigh: blackColor,

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

    // set reveal config, by colors after.
    this.revealConfig = this.getRevealConfig(revealConfig);

    // theme styleManager.
    this.styleManager = new StyleManager();
    const prefixStyle = prefixAll();
    Object.assign(this, {
      prefixStyle,
      prepareStyle: config => {
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
        return classNames.filter(className => Boolean(className)).reduce((prev, curr) => `${prev} ${curr}`);
      }
    } as Theme);

    const {
      acrylicTexture20Config,
      acrylicTexture40Config,
      acrylicTexture60Config,
      acrylicTexture80Config,
      acrylicTexture100Config
    } = this.mergeAcrylicStyles(blurSize);

    // generateAcrylicTextures method.
    const generateAcrylicTextures = (themeCallback?: ThemeCallback) => {
      this.acrylicTextureCount = 0;
      const callback = (acrylicTextureUrl: string, key: number, isCanvasFilter?: boolean) => {
        const backgrounds: string[] = [];
        backgrounds.push(this.getBackgroundFromTexture(acrylicTextureUrl) + " left top / cover no-repeat fixed");
        if (this.materialTexture) {
          backgrounds.push(this.getBackgroundFromTexture(this.materialTexture) + " left top repeat fixed");
        }
        if (this.materialBackground) {
          backgrounds.push(this.materialBackground);
        }
        const background = backgrounds.join(", ");

        this.acrylicTextureCount += 1;
        const style: CustomCSSProperties = {
          background,
          backgroundBlendMode: "overlay"
        };

        switch (key) {
          case 2: {
            Object.assign(this.acrylicTexture20, {
              tintColor: acrylicTexture20Config.tintColor,
              style,
              background,
              blurSize
            });
            break;
          }
          case 4: {
            Object.assign(this.acrylicTexture40, {
              tintColor: acrylicTexture40Config.tintColor,
              style,
              background,
              blurSize
            });
            break;
          }
          case 6: {
            Object.assign(this.acrylicTexture60, {
              tintColor: acrylicTexture60Config.tintColor,
              style,
              background,
              blurSize
            });
            break;
          }
          case 8: {
            Object.assign(this.acrylicTexture80, {
              tintColor: acrylicTexture80Config.tintColor,
              style,
              background,
              blurSize
            });
            break;
          }
          case 10: {
            Object.assign(this.acrylicTexture100, {
              tintColor: acrylicTexture100Config.tintColor,
              style,
              background,
              blurSize
            });
            break;
          }
          default: {
            break;
          }
        }

        if (this.acrylicTextureCount === 5) {
          if (themeCallback) themeCallback(this);
        }
      };

      generateAcrylicTexture({
        image: this.desktopBackgroundImage,
        tintColor: acrylicTexture20Config.tintColor,
        blurSize,
        callback: (image, isCanvasFilter) => callback(image, 2, isCanvasFilter)
      });
      generateAcrylicTexture({
        image: this.desktopBackgroundImage,
        tintColor: acrylicTexture40Config.tintColor,
        blurSize,
        callback: (image, isCanvasFilter) => callback(image, 4, isCanvasFilter)
      });
      generateAcrylicTexture({
        image: this.desktopBackgroundImage,
        tintColor: acrylicTexture60Config.tintColor,
        blurSize,
        callback: (image, isCanvasFilter) => callback(image, 6, isCanvasFilter)
      });
      generateAcrylicTexture({
        image: this.desktopBackgroundImage,
        tintColor: acrylicTexture80Config.tintColor,
        blurSize,
        callback: (image, isCanvasFilter) => callback(image, 8, isCanvasFilter)
      });
      generateAcrylicTexture({
        image: this.desktopBackgroundImage,
        tintColor: acrylicTexture100Config.tintColor,
        blurSize,
        callback: (image, isCanvasFilter) => callback(image, 10, isCanvasFilter)
      });
    };

    // add generateBackgroundTexture method to theme.
    this.generateBackgroundTexture = (callback?: ThemeCallback) => {
      let webGLRender = new WebGLRender({ fragmentSource: getNoiseFrag(this.isDarkTheme ? { r: "1.", g: "1.", b: "1." } : { r: "0.", g: "0.", b: "0." }), width: screen.availWidth, height: screen.availHeight });
      webGLRender.render();
      webGLRender.toUrl(url => {
        this.materialTexture = url;
        this.mergeAcrylicStyles(blurSize);
        if (callback) callback(this);
        webGLRender.cleanup();
        webGLRender = null;
      });
    };
    // Add to generateAcrylicTextures method to theme.
    this.generateAcrylicTextures = generateAcrylicTextures;

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

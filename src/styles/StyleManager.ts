import * as createHash from "murmurhash-js/murmurhash3_gc";
import isUnitlessNumber from "../utils/react/isUnitlessNumber";
import { Theme } from "./getTheme";

export const replace2Dashes = (key: string) => key.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`);
export const getStyleValue = (key: string, value: string) => ((typeof value === "number" && !isUnitlessNumber[key]) ? `${value}px` : value);

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

export interface Sheet {
  CSSText?: string;
  className?: string;
  classNameWithHash?: string;
  id?: number;
}

export const extendsStyleKeys: any = {
  "&:hover": true,
  "&:active": true,
  "&:focus": true,
  "&:disabled": true
};
export interface StyleManagerConfig {
  prefixClassName?: string;
}

export class StyleManager {
  prefixClassName: string;
  theme: Theme;
  sheets: {
    [key: string]: Sheet
  } = {};
  CSSText: string = "";
  addedCSSText: {
    [key: string]: boolean;
  } = {};
  onSheetsUpdate(sheets?: {
    [key: string]: Sheet
  }) {}

  constructor(config?: StyleManagerConfig) {
    const { prefixClassName } = config || {};
    this.prefixClassName = prefixClassName ? `${prefixClassName}-` : "";
  }

  cleanStyleSheet = (): void => {
    this.theme = null;
    this.sheets = {};
    this.CSSText = "";
  }

  style2CSSText = (style: React.CSSProperties): string => style ? Object.keys(style).map(key => (
    `  ${replace2Dashes(key)}: ${getStyleValue(key, style[key])};`
  )).join("\n") : void 0

  sheetsToString = () => `\n${Object.keys(this.sheets).map(id => this.sheets[id].CSSText).join("")}`;

  getAllCSSText = () => `${this.sheetsToString()}\n${this.CSSText}`;

  addStyle = (style: CustomCSSProperties, className = ""): Sheet => {
    const id = createHash(JSON.stringify(style));

    if (this.sheets[id]) {
      this.onSheetsUpdate(this.sheets);
      return this.sheets[id];
    }

    const classNameWithHash = `${this.prefixClassName}${className}-${id}`;
    const styleKeys = Object.keys(style);
    let CSSText = "";
    let contentCSSText = "";
    let extendsCSSText = "";

    for (const styleKey of styleKeys) {
      if (extendsStyleKeys[styleKey]) {
        const extendsStyle = style[styleKey];
        if (extendsStyle) {
          extendsCSSText += `.${classNameWithHash}${styleKey.slice(1)} {\n${this.style2CSSText(extendsStyle)}\n}\n`;
        }
      } else {
        if (style[styleKey] !== void 0) {
          contentCSSText += `  ${replace2Dashes(styleKey)}: ${getStyleValue(styleKey, style[styleKey])};\n`;
        }
      }
    }

    CSSText += `.${classNameWithHash} {\n${contentCSSText}\n}\n`;
    CSSText += extendsCSSText;

    this.sheets[id] = { CSSText, classNameWithHash, id, className };
    this.onSheetsUpdate(this.sheets);

    return this.sheets[id];
  }

  addCSSText = (CSSText: string): void => {
    const hash = createHash(CSSText);
    const shouldUpdate = !this.addedCSSText[hash];
    if (shouldUpdate) {
      this.addedCSSText[hash] = true;
      this.CSSText += CSSText;
    }
    this.onSheetsUpdate(this.sheets);
  }

  setStyleToManager(config?: {
    style?: CustomCSSProperties;
    className?: string;
  }, callback?: (theme?: Theme) => StyleClasses): StyleClasses {
    let newStyles: StyleClasses = {};
    let { style, className } = config || {} as StyleClasses;
    if (callback) style = callback(this.theme) as CustomCSSProperties;

    const { dynamicStyle, ...styleProperties } = style;
    className = className || "";
    const sheet = this.addStyle(styleProperties, className);
    newStyles = {
      className: sheet.classNameWithHash,
      style: dynamicStyle
    };

    return newStyles;
  }

  setStylesToManager(config?: {
    styles: { [key: string]: StyleClasses | CustomCSSProperties };
    className?: string;
  }, callback?: (theme?: Theme) => { [key: string]: StyleClasses }): { [key: string]: StyleClasses } {
    const newStyles: {
      [key: string]: {
        className?: string;
        style?: React.CSSProperties;
      }
    } = {};
    let { className, styles } = config;
    if (callback) styles = callback(this.theme);
    className = className || "";
    const keys = Object.keys(styles);

    for (const key of keys) {
      let styleItem: StyleClasses = styles[key] as StyleClasses;
      if (!styleItem) continue;

      const isStyleClasses = styleItem.className || styleItem.style;
      let secondClassName: string = `-${key}`;

      if (isStyleClasses) {
        secondClassName = styleItem.className;
        secondClassName = secondClassName ? `-${secondClassName}` : "";
        secondClassName = `-${key}${secondClassName}`;
      }

      const { dynamicStyle, ...styleProperties } = (isStyleClasses ? styleItem.style : styleItem) as any;
      const sheet = this.addStyle(
        styleProperties,
        `${className}${secondClassName}`
      );
      newStyles[key] = {
        className: sheet.classNameWithHash,
        style: dynamicStyle
      };
    }

    return newStyles;
  }
}

export default StyleManager;

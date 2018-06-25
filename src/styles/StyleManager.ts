import * as createHash from "murmurhash-js/murmurhash3_gc";
import IS_NODE_ENV from "../common/nodeJS/IS_NODE_ENV";
import isUnitlessNumber from "../common/react/isUnitlessNumber";
import isElectronEnv from "../common/electron/IS_ELECTRON_ENV";

export const replace2Dashes = (key: string) => key.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`);
export const getStyleValue = (key: string, value: string) => ((typeof value === "number" && !(isUnitlessNumber as any)[key]) ? `${value}px` : value);

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
  theme?: ReactUWP.ThemeType;
  globalClassName?: string;
  styleDidUpdate?: () => void;
}

let StyleManager: new(config: StyleManagerConfig) => ReactUWP.StyleManager;
StyleManager = class {
  globalClassName: string;
  theme: ReactUWP.ThemeType;
  themeId: number = 0;
  styleElement: HTMLStyleElement = null;
  sheets: {
    [key: string]: Sheet
  } = {};
  styleDidUpdate: () => void;
  CSSText: string = "";
  addedCSSText: {
    [key: string]: boolean;
  } = {};

  constructor(config: StyleManagerConfig) {
    const { globalClassName, theme, styleDidUpdate } = config;
    this.styleDidUpdate = styleDidUpdate || (() => {});
    this.globalClassName = globalClassName ? `${globalClassName}-` : "";
    this.setupTheme(theme);
    this.setupStyleElement();
  }

  setupTheme = (theme?: ReactUWP.ThemeType): void => {
    this.theme = theme;
    this.themeId = createHash([theme.accent, theme.themeName, theme.useFluentDesign].join(", "));
  }

  setupStyleElement = (): void => {
    if (IS_NODE_ENV) return;
    if (!this.styleElement) {
      const name = `data-uwp-jss-${this.themeId}`;
      this.styleElement = document.createElement("style");
      this.styleElement.setAttribute(name, "");
      document.head.appendChild(this.styleElement);
    }
  }

  cleanStyleSheet = (): void => {
    if (this.styleElement) document.head.removeChild(this.styleElement);
    this.theme = null;
    this.sheets = {};
    this.CSSText = "";
    this.styleElement = null;
  }

  style2CSSText = (style: React.CSSProperties): string => style ? Object.keys(style).map(key => (
    `  ${replace2Dashes(key)}: ${getStyleValue(key, style[key])};`
  )).join("\n") : void 0

  sheetsToString = (): string => `\n${Object.keys(this.sheets).map(id => this.sheets[id].CSSText).join("")}`;

  addStyle = (style: CustomCSSProperties, className = "", callback = () => {}): Sheet => {
    const id = createHash(`${this.themeId}: ${JSON.stringify(style)}`);
    if (this.sheets[id]) return this.sheets[id];

    const classNameWithHash = `${this.globalClassName}${className}-${id}`;
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
    callback();
    return this.sheets[id];
  }

  addStyleWithUpdate = (style: CustomCSSProperties, className = ""): Sheet => {
    return this.addStyle(style, className, this.renderSheets);
  }

  addCSSText = (CSSText: string, callback: (shouldUpdate?: boolean) => void = () => {}): void => {
    const hash = createHash(CSSText);
    const shouldUpdate = !this.addedCSSText[hash];
    if (shouldUpdate) {
      this.addedCSSText[hash] = true;
      this.CSSText += CSSText;
    }
    callback(shouldUpdate);
  }

  addCSSTextWithUpdate = (CSSText: string): void => {
    this.addCSSText(CSSText, shouldUpdate => {
      if (this.styleElement && shouldUpdate) {
        this.updateStyleElement(this.styleElement.textContent += CSSText);
      }
    });
  }

  setStyleToManager(config?: {
    style?: CustomCSSProperties;
    className?: string;
  }, callback?: (theme?: ReactUWP.ThemeType) => StyleClasses): StyleClasses {
    let newStyles: StyleClasses = {};
    let { style, className } = config || {} as StyleClasses;
    if (callback) style = callback(this.theme) as CustomCSSProperties;

    const { dynamicStyle, ...styleProperties } = style;
    className = className || "";
    const sheet = this.addStyleWithUpdate(styleProperties, className);
    newStyles = {
      className: sheet.classNameWithHash,
      style: dynamicStyle
    };

    return newStyles;
  }

  setStylesToManager(config?: {
    styles: { [key: string]: StyleClasses | CustomCSSProperties };
    className?: string;
  }, callback?: (theme?: ReactUWP.ThemeType) => { [key: string]: StyleClasses }): { [key: string]: StyleClasses } {
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

  let CSSText = "";
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
    const sheet = this.addStyleWithUpdate(
      styleProperties,
      `${className}${secondClassName}`
    );
    newStyles[key] = {
      className: sheet.classNameWithHash,
      style: dynamicStyle
    };
    CSSText += `${sheet.CSSText}\n`;
  }

  return newStyles;
}

  renderSheets = (): void => {
    let textContent = this.sheetsToString();
    textContent += this.CSSText;
    this.updateStyleElement(textContent);
  }

  updateStyleElement = (textContent: string): void => {
    const name = `data-uwp-jss-${this.themeId}`;
    if (this.styleElement) {
      this.styleElement.textContent = textContent;
      this.styleDidUpdate();
    }
  }
} as any;

export default StyleManager;

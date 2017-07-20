import * as createHash from "murmurhash-js/murmurhash3_gc";
import isUnitlessNumber from "../common/react/isUnitlessNumber";

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

export interface StyleWithClasses {
  style?: CustomCSSProperties;
  className?: string;
}

export const extendsStyleKeys: any = {
  "&:hover": true,
  "&:active": true,
  "&:focus": true,
  "&:disabled": true
};

export class StyleManager {
  globalClassName: string;
  theme: ReactUWP.ThemeType;
  themeId = 0;
  styleElement: HTMLStyleElement = null;
  sheets: {
    [key: string]: {
      CSSText?: string;
      className?: string;
      classNameWithHash?: string;
      id?: number;
    }
  } = {};
  styleDidUpdate: () => void;
  CSSText = "";
  addedCSSText: {
    [key: string]: boolean;
  } = {};

  constructor(config: {
    theme?: ReactUWP.ThemeType;
    globalClassName?: string;
    styleDidUpdate?: () => void;
  }) {
    const { globalClassName, theme, styleDidUpdate } = config;
    this.styleDidUpdate = styleDidUpdate || (() => {});
    this.globalClassName = globalClassName ? `${globalClassName}-` : "";
    this.setupTheme(theme);
    this.setupStyleElement();
  }

  setupTheme = (theme?: ReactUWP.ThemeType) => {
    this.theme = theme;
    this.themeId = createHash([theme.accent, theme.themeName, theme.useFluentDesign].join(", "));
  }

  setupStyleElement = () => {
    const name = `data-uwp-jss-${this.themeId}`;
    if (!this.styleElement) {
      this.styleElement = document.createElement("style");
      this.styleElement.setAttribute(name, "");
      document.head.appendChild(this.styleElement);
    }
  }

  cleanStyleSheet = () => {
    if (this.styleElement) document.head.removeChild(this.styleElement);
    this.theme = null;
    this.sheets = {};
    this.CSSText = "";
    this.styleElement = null;
  }

  style2CSSText = (style: React.CSSProperties) => style ? Object.keys(style).map(key => (
    `  ${replace2Dashes(key)}: ${getStyleValue(key, style[key])};`
  )).join("\n") : void 0

  sheetsToString = () => `\n${Object.keys(this.sheets).map(id => this.sheets[id].CSSText).join("")}`;

  addStyle = (style: CustomCSSProperties, className = "", callback = () => {}) => {
    const id = createHash(`${this.themeId}: ${JSON.stringify(style)}`);
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
        contentCSSText += `  ${replace2Dashes(styleKey)}: ${getStyleValue(styleKey, style[styleKey])};\n`;
      }
    }

    CSSText += `.${classNameWithHash} {\n${contentCSSText}\n}\n`;
    CSSText += extendsCSSText;

    this.sheets[id] = { CSSText, classNameWithHash, id, className };
    callback();
    return this.sheets[id];
  }

  addStyleWithUpdate = (style: CustomCSSProperties, className = "") => {
    return this.addStyle(style, className, this.renderSheets);
  }

  addCSSText = (CSSText: string, callback = () => {}) => {
    const hash = createHash(CSSText);
    if (!this.addedCSSText[hash]) {
      this.addedCSSText[hash] = true;
      this.CSSText += CSSText;
      callback();
    }
  }

  addCSSTextWithUpdate = (CSSText: string) => {
    this.addCSSText(CSSText, () => {
      if (this.styleElement) {
        this.updateStyleElement(this.styleElement.textContent += CSSText);
      }
    });
  }

  setStyleToManager(config?: {
    style?: CustomCSSProperties;
    className?: string;
  }, callback?: (theme?: ReactUWP.ThemeType) => StyleWithClasses): StyleWithClasses {
    let newStyles: StyleWithClasses = {};
    let { style, className } = config || {} as StyleWithClasses;
    if (callback) style = callback(this.theme);

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
    styles: { [key: string]: StyleWithClasses | CustomCSSProperties };
    className?: string;
  }, callback?: (theme?: ReactUWP.ThemeType) => { [key: string]: StyleWithClasses }): { [key: string]: StyleWithClasses } {
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
    let styleItem: StyleWithClasses = styles[key] as StyleWithClasses;
    const isStyleWithClasses = styleItem.className || styleItem.style;
    let secondClassName: string = `-${key}`;

    if (isStyleWithClasses) {
      secondClassName = styleItem.className;
      secondClassName = secondClassName ? `-${secondClassName}` : "";
      secondClassName = `-${key}${secondClassName}`;
    }

    const { dynamicStyle, ...styleProperties } = isStyleWithClasses ? styleItem.style : styleItem;
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

  renderSheets = () => {
    let textContent = this.sheetsToString();
    textContent += this.CSSText;
    this.updateStyleElement(textContent);
  }

  updateStyleElement = (textContent: string) => {
    const name = `data-uwp-jss-${this.themeId}`;
    if (this.styleElement) {
      this.styleElement.textContent = textContent;
      this.styleDidUpdate();
    }
  }
}

export default StyleManager;

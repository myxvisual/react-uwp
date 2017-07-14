import * as createHash from "murmurhash-js/murmurhash3_gc";
import isUnitlessNumber from "../common/react/isUnitlessNumber";

const replace2Dashes = (key: string) => key.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`);
const getStyleValue = (key: string, value: string) => ((typeof value === "number" && !(isUnitlessNumber as any)[key]) ? `${value}px` : value);

export interface CustomCSSProperties extends React.CSSProperties {
  "&:hover"?: React.CSSProperties;
  "&:active"?: React.CSSProperties;
  "&:focus"?: React.CSSProperties;
  "&:disabled"?: React.CSSProperties;
}

const extendsStyleKeys: any = {
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
  sheets: any = {};

  constructor(theme: ReactUWP.ThemeType, globalClassName?: string) {
    this.globalClassName = globalClassName ? `${globalClassName}-` : "";
    this.setupTheme(theme);
  }

  setupTheme = (theme: ReactUWP.ThemeType) => {
    this.theme = theme;
    this.themeId = createHash([theme.accent, theme.themeName, theme.useFluentDesign].join(", "));
  }

  style2CSSText = (style: React.CSSProperties) => style ? Object.keys(style).map(key => (
    `  ${replace2Dashes(key)}: ${getStyleValue(key, style[key])};`
  )).join("\n") : void 0

  renderSheets = () => {};

  sheetsToString = () => `\n${Object.keys(this.sheets).map(id => this.sheets[id].CSSText).join("")}`;

  updateTheme = () => {};

  addSheet = (style: CustomCSSProperties, className = "", callback = () => {}) => {
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

  addSheetWithUpdate = (style: CustomCSSProperties, className = "") => {
    return this.addSheet(style, className, this.updateSheetsToDOM);
  }

  updateSheetByID = () => {};

  updateAllSheets = () => {};

  removeSheetByID = () => {};

  updateSheetsToDOM = () => {
    const name = `data-uwp-jss-${this.themeId}`;
    this.styleElement = document.querySelector(`[${name}]`) as HTMLStyleElement;
    const textContent = this.sheetsToString();

    if (!this.styleElement) {
      this.styleElement = document.createElement("style");
      this.styleElement.setAttribute(name, "");
      this.styleElement.textContent = textContent;
      document.head.appendChild(this.styleElement);
    } else {
      this.styleElement.textContent = textContent;
    }
  }
}

export default StyleManager;

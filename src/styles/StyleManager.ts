import * as createHash from "murmurhash-js/murmurhash3_gc";
import isUnitlessNumber from "../common/react/isUnitlessNumber";

const style2CSSText = (style: React.CSSProperties) => Object.keys(style).map(key => `  ${replace2Dashes(key)}: ${getStyleValue(key, style[key])};`).join("\n");
const replace2Dashes = (key: string) => key.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`);
const getStyleValue = (key: string, value: string) => ((typeof value === "number" && !(isUnitlessNumber as any)[key]) ? `${value}px` : value);

export interface CustomCSSProperties extends React.CSSProperties {
  "hoverStyle"?: React.CSSProperties;
  "activeStyle"?: React.CSSProperties;
}

export class StyleManager {
  theme: ReactUWP.ThemeType;
  themeId: number;
  styleElement: HTMLStyleElement = null;
  sheets: any = {};

  constructor(theme: ReactUWP.ThemeType) {
    this.setupTheme(theme);
    this.updateSheetsToDOM();
  }

  setupTheme = (theme: ReactUWP.ThemeType) => {
    this.theme = theme;
    this.themeId = createHash(JSON.stringify(theme));
  }

  renderSheets = () => {};

  sheetsToString = () => `\n${Object.keys(this.sheets).map(id => this.sheets[id].CSSText).join("\n")}\n`;

  updateTheme = () => {};

  addSheet = (style: CustomCSSProperties, className = "", callback = () => {}) => {
    const { hoverStyle, activeStyle, ...originStyle } = style;
    let CSSText = style2CSSText(originStyle);
    const id = createHash(`.${className} {\n${CSSText}\n}`);
    const classNameWithHash = `${className}-${id}`;
    CSSText = `.${classNameWithHash} {\n${CSSText}\n}\n`;

    if (hoverStyle) {
      const hoverCSSText = style2CSSText(hoverStyle);
      CSSText += `.${classNameWithHash}:hover {\n${hoverCSSText}\n}\n`;
    }
    if (activeStyle) {
      const activeCSSText = style2CSSText(activeStyle);
      CSSText += `.${classNameWithHash}:active {\n${activeCSSText}\n}\n`;
    }

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
    this.styleElement = document.querySelector("[data-uwp-jss]") as HTMLStyleElement;
    const textContent = this.sheetsToString();

    if (!this.styleElement) {
      this.styleElement = document.createElement("style");
      this.styleElement.setAttribute("data-uwp-jss", "");
      this.styleElement.textContent = textContent;
      document.head.appendChild(this.styleElement);
    } else {
      this.styleElement.textContent = textContent;
    }
  }
}

export default StyleManager;

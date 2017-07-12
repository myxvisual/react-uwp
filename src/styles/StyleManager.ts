import * as createHash from "murmurhash-js/murmurhash3_gc";
import isUnitlessNumber from "../common/react/isUnitlessNumber";

const replace2Dashes = (key: string) => key.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`);
const getStyleValue = (key: string, value: string) => ((typeof value === "number" && !(isUnitlessNumber as any)[key]) ? `${value}px` : value);

export class StyleManager {
  theme: ReactUWP.ThemeType;
  themeId: number;
  styleElement: HTMLStyleElement = null;
  sheets: any = {};

  constructor(theme: ReactUWP.ThemeType) {
    this.setupTheme(theme);
    this.addSheet({}, "text");
    this.renderToDOM();
  }

  setupTheme = (theme: ReactUWP.ThemeType) => {
    this.theme = theme;
    this.themeId = createHash(JSON.stringify(theme));
  }

  renderSheets = () => {};

  sheetsToString = () => {};

  updateTheme = () => {};

  addSheet = (style: React.CSSProperties, className = "") => {
    style = {
      borderTop: 2,
      fontSize: 12,
      lineHeight: 2
    };
    let CSSText = Object.keys(style).map(key => `  ${replace2Dashes(key)}: ${getStyleValue(key, style[key])};`).join("\n");
    const id = createHash(`.${className} {\n${CSSText}\n}`);
    CSSText = `.${className}-${id} {\n${CSSText}\n}`;
    this.sheets[id] = { CSSText };
  }

  updateSheetByID = () => {};

  updateAllSheets = () => {};

  removeSheetByID = () => {};

  renderToDOM = () => {
    this.styleElement = document.querySelector("[data-uwp-jss]") as HTMLStyleElement;
    const textContent = `\n${Object.keys(this.sheets).map(id => this.sheets[id].CSSText).join("\n")}\n`;
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

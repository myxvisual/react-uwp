import * as createHash from "murmurhash-js/murmurhash3_gc";
import isUnitlessNumber from "../common/react/isUnitlessNumber";

const replace2Dashes = (key: string) => key.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`);
const getStyleValue = (key: string, value: string) => ((typeof value === "number" && !(isUnitlessNumber as any)[key]) ? `${value}px` : value);

export class StyleManager {
  theme: ReactUWP.ThemeType;
  themeId: number;
  sheets: any[] = [];

  constructor(theme: ReactUWP.ThemeType) {
    this.setupTheme(theme);
    this.addSheet({}, "");
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
    const id = createHash(CSSText);
    CSSText = `.${className}-${id} {\n${CSSText}\n}`;
  }

  updateSheetByID = () => {};

  updateAllSheets = () => {};

  removeSheetByID = () => {};
}

export default StyleManager;

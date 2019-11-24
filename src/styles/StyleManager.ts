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
  rules?: Map<string, boolean>;
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
  sheets: {
    [key: string]: Sheet;
  } = {};
  resultCSSText: string = "";
  addedCSSText: {
    [key: string]: {
      CSSText?: string;
      rules?: Map<string, boolean>;
    };
  } = {};
  allRules: Map<string, boolean> = new Map();
  onAddCSSText(CSSText?: string) {}
  onAddRules(rules?: Map<string, boolean>) {}
  onRemoveCSSText(CSSText?: string) {}

  constructor(config?: StyleManagerConfig) {
    const { prefixClassName } = config || {};
    this.prefixClassName = prefixClassName ? `${prefixClassName}-` : "";
  }

  setRules2allRules(rules: Map<string, boolean>, rule: string) {
    if (this.allRules.get(rule)) {
      rules.set(rule, true);
    } else {
      rules.set(rule, false);
      this.allRules.set(rule, false)
    }
  }

  cleanAllStyles() {
    this.cleanSheets();
    this.cleanCSSText();
  }

  cleanSheets = (): void => {
    this.sheets = {};
  }

  cleanCSSText() {
    this.addedCSSText = {};
    this.resultCSSText = "";
  }

  style2CSSText = (style: React.CSSProperties): string => style ? Object.keys(style).map(key => (
    `${replace2Dashes(key)}: ${getStyleValue(key, style[key])};`
  )).join(" ") : void 0

  sheetsToString = () => `${Object.keys(this.sheets).map(id => this.sheets[id].CSSText).join("")}`;

  getAllCSSText = () => `${this.sheetsToString()}\n${this.resultCSSText}`;

  addStyle = (style: CustomCSSProperties, className = ""): Sheet => {
    const id = createHash(JSON.stringify(style));

    if (this.sheets[id]) {
      return this.sheets[id];
    }

    const classNameWithHash = `${this.prefixClassName}${className}-${id}`;
    let CSSText = "";
    let currStyleText = "";
    let extendsRules = "";
    const rules = new Map<string, boolean>();

    for (const styleKey in style) {
      if (extendsStyleKeys[styleKey]) {
        const extendsStyle = style[styleKey];
        if (extendsStyle) {
          const newRules = `.${classNameWithHash}${styleKey.slice(1)} { ${this.style2CSSText(extendsStyle)} }`;
          this.setRules2allRules(rules, newRules);
          extendsRules += newRules;
        }
      } else {
        if (style[styleKey] !== void 0) {
          currStyleText += `${replace2Dashes(styleKey)}: ${getStyleValue(styleKey, style[styleKey])}; `;
        }
      }
    }

    const currRules = `.${classNameWithHash} { ${currStyleText}}`;
    this.setRules2allRules(rules, currRules);
    CSSText += currRules;
    CSSText += extendsRules;

    this.sheets[id] = { CSSText, classNameWithHash, id, className, rules };
    this.onAddCSSText(currRules + extendsRules);
    this.onAddRules(rules);

    return this.sheets[id];
  }

  addCSSText = (CSSText: string) => {
    const hash = createHash(CSSText);
    const shouldUpdate = !this.addedCSSText[hash];
    if (shouldUpdate) {
      this.resultCSSText += CSSText;
      const textSize = CSSText.length;
      let currRule = "";
      let leftBraces = 0;
      const rules = new Map<string, boolean>();
      for (let i = 0; i < textSize; i ++) {
        const char = CSSText[i];
        currRule += char;
        if (char === "{") {
          leftBraces += 1;
        }
        if (char === "}") {
          leftBraces -= 1;
          if (leftBraces === 0) {
            this.setRules2allRules(rules, currRule);
            currRule = "";
          }
        }
      }
      this.addedCSSText[hash] = { CSSText, rules };
      this.onAddCSSText(CSSText);
      this.onAddRules(rules);
    }
  }

  removeCSSText = (CSSText: string) => {
    const hash = createHash(CSSText);
    delete this.addedCSSText[hash];
    this.resultCSSText = this.resultCSSText.replace(CSSText, "");
    this.onRemoveCSSText(CSSText);
  }

  setStyleToManager(config?: { style?: CustomCSSProperties; className?: string; }): StyleClasses {
    let newStyles: StyleClasses = {};
    let { style, className } = config || {} as StyleClasses;

    const { dynamicStyle, ...styleProperties } = style;
    className = className || "";
    const sheet = this.addStyle(styleProperties, className);
    newStyles = {
      className: sheet.classNameWithHash,
      style: dynamicStyle
    };

    return newStyles;
  }

  setStylesToManager(config?: { styles: { [key: string]: StyleClasses | CustomCSSProperties }; className?: string; }): { [key: string]: StyleClasses } {
    const newStyles: {
      [key: string]: {
        className?: string;
        style?: React.CSSProperties;
      }
    } = {};
    let { className, styles } = config;
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

  insertRule2el(styleEl: HTMLStyleElement, rule: string, index?: number) {
    if (rule && styleEl && !this.allRules.get(rule)) {
      const { sheet } = styleEl;
      const rulesSize = sheet["rules"].size;

      try {
        if ("insertRule" in sheet) {
          (sheet as any)["insertRule"](rule, index === void 0 ? rulesSize : index);
        } else if ("appendRule" in sheet) {
          (sheet as any)["appendRule"](rule);
        } else {
          styleEl.textContent += rule;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  inserAllRule2el(styleEl: HTMLStyleElement) {
    this.allRules.forEach((inserted, rule) => {
      if (!inserted) {
        this.insertRule2el(styleEl, rule);
        this.allRules.set(rule, true);
      }
    });
  }

  cleanRules(styleEl: HTMLStyleElement) {
    if (styleEl) {
      const { sheet } = styleEl;
      const rules = sheet["rules"] as any;
      if (rules && rules.length > 0) {
        for (const rule of rules) {
          (sheet as any)["deleteRule"](rule);
        }
      }
      this.cleanAllStyles();
    }
  }
}

export default StyleManager;

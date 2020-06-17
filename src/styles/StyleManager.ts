import * as createHash from "murmurhash-js/murmurhash3_gc";
import isUnitlessNumber from "../utils/react/isUnitlessNumber";
import { PseudoSelector, pseudoSelectorMap } from "./PseudoSelectors";

export const replace2Dashes = (key: string) => key.replace(/[A-Z]/g, $1 => `-${$1.toLowerCase()}`);
export const getStyleValue = (key: string, value: string) => (typeof value === "number" && !isUnitlessNumber[key]) ? `${value}px` : value;

export type PseudoCSSProperties = {
  [K in PseudoSelector]?: React.CSSProperties;
};

export type CSSDirectProperties = {
  "@keyframes"?: {
    from?: React.CSSProperties;
    to?: React.CSSProperties;
    [key: string]: React.CSSProperties;
  };
  "@font-face"?: React.CSSProperties;
};

export interface CustomCSSProperties extends React.CSSProperties, PseudoCSSProperties {
  inlineStyle?: React.CSSProperties;
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
export interface StyleManagerConfig {
  prefixClassName?: string;
}

export class StyleManager {
  prefixSelector: string;
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
  allRules: Map<string, {
    isInserted?: boolean;
    ruleIndex?: number;
  }> = new Map();
  ruleIndList: number[] = [];
  onAddCSSText(CSSText?: string) {}
  onAddRules(rules?: Map<string, boolean>) {}
  onRemoveRules(rules?: Map<string, boolean>) {}
  onRemoveCSSText(CSSText?: string) {}

  constructor(config?: StyleManagerConfig) {
    const { prefixClassName } = config || {};
    this.prefixSelector = prefixClassName ? `${prefixClassName}-` : "";
  }

  getRules4allRules(rules: Map<string, boolean>, rule: string) {
    if (this.allRules.get(rule)) {
      rules.set(rule, true);
    } else {
      rules.set(rule, false);
      this.allRules.set(rule, {
        isInserted: false
      });
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

  style2CSSText = (style: React.CSSProperties) => {
    let cssText = "{ ";
    if (style) {
      for (let key in style) {
        const value = style[key];
        cssText += `${replace2Dashes(key)}: ${getStyleValue(key, value)};`;
      }
    }
    cssText += " }";
    return cssText;
  }

  sheetsToString = () => `${Object.keys(this.sheets).map(id => this.sheets[id].CSSText).join("")}`;

  getAllCSSText = () => `${this.sheetsToString()}\n${this.resultCSSText}`;

  addStyle = (style: CustomCSSProperties, className = ""): Sheet => {
    const id = createHash(JSON.stringify(style));

    if (this.sheets[id]) {
      return this.sheets[id];
    }

    const classNameWithHash = `${this.prefixSelector}${className}-${id}`;
    let CSSText = "";
    let mainCSSText = "";
    let pseudoCSSText = "";
    const rules = new Map<string, boolean>();

    for (const styleKey in style) {
      if (pseudoSelectorMap[styleKey] || styleKey.startsWith("&")) {
        const extendsStyle = style[styleKey];
        if (extendsStyle) {
          const newExtendsCSSText = `.${classNameWithHash}${styleKey.slice(1)} ${this.style2CSSText(extendsStyle)}`;
          this.getRules4allRules(rules, newExtendsCSSText);
          pseudoCSSText += newExtendsCSSText;
        }
      } else {
        if (style[styleKey] !== void 0) {
          mainCSSText += `${replace2Dashes(styleKey)}: ${getStyleValue(styleKey, style[styleKey])}; `;
        }
      }
    }

    const currCSSText = `.${classNameWithHash} { ${mainCSSText} }`;
    this.getRules4allRules(rules, currCSSText);
    CSSText += currCSSText;
    CSSText += pseudoCSSText;

    this.sheets[id] = { CSSText, classNameWithHash, id, className, rules };
    this.onAddCSSText(currCSSText + pseudoCSSText);
    this.onAddRules(rules);

    return this.sheets[id];
  }

  addStyleWithSelector = (selector: string, style: React.CSSProperties) => {
    let cssText = `${selector} ${this.style2CSSText(style)}`;
    this.addCSSText(cssText);
  }

  addStylesWithSelector = (styles: { [selector: string]: React.CSSProperties; }) => {
    for (let selector in styles) {
      const style = styles[selector];
      let cssText = `${selector} ${this.style2CSSText(style)}`;
      this.addCSSText(cssText);
    }
  }

  addCSSText = (cssText: string) => {
    const hash = createHash(cssText);
    const shouldUpdate = !this.addedCSSText[hash];
    if (shouldUpdate) {
      this.resultCSSText += cssText;
      const rules = new Map<string, boolean>();
      this.cssText2rules(cssText, currRule => {
        this.getRules4allRules(rules, currRule);
      });
      this.addedCSSText[hash] = { CSSText: cssText, rules };
      this.onAddCSSText(cssText);
      this.onAddRules(rules);
    }
  }

  removeCSSText = (cssText: string) => {
    const hash = createHash(cssText);

    const shouldUpdate = this.addedCSSText[hash];
    if (shouldUpdate) {
      this.resultCSSText = this.resultCSSText.replace(cssText, "");
      const rules = new Map<string, boolean>();
      this.cssText2rules(cssText, currRule => {
        this.getRules4allRules(rules, currRule);
      });

      this.onRemoveCSSText(cssText);
      this.onRemoveRules(rules);
      delete this.addedCSSText[hash];
    }
  }

  cssText2rules(cssText: string, onNewRule?: (rule?: string) => void) {
    let currRule = "";
    let selectorTexts: string[] = [];
    let selectorTextIsEnd = false;
    let selectorTextIndex = 0;

    const rules: string[] = [];
    let leftBraces = 0;
    const textSize = cssText.length;
    for (let i = 0; i < textSize; i ++) {
      const char = cssText[i];
      if (char === "{") {
        selectorTextIsEnd = true;
        leftBraces += 1;
      }

      if (selectorTextIsEnd) {
        currRule += char;
      } else {
        if (char === ",") {
          selectorTextIndex += 1;
        } else {
          if (selectorTexts[selectorTextIndex]) {
            selectorTexts[selectorTextIndex] += char;
          } else {
            selectorTexts[selectorTextIndex] = char;
          }
        }
      }

      if (char === "}") {
        leftBraces -= 1;
        if (leftBraces === 0) {
          selectorTexts.forEach(selectorText => {
            if (onNewRule) {
              onNewRule(selectorText + currRule);
            }
            rules.push(selectorText + currRule);
          });

          currRule = "";
          selectorTexts = [];
          selectorTextIsEnd = false;
          selectorTextIndex = 0;
        }
      }
    }

    return rules;
  }

  setStyleToManager(config?: { style?: CustomCSSProperties; className?: string; }): StyleClasses {
    let newStyles: StyleClasses = {};
    let { style, className } = config || {} as StyleClasses;

    const { inlineStyle, ...styleProperties } = style;
    className = className || "";
    const sheet = this.addStyle(styleProperties, className);
    newStyles = {
      className: sheet.classNameWithHash,
      style: inlineStyle
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

      const { inlineStyle, ...styleProperties } = styleItem as any;
      const sheet = this.addStyle(
        styleProperties,
        `${className}${secondClassName}`
      );
      newStyles[key] = {
        className: sheet.classNameWithHash,
        style: inlineStyle
      };
    }

    return newStyles;
  }

  insertRuleToStyleEl = (styleEl: HTMLStyleElement, rule: string, index: number) => {
    const sheet = styleEl.sheet as CSSStyleSheet;

    if ("insertRule" in sheet) {
      sheet.insertRule(rule, index);
    } else if ("appendRule" in sheet) {
      (sheet as any)["appendRule"](rule);
    } else {
      styleEl.textContent += rule;
    }
  }

  insertRule2el(styleEl: HTMLStyleElement, rule: string, index?: number) {
    this.queueMethods.push({
      method: () => {
        if (rule && styleEl && !this.allRules.get(rule).isInserted) {
          const sheet = styleEl.sheet as CSSStyleSheet;
          const rules = sheet.rules || sheet.cssRules;
          const rulesSize = rules.length;
          const ruleIndex = index === void 0 ? rulesSize : index;

          if (!sheet) return;
          try {
            this.insertRuleToStyleEl(styleEl, rule, ruleIndex);

            const id = this.ruleIndList.length;
            this.allRules.set(rule, {
              isInserted: true,
              ruleIndex: id
            });
            this.ruleIndList.push(id);
          } catch (error) {}
        }
      },
      name: "insetRule2el"
    });
    this.runQueueMethods();
  }

  queueMethods: { method: Function; name: string; }[] = [];
  runningQueueMethods = false;

  runQueueMethods() {
    const methodSize = this.queueMethods.length;
    if (methodSize > 0 && this.runningQueueMethods === false) {
      this.runningQueueMethods = true;
      const queueMethod = this.queueMethods.shift();
      queueMethod.method();
      this.runningQueueMethods = false;
      if (methodSize > 0) this.runQueueMethods();
    }
  }

  insertAllRule2el(styleEl: HTMLStyleElement) {
    this.allRules.forEach((value, rule) => {
      if (!value.isInserted) {
        this.insertRule2el(styleEl, rule);
      }
    });
  }

  deleteRule2el(styleEl: HTMLStyleElement, rule: string) {
    this.queueMethods.push({
      method: () => {
        if (!rule) return;
        const sheetItem = this.allRules.get(rule);
        this.allRules.delete(rule);

        if (styleEl && sheetItem) {
          const sheet = styleEl.sheet as CSSStyleSheet;
          const { isInserted, ruleIndex } = sheetItem;
          if (isInserted && sheet) {
            const sheetInd = this.ruleIndList.filter(t => t !== null).indexOf(ruleIndex);
            if (sheet.rules[sheetInd]) {
              sheet.deleteRule(sheetInd + 0);
              this.ruleIndList.splice(sheetInd, 1, null);
            }
          }
        }
      },
      name: "deleteRule2el"
    });
    this.runQueueMethods();
  }

  deleteAllRule2el(styleEl: HTMLStyleElement) {
    const sheet = styleEl.sheet as CSSStyleSheet;
    const rules = sheet.rules || sheet.cssRules;
    const rulesSize = rules.length;
    const lastIndex = rulesSize - 1;
    for (let i = lastIndex; i > -1; i--) {
      sheet.deleteRule(i);
    }

    this.allRules = new Map();
    this.ruleIndList = [];
  }
}

export default StyleManager;

import CSSManager from "koss";

export interface StyleManagerConfig {
  prefixClassName?: string;
}

export class StyleManager extends CSSManager {
  prefixSelector: string;
  allRules: Map<string, {
    isInserted?: boolean;
    ruleIndex?: number;
  }> = new Map();
  ruleIndList: number[] = [];
  
  onAddRules: (rules: Map<string, boolean>) => void = () => {};
  onRemoveRules: (rules: Map<string, boolean>) => void = () => {};

  constructor(config?: StyleManagerConfig) {
    const { prefixClassName } = config || {};
    super({ prefixName: prefixClassName ? `${prefixClassName}-` : "ko-" });
    this.prefixSelector = prefixClassName ? `${prefixClassName}-` : "";

    this.on("addCSS", (cssDetail: any) => {
      const rules = new Map<string, boolean>();
      cssDetail.cssRuleDetails.forEach((detail: any) => {
        const rule = `${cssDetail.selector} {${detail.styleBlock}}`;
        rules.set(rule, false);
      });
      this.onAddRules(rules);
    });

    this.on("removeCSS", (cssDetail: any) => {
      const rules = new Map<string, boolean>();
      cssDetail.cssRuleDetails.forEach((detail: any) => {
        const rule = `${cssDetail.selector} {${detail.styleBlock}}`;
        rules.set(rule, true);
      });
      this.onRemoveRules(rules);
    });
  }

  // 兼容原有的 DOM 插入逻辑
  insertRule2el(styleEl: HTMLStyleElement, rule: string, index?: number) {
    const sheet = styleEl.sheet as CSSStyleSheet;
    if (!sheet) return;
    
    const rules = sheet.rules || sheet.cssRules;
    const ruleIndex = index === void 0 ? rules.length : index;

    try {
      if ("insertRule" in sheet) {
        sheet.insertRule(rule, ruleIndex);
      } else {
        styleEl.textContent += rule;
      }

      const id = this.ruleIndList.length;
      this.allRules.set(rule, { isInserted: true, ruleIndex: id });
      this.ruleIndList.push(id);
    } catch (e) {}
  }

  deleteAllRule2el(styleEl: HTMLStyleElement) {
    const sheet = styleEl.sheet as CSSStyleSheet;
    if (!sheet) return;
    const rules = sheet.rules || sheet.cssRules;
    for (let i = rules.length - 1; i >= 0; i--) {
      sheet.deleteRule(i);
    }
    this.allRules.clear();
    this.ruleIndList = [];
  }
}

export default StyleManager;

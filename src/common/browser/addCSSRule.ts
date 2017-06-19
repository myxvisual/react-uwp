export default function addCSSRule(styleSheetStr: string | string[], styleSheet = document.styleSheets[0]) {
  if (!styleSheet) styleSheet = document.styleSheets[0];
  const insertToRule = (styleSheet: any) => {
    try {
      if (Array.isArray(styleSheetStr)) {
        styleSheetStr.forEach(str => {
          styleSheet.insertRule(str, 0);
        });
      } else {
        styleSheet.insertRule(styleSheetStr, 0);
      }
    } catch (e) {
      console.error(e);
    }
  };
  if (!styleSheet) {
    const styleElm = document.createElement("style");
    document.head.appendChild(styleElm);
    insertToRule(styleElm.sheet);
  } else {
    insertToRule(styleSheet);
  }
}

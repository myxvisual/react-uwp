export default function addCSSRule(styleSheetStr: string | string[], styleSheet = document.styleSheets[0]) {
	const insertToRule = (styleSheet: any) => {
		if (Array.isArray(styleSheetStr)) {
			styleSheetStr.forEach(str => {
				styleSheet.insertRule(str, "styleSheet" in styleSheet ? styleSheet.cssRules.length : styleSheet.rules.length);
			});
		} else {
			styleSheet.insertRule(styleSheetStr, "styleSheet" in styleSheet ? styleSheet.cssRules.length : styleSheet.rules.length);
		}
	};
	if (!styleSheet) {
		const { head, createElement } = document;
		const link = createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		styleSheet = link.sheet;
		insertToRule(styleSheet);
		head.appendChild(link);
	} else {
		insertToRule(styleSheet);
	}
}

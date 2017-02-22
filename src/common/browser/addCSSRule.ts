export default function addCSSRule(styleSheetStr: string, styleSheet = document.styleSheets[0]) {
	const insertToRule = (styleSheet: any) => {
		styleSheet.insertRule(styleSheetStr, "styleSheet" in styleSheet ? styleSheet.cssRules.length : styleSheet.rules.length);
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

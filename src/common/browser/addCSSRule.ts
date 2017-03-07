export default function addCSSRule(styleSheetStr: string | string[], styleSheet = document.styleSheets[0]) {
	const insertToRule = (styleSheet: any) => {
		try {
			if (Array.isArray(styleSheetStr)) {
				styleSheetStr.forEach(str => {
					styleSheet.insertRule(str, 0);
				});
			} else {
				styleSheet.insertRule(styleSheetStr, 0);
			}
		} catch (e) {};
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

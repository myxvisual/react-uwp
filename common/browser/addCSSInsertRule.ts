// import vendors from "./vendors";

interface StyleSheet {
	insertRule: any;
}
export default function addCSSInsertRule(styleSheetStr: string, styleSheet = document.stylesheets[0]) {
	// const insertaToRule = (styleSheet: StyleSheet) => { styleSheet.insertRule(styleSheetStr, styleSheet.cssRules.length); };
	if (!styleSheet) {
		const { head, createElement } = document;
		const link = createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		styleSheet = link.sheet;
		// insertaToRule(styleSheet);
		head.appendChild(link);
	} else {
		// insertaToRule(styleSheet);
	}
}

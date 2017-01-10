export default function setStyleToElement(elm: HTMLElement, style: React.CSSProperties, setToCSSText = true) {
	let cssText = "";
	for (const property in style) {
		if (setToCSSText) {
			cssText += `${property}: ${style[property]};`;
		} else {
			elm.style[property as any] = style[property];
		}
	}
	if (setToCSSText) elm.style.cssText = cssText;
};

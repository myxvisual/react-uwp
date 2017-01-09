export default function setStyleToElement(elm: HTMLElement, style: React.CSSProperties) {
	for (const property in style) {
		elm.style[property as any] = style[property];
	}
};

export default function setStyleToElement<T>(elm: HTMLElement| EventTarget & T, style: React.CSSProperties) {
	for (const styleName in style) {
		elm[styleName] = style[styleName];
	}
};

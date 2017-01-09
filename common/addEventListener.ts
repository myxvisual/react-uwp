export default function addEventListener<T>(elm: HTMLElement, event: string, func = () => {}) {
	if (elm.addEventListener) {
		elm.addEventListener(event, func, false);
	} else if (elm.attachEvent) {
		elm.attachEvent(`on${event}`, func);
	}
};

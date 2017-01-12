import vendors from "./vendors";

let requestAnimationFrame = window.requestAnimationFrame;

if (!requestAnimationFrame) {
	for (const vendor of vendors) {
		if (window[`${vendor}RequestAnimationFrame`]) {
			requestAnimationFrame = window[`${vendor}RequestAnimationFrame`];
			break;
		}
	}
}

export default requestAnimationFrame = requestAnimationFrame || ((callback: FrameRequestCallback) => {
	return window.setTimeout(callback, 1000 / 60);
});

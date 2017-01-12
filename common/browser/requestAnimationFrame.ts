import vendors from "./vendors";

let requestAnimationFrame = window.requestAnimationFrame;

if (!requestAnimationFrame) {
	for (const vendor of vendors) {
		const requestAnimationFrameName = `${vendor}RequestAnimationFrame`;
		if (window[requestAnimationFrameName]) {
			requestAnimationFrame = window[requestAnimationFrameName];
			break;
		}
	}
}

export default requestAnimationFrame = requestAnimationFrame || ((callback: FrameRequestCallback) => {
	return window.setTimeout(callback, 1000 / 60);
});

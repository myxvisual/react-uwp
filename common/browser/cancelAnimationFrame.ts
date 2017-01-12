import vendors from "./vendors";

let cancelAnimationFrame = window.cancelAnimationFrame;

if (!cancelAnimationFrame) {
	for (const vendor of vendors) {
		if (window[`${vendor}CancelAnimationFrame`]) {
			cancelAnimationFrame = window[`${vendor}CancelAnimationFrame`];
			break;
		}
	}
}

cancelAnimationFrame = cancelAnimationFrame || ((id: number) => {
	clearTimeout(id);
});

export default cancelAnimationFrame;

interface Window {
	mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
	msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
}

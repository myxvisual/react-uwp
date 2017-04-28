interface Window {
  mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  mozCancelAnimationFrame(handle: number): void;
  [key: string]: any;
}

interface HTMLElement {
  attachEvent: (type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean) => void;
}

interface StyleSheet {
  cssRules: CSSRuleList;
}

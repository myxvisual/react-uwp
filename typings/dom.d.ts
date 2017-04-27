export interface Window {
  mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  mozCancelAnimationFrame(handle: number): void;
  [key: string]: any;
}

export interface HTMLElement {
  attachEvent: (type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean) => void;
}

export interface StyleSheet {
  cssRules: CSSRuleList;
}

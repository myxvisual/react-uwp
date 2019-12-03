import { Throttle, frameMS, getNow } from "./Throttle";

export function setRequestAnimationFrame() {
  let vendors = ["ms", "moz", "webkit", "o"];
  for (const vendor of vendors) {
    if (window.requestAnimationFrame) break;
    window.requestAnimationFrame = window[`${vendor}RequestAnimationFrame`];
    window.cancelAnimationFrame = window[`${vendor}CancelAnimationFrame`] || window[`${vendor}CancelRequestAnimationFrame`];
  }

  let lastTime = 0;
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback: FrameRequestCallback) {
      let now = getNow();
      const timeToCall = Math.max(0, frameMS - (now - lastTime));
      const id: number = window.setTimeout(function() {
        callback(now + timeToCall);
      }, timeToCall);
      lastTime = now + timeToCall;
      return id;
    } as any;
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id: number) {
      clearTimeout(id);
    };
  }
}

import * as easings from "../common/easing";

const oldWindow: any = window;
const requestAnimationFrame = (
  oldWindow.requestAnimationFrame ||
  oldWindow.webkitRequestAnimationFrame ||
  oldWindow.mozRequestAnimationFrame ||
  oldWindow.msRequestAnimationFrame ||
  ((callback: FrameRequestCallback) => oldWindow.setTimeout(callback, 1000 / 60))
);

export default function animation(
  speed = 1,
  originValue = 0,
  changeValue = 1,
  easing = easings.linear,
  animateFunc = (currentValue: number) => {},
  delay = 0,
  loop = false,
  loopDelay = 0,
  callback = () => {}
) {
  let currentTime = 0;
  const time = Math.abs(changeValue - originValue) / speed;
  const tick = () => {
    currentTime += 1 / 60;
    const p = currentTime / time;
    const t = easing(p);
    const nextValue = originValue + ((changeValue - originValue) * t);
    if (p < 1) {
      animateFunc(nextValue);
      requestAnimationFrame(tick);
    } else {
      animateFunc(changeValue);
      if (loop) {
        currentTime = 0;
        setTimeout(() => {
          animateFunc(nextValue);
          requestAnimationFrame(tick);
        }, loopDelay);
      }
      callback();
    }
  };
  setTimeout(() => {
    tick();
  }, delay);
}

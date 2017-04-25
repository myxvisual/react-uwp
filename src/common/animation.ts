import * as easings from "../common/easing";

const requestAnimationFrame = (
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  ((callback: FrameRequestCallback) => window.setTimeout(callback, 1000 / 60))
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
    const nextVlue = originValue + ((changeValue - originValue) * t);
    if (p < 1) {
      animateFunc(nextVlue);
      requestAnimationFrame(tick);
    } else {
      animateFunc(changeValue);
      if (loop) {
        currentTime = 0;
        setTimeout(() => {
          animateFunc(nextVlue);
          requestAnimationFrame(tick);
        }, loopDelay);
      }
      callback();
    }
  };
  setTimeout(() => {
    tick();
  }, delay);
};

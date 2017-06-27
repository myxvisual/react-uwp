// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/

import IS_NODE_ENV from "../nodeJS/IS_NODE_ENV";

let requestAnimationFrame: (callback: FrameRequestCallback) => any;
if (IS_NODE_ENV) {
  requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(callback, 1000 / 60);
} else {
  const oldWindow: any = window;
  requestAnimationFrame = (
    oldWindow.requestAnimationFrame ||
    oldWindow.webkitRequestAnimationFrame ||
    oldWindow.mozRequestAnimationFrame ||
    oldWindow.msRequestAnimationFrame ||
    ((callback: FrameRequestCallback) => setTimeout(callback, 1000 / 60))
  );
}

const easingEquations = {
  easeOutSine: (pos: number) =>  Math.sin(pos * (Math.PI / 2)),
  easeInOutSine: (pos: number) => (-0.5 * (Math.cos(Math.PI * pos) - 1)),
  easeInOutQuint: (pos: number) => ((pos /= 0.5) < 1
    ? 0.5 * Math.pow(pos, 5)
    : 0.5 * (Math.pow((pos - 2), 5) + 2)
  )
};

const scrollToY = (
  targetElement: HTMLElement = null,
  scrollTargetY = 0,
  speed = 2000,
  easing: "easeOutSine" | "easeInOutSine" | "easeInOutQuint" = "easeOutSine",
  callback = (() => {})
) => {
  let scrollY = window.scrollY;
  let currentTime = 0;
  const time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));

  if (targetElement) {
    scrollY = targetElement.scrollTop;
  }

  const scrollToFunc = (top: number) => {
    if (targetElement) {
      targetElement.scrollTop = top;
    } else {
      window.scrollTo(0, top);
    }
  };

  function tick() {
    currentTime += 1 / 60;
    let flag = 0;
    const p = currentTime / time;
    const t = easingEquations[easing](p);
    if (p < 1) {
      scrollToFunc(scrollY + ((scrollTargetY - scrollY) * t));
      requestAnimationFrame(tick);
    } else {
      scrollToFunc(scrollTargetY);
      flag = 1;
    }
    callback();
  }
  tick();
};

export default scrollToY;

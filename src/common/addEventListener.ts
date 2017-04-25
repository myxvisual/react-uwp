export default function addEventListener<T>(elm: HTMLElement, event: string, func = () => {}) {
  if ("addEventListener" in elm) {
    elm.addEventListener(event, func, false);
  } else if ("attachEvent" in elm) {
    elm.attachEvent(`on${event}`, func);
  }
};

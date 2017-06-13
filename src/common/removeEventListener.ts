export default function removeEventListener<T>(elm: any, event: string, func = () => {}) {
  if (elm.removeEventListener) {
    elm.removeEventListener(event, func);
  } else if (elm.detachEvent) {
    elm.detachEvent(`on${event}`, func);
  }
}

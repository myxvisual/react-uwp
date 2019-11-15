import removeEventListener from "./removeEventListener";

export default function removeArrayEvent<T>(elm: HTMLElement & T, events?: string[], func = () => {}) {
  for (const event of events) {
    removeEventListener(elm, event, func);
  }
}

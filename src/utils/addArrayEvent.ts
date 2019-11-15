import addEventListener from "./addEventListener";

export default function addArrayEvent<T>(elm: HTMLElement & T, events?: string[], func = () => {}) {
  for (const event of events) {
    addEventListener(elm, event, func);
  }
}

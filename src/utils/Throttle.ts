export const frameMS = Math.floor(1000 / 120);

export function getNow() {
  if ("performance" in window) {
    return performance.now();
  } else {
    return Date.now();
  }
}

export interface ThrottleProps {
  timeMS?: number;
}

export class Throttle {
  prevRuntime = getNow();
  timeMS = frameMS;

  constructor(props?: ThrottleProps) {
    if (props) {
      const { timeMS } = props;
      if (timeMS !== void 0) this.timeMS = timeMS;
    }
  }

  shouldFunctionRun() {
    const now = getNow();
    if (now - this.prevRuntime < frameMS) {
      return false;
    } else {
      this.prevRuntime = now;
      return true;
    }
  }
}

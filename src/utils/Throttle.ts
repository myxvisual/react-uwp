export const frameMS = Math.floor(1000 / 48);

export function getNow() {
  if ("performance" in window) {
    return performance.now();
  } else {
    return Date.now();
  }
}

export interface ThrottleProps {
  timeMS?: number;
  runFunc?: Function;
}

export class Throttle {
  prevRuntime = getNow();
  timeMS = frameMS;
  enableRunFunc = false;
  runFunc: Function;
  remainTime: number = 0;

  constructor(props?: ThrottleProps) {
    if (props) {
      const { timeMS } = props;
      if (timeMS !== void 0) this.timeMS = timeMS;
      if (props.runFunc) {
        this.enableRunFunc = true;
        this.runFunc = props.runFunc;
      }
    }
  }

  shouldFunctionRun = () => {
    const now = getNow();
    const remainTime = now - this.prevRuntime;
    this.remainTime = remainTime;
    if (remainTime < frameMS) {
      return false;
    } else {
      this.prevRuntime = now;
      return true;
    }
  }

  runOnceTime: any = null;
  runOnceByThrotlle = (method: Function) => {
    clearTimeout(this.runOnceTime);
    const shouldRun = this.shouldFunctionRun();
    if (shouldRun) {
      method();
    } else {
      this.runOnceTime = setTimeout(method, this.remainTime);
    }
  }

  runTimer: any = null;
  startRunFunc = () => {
    this.enableRunFunc = true;
    clearTimeout(this.runTimer);
    if (!this.enableRunFunc) return;
    this.runFunc();
    const shouldRun = this.shouldFunctionRun();
    if (shouldRun) {
      this.startRunFunc();
    } else {
      this.runTimer = setTimeout(this.startRunFunc, this.remainTime);
    }
  }

  endRunFunc = () => {
    clearTimeout(this.runTimer);
    this.enableRunFunc = false;
  }
}

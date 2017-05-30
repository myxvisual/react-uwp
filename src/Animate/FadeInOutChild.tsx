import * as React from "react";

export interface DataProps {
  appearAnimate?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  maxValue?: number;
  minValue?: number;
  mode?: "in" | "out" | "both";
  speed?: number;
}
export interface FadeInOutChildProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export default class FadeInOutChild extends React.Component<FadeInOutChildProps, {}> {
  static defaultProps = {
    appearAnimate: true,
    enterDelay: 0,
    leaveDelay: 0,
    maxValue: 1,
    minValue: 0,
    mode: "both",
    speed: 500
  };

  enterTimer: any;
  leaveTimer: any;
  rootElm: HTMLSpanElement;

  componentWillAppear = this.props.appearAnimate ? (callback: () => void) => {
    if (this.props.mode !== "out") {
      this.initializeAnimation(callback);
    } else { callback(); }
  } : void 0;

  componentDidAppear = this.props.appearAnimate ? () => {
    if (this.props.mode !== "out") {
      this.enterTimer = setTimeout(() => {
        this.animate();
      }, this.props.enterDelay);
    }
  } : void 0;

  componentWillEnter(callback: () => void) {
    if (this.props.mode !== "out") {
      const display = this.rootElm.style.display;
      this.rootElm.style.display = "none";

      this.enterTimer = setTimeout(() => {
        this.rootElm.style.display = display;
        this.initializeAnimation(callback);
      }, this.props.speed * 2 + this.props.enterDelay);
    } else {
      callback();
    }
  }

  componentDidEnter() {
    if (this.props.mode !== "out") this.animate();
  }

  componentWillLeave(callback: () => void) {
    if (this.props.mode !== "in") {
      this.initializeAnimation(callback, true);
    } else {
      callback();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.enterTimer);
    clearTimeout(this.leaveTimer);
  }

  animate = (callback = () => {}) => {
    const { speed, maxValue, enterDelay } = this.props;
    const { style } = this.rootElm;

    Object.assign(this.rootElm.style, {
      opacity: `${maxValue}`
    } as CSSStyleDeclaration);

    this.enterTimer = setTimeout(callback, speed + enterDelay);
  }

  initializeAnimation = (callback = () => {}, revers = false) => {
    const { minValue, speed, leaveDelay } = this.props;
    const { style } = this.rootElm;

    Object.assign(this.rootElm.style, {
      opacity: `${minValue}`
    } as CSSStyleDeclaration);

    this.leaveTimer = setTimeout(callback, speed / 2 + leaveDelay);
  }

  render() {
    const {
      appearAnimate, // tslint:disable-line:no-unused-variable
      children,
      enterDelay, // tslint:disable-line:no-unused-variable
      leaveDelay, // tslint:disable-line:no-unused-variable
      maxValue, // tslint:disable-line:no-unused-variable
      minValue, // tslint:disable-line:no-unused-variable
      speed,
      style,
      mode,
      ...attributes
    } = this.props;

    return typeof children !== "object" ? (
      <span
        {...attributes}
        ref={rootElm => this.rootElm = rootElm}
        style={{
          transition: `all ${speed}ms ease-in-out`,
          ...style
        }}
      >
        {children}
      </span>
    ) : React.cloneElement(children as any, {
      style: {
        transition: `all ${speed}ms ease-in-out`,
        ...(children as any).props.style
      },
      ref: (rootElm: any) => this.rootElm = rootElm
    });
  }
}

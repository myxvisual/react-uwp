import * as React from "react";

export interface DataProps {
  appearAnimate?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  maxScale?: number;
  minScale?: number;
  mode?: "in" | "out" | "both";
  speed?: number;
}
export interface ScaleInOutChildProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export default class ScaleInOutChild extends React.Component<ScaleInOutChildProps, {}> {
  static defaultProps = {
    appearAnimate: true,
    enterDelay: 0,
    leaveDelay: 0,
    maxScale: 1,
    minScale: 0,
    mode: "Both",
    speed: 250
  };

  enterTimer: any;
  leaveTimer: any;
  rootElm: HTMLDivElement;

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
      }, this.props.speed + this.props.enterDelay);
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
    const { speed, maxScale, enterDelay } = this.props;
    const { style } = this.rootElm;
    const transform = `scale(${maxScale})`;
    Object.assign(style, {
      transform,
      webkitTransform: transform,
      opacity: "1"
    } as CSSStyleDeclaration);

    this.enterTimer = setTimeout(callback, speed + enterDelay) as any;
  }

  initializeAnimation = (callback = () => {}, revers = false) => {
    const { minScale, speed, leaveDelay } = this.props;
    const transform = `scale(${minScale})`;
    Object.assign(this.rootElm.style, {
      transform,
      webkitTransform: transform,
      opacity: "0"
    } as CSSStyleDeclaration);

    this.leaveTimer = setTimeout(callback, speed + leaveDelay) as any;
  }

  render() {
    const {
      appearAnimate,
      children,
      enterDelay,
      leaveDelay,
      maxScale,
      minScale,
      speed,
      style,
      mode,
      ...attributes
    } = this.props;

    return (
      <div
        {...attributes}
        ref={(rootElm) => this.rootElm = rootElm}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transition: `all ${speed}ms ease-in-out`,
          ...style
        }}
      >
        {children}
      </div>
    );
  }
}

import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  appearAnimate?: boolean;
  childAttributes?: React.HTMLAttributes<HTMLDivElement>;
  enterDelay?: number;
  leaveDelay?: number;
  maxValue?: number;
  minValue?: number;
  mode?: "in" | "out" | "both";
  speed?: number;
}

export interface CustomAnimateChildProps extends DataProps {
  [key: string]: any;
}


export default class CustomAnimateChild extends React.Component<CustomAnimateChildProps, void> {
  static defaultProps = {
    appearAnimate: true,
    enterDelay: 0,
    leaveDelay: 0,
    mode: "both",
    speed: 500
  };

  enterTimer: any;
  leaveTimer: any;
  displayStyleTimer: any;
  rootElm: HTMLSpanElement;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

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
      this.displayStyleTimer = setTimeout(() => {
        this.rootElm.style.display = display;
        this.initializeAnimation();
      }, this.props.speed + this.props.enterDelay);
      this.enterTimer = setTimeout(callback, this.props.speed * 2 + this.props.enterDelay);
    } else {
      callback();
    }
  }

  componentDidEnter() {
    if (this.props.mode !== "out") this.animate();
  }

  componentWillLeave(callback: () => void) {
    if (this.props.mode !== "in") {
      this.initializeAnimation();
      this.leaveTimer = setTimeout(() => {
        callback();
      }, this.props.speed + this.props.leaveDelay);
    } else {
      callback();
    }
  }

  componentDidLeave() {
    if (this.props.mode !== "in") {
      this.initializeAnimation();
      this.leaveTimer = setTimeout(() => {
      }, this.props.speed + this.props.leaveDelay);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.enterTimer);
    clearTimeout(this.leaveTimer);
    clearTimeout(this.displayStyleTimer);
  }

  animate = (callback = () => {}) => {
    const { speed, maxValue, enterDelay, animateStyle } = this.props;
    const { style } = this.rootElm;

    Object.assign(this.rootElm.style, animateStyle);

    this.enterTimer = setTimeout(callback, speed + enterDelay);
  }

  initializeAnimation = (callback = () => {}, revers = false) => {
    const { minValue, speed, leaveDelay, style } = this.props;

    Object.assign(this.rootElm.style, style);
    callback();
  }

  render() {
    const {
      appearAnimate,
      children,
      enterDelay,
      leaveDelay,
      mode,
      speed,
      style,
      animateStyle,
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

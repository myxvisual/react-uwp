import * as React from "react";
import * as PropTypes from "prop-types";

import { DataProps } from "./CustomAnimate";

export default class CustomAnimateChild extends React.Component<DataProps, void> {
  enterTimer: any;
  leaveTimer: any;
  leaveCallback = () => {};
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
    const { mode, speed, enterDelay } = this.props;
    clearTimeout(this.leaveTimer);
    if (mode !== "out") {
      const isInOut = mode === "in-out";
      const { style } = this.rootElm;
      const { display } = style;
      style.display = "none";
      this.initializeAnimation();
      this.displayStyleTimer = setTimeout(() => {
        style.display = display;
      }, speed / 2 + enterDelay);
      this.enterTimer = setTimeout(() => {
        style.display = display;
        this.animate();
        callback();
      }, speed + enterDelay);
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
      this.leaveCallback = callback;
      this.leaveTimer = setTimeout(() => {
        this.rootElm.style.display = "none";
        this.leaveCallback();
      }, this.props.speed + this.props.leaveDelay);
    } else {
      callback();
    }
  }

  componentDidLeave() {
    if (this.props.mode !== "in") {
      this.initializeAnimation();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.enterTimer);
    clearTimeout(this.leaveTimer);
    clearTimeout(this.displayStyleTimer);
  }

  animate = (callback = () => {}) => {
    const { speed, enterDelay, animatedStyle, animate } = this.props;
    const isControlledAnimate = typeof animate === "boolean";
    if (isControlledAnimate) {
      callback();
      return;
    }
    const { style } = this.rootElm;

    Object.assign(this.rootElm.style, this.context.theme.prepareStyles(animatedStyle));

    this.enterTimer = setTimeout(callback, speed + enterDelay);
  }

  initializeAnimation = (callback = () => {}, revers = false) => {
    const { speed, leaveDelay, style, animate } = this.props;
    const isControlledAnimate = typeof animate === "boolean";
    if (isControlledAnimate) {
      callback();
      return;
    }

    Object.assign(this.rootElm.style, this.context.theme.prepareStyles(style));
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
      animatedStyle,
      animate,
      transitionTimingFunction,
      ...attributes
    } = this.props;
    const isControlledAnimate = typeof animate === "boolean";
    const currStyle = {
      transition: `all ${speed}ms${transitionTimingFunction ? ` ${transitionTimingFunction}` : ""}`,
      ...(children as any).props.style,
      ...(isControlledAnimate ? this.props[animate ? "animatedStyle" : "style"] : void 0)
    };

    return typeof children !== "object" ? (
      <span
        {...attributes}
        ref={rootElm => this.rootElm = rootElm}
        style={currStyle}
      >
        {children}
      </span>
    ) : React.cloneElement(children as any, {
      style: this.context.theme.prepareStyles(currStyle),
      ref: (rootElm: any) => this.rootElm = rootElm
    });
  }
}

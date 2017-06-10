import * as React from "react";
import * as PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

import { DataProps } from "./CustomAnimate";

export default class CustomAnimateChild extends React.Component<DataProps, void> {
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
    const { mode, speed, enterDelay } = this.props;
    clearTimeout(this.leaveTimer);
    const { style } = this.rootElm;
    const { display } = style;
    style.display = "none";
    this.displayStyleTimer = setTimeout(() => {
      style.display = display;
    }, (mode === "in" ? 0 : speed) + enterDelay);

    if (mode === "out") {
      this.enterTimer = setTimeout(() => {
        this.animate();
        callback();
      }, speed);
      return;
    }

    this.initializeAnimation();

    this.enterTimer = setTimeout(() => {
      style.display = display;
      this.animate();
      callback();
    }, mode === "in" ? 40 + enterDelay : speed + 40 + enterDelay);
  }

  componentWillLeave(callback: () => void) {
    if (this.props.mode !== "in") {
      this.initializeAnimation();
      this.leaveTimer = setTimeout(() => {
        this.rootElm.style.display = "none";
        callback();
      }, this.props.speed + this.props.leaveDelay);
    } else {
      this.rootElm.style.display = "none";
      callback();
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

    const style = this.getElmOrComponentStyle(this.rootElm);

    Object.assign(style, this.context.theme.prepareStyles(animatedStyle));

    this.enterTimer = setTimeout(callback, speed + enterDelay);
  }

  initializeAnimation = (callback = () => {}, revers = false) => {
    const { speed, leaveDelay, animate } = this.props;
    const isControlledAnimate = typeof animate === "boolean";
    if (isControlledAnimate) {
      callback();
      return;
    }

    const style = this.getElmOrComponentStyle(this.rootElm);

    Object.assign(style, this.context.theme.prepareStyles(this.props.style));
    callback();
  }

  getElmOrComponentStyle = (rootElm: any): any => {
    let { style } = rootElm;
    if (style) {
      return style;
    } else {
      rootElm = findDOMNode(rootElm) as any;
      style = rootElm.style;
      if (style) {
        return style;
      } else if (rootElm) {
        return this.getElmOrComponentStyle(rootElm);
      } else {
        return {};
      }
    }
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
      ...style,
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

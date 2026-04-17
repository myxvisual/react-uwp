import * as React from "react";
import * as PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

import { DataProps } from "./CustomAnimate";

export default class CustomAnimateChild extends React.Component<DataProps> {
  enterTimer: any;
  leaveTimer: any;
  displayStyleTimer: any;
  rootElm: HTMLSpanElement;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillAppear = this.props.appearAnimate ? (callback: () => void) => {
    if (this.props.mode !== "out") {
      this.setLeaveStyle(callback);
    } else { callback(); }
  } : void 0;

  componentDidAppear = this.props.appearAnimate ? () => {
    if (this.props.mode !== "out") {
      this.enterTimer = setTimeout(() => {
        this.setEnterStyle();
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
        this.setEnterStyle();
        callback();
      }, speed);
      return;
    }

    this.setLeaveStyle();

    this.enterTimer = setTimeout(() => {
      style.display = display;
      this.setEnterStyle();
      callback();
    }, mode === "in" ? 40 + enterDelay : speed + 40 + enterDelay);
  }

  componentWillLeave(callback: () => void) {
    if (this.props.mode !== "in") {
      this.setLeaveStyle();
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

  setEnterStyle = (callback = () => {}) => {
    const { speed, enterDelay, enterStyle } = this.props;

    const style = this.getRootElmOrComponentStyle(this.rootElm);

    Object.assign(style, this.context.theme.prefixStyle(enterStyle));

    this.enterTimer = setTimeout(callback, speed + enterDelay);
  }

  setLeaveStyle = (callback = () => {}, revers = false) => {
    const { speed, leaveDelay } = this.props;

    const style = this.getRootElmOrComponentStyle(this.rootElm);

    Object.assign(style, this.context.theme.prefixStyle(this.props.leaveStyle));
    callback();
  }

  getRootElmOrComponentStyle = (rootElm: any): any => {
    let { style } = rootElm;
    if (style) {
      return style;
    } else {
      rootElm = findDOMNode(rootElm) as any;
      style = rootElm.style;
      if (style) {
        return style;
      } else if (rootElm) {
        return this.getRootElmOrComponentStyle(rootElm);
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
      leaveStyle,
      enterStyle,
      transitionTimingFunction,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const currStyle = theme.prefixStyle({
      transition: `all ${speed}ms${transitionTimingFunction ? ` ${transitionTimingFunction}` : ""}`,
      ...style,
      ...(children as any).props.style,
      ...(appearAnimate ? leaveStyle : Object.assign({}, leaveStyle, enterStyle))
    });

    return typeof children !== "object" ? (
      <span
        {...attributes}
        ref={rootElm => this.rootElm = rootElm}
        style={currStyle}
      >
        {children}
      </span>
    ) : React.cloneElement(children as any, {
      style: currStyle,
      ref: (rootElm: any) => this.rootElm = rootElm
    });
  }
}

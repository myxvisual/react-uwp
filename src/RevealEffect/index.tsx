import * as React from "react";
import * as PropTypes from "prop-types";
import { drawRectAtRange, createRadialGradient } from "./helper";
import { Throttle } from "../utils/Throttle";
import * as tinyColor from "tinycolor2";

export function updateCanvasRect(borderCanvasEl: HTMLCanvasElement) {
  const hoverCanvasEl = borderCanvasEl.previousElementSibling as HTMLCanvasElement;
  const parentEl = borderCanvasEl.parentElement as HTMLElement;
  if (!parentEl) return;
  const style = window.getComputedStyle(parentEl);
  const {
      borderTopWidth,
      borderLeftWidth,
      width,
      height
  } = style;

  const btWidth = Number.parseFloat(borderTopWidth);
  const blWidth = Number.parseFloat(borderLeftWidth);
  const elWidth = Number.parseFloat(width);
  const elHeight = Number.parseFloat(height);

  if (borderCanvasEl.width !== elWidth) borderCanvasEl.width = elWidth;
  if (borderCanvasEl.height !== elHeight) borderCanvasEl.height = elHeight;
  if (hoverCanvasEl.width !== elWidth) hoverCanvasEl.width = elWidth;
  if (hoverCanvasEl.height !== elHeight) hoverCanvasEl.height = elHeight;

  const currStyle = {
    left: blWidth ? `-${blWidth / 2}px` : "0px",
    top: btWidth ? `-${btWidth / 2}px` : "0px",
    width,
    height
  } as CSSStyleDeclaration;

  for (let key in currStyle) {
    const value = currStyle[key];
    if (borderCanvasEl.style[key] !== value) {
      borderCanvasEl.style[key] = value;
    }
    if (hoverCanvasEl.style[key] !== value) {
      hoverCanvasEl.style[key] = value;
    }
  }
}

export interface DataProps {
  /** Set effectEnable type, default is both. */
  effectEnable?: "hover" | "border" | "both";
  /** Set hover size. */
  hoverSize?: number;
  /** Set hoverColor. */
  hoverColor?: string;
  /** Set hover borderWidth. */
  borderWidth?: number;
  /** Set borderColor. */
  borderColor?: string;
}

export interface RevealEffectProps extends DataProps, React.HTMLAttributes<HTMLCanvasElement> {}
export class RevealEffect extends React.Component<RevealEffectProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  parentEl: HTMLElement;
  currPosition = {
    clientX: 0,
    clientY: 0
  };
  hoverCanvasEl: HTMLCanvasElement;
  borderCanvasEl: HTMLCanvasElement;

  componentDidMount() {
    this.updateDOMNode();
  }

  componentDidUpdate() {
    this.updateDOMNode();
  }

  componentWillUnmount() {
    this.removeDOMNode();
  }

  updateDOMNode() {
    const { theme } = this.context;
    const {
      effectEnable,
      hoverSize,
      hoverColor,
      borderWidth,
      borderColor
    } = this.props;
    const currRevealConfig = theme.getRevealConfig(theme.revealConfig, {
      borderWidth,
      hoverSize,
      effectEnable,
      hoverColor,
      borderColor
    });
    theme.revealEffectMap.set(this.borderCanvasEl, currRevealConfig);

    this.parentEl = this.borderCanvasEl.parentElement;
    if (this.parentEl && effectEnable !== "border") {
      this.parentEl.addEventListener("mouseenter", this.drawHoverEffect, true);
      this.parentEl.addEventListener("mousemove", this.drawHoverEffect, true);
      this.parentEl.addEventListener("mouseleave", this.cleanHoverEffect, true);
    }
  }

  hoverCtx: CanvasRenderingContext2D;
  drawHoverThrottle = new Throttle();
  drawHoverEffect = (e?: MouseEvent) => {
    if (!this.drawHoverThrottle.shouldFunctionRun()) return;

    updateCanvasRect(this.borderCanvasEl);
    const { offsetX, offsetY } = e;
    const { theme } = this.context;
    const {
      hoverSize,
      hoverColor,
      effectEnable
    } = theme.revealEffectMap.get(this.borderCanvasEl);
    theme.currHoverSize = hoverSize;

    if (!this.hoverCtx) {
      this.hoverCtx = this.hoverCanvasEl.getContext("2d");
    }
    this.hoverCtx.clearRect(0, 0, this.hoverCanvasEl.width, this.hoverCanvasEl.height);

    const hslaStr = tinyColor(hoverColor).toHslString();
    let hoverGradient = theme.hoverGradientMap.get(hslaStr);
    if (!hoverGradient) {
      const { gradient } = createRadialGradient(this.hoverCtx, hoverColor);
      hoverGradient = gradient;
      theme.hoverGradientMap.set(hslaStr, gradient);
    }
    drawRectAtRange(this.hoverCtx, {
      x: offsetX,
      y: offsetY,
      scale: 1,
      size: hoverSize * 2
    }, hoverGradient);
  }

  cleanHoverEffect = (e?: MouseEvent) => {
    this.context.theme.currHoverSize = void 0;
    const hoverCtx = this.hoverCanvasEl.getContext("2d");
    hoverCtx.clearRect(0, 0, this.hoverCanvasEl.width, this.hoverCanvasEl.height);
  }

  removeDOMNode() {
    this.context.theme.revealEffectMap.delete(this.borderCanvasEl);
    if (this.parentEl) {
      this.parentEl.removeEventListener("mouseenter", this.drawHoverEffect, true);
      this.parentEl.removeEventListener("mousemove", this.drawHoverEffect, true);
      this.parentEl.removeEventListener("mouseleave", this.cleanHoverEffect, true);
    }
  }

  render() {
    const {
      borderWidth,
      hoverSize,
      effectEnable,
      hoverColor,
      borderColor,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const classes = theme.prepareStyles({
      styles,
      className: "reveal-effect"
    });

    return (
      <React.Fragment>
        <canvas
          width={0}
          height={0}
          ref={hoverCanvas => this.hoverCanvasEl = hoverCanvas}
          {...attributes}
          {...classes.root}
        />
        <canvas
          width={0}
          height={0}
          ref={borderCanvas => this.borderCanvasEl = borderCanvas}
          {...attributes}
          {...classes.root}
        />
      </React.Fragment>
    );
  }
}

function getStyles(RevealEffect: RevealEffect) {
  const {
    context: { theme },
    props: { style }
  } = RevealEffect;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      background: "none",
      position: "absolute",
      pointerEvents: "none",
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      ...style
    })
  };
}

export default RevealEffect;

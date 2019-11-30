import * as React from "react";
import * as PropTypes from "prop-types";
import * as tinyColor from "tinycolor2";
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';
import { drawRectAtRange, createRadialGradient, drawBorder, drawHover } from "./helper";
import { drawGlobalEffects } from "./GlobalRevealStore";
import { Throttle, frameMS } from "../utils/Throttle";

const ResizeObserver: typeof ResizeObserverPolyfill = window["ResizeObserver"] || ResizeObserverPolyfill;

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

  const btWidth = Number.parseInt(borderTopWidth);
  const blWidth = Number.parseInt(borderLeftWidth);
  const elWidth = Number.parseInt(width);
  const elHeight = Number.parseInt(height);

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
  effectEnable?: "hover" | "border" | "both" | "disabled";
  /** Set hover size. */
  hoverSize?: number;
  /** Set hoverColor. */
  hoverColor?: string;
  /** Set hover borderWidth. */
  borderWidth?: number;
  /** Set borderColor. */
  borderColor?: string;
  /** Set effect enable range. */
  effectRange?: "self" | "all";
}

export interface RevealEffectProps extends DataProps, React.HTMLAttributes<HTMLCanvasElement> {}
export class RevealEffect extends React.Component<RevealEffectProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  parentEl: HTMLElement;
  parentElRect: DOMRect;
  currPosition = {
    clientX: 0,
    clientY: 0
  };
  hoverCanvasEl: HTMLCanvasElement;
  borderCanvasEl: HTMLCanvasElement;
  resizeOb: ResizeObserverPolyfill;

  componentDidMount() {
    this.updateDOMNode();
  }

  componentDidUpdate() {
    this.updateDOMNode();
  }

  componentWillUnmount() {
    this.removeDOMNode();
  }

  resizeTimer: any = null;
  updateDOMNode() {
    const { theme } = this.context;
    const {
      effectEnable,
      hoverSize,
      hoverColor,
      borderWidth,
      borderColor,
      effectRange
    } = this.props;
    const currRevealConfig = theme.getRevealConfig(theme.revealConfig, {
      borderWidth,
      hoverSize,
      effectEnable,
      hoverColor,
      borderColor,
      effectRange
    });
    this.parentEl = this.borderCanvasEl.parentElement;
    const disabledHover = effectEnable === "border" || effectEnable === "disabled";
    if (this.parentEl && !disabledHover) {
      theme.revealEffectMap.set(this.borderCanvasEl, currRevealConfig);
      if (currRevealConfig.effectRange === "self") {
        theme.selfRangeRevealEffectMap.set(this.borderCanvasEl, currRevealConfig);
      }
      this.parentEl.addEventListener("click", this.drawEffect, false);
      this.parentEl.addEventListener("mouseenter", this.drawEffect, false);
      this.parentEl.addEventListener("mousemove", this.drawEffect, false);
      this.parentEl.addEventListener("mouseleave", this.cleanEffect, false);
    }
  }

  getGradient = (hslaStr: string) => {
    const { theme } = this.context;
    let cachedGradient = theme.reveaGradientMap.get(hslaStr);
    if (!cachedGradient) {
      const { gradient } = createRadialGradient(this.hoverCtx, hslaStr);
      cachedGradient = gradient;
      theme.reveaGradientMap.set(hslaStr, gradient);
    }

    return cachedGradient;
  }

  hoverCtx: CanvasRenderingContext2D;
  drawHoverThrottle = new Throttle();
  drawEffect = (e?: MouseEvent) => {
    if (!this.drawHoverThrottle.shouldFunctionRun()) return;

    updateCanvasRect(this.borderCanvasEl);
    const { clientX, clientY } = e;
    this.currPosition = { clientX, clientY };
    const { theme } = this.context;
    const revealConfig = theme.revealEffectMap.get(this.borderCanvasEl);
    if (!revealConfig) return;

    if (!this.resizeOb) {
      this.resizeOb = new ResizeObserver((entries, observer) => {
        entries.forEach(entry => {
          clearTimeout(this.resizeTimer);
          if (entry.target === this.parentEl) {
            this.resizeTimer = setTimeout(() => {
              this.updateDOMNode();
              this.drawEffect(this.currPosition as MouseEvent);
              drawGlobalEffects(e, theme);
            }, frameMS);
          }
        });
      });
      this.resizeOb.observe(this.parentEl);
    }

    const {
      hoverSize,
      hoverColor,
      borderWidth,
      borderColor,
      effectRange
    } = revealConfig;
    theme.currHoverSize = hoverSize;

    this.parentElRect = this.parentEl.getBoundingClientRect();
    const [x, y] = [clientX - this.parentElRect.x, clientY - this.parentElRect.y];
    if (!this.hoverCtx) {
      this.hoverCtx = this.hoverCanvasEl.getContext("2d");
    }
    this.hoverCtx.clearRect(0, 0, this.hoverCanvasEl.width, this.hoverCanvasEl.height);

    // draw self hover effect.
    const hslaStr = tinyColor(hoverColor).toHslString();
    const hoverGradient = this.getGradient(hslaStr);
    drawRectAtRange(this.hoverCtx, {
      x,
      y,
      scale: 1,
      size: hoverSize * 2
    }, hoverGradient);

    // draw self border effect.
    if (theme.selfRangeRevealEffectMap.size > 0 && effectRange === "self") {
      const hslaStr = tinyColor(borderColor).toHslString();
      const gradient = this.getGradient(hslaStr);
      drawBorder({
        borderCanvas: this.borderCanvasEl,
        hoverSize,
        borderWidth,
        gradient,
        x,
        y
      });
    }
  }

  cleanEffect = (e?: MouseEvent) => {
    this.context.theme.currHoverSize = void 0;
    const hoverCtx = this.hoverCanvasEl.getContext("2d");
    const borderCtx = this.borderCanvasEl.getContext("2d");
    hoverCtx.clearRect(0, 0, this.hoverCanvasEl.width, this.hoverCanvasEl.height);
    borderCtx.clearRect(0, 0, this.borderCanvasEl.width, this.borderCanvasEl.height);
    if (this.resizeOb) {
      this.resizeOb.disconnect();
      this.resizeOb = null;
    }
  }

  removeDOMNode() {
    if (this.resizeOb) {
      this.resizeOb.disconnect();
      this.resizeOb = null;
    }
    this.context.theme.revealEffectMap.delete(this.borderCanvasEl);
    if (this.parentEl) {
      this.parentEl.removeEventListener("click", this.drawEffect, false);
      this.parentEl.removeEventListener("mouseenter", this.drawEffect, false);
      this.parentEl.removeEventListener("mousemove", this.drawEffect, false);
      this.parentEl.removeEventListener("mouseleave", this.cleanEffect, false);
    }
  }

  render() {
    const {
      borderWidth,
      hoverSize,
      effectEnable,
      hoverColor,
      borderColor,
      effectRange,
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

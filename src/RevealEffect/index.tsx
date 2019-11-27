import * as React from "react";
import * as PropTypes from "prop-types";
import { drawRectAtRange, createRadialGradient, frameMS, getNow } from "./helper";
import * as tinyColor from "tinycolor2";

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
    theme.reveaEffectMap.set(this.borderCanvasEl, currRevealConfig);

    this.parentEl = this.borderCanvasEl.parentElement;
    if (this.parentEl) {
      const style = window.getComputedStyle(this.parentEl);
      const {
          borderTopWidth,
          borderLeftWidth,
          width,
          height
      } = style;
      this.borderCanvasEl.width = Number.parseFloat(width);
      this.borderCanvasEl.height = Number.parseFloat(height);
      this.hoverCanvasEl.width = Number.parseFloat(width);
      this.hoverCanvasEl.height = Number.parseFloat(height);

      Object.assign(this.borderCanvasEl.style, {
        left: `-${borderLeftWidth}`,
        top: `-${borderTopWidth}`,
        width,
        height
      } as CSSStyleDeclaration);
      Object.assign(this.hoverCanvasEl.style, {
        left: `-${borderLeftWidth}`,
        top: `-${borderTopWidth}`,
        width,
        height
      } as CSSStyleDeclaration);

      if (effectEnable === "border") return;
      this.parentEl.addEventListener("mouseenter", this.drawHoverEffect, true);
      this.parentEl.addEventListener("mousemove", this.drawHoverEffect, true);
      this.parentEl.addEventListener("mouseleave", this.cleanHoverEffect, true);
    }
  }

  hoverCtx: CanvasRenderingContext2D;
  hoverPrevDrawTime: number = getNow();
  drawHoverEffect = (e?: MouseEvent) => {
    const now = getNow();
    if (now - this.hoverPrevDrawTime < frameMS) {
      return;
    }
    this.hoverPrevDrawTime = now;
    const { offsetX, offsetY } = e;
    const { theme } = this.context;
    const {
      hoverSize,
      hoverColor,
      effectEnable
    } = theme.reveaEffectMap.get(this.borderCanvasEl);
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
    this.context.theme.reveaEffectMap.delete(this.borderCanvasEl);
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
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      ...style
    })
  };
}

export default RevealEffect;

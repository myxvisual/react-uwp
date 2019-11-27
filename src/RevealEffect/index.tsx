import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PropTypes from "prop-types";

export interface DataProps {
  /** Set hover borderWidth. */
  borderWidth?: number;
  /** Set hover size. */
  hoverSize?: number;
  /** Set effectEnable type, default is both. */
  effectEnable?: "hover" | "border" | "both";
  /** Set borderType, default is inside. */
  borderType?: "inside" | "outside";
  /** Set hoverColor. */
  hoverColor?: string;
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
    const {
      borderWidth,
      hoverSize,
      effectEnable,
      borderType,
      hoverColor,
      borderColor
    } = this.props;

    this.context.theme.borderRevealMap.set(this.borderCanvasEl, {
      borderWidth,
      hoverSize,
      effectEnable,
      borderType,
      borderColor
    });

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

      this.parentEl.addEventListener("mouseenter", this.renderHoverEffect, true);
      this.parentEl.addEventListener("mousemove", this.renderHoverEffect, true);
      this.parentEl.addEventListener("mouseleave", this.cleanHoverEffect, true);
    }
  }

  renderHoverEffect = (e?: MouseEvent) => {
    const { offsetX, offsetY } = e;
    const { theme } = this.context;
    // TODO: Add hoverSize
    this.hoverCanvasEl.style.background = `radial-gradient(100px at ${offsetX}px ${offsetY}px, ${theme.baseMediumLow}, ${theme.baseLow}, transparent)`;
  }

  cleanHoverEffect = (e?: MouseEvent) => {
    this.hoverCanvasEl.style.background = "none";
  }

  removeDOMNode() {
    this.context.theme.borderRevealMap.delete(this.borderCanvasEl);
    if (this.parentEl) {
      this.parentEl.removeEventListener("mouseenter", this.renderHoverEffect, true);
      this.parentEl.removeEventListener("mousemove", this.renderHoverEffect, true);
      this.parentEl.removeEventListener("mouseleave", this.cleanHoverEffect, true);
    }
  }

  render() {
    const {
      borderWidth,
      hoverSize,
      effectEnable,
      borderType,
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

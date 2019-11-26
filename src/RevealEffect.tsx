import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface RevealEffectProps extends DataProps, React.HTMLAttributes<HTMLCanvasElement> {}

export class RevealEffect extends React.Component<RevealEffectProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  parentEl: HTMLElement;
  hoverCanvasEl: HTMLCanvasElement;
  borderCnavasEl: HTMLCanvasElement;

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
    this.parentEl = this.borderCnavasEl.parentElement;
    if (this.parentEl) {
      this.parentEl.addEventListener("mouseenter", this.renderHoverEffect);
      this.parentEl.addEventListener("mousemove", this.renderHoverEffect);
      this.parentEl.addEventListener("mouseleave", this.cleanHoverEffect);
    }
  }
  
  renderHoverEffect = (e?: MouseEvent) => {
    const { offsetX, offsetY } = e;
    const { theme } = this.context;
    this.hoverCanvasEl.style.background = `radial-gradient(100px at ${offsetX}px ${offsetY}px, ${theme.baseMediumLow}, ${theme.baseLow}, transparent)`;
  }
  
  cleanHoverEffect = (e?: MouseEvent) => {
    this.hoverCanvasEl.style.background = "none";
  }

  removeDOMNode() {
    if (this.parentEl) {
      this.parentEl.removeEventListener("mouseenter", this.renderHoverEffect);
      this.parentEl.removeEventListener("mousemove", this.renderHoverEffect);
      this.parentEl.removeEventListener("mouseleave", this.cleanHoverEffect);
    }
  }

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const classes = theme.prepareStyles({
      styles,
      className: "reveal-effect"
    });

    return (
      <React.Fragment>
        <canvas
          ref={borderCnavas => this.borderCnavasEl = borderCnavas}
          {...attributes}
          {...classes.root}
        />
        <canvas
          ref={hoverCanvas => this.hoverCanvasEl = hoverCanvas}
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
      width: "100%",
      height: "100%",
      transition: "background .25s 0s ease-in-out",
      ...style
    })
  };
}

export default RevealEffect;

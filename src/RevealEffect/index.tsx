import * as React from "react";
import * as PropTypes from "prop-types";

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
  effectRange?: "self" | "others" | "all";
  /** Observer resize event. */
  observerResize?: boolean;
  /** addLister observerTransition by propertyName. */
  observerTransition?: string | string[];
}

export interface RevealEffectProps extends DataProps, React.HTMLAttributes<HTMLCanvasElement> {
}
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
      borderColor,
      effectRange,
      observerResize,
      observerTransition
    } = this.props;
    const currRevealConfig = theme.getRevealConfig(theme.revealConfig, {
      borderWidth,
      hoverSize,
      effectEnable,
      hoverColor,
      borderColor,
      effectRange,
      observerResize,
      observerTransition
    });
    theme.addBorderCanvas(this.borderCanvasEl, currRevealConfig);
  }

  removeDOMNode() {
    this.context.theme.removeBorderCanvas(this.borderCanvasEl);
  }

  render() {
    const {
      borderWidth,
      hoverSize,
      effectEnable,
      hoverColor,
      borderColor,
      effectRange,
      observerResize,
      observerTransition,
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
      flex: "0 0 auto",
      display: "none",
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      ...style
    })
  };
}

export default RevealEffect;

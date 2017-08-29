import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  /**
   * Set Car perspective.
   */
  perspective?: string | number;
  /**
   * Set the x rotate max deg.
   */
  xMaxRotate?: number;
  /**
   * Set the y rotate max deg.
   */
  yMaxRotate?: number;
  /**
   * Set the default rotateX.
   */
  defaultRotateX?: number;
  /**
   * Set the default rotateY.
   */
  defaultRotateY?: number;
  /**
   * Set mouse leave transition speed.
   */
  leaveSpeed?: number;
  /**
   * Set mouse leave transition TimingFunction.
   */
  leaveTimingFunction?: string;
}

export interface TransformCardProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface TransformCardState {
  isEnter?: boolean;
}

export class TransformCard extends React.Component<TransformCardProps, TransformCardState> {
  static defaultProps: TransformCardProps = {
    perspective: 200,
    xMaxRotate: 15,
    yMaxRotate: 15,
    defaultRotateX: 0,
    defaultRotateY: 0,
    leaveSpeed: 750,
    leaveTimingFunction: ""
  };

  state: TransformCardState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  wrapperElm: HTMLDivElement;

  handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {

    const {
      xMaxRotate,
      yMaxRotate,
      defaultRotateX,
      defaultRotateY,
      leaveSpeed,
      leaveTimingFunction
    } = this.props;
    const { currentTarget, clientX, clientY } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const xOffset = (left + width - clientX) / width;
    const yOffset = (top + height - clientY) / height;

    const transition = `all ${leaveSpeed}ms ${leaveTimingFunction ? " " + leaveTimingFunction : ""}`;
    Object.assign(this.wrapperElm.style, {
      transition: "all 0ms",
      transform: `rotateX(${defaultRotateX + (yOffset - 0.5) * xMaxRotate}deg) rotateY(${defaultRotateY + (0.5 - xOffset) * yMaxRotate}deg)`
    });
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      defaultRotateX,
      defaultRotateY,
      leaveSpeed,
      leaveTimingFunction
    } = this.props;
    const transition = `all ${leaveSpeed}ms ${leaveTimingFunction ? " " + leaveTimingFunction : ""}`;

    Object.assign(this.wrapperElm.style, {
      transition,
      transform: `rotateX(${defaultRotateX}deg) rotateY(${defaultRotateY}deg)`
    });
  }

  render() {
    const {
      perspective,
      xMaxRotate,
      yMaxRotate,
      defaultRotateX,
      defaultRotateY,
      leaveSpeed,
      leaveTimingFunction,
      children,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
        onMouseLeave={this.handleMouseLeave}
        onMouseMove={this.handleMouseMove}
      >
        <div
          onMouseLeave={this.handleMouseLeave}
          onMouseMove={this.handleMouseMove}
          style={styles.wrapper}
          ref={wrapperElm => this.wrapperElm = wrapperElm}
        >
          {children}
        </div>
      </div>
    );
  }
}

function getStyles(TransformCard: TransformCard) {
  const {
    context: { theme },
    props: {
      perspective,
      style,
      defaultRotateX,
      defaultRotateY,
      leaveSpeed,
      leaveTimingFunction
    }
  } = TransformCard;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      display: "inline-block",
      perspective,
      ...style
    }),
    wrapper: theme.prefixStyle({
      display: "inline-block",
      transition: `all ${leaveSpeed}ms ${leaveTimingFunction ? " " + leaveTimingFunction : ""}`,
      transform: `rotateX(${defaultRotateX}deg) rotateY(${defaultRotateY}deg)`
    })
  };
}

export default TransformCard;

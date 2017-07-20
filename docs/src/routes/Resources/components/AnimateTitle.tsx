import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  leftTopStart?: boolean;
  dotSize?: number;
  hoveredBorderWidth?: string;
  borderWidth?: string;
}

export interface AnimateTitleProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface AnimateTitleState {
  hovered?: boolean;
}

export default class AnimateTitle extends React.Component<AnimateTitleProps, AnimateTitleState> {
  static defaultProps: AnimateTitleProps = {
    dotSize: 16,
    borderWidth: "2px",
    hoveredBorderWidth: "4px"
  };

  state: AnimateTitleState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: true });
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: false });
  }

  render() {
    const {
      children,
      leftTopStart,
      dotSize,
      borderWidth,
      hoveredBorderWidth,
      ...attributes
    } = this.props;
    const { hovered } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);
    const currDotSize = hovered ? 0 : dotSize;
    const columnLineHeight = hovered ? "100%" : "50%";
    const columnLineWidth = hovered ? "100%" : "25%";
    const transition = "all .125s ease-in-out";
    const topPosition: React.CSSProperties = leftTopStart ? {
      left: 0
    } : {
      right: 0
    };
    const bottomPosition: React.CSSProperties = leftTopStart ? {
      right: 0
    } : {
      left: 0
    };
    const currBorderWidth = hovered ? hoveredBorderWidth : borderWidth;

    return (
      <div
        {...attributes}
        style={styles.root}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div
          style={theme.prefixStyle({
            position: "absolute",
            top: 0,
            ...topPosition,
            height: columnLineHeight,
            width: columnLineWidth,
            borderLeft: leftTopStart ? `${currBorderWidth} solid ${theme.accent}` : void 0,
            borderRight: leftTopStart ? void 0 : `${currBorderWidth} solid ${theme.accent}`,
            borderTop: `${currBorderWidth} solid ${theme.accent}`,
            transition
          })}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              ...topPosition,
              height: currDotSize,
              width: currDotSize,
              background: theme.accent,
              transition
            }}
          />
        </div>
        {children}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            ...bottomPosition,
            height: columnLineHeight,
            width: columnLineWidth,
            borderLeft: leftTopStart ? void 0 : `${currBorderWidth} solid ${theme.accent}`,
            borderRight: leftTopStart ? `${currBorderWidth} solid ${theme.accent}` : void 0,
            borderBottom: `${currBorderWidth} solid ${theme.accent}`,
            transition
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              ...bottomPosition,
              height: currDotSize,
              width: currDotSize,
              background: theme.accent,
              transition
            }}
          />
        </div>
      </div>
    );
  }
}

function getStyles(animateTitle: AnimateTitle): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = animateTitle;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      position: "relative",
      padding: "20px 40px",
      ...style
    })
  };
}

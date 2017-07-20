import * as React from "react";
import * as PropTypes from "prop-types";

import * as tinycolor from "tinycolor2";
import getStripedBackground from "react-uwp/styles/getStripedBackground";
import Icon from "react-uwp/Icon";

export interface DataProps {
  screenType?: string;
  renderContentWidth?: number | string;
  renderContentHeight?: number | string;
}

export interface NotFoundProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface NotFoundState {}

export default class NotFound extends React.Component<NotFoundProps, NotFoundState> {
  static defaultProps: NotFoundProps = {};

  state: NotFoundState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      screenType,
      renderContentWidth,
      renderContentHeight
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div style={styles.root}>
        <Icon style={styles.icon}>
          MapDirections
        </Icon>
        <div style={styles.desc}>
          <h5 style={styles.descTitle}>ERROR CODE: 404</h5>
          <p style={styles.descSubtitle}>We can't seem to find the page you're looking for.</p>
        </div>
      </div>
    );
  }
}

function getStyles(notFound: NotFound): {
  root?: React.CSSProperties;
  icon?: React.CSSProperties;
  desc?: React.CSSProperties;
  descTitle?: React.CSSProperties;
  descSubtitle?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, renderContentWidth, renderContentHeight }
  } = notFound;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      ...getStripedBackground(4, tinycolor(theme.baseHigh).setAlpha(0.025).toRgbString(), "transparent"),
      fontSize: 14,
      color: theme.baseMediumHigh,
      padding: 40,
      height: "100%",
      width: "100%",
      minHeight: renderContentHeight,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      ...style
    }),
    icon: {
      fontSize: 280,
      color: theme.accent
    },
    desc: {
      marginTop: 40,
      borderLeft: `12px solid ${theme.accent}`,
      padding: "0 10px",
      fontWeight: "lighter",
      color: theme.accent
    },
    descTitle: {
      fontSize: 42,
      lineHeight: 1,
      fontWeight: "lighter"
    },
    descSubtitle: {
      fontWeight: "lighter",
      lineHeight: 1.6,
      fontSize: 16
    }
  };
}

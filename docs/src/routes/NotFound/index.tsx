import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";
import Icon from "react-uwp/Icon";

export interface DataProps {
  screenType?: string;
  renderContentWidth?: number | string;
}

export interface NotFoundProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface NotFoundState {}

export default class NotFound extends React.Component<NotFoundProps, NotFoundState> {
  static defaultProps: NotFoundProps = {};

  state: NotFoundState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const {
      screenType,
      renderContentWidth
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div style={styles.root}>
        <div style={styles.content}>
          <Icon style={styles.icon}>
            MapDirections
          </Icon>
          <div style={styles.desc}>
            <h5 style={styles.descTitle}>ERROR CODE: 404</h5>
            <p style={styles.descSubtitle}>We can't seem to find the page you're looking for.</p>
          </div>
        </div>
      </div>
    );
  }
}

function getStyles(notFound: NotFound): {
  root?: React.CSSProperties;
  content?: React.CSSProperties;
  icon?: React.CSSProperties;
  desc?: React.CSSProperties;
  descTitle?: React.CSSProperties;
  descSubtitle?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, renderContentWidth }
  } = notFound;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseMediumHigh,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      ...style
    }),
    content: prepareStyles({
      width: renderContentWidth,
      height: "100%",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }),
    icon: {
      fontSize: 480,
      color: theme.accent
    },
    desc: {
      marginTop: 64,
      borderLeft: `12px solid ${theme.accent}`,
      padding: "0 10px",
      fontWeight: "lighter",
      color: theme.accent
    },
    descTitle: {
      fontSize: 48,
      lineHeight: 1,
      fontWeight: "lighter"
    },
    descSubtitle: {
      fontWeight: "lighter",
      lineHeight: 1.6,
      fontSize: 18
    }
  };
}

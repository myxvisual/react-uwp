import * as React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router";

import HyperLink from "react-uwp/HyperLink";
import ElementState from "react-uwp/ElementState";
import Icon from "react-uwp/Icon";

export interface DataProps {
  title?: string;
  description?: string | React.ReactElement<any>;
  linkInfo?: string;
  link?: string;
}

export interface MainTitleCenterProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class MainTitleCenter extends React.PureComponent<MainTitleCenterProps> {
  static defaultProps: MainTitleCenterProps = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      title,
      description,
      linkInfo,
      link,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <h5 style={styles.title}>{title}</h5>
        <div style={styles.description}>{description}</div>
        <ElementState style={styles.link} hoverStyle={{ color: theme.baseMediumHigh }}>
          <Link to={link}>
            <span>
              {linkInfo}
            </span>
            <Icon style={theme.prefixStyle({ marginLeft: 4, transition: styles.link.transition })}>
              ScrollChevronRightLegacy
            </Icon>
          </Link>
        </ElementState>
      </div>
    );
  }
}

function getStyles(mainTitleCenter: MainTitleCenter): {
  root?: React.CSSProperties;
  title?: React.CSSProperties;
  description?: React.CSSProperties;
  link?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = mainTitleCenter;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      ...style,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: theme.baseHigh,
      textAlign: "center"
    }),
    title: {
      fontSize: 28,
      lineHeight: 1.6,
      fontWeight: "lighter"
    },
    description: {
      color: theme.baseMediumHigh,
      fontSize: 13,
      fontWeight: "lighter"
    },
    link: theme.prefixStyle({
      transition: "all .25s ease-in-out",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      textDecoration: "none",
      color: theme.accent,
      fontSize: 12,
      marginTop: 12
    })
  };
}

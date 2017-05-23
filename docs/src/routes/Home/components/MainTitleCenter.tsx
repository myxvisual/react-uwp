import * as React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router";

import ThemeType from "react-uwp/styles/ThemeType";
import HyperLink from "react-uwp/HyperLink";
import Icon from "react-uwp/Icon";

export interface DataProps {
  title?: string;
  description?: string | React.ReactElement<any>;
  linkInfo?: string;
  link?: string;
}

export interface MainTitleCenterProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class MainTitleCenter extends React.PureComponent<MainTitleCenterProps, void> {
  static defaultProps: MainTitleCenterProps = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

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
        <p style={styles.description}>{description}</p>
        <Link to={link} style={styles.link}>
          <HyperLink>
            {linkInfo}
          </HyperLink>
          <Icon style={{ marginLeft: 4 }}>
            ScrollChevronRightLegacy
          </Icon>
        </Link>
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
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
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
      fontSize: 14,
      fontWeight: "lighter"
    },
    link: {
      textDecoration: "none",
      color: theme.accent,
      fontSize: 12,
      marginTop: 12
    }
  };
}

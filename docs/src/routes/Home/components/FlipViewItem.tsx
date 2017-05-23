import * as React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router";

import ThemeType from "react-uwp/styles/ThemeType";
import Icon from "react-uwp/Icon";

export interface DataProps {
  title?: string;
  description?: string;
  linkInfo?: string;
  link?: string;
  image?: any;
  flipHeight?: string | number;
}

export interface FlipViewItemProps extends DataProps, React.HTMLAttributes<HTMLAnchorElement> {}

export default class FlipViewItem extends React.Component<FlipViewItemProps, void> {
  static defaultProps: FlipViewItemProps = {
    flipHeight: 500
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const {
      title,
      description,
      linkInfo,
      link,
      image,
      flipHeight,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <Link
        {...attributes as any}
        style={styles.root}
        to={link}
      >
        <div>
          <p style={styles.title}>{title}</p>
          <p style={styles.description}>{description}</p>
          <button style={styles.button}>
            {linkInfo}
            <Icon style={styles.icon}>
              ScrollChevronRightLegacy
            </Icon>
          </button>
        </div>
        <img src={image} style={{ maxHeight: "75%" }} />
      </Link>
    );
  }
}

function getStyles(flipViewItem: FlipViewItem): {
  root?: React.CSSProperties;
  title?: React.CSSProperties;
  description?: React.CSSProperties;
  button?: React.CSSProperties;
  icon?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, flipHeight }
  } = flipViewItem;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      WebkitUserDrag: "none",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "0 40px",
      color: theme.baseHigh,
      height: flipHeight,
      fontWeight: "lighter",
      textDecoration: "none",
      ...style
    }),
    title: {
      fontSize: 42,
      lineHeight: 1.8
    },
    description: {
      margin: "10px 0",
      fontSize: 20,
      lineHeight: 1.5
    },
    button: {
      background: theme.baseHigh,
      color: theme.altHigh,
      height: 32,
      padding: "0 40px",
      border: "none",
      outline: "none",
      cursor: "pointer"
    },
    icon: {
      marginLeft: 10
    }
  };
}

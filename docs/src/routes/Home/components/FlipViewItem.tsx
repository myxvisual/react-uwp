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

export interface FlipViewItemProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

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
      <div
        {...attributes}
        style={styles.root}
      >
        <div>
          <p style={styles.title}>{title}</p>
          <p style={styles.description}>{description}</p>
          <Link to={link}>
            <button style={styles.button}>
              {linkInfo}
              <Icon style={styles.icon}>
                ScrollChevronRightLegacy
              </Icon>
            </button>
          </Link>
        </div>
        <img src={image} />
      </div>
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
      width: "100%",
      padding: "0 40px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: flipHeight,
      fontWeight: "lighter",
      ...style
    }),
    title: {
      fontSize: 42,
      lineHeight: 1.5
    },
    description: {
      fontSize: 20,
      lineHeight: 1.5
    },
    button: {
      background: theme.baseHigh,
      color: theme.altHigh,
      height: 36,
      padding: "0 20px",
      border: "none",
      outline: "none",
      cursor: "pointer"
    },
    icon: {
      marginLeft: 10
    }
  };
}

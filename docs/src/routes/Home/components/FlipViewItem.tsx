import * as React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router";

import Icon from "react-uwp/Icon";
import { WrapperState } from "components/Wrapper";

export interface DataProps extends WrapperState {
  title?: string;
  description?: string;
  linkInfo?: string;
  link?: string;
  image?: any;
  flipHeight?: string | number;
}

export interface FlipViewItemProps extends DataProps, React.HTMLAttributes<HTMLAnchorElement> {}

export default class FlipViewItem extends React.Component<FlipViewItemProps> {
  static defaultProps: FlipViewItemProps = {
    flipHeight: 500
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      title,
      description,
      linkInfo,
      link,
      image,
      flipHeight,
      renderContentHeight,
      renderContentWidth,
      screenType,
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
        <div style={styles.desc}>
          <p style={styles.title}>{title}</p>
          <p style={styles.description}>{description}</p>
          <button style={styles.button}>
            {linkInfo}
            <Icon style={styles.icon}>
              ScrollChevronRightLegacy
            </Icon>
          </button>
        </div>
        <img src={image} style={styles.image} />
      </Link>
    );
  }
}

function getStyles(flipViewItem: FlipViewItem): {
  root?: React.CSSProperties;
  desc?: React.CSSProperties;
  title?: React.CSSProperties;
  description?: React.CSSProperties;
  button?: React.CSSProperties;
  icon?: React.CSSProperties;
  image?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, image, flipHeight, screenType }
  } = flipViewItem;
  const { prefixStyle } = theme;
    const isPhoneScreen = screenType === "phone";

  return {
    root: prefixStyle({
      WebkitUserDrag: "none",
      position: "relative",
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
    desc: isPhoneScreen ? prefixStyle({
      flex: "0 0 auto",
      display: "inline-block",
      textAlign: "center"
    } as React.CSSProperties) : void 0,
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
      padding: "6px 40px",
      border: "none",
      outline: "none",
      cursor: "pointer"
    },
    icon: {
      marginLeft: 10
    },
    image: prefixStyle({
      maxHeight: isPhoneScreen ? "100%" : "75%",
      ...(isPhoneScreen ? {
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
        filter: "blur(2px)",
        opacity: .5
      } as React.CSSProperties : {})
    })
  };
}

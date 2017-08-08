import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";
import Image from "../Image";
import shallowEqual from "../common/shallowEqual";

export interface DataProps {
  author?: string;
  category?: string;
  authorImage?: string;
  like?: string;
  secondaryTitle?: string;
  time?: Date;
  comments?: string[];
  title?: string;
  image?: string;
  href?: string;
  size?: number;
  target?: string;
}

export interface ArticleCardProps extends DataProps, React.HTMLAttributes<HTMLAnchorElement> {}

export interface ArticleCardState {
  isHovered?: boolean;
  normalColor?: string;
}

export default class ArticleCard extends React.Component<ArticleCardProps, ArticleCardState> {
  static defaultProps: ArticleCardProps = {
    target: "_blank",
    size: 200
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  getNormalColor = (context: { theme: ReactUWP.ThemeType }) => (
    Math.random() < 0.875 ?
      `linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.25) 35%, transparent 100%)` :
      context.theme.listAccentMedium
  )

  state: ArticleCardState = {
    isHovered: false,
    normalColor: this.getNormalColor(this.context)
  };

  handleMouseEnter = (e: any) => {
    this.setState({
      isHovered: true
    });
  }

  handleMouseLeave = (e: any) => {
    this.setState({
      isHovered: false
    });
  }

  shouldComponentUpdate(nextProps: ArticleCardProps, nextState: ArticleCardState, nextContext: { theme: ReactUWP.ThemeType }) {
    this.state.normalColor = this.getNormalColor(nextContext);
    return (!shallowEqual(nextProps, this.props) ||
      !shallowEqual(nextState, this.state) ||
      !shallowEqual(nextContext, this.context));
  }

  render() {
    const {
      author,
      category,
      authorImage,
      like,
      secondaryTitle,
      time,
      comments,
      title,
      image,
      href,
      size,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const { isHovered, normalColor } = this.state;
    const styles = getStyles(this);

    return (
      <a
        {...attributes}
        rel="noopener"
        onMouseEnter={this.handleMouseEnter as any}
        onMouseLeave={this.handleMouseLeave as any}
        style={{
          ...styles.container,
          ...theme.prefixStyle(attributes.style)
        }}
      >
        {image && (
          <Image
            useLazyLoad
            useDivContainer
            src={image}
            style={styles.image}
            placeholder={
              <div style={styles.imagePlaceholder}>
                <Icon
                  style={{
                    color: theme.baseMedium,
                    fontSize: 80,
                    textDecoration: "none"
                  }}
                  hoverStyle={{}}
                >
                  &#xEB9F;
                </Icon>
              </div> as any
            }
          />
        )}
        <div style={{ ...styles.content, background: isHovered ? "transparent" : (image ? normalColor : theme.listAccentMedium) }}>
          <p style={theme.prefixStyle({ fontSize: 12, color: "#fff", textAlign: "left", opacity: (isHovered && image) ? 0 : 1, transition: "all .5s 0s ease-in-out" })}>
            {title}
          </p>
        </div>
      </a>
    );
  }
}

function getStyles(instance: ArticleCard): {
  container?: React.CSSProperties;
  content?: React.CSSProperties;
  image?: React.CSSProperties;
  imagePlaceholder?: React.CSSProperties;
  [key: string]: React.CSSProperties;
} {
  const { size } = instance.props;
  const { isHovered } = instance.state;
  const { context } = instance;
  const { theme } = context;
  const { prefixStyle } = theme;

  return {
    container: prefixStyle({
      position: "relative",
      color: theme.baseMediumHigh,
      background: theme.chromeMedium,
      fontSize: 14,
      width: size,
      height: size,
      overflow: "hidden",
      margin: 2,
      flex: "1 1 auto",
      flexDirection: "column",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textDecoration: "none"
    }),
    image: prefixStyle({
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundSize: "cover"
    }),
    imagePlaceholder: prefixStyle({
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    }),
    content: prefixStyle({
      position: "absolute",
      top: 0,
      left: 0,
      transition: "all .5s 0s ease-in-out",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "center",
      width: "100%",
      height: "100%",
      padding: 12
    })
  };
}

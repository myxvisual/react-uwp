import * as React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router";
import RevealEffect from "react-uwp/RevealEffect";

export interface DataProps {
  title?: string;
  description?: string | React.ReactElement<any>;
  link?: string;
  icon?: React.ReactElement<any>;
}

export interface CategoryProps extends DataProps, React.HTMLAttributes<HTMLAnchorElement> {}

export default class Category extends React.Component<CategoryProps> {
  static defaultProps: CategoryProps = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      title,
      description,
      link,
      icon,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const classes = theme.prepareStyles({
      styles,
      className: "Category"
    });

    return (
      <Link
        {...attributes}
        to={link}
        {...classes.root}
      >
        <div style={styles.iconContainer}>
          {icon}
        </div>
        <div>
          <h5 {...classes.title}>{title}</h5>
          <span>{description}</span>
        </div>
        <RevealEffect
          effectEnable="both"
          hoverSize={320}
        />
      </Link>
    );
  }
}

function getStyles(Category: Category) {
  const {
    context: { theme },
    props: { style }
  } = Category;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      position: "relative",
      width: 320,
      height: 320,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-around",
      padding: 16,
      textDecoration: "none",
      color: theme.baseHigh,
      textAlign: "center",
      fontSize: 12,
      fontWeight: "lighter",
      border: `1px solid ${theme.listLow}`,
      ...theme.acrylicTexture60.style,
      ...style
    }),
    title: {
      fontSize: 24,
      fontWeight: "lighter",
      lineHeight: 1.6
    },
    iconContainer: prefixStyle({
      height: 160,
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    })
  };
}

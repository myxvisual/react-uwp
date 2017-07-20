import * as React from "react";
import * as PropTypes from "prop-types";
import { Link } from "react-router";

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

    return (
      <Link
        {...attributes as any}
        to={link}
        style={styles.root}
      >
        <div style={styles.iconContainer}>
          {icon}
        </div>
        <div>
          <h5 style={styles.title}>{title}</h5>
          <span>{description}</span>
        </div>
      </Link>
    );
  }
}

function getStyles(Category: Category): {
  root?: React.CSSProperties;
  title?: React.CSSProperties;
  iconContainer?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = Category;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      width: 320,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textDecoration: "none",
      color: theme.baseHigh,
      textAlign: "center",
      fontSize: 12,
      fontWeight: "lighter",
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

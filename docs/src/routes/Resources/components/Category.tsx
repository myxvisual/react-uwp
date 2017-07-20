import * as React from "react";
import * as PropTypes from "prop-types";

import AnimateTitle, { AnimateTitleProps } from "./AnimateTitle";
import DownloadLink, { DataProps as ILink } from "./DownloadLink";

export { ILink };
export interface DataProps {
  title?: string;
  description?: string;
  links?: ILink[];
}

export interface CategoryProps extends DataProps, AnimateTitleProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Category extends React.Component<CategoryProps> {
  static defaultProps: CategoryProps = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      title,
      description,
      links,
      leftTopStart,
      dotSize,
      borderWidth,
      hoveredBorderWidth,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        {title && (
          <AnimateTitle {...{ leftTopStart, dotSize, borderWidth, hoveredBorderWidth }}>
            <h5 style={styles.title}>{title}</h5>
          </AnimateTitle>
        )}
        {description ? (
          <p style={styles.description}>{description}</p>
        ) : null}
        <div style={{ margin: 10 }}>
          {links && links.map((linkProps, index) => (
            <DownloadLink style={{ margin: 4 }} {...linkProps} key={`${index}`} />
          ))}
        </div>
      </div>
    );
  }
}

function getStyles(category: Category): {
  root?: React.CSSProperties;
  title?: React.CSSProperties;
  description?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = category;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontWeight: "lighter",
      color: theme.accent,
      textAlign: "center",
      ...style
    }),
    title: {
      fontSize: 64,
      lineHeight: 1,
      fontWeight: "lighter"
    },
    description: {
      fontSize: 14,
      margin: 10
    }
  };
}

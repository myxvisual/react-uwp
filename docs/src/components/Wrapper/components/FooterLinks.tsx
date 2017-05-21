import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";

export interface DataProps {
  title?: string;
  links?: React.HTMLAttributes<HTMLAnchorElement>[];
}

export interface FooterLinksProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class FooterLinks extends React.Component<FooterLinksProps, void> {

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const {
      title,
      links,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <p style={styles.title}>{title}</p>
        <div style={{ margin: "8px 0" }}>
          {links.map((link, index) => (
            <a
              style={styles.link}
              target="_blank"
              {...link}
              key={`${index}`}
            >
              {link.children}
            </a>
          ))}
        </div>
      </div>
    );
  }
}

function getStyles(footerLinks: FooterLinks): {
  root?: React.CSSProperties;
  title?: React.CSSProperties;
  link?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = footerLinks;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      ...style
    }),
    title: {
      fontSize: 22,
      fontWeight: "lighter",
      color: theme.baseHigh
    },
    link: {
      display: "block",
      fontSize: 13,
      margin: "16px 0",
      fontWeight: "lighter",
      color: theme.baseMediumHigh,
      textDecoration: "none"
    }
  };
}

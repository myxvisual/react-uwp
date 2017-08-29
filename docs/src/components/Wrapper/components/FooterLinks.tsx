import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  title?: string;
  links?: {
    children?: React.ReactNode;
    href?: string
  }[];
}

export interface FooterLinksProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class FooterLinks extends React.Component<FooterLinksProps> {

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

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
        <div style={styles.links}>
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

function getStyles(footerLinks: FooterLinks) {
  const {
    context: { theme },
    props: { style }
  } = footerLinks;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      fontSize: 14,
      color: "inherit",
      ...style
    }),
    title: {
      fontSize: 20,
      fontWeight: "lighter",
      color: "inherit"
    } as React.CSSProperties,
    links: prefixStyle({
      margin: "8px 0",
      display: "flex",
      flexDirection: "column"
    }),
    link: {
      display: "inline-block",
      fontSize: 12,
      margin: "12px 0",
      fontWeight: "lighter",
      color: "inherit",
      textDecoration: "none"
    } as React.CSSProperties
  };
}

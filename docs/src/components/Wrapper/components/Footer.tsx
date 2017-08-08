import * as React from "react";
import * as PropTypes from "prop-types";

import FooterLinks from "./FooterLinks";

export interface DataProps {
  renderContentWidth?: number | string;
  footerHeight?: number;
}

export interface FooterProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Footer extends React.Component<FooterProps> {
  static defaultProps: FooterProps = {
    footerHeight: 280
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      footerHeight,
      renderContentWidth,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <footer
        {...attributes}
        style={styles.root}
      >
        <div style={styles.content}>
          <div>
            <FooterLinks
              style={styles.links}
              title="Community Resources"
              links={[{
                children: "UWP Design",
                href: "https://developer.microsoft.com/en-us/windows/apps/design"
              }, {
                children: "Windows Dev Center",
                href: "https://developer.microsoft.com/en-us/windows"
              }, {
                children: "MSDN Forums",
                href: "https://msdn.microsoft.com/en-us/default.aspx"
              }, {
                children: "Fluent Design System",
                href: "http://fluent.microsoft.com/"
              }, {
                children: "Fabric",
                href: "https://dev.office.com/fabric"
              }]}
            />
            <FooterLinks
              style={styles.links}
              title="Follow React-UWP"
              links={[{
                children: "Github",
                href: "https://github.com/myxvisual/react-uwp"
              }]}
            />
          </div>
          <a
            href="https://github.com/myxvisual/react-uwp/blob/master/LICENSE"
            target="_blank"
            style={styles.openSource}
          >
            Free & Open Source (MIT)
          </a>
        </div>
      </footer>
    );
  }
}

function getStyles(footer: Footer): {
  root?: React.CSSProperties;
  content?: React.CSSProperties;
  links?: React.CSSProperties;
  openSource?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { footerHeight, renderContentWidth, style }
  } = footer;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      zIndex: theme.zIndex.header,
      fontSize: 14,
      color: theme.baseHigh,
      background: theme.useFluentDesign ? (
        theme.isDarkTheme ? "hsla(0, 0%, 0%, 0.95)" : "hsla(0, 0%, 100%, 0.95)"
      ) : (
        theme.isDarkTheme ? "hsla(0, 0%, 5%, 0.85)" : "hsla(0, 0%, 95%, 0.85)"
      ),
      minHeight: footerHeight,
      ...style
    }),
    content: prefixStyle({
      width: renderContentWidth,
      margin: "0 auto",
      padding: "10px 0",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      ...style
    }),
    links: {
      display: "inline-block",
      margin: 20,
      verticalAlign: "top"
    },
    openSource: {
      margin: 20,
      fontSize: 12,
      color: "inherit",
      alignSelf: "flex-end"
    }
  };
}

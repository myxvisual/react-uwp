import * as React from "react";
import * as PropTypes from "prop-types";

import RevealEffect from "react-uwp/RevealEffect";
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
    const classes = theme.prepareStyles({
      styles,
      className: "Footer"
    });

    return (
      <footer
        {...attributes}
        {...classes.root}
      >
        <div {...classes.content}>
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
            {...classes.openSource}
          >
            Free & Open Source (MIT)
          </a>
        </div>
        <RevealEffect
          effectEnable="border"
          hoverSize={400}
        />
      </footer>
    );
  }
}

function getStyles(footer: Footer) {
  const {
    context: { theme },
    props: { footerHeight, renderContentWidth, style }
  } = footer;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      ...theme.acrylicTexture20.style,
      zIndex: theme.zIndex.header,
      fontSize: 14,
      color: theme.baseHigh,
      minHeight: footerHeight,
      borderTop: `1px solid ${theme.listLow}`,
      position: "relative",
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

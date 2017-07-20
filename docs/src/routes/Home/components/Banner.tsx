import * as React from "react";
import * as PropTypes from "prop-types";

import ReactIcon from "components/ReactIcon";
import ScrollReveal, { slideBottomInProps } from "react-uwp/ScrollReveal";

export interface DataProps {
  renderContentWidth?: number | string;
}

export interface BannerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Banner extends React.Component<BannerProps> {
  static defaultProps: BannerProps = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      renderContentWidth,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <ScrollReveal {...slideBottomInProps} wrapperStyle={styles.content}>
          <ReactIcon width={80} fill="#fff" />
          <p style={{ marginTop: 12 }}>
            Built with React <br />
            React-UWP’s robust, up-to-date components are built with React
          </p>
        </ScrollReveal>
      </div>
    );
  }
}

function getStyles(banner: Banner): {
  root?: React.CSSProperties;
  content?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, renderContentWidth }
  } = banner;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      color: "#fff",
      background: theme.listAccentHigh,
      ...style
    }),
    content: {
      width: renderContentWidth,
      fontWeight: "lighter",
      fontSize: 13,
      textAlign: "center",
      lineHeight: 1.2,
      padding: "40px 0",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  };
}

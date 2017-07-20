import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "react-uwp/Icon";

export interface DataProps {
  title?: string;
  link?: string;
}

export interface DownloadLinkProps extends DataProps, React.HTMLAttributes<HTMLAnchorElement> {}

export default class DownloadLink extends React.Component<DownloadLinkProps> {
  static defaultProps: DownloadLinkProps = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      link,
      title,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <a
        {...attributes}
        href={link}
        style={styles.root}
      >
        <button style={styles.button}>
          {title}
        </button>
        <Icon style={{ marginLeft: 4 }}>
          Download
        </Icon>
      </a>
    );
  }
}

function getStyles(downloadLink: DownloadLink): {
  root?: React.CSSProperties;
  button?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = downloadLink;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      display: "inline-block",
      fontSize: 12,
      color: theme.accent,
      fontWeight: "lighter",
      padding: "4px 20px",
      border: `1px solid ${theme.accent}`,
      textDecoration: "none",
      cursor: "pointer",
      ...style
    }),
    button: {
      color: theme.accent,
      fontWeight: "lighter",
      fontSize: "inherit",
      border: "none",
      outline: "none",
      background: "none",
      cursor: "pointer"
    }
  };
}

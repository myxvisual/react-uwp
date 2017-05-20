import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";

export interface DataProps {
  maxWidth?: number | string;
}

export interface HeaderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface HeaderState {}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  static defaultProps: HeaderProps = {};

  state: HeaderState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const {
      maxWidth,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <div style={styles.content}>
          Header
        </div>
      </div>
    );
  }
}

function getStyles(header: Header): {
  root?: React.CSSProperties;
  content?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style, maxWidth }
  } = header;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      width: "100%",
      height: 52,
      position: "fixed",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      left: 0,
      top: 0,
      ...style
    }),
    content: prepareStyles({
      width: maxWidth,
      height: "100%",
      background: theme.accent
    })
  };
}

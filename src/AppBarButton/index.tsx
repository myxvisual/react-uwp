import * as React from "react";
import * as PropTypes from "prop-types";

import ElementState from "../ElementState";
import Icon from "../Icon";

export interface DataProps {
  icon?: string;
  iconStyle?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  labelPosition?: "right" | "bottom" | "collapsed";
}

export interface AppBarButtonButtonProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class AppBarButtonButton extends React.Component<AppBarButtonButtonProps, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      icon,
      iconStyle,
      hoverStyle,
      label,
      labelPosition,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <ElementState
        {...attributes as any}
        style={styles.root}
        hoverStyle={hoverStyle || {
          background: theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"]
        }}
      >
        <div>
          <Icon style={styles.icon}>
            {icon}
          </Icon>
          {labelPosition !== "collapsed" && <p style={styles.label}>
            {label}
          </p>}
        </div>
      </ElementState>
    );
  }
}

function getStyles(AppBarButtonButton: AppBarButtonButton): {
  root?: React.CSSProperties;
  icon?: React.CSSProperties;
  label?: React.CSSProperties;
} {
  const { context, props: { labelPosition, style, iconStyle } } = AppBarButtonButton;
  const { theme } = context;
  const { prepareStyles } = theme;
  const flexDirection: any = {
    "bottom": "column",
    "right": "row",
    "left": "row-reverse"
  };
  const isRight = labelPosition === "right";

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseMediumHigh,
      display: "flex",
      flexDirection: flexDirection[labelPosition],
      alignItems: "center",
      justifyContent: "flex-start",
      flex: "0 0 auto",
      height: "100%",
      padding: "0 10px",
      maxWidth: isRight ? void 0 : 72,
      cursor: "default",
      ...style
    }),
    label: {
      lineHeight: isRight ? void 0 : 1,
      height: isRight ? void 0 : 28,
      fontSize: 12,
      width: "100%",
      textAlign: "center",
      textOverflow: "ellipsis",
      overflow: "hidden"
    },
    icon: prepareStyles({
      width: 48,
      height: 48,
      fontSize: 18,
      ...iconStyle
    })
  };
}

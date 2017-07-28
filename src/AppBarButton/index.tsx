import * as React from "react";
import * as PropTypes from "prop-types";

import PseudoClasses from "../PseudoClasses";
import Icon from "../Icon";

export interface DataProps {
  /**
   * Set custom icon string.
   */
  icon?: string;
  /**
   * Set custom icon style.
   */
  iconStyle?: React.CSSProperties;
  /**
   * Set rootElm hovered style.
   */
  hoverStyle?: React.CSSProperties;
  /**
   * Set label string.
   */
  label?: string;
  /**
   * Set label display position.
   */
  labelPosition?: "right" | "bottom" | "collapsed";
}

export interface AppBarButtonButtonProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class AppBarButtonButton extends React.Component<AppBarButtonButtonProps> {
  static defaultProps: AppBarButtonButtonProps = {
    labelPosition: "bottom"
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      icon,
      iconStyle,
      hoverStyle,
      label,
      className,
      labelPosition,
      ...attributes
    } = this.props;
    const { theme } = this.context;

    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      styles: inlineStyles,
      className: "app-bar-button"
    });

    const rootProps = {
      ...attributes,
      style: styles.root.style,
      className: theme.classNames(className, styles.root.className)
    };

    return (
      <PseudoClasses
        {...attributes}
        style={styles.root.style}
        className={theme.classNames(className, styles.root.className)}
      >
        <div>
          <Icon style={inlineStyles.icon}>
            {icon}
          </Icon>
          {labelPosition !== "collapsed" && <p {...styles.label}>
            {label}
          </p>}
        </div>
      </PseudoClasses>
    );
  }
}

function getStyles(AppBarButtonButton: AppBarButtonButton): {
  root?: React.CSSProperties;
  icon?: React.CSSProperties;
  label?: React.CSSProperties;
} {
  const {
    context,
    props: {
      labelPosition,
      style,
      iconStyle,
      hoverStyle
    }
  } = AppBarButtonButton;
  const { theme } = context;
  const { prefixStyle } = theme;
  const flexDirection: any = {
    "bottom": "column",
    "right": "row",
    "left": "row-reverse"
  };
  const isRight = labelPosition === "right";

  return {
    root: prefixStyle({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: "none",
      display: "flex",
      flexDirection: flexDirection[labelPosition],
      alignItems: "center",
      justifyContent: "flex-start",
      flex: "0 0 auto",
      height: "100%",
      padding: "0 10px",
      maxWidth: isRight ? 120 : 72,
      cursor: "default",
      transition: "all .25s",
      "&:hover": hoverStyle || {
        background: theme.listAccentLow
      },
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
    icon: prefixStyle({
      width: 48,
      height: 48,
      lineHeight: "48px",
      fontSize: 18,
      ...iconStyle
    })
  };
}

export default AppBarButtonButton;

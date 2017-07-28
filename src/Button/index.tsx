import * as React from "react";
import * as PropTypes from "prop-types";

import PseudoClasses from "../PseudoClasses";
import Icon from "../Icon";
import Tooltip from "../Tooltip";

export interface DataProps {
  /**
   * Control `Button` border size.
   */
  borderSize?: string;
  /**
   * Is onMouseEnter Inline Style will assign to default `hoverStyle`.
   */
  hoverStyle?: React.CSSProperties;
  /**
   * Is onMouseDown Inline Style will assign to default `hoverStyle`.
   */
  activeStyle?: React.CSSProperties;
  /**
   * icon use the Iconfont like `\uE00A` or iconName `HeartLegacy`.
   */
  icon?: string;
  /**
   * This will assign to default `iconStyle`.
   */
  iconStyle?: React.CSSProperties;
  /**
   * will change to icon position, default is `left`.
   */
  iconPosition?: "left" | "right";
  /**
   * if `true`, will become `Disabled Button`.
   */
  disabled?: boolean;
  /**
   * `tooltip` is any type, you can passe a `React.Element` or `string`.
   */
  tooltip?: React.ReactElement<any> | string;
  /**
   * Set custom Button `background`.
   */
  background?: string;
}

export interface ButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}

const labelStyle: React.CSSProperties = {
  verticalAlign: "middle"
};
export class Button extends React.Component<ButtonProps> {
  static defaultProps: ButtonProps = {
    borderSize: "2px",
    iconPosition: "left"
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  refs: { container: HTMLButtonElement };

  render() {
    const {
      borderSize,
      style,
      className,
      hoverStyle,
      children,
      icon,
      iconStyle,
      iconPosition,
      disabled,
      tooltip,
      background,
      activeStyle,
      ...attributes
    } = this.props;
    const { theme } = this.context;

    const buttonStyles = theme.prepareStyle({
      className: "button-root",
      style: {
        display: "inline-block",
        verticalAlign: "middle",
        cursor: "pointer",
        color: theme.baseHigh,
        outline: "none",
        padding: "4px 16px",
        transition: "all .25s",
        border: `${borderSize} solid transparent`,
        background: background || theme.baseLow,
        ...theme.prefixStyle(style),
        "&:hover": disabled ? void 0 : {
          border: `2px solid ${theme.baseMediumLow}`
        },
        "&:active": disabled ? void 0 : {
          background: theme.baseMediumLow
        },
        "&:disabled": {
          background: theme.baseMedium,
          cursor: "not-allowed",
          color: theme.baseMedium
        }
      },
      extendsClassName: className
    });

    const iconStyles = theme.prepareStyle({
      className: "button-icon",
      style: {
        padding: "0 4px",
        display: "inline-block",
        ...theme.prefixStyle(iconStyle)
      }
    });

    const normalRender = (
      <PseudoClasses {...attributes} disabled={disabled} {...buttonStyles}>
        {(
          icon ? (iconPosition === "right" ? (
            <button>
              <span style={labelStyle}>
                {children}
              </span>
              <Icon {...iconStyles}>
                {icon}
              </Icon>
            </button>
          ) : (
            <button>
              <Icon {...iconStyles}>
                {icon}
              </Icon>
              <span style={labelStyle}>
                {children}
              </span>
            </button>
          )) : (
            <button>
              {children}
            </button>
          )
        )}
      </PseudoClasses>
    );

    return tooltip ? (
      <Tooltip contentNode={tooltip}>
        {normalRender}
      </Tooltip>
    ) : normalRender;
  }
}

export default Button;

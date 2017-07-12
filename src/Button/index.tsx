import * as React from "react";
import * as PropTypes from "prop-types";

import ElementState from "../ElementState";
import Icon from "../Icon";
import Tooltip from "../Tooltip";
import { setStylesToManager } from "../styles/setStylesToManager";

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

    const currIconStyle: React.CSSProperties = {
      padding: "0 4px",
      display: "inline",
      ...theme.prepareStyles(iconStyle)
    };

    const styleWithClassName = setStylesToManager({
      baseClassName: "button",
      theme,
      styleWithClassNames: {
        root: {
          style: {
            display: "inline-block",
            verticalAlign: "middle",
            background: disabled ? theme.baseMedium : (background || theme.baseLow),
            cursor: disabled ? "not-allowed" : "pointer",
            color: disabled ? theme.baseMedium : theme.baseHigh,
            outline: "none",
            padding: "4px 16px",
            border: `${borderSize} solid transparent`,
            transition: "all ease-in-out .25s",
            ...theme.prepareStyles(style),
            hoverStyle: {
              border: `2px solid ${theme.baseMediumLow}`
            },
            activeStyle: {
              background: theme.baseMediumLow
            }
          }
        }
      }
    }).root;

    const normalRender =  (
      icon ? (iconPosition === "right" ? (
        <button {...styleWithClassName}>
          <span style={{ verticalAlign: "middle" }}>
            {children}
          </span>
          <Icon style={currIconStyle}>
            {icon}
          </Icon>
        </button>
      ) : (
        <button {...styleWithClassName}>
          <Icon style={currIconStyle}>
            {icon}
          </Icon>
          <span style={{ verticalAlign: "middle" }}>
            {children}
          </span>
        </button>
      )) : (
        <button {...styleWithClassName}>
          {children}
        </button>
      )
    );

    return tooltip ? (
      <Tooltip contentNode={tooltip}>
        {normalRender}
      </Tooltip>
    ) : normalRender;
  }
}

export default Button;

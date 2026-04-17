import * as React from "react";
import * as PropTypes from "prop-types";

import PseudoClasses from "./PseudoClasses";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import RevealEffect, { RevealEffectProps } from "./RevealEffect";

export interface DataProps {
  /**
   * Control Button border width.
   */
  borderWidth?: number;
  /**
   * Style applied when mouse enters the button.
   */
  hoverStyle?: React.CSSProperties;
  /**
   * Style applied when mouse presses the button.
   */
  activeStyle?: React.CSSProperties;
  /**
   * Icon name from Segoe MDL2 Assets or unicode value.
   */
  icon?: string;
  /**
   * Custom style for the icon.
   */
  iconStyle?: React.CSSProperties;
  /**
   * Position of the icon relative to the text.
   * @default "left"
   */
  iconPosition?: "left" | "right";
  /**
   * If true, button is disabled and cannot be interacted with.
   */
  disabled?: boolean;
  /**
   * Tooltip content shown on hover. Can be string or React element.
   */
  tooltip?: React.ReactElement<any> | string;
  /**
   * Custom background color for the button.
   */
  background?: string;
  /**
   * Configuration for Fluent Design reveal effect.
   */
  revealConfig?: RevealEffectProps;
}

export interface ButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}

const labelStyle: React.CSSProperties = {
  verticalAlign: "middle"
};

export class Button extends React.Component<ButtonProps> {
  static defaultProps: ButtonProps = {
    iconPosition: "left"
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  refs: { container: HTMLButtonElement };

  render() {
    const {
      children,
      icon,
      iconPosition,
      disabled,
      tooltip,
      revealConfig,
      ...attributes
    } = this.props;
    const { theme } = this.context;

    // Get all style classes in one call
    const cls = getCls(theme, this.props);

    const normalRender = (
      <PseudoClasses {...attributes} disabled={disabled} className={cls.button}>
        {(icon ? (iconPosition === "right" ? (
            <button>
              <span style={labelStyle}>
                {children}
              </span>
              <Icon className={cls.icon}>
                {icon}
              </Icon>
              <RevealEffect />
            </button>
          ) : (
            <button>
              <Icon className={cls.icon}>
                {icon}
              </Icon>
              <span style={labelStyle}>
                {children}
              </span>
              <RevealEffect />
            </button>
          )) : (
            <button>
              {children}
              <RevealEffect {...revealConfig} />
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

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, props: ButtonProps) => {
  const { borderWidth: borderSize, style, className, disabled, background, iconStyle } = props;
  const currBorderWidth = borderSize === void 0 ? theme.borderWidth : borderSize;

  const buttonStyle = {
    position: "relative",
    display: "inline-block",
    verticalAlign: "middle",
    cursor: "pointer",
    color: theme.baseHigh,
    outline: "none",
    padding: "4px 16px",
    transition: "all .25s",
    border: `${currBorderWidth}px solid transparent`,
    background: background || theme.baseLow,
    ...theme.prefixStyle(style),
    "&:hover": disabled ? void 0 : {
      border: `${currBorderWidth}px solid ${theme.baseMediumLow}`
    },
    "&:active": disabled ? void 0 : {
      background: theme.baseMediumLow
    },
    "&:disabled": {
      background: theme.baseMedium,
      cursor: "not-allowed",
      color: theme.baseMedium
    },
  };

  const iconStyleDef = {
    padding: "0 4px",
    display: "inline-block",
    ...theme.prefixStyle(iconStyle)
  };

  const button = theme.prepareStyle(buttonStyle, "button-root");
  const icon = theme.prepareStyle(iconStyleDef, "button-icon");

  return {
    button: theme.classNames(button, className),
    icon
  };
};

export default Button;

import { useTheme } from './hooks/useTheme';
import * as React from "react";

import RevealEffect, { RevealEffectProps } from "./RevealEffect";
import Icon from "./Icon";

export interface DataProps {
  /**
   * Style applied when mouse enters the button.
   */
  hoverStyle?: React.CSSProperties;
  /**
   * Style applied when mouse presses the button.
   */
  activeStyle?: React.CSSProperties;
  /**
   * Size of the icon button (width and height in pixels).
   * @default 48
   */
  size?: number;
  /**
   * If true, button is disabled and cannot be interacted with.
   */
  disabled?: boolean;
  /**
   * Configuration for Fluent Design reveal effect.
   * @default { effectEnable: "disabled" }
   */
  revealConfig?: RevealEffectProps;
}

export interface IconButtonProps extends DataProps, React.HTMLAttributes<HTMLButtonElement> {}

const IconButton: React.FC<IconButtonProps> = ({
  size = 48,
  revealConfig = { effectEnable: "disabled" },
  children,
  disabled,
  ...attributes
}) => {
  const theme = useTheme();
  // Get all style classes in one call
  const cls = getCls(theme, { size, revealConfig, disabled, ...attributes });

  return (
    <Icon
      {...attributes}
      style={cls.root}
      hoverStyle={cls.hover}
      activeStyle={cls.active}
    >
      {children}
      <RevealEffect {...revealConfig} />
    </Icon>
  );
}

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, props: IconButtonProps) => {
  const { style, hoverStyle, activeStyle, size, disabled } = props;

  const root = {
    position: "relative",
    display: "inline-block",
    fontFamily: theme.fonts.segoeMDL2Assets,
    verticalAlign: "middle",
    textAlign: "center",
    userSelect: "none",
    background: disabled ? theme.baseLow : "none",
    border: "none",
    outline: "none",
    fontSize: size / 2,
    width: size,
    height: size,
    cursor: "pointer",
    color: disabled ? theme.baseMedium : theme.baseHigh,
    padding: 0,
    flexShrink: 0,
    lineHeight: `${size}px`,
    transition: "background .25s ease-in-out",
    ...theme.prefixStyle(style)
  };

  const hover = disabled ? void 0 : (hoverStyle || {
    background: theme.listLow
  });

  const active = disabled ? void 0 : (activeStyle || {
    background: theme.baseLow
  });

  return { root, hover, active };
};

export default IconButton;

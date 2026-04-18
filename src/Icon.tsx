import { useTheme } from './hooks/useTheme';
import React, { useState } from 'react';
import PseudoClasses from './PseudoClasses';
import iconsType from './Icon.icons';

const icons: Record<string, string> = iconsType;

export interface DataProps {
  /**
   * Set custom Icon size.
   */
  size?: number;
  /**
   * The Icon `onMouseEnter` will applied to `rootElm.style`.
   */
  hoverStyle?: React.CSSProperties;
  /**
   * The Icon `onMouseDown` will applied to `rootElm.style`.
   */
  activeStyle?: React.CSSProperties;
  /**
   * `ReactNode`, Paste unicode or string or `IconName`.
   */
  children?: React.ReactNode;
  /**
   * if `true`, default `span` element will changed to `svg text` element.
   */
  useSVGElement?: boolean;
}
export interface IconProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}

const Icon: React.FC<IconProps> = ({
  size,
  className,
  style,
  hoverStyle,
  activeStyle,
  children,
  useSVGElement = false,
  onMouseEnter,
  onMouseLeave,
  ...attributes
}) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    onMouseEnter?.(e);
    setHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    onMouseLeave?.(e);
    setHovered(false);
  };

  const cls = getCls(theme, { size, style, hoverStyle, activeStyle, className, hovered });

  if (children) {
    children = React.Children.map(children, child => {
      const newIcon = icons[child as any];
      return newIcon || child;
    });
  }

  return (
    <PseudoClasses
      {...attributes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cls.root}
    >
      {useSVGElement ? (
        <text>{children}</text>
      ) : (
        <span>{children}</span>
      )}
    </PseudoClasses>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, props: {
  size?: number;
  style?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  activeStyle?: React.CSSProperties;
  className?: string;
  hovered: boolean;
}) => {
  const { size, style, hoverStyle, activeStyle, className, hovered } = props;

  const inlineStyle = theme.prefixStyle({
    display: "inline-block",
    textAlign: "center",
    verticalAlign: "middle",
    fontFamily: theme.fonts.segoeMDL2Assets,
    transition: "all .25s",
    border: "none",
    outline: "none",
    userSelect: "none",
    width: size,
    height: size,
    lineHeight: size ? `${size}px` : "inherit",
    fontSize: size || "inherit",
    color: "inherit",
    ...style,
    "&:hover": hovered ? hoverStyle : void 0,
    "&:active": activeStyle
  });

  const root = theme.prepareStyle({
    className: "icon",
    style: inlineStyle,
    extendsClassName: className
  });

  return { root };
};


export { icons };

export default Icon;

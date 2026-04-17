import * as React from "react";
import { useContext } from "react";
import RevealEffect, { RevealEffectProps } from "./RevealEffect";

import PseudoClasses from "./PseudoClasses";
import Icon from "./Icon";

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
  /**
   * Set RevealEffect, check the styles/reveal-effect.
   */
  revealConfig?: RevealEffectProps;
}

export type AppBarButtonProps = DataProps & React.HTMLAttributes<HTMLDivElement>;

const AppBarButton: React.FC<AppBarButtonProps> = (props) => {
  const {
    icon,
    iconStyle,
    hoverStyle,
    label,
    className,
    labelPosition = "bottom",
    revealConfig,
    ...attributes
  } = props;

  const theme = useContext<ReactUWP.ThemeType>({ theme: {} } as any);
  const cls = getCls(theme, props);

  return (
    <PseudoClasses
      {...attributes}
      style={cls.root}
      className={theme.classNames?.(className, cls.rootClass) || cls.rootClass}
    >
      <div>
        <Icon style={cls.icon}>
          {icon}
        </Icon>
        {labelPosition !== "collapsed" && <p className={cls.labelClass} style={cls.label}>
          {label}
        </p>}
        <RevealEffect {...revealConfig} />
      </div>
    </PseudoClasses>
  );
};

export default AppBarButton;

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const flexDirectionMap: Record<string, React.CSSProperties["flexDirection"]> = {
  "bottom": "column",
  "right": "row",
  "left": "row-reverse"
};

const getCls = (theme: ReactUWP.ThemeType, props: AppBarButtonProps) => {
  const {
    labelPosition = "bottom",
    style,
    iconStyle,
    hoverStyle
  } = props;
  const isRight = labelPosition === "right";

  const rawStyles = {
    root: theme.prefixStyle({
      position: "relative",
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: "none",
      display: "flex",
      flexDirection: flexDirectionMap[labelPosition],
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
    icon: theme.prefixStyle({
      width: 48,
      height: 48,
      lineHeight: "48px",
      fontSize: 18,
      ...iconStyle
    })
  };

  const classMap = theme.prepareStyles({ styles: rawStyles, className: "app-bar-button" });
  
  return {
    root: rawStyles.root,
    rootClass: classMap.root,
    label: rawStyles.label,
    labelClass: classMap.label,
    icon: rawStyles.icon
  };
};

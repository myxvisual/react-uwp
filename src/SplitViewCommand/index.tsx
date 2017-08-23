import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";
import PseudoClasses from "../PseudoClasses";

export interface DataProps {
  /**
   * Set custom icon label.
   */
  label?: string;
  /**
   * Set custom icon.
   */
  icon?: string;
  /**
   * Set command is visited status.
   */
  visited?: boolean;
  /**
   * Set custom icon style.
   */
  iconStyle?: React.CSSProperties;
  /**
   * Use 10ft Design mode.
   */
  isTenFt?: boolean;
  /**
   * Set show label text.
   */
  showLabel?: boolean;
}

export interface SplitViewCommandProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class SplitViewCommand extends React.Component<SplitViewCommandProps> {
  static defaultProps: SplitViewCommandProps = {
    isTenFt: false,
    showLabel: true
  };

  displayName: "SplitViewCommand";

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      style,
      className,
      label,
      icon,
      visited,
      onMouseEnter,
      onMouseLeave,
      isTenFt,
      iconStyle,
      showLabel,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);

    const rootStyleClasses = theme.prepareStyle({
      className: "split-view-command",
      style: inlineStyles.root,
      extendsClassName: className
    });
    const iconStyleClasses = theme.prepareStyle({
      className: "split-view-command-icon",
      style: inlineStyles.icon,
      extendsClassName: className
    });
    const labelStyleClasses = theme.prepareStyle({
      className: "split-view-command-label",
      style: inlineStyles.label,
      extendsClassName: className
    });
    const visitedBorderStyleClasses = theme.prepareStyle({
      className: "split-view-command-border",
      style: inlineStyles.visitedBorder,
      extendsClassName: className
    });

    return (
      <PseudoClasses {...rootStyleClasses}>
      <div {...attributes}>
        {(visited && !isTenFt) ? <div {...visitedBorderStyleClasses}/> : null}
        <Icon {...iconStyleClasses}>
          {icon}
        </Icon>
        {label && (
          <div  {...labelStyleClasses}>
            {label}
          </div>
        )}
      </div>
      </PseudoClasses>
    );
  }
}

function getStyles(splitViewCommand: SplitViewCommand) {
  const {
    context,
    props: {
      style,
      iconStyle,
      visited,
      isTenFt,
      showLabel
    }
  } = splitViewCommand;
  const { theme } = context;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: isTenFt ? (visited ? theme.listAccentLow : "none") : "none",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      transition: "all .25s 0s ease-in-out",
      "&:hover": {
        background: isTenFt ? theme.accent : theme.baseLow
      },
      ...style
    }),
    visitedBorder: {
      width: 0,
      borderLeft: `4px solid ${theme.accent}`,
      height: "50%",
      left: 0,
      top: "25%",
      position: "absolute"
    } as React.CSSProperties,
    icon: prefixStyle({
      cursor: "default",
      flex: "0 0 auto",
      width: 48,
      height: 48,
      lineHeight: "48px",
      color: isTenFt ? void 0 : (visited ? theme.accent : theme.baseHigh),
      fontSize: 16,
      ...iconStyle
    }),
    label: {
      color: isTenFt ? void 0 : (visited ? theme.accent : theme.baseHigh),
      cursor: "default",
      opacity: showLabel ? 1 : 0,
      transition: "opacity .25s"
    }
  };
}

export default SplitViewCommand;

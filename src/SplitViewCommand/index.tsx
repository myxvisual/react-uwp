import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";

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
}

export interface SplitViewCommandProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class SplitViewCommand extends React.Component<SplitViewCommandProps, void> {
  static defaultProps: SplitViewCommandProps = {
    isTenFt: false
  };

  displayName: "SplitViewCommand";

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      label,
      icon,
      visited,
      onMouseEnter,
      onMouseLeave,
      isTenFt,
      iconStyle,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={{
          ...styles.root,
          ...theme.prepareStyles(attributes.style)
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = isTenFt ? theme.accent : theme.baseLow
          ;
          if (onMouseEnter) onMouseEnter(e);
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = (visited && isTenFt) ? theme.listAccentLow : "none";
          if (onMouseLeave) onMouseLeave(e);
        }}
      >
        {(visited && !isTenFt) ? <div style={styles.visitedBorder} /> : null}
        <Icon style={styles.icon}>
          {icon}
        </Icon>
        {label && (
          <div
            style={{
              color: isTenFt ? void(0) : (visited ? theme.accent : theme.baseHigh),
              cursor: "default"
            }}
          >
            {label}
          </div>
        )}
      </div>
    );
  }
}

function getStyles(splitViewCommand: SplitViewCommand): {
  root?: React.CSSProperties;
  icon?: React.CSSProperties;
  visitedBorder?: React.CSSProperties;
} {
  const { context, props: { style, iconStyle, visited, isTenFt } } = splitViewCommand;
  const { theme } = context;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: isTenFt ? (visited ? theme.listAccentLow : "none") : "none",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      transition: "all .25s 0s ease-in-out",
      ...style
    }),
    visitedBorder: {
      width: 0,
      borderLeft: `4px solid ${theme.accent}`,
      height: "50%",
      left: 0,
      top: "25%",
      position: "absolute"
    },
    icon: prepareStyles({
      cursor: "default",
      flex: "0 0 auto",
      width: 48,
      height: 48,
      lineHeight: "48px",
      color: isTenFt ? void 0 : (visited ? theme.accent : theme.baseHigh),
      fontSize: 16,
      ...iconStyle
    })
  };
}

export default SplitViewCommand;

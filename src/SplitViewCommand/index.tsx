import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";
import ThemeType from "../styles/ThemeType";

export interface DataProps {
  labelNode?: any;
  icon?: string;
  visited?: boolean;
  iconStyle?: React.CSSProperties;
  isTenFt?: boolean;
}

export interface SplitViewCommandProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface SplitViewCommandState {}

export default class SplitViewCommand extends React.Component<SplitViewCommandProps, SplitViewCommandState> {
  static defaultProps: SplitViewCommandProps = {
    isTenFt: false
  };

  state: SplitViewCommandState = {};

  displayName: "SplitViewCommand";

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  shouldComponentUpdate(nextProps: SplitViewCommandProps, nextState: SplitViewCommandState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  render() {
    // tslint:disable-next-line:no-unused-variable
    const { label, labelNode, icon, visited, onMouseEnter, onMouseLeave, isTenFt, ...attributes } = this.props;
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
          e.currentTarget.style.background = (visited && isTenFt) ? theme.baseLow : "none";
          if (onMouseLeave) onMouseLeave(e);
        }}
      >
        {(visited && !isTenFt) ? <div style={styles.visitedBorder} /> : null}
        <Icon hoverStyle={{}} style={styles.icon}>
          {icon}
        </Icon>
        <div
          style={{
            color: isTenFt ? void(0) : (visited ? theme.accent : theme.baseHigh)
          }}
        >
          {label || labelNode}
        </div>
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
      background: isTenFt ? (visited ? theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"] : "none") : "none",
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
      flex: "0 0 auto",
      width: 48,
      height: 48,
      color: isTenFt ? void 0 : (visited ? theme.accent : theme.baseHigh),
      fontSize: 16,
      ...iconStyle
    })
  };
}

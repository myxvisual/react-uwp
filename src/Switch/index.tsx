import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "../styles/ThemeType";

export interface DataProps {
  isSwitched?: boolean;
  onSwitch?: (isOpen?: boolean) => void;
  padding?: number;
  label?: string;
}
export interface SwitchProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {
}
export interface SwitchState {
  currSwitched?: boolean;
}

const emptyFunc = () => {};
export default class Switch extends React.Component<SwitchProps, SwitchState> {
  static defaultProps: SwitchProps = {
    width: 42,
    height: 18,
    padding: 6,
    onSwitch: emptyFunc
  };

  state: SwitchState = {
    currSwitched: this.props.isSwitched
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  componentWillReceiveProps(nextProps: SwitchProps) {
    this.setState({ currSwitched: nextProps.isSwitched });
  }

  toggleSwitch = (currSwitched?: any) => {
    if (typeof currSwitched === "boolean") {
      if (currSwitched !== this.state.currSwitched) {
        this.setState({ currSwitched });
        this.props.onSwitch(currSwitched);
      }
    } else {
      this.setState((prevState, prevProps) => {
        const currSwitched = !prevState.currSwitched;
        this.props.onSwitch(currSwitched);
        return { currSwitched };
      });
    }
  }

  render() {
    const { style, isSwitched, onSwitch, padding, label, ...attributes } = this.props;
    const { currSwitched } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div {...attributes} style={theme.prepareStyles({ display: "inline-block", verticalAlign: "middle", ...style })}>
        <div
          style={styles.root}
          onClick={this.toggleSwitch}
        >
          <div
            style={theme.prepareStyles({
              ...styles.button,
              ...styles.button
            })}
          />
        </div>
        {label && (
          <span style={{ marginLeft: 8, verticalAlign: "middle" }}>
            {label}
          </span>
        )}
      </div>
    );
  }
}

function getStyles(context: Switch): {
  root: React.CSSProperties;
  button: React.CSSProperties;
} {
  const { width, height, padding } = context.props;
  const { theme } = context.context;
  const { currSwitched } = context.state;
  const itemSize = Number(height) / 1.5;
  return {
    root: theme.prepareStyles({
      position: "relative",
      display: "inline-block",
      verticalAlign: "middle",
      boxSizing: "content-box",
      width,
      height,
      background: currSwitched ? theme.accent : theme.altHigh,
      border: `2px solid ${currSwitched ? theme.accent : theme.baseMediumHigh}`,
      borderRadius: height,
      transition: "all .25s 0s ease-in-out"
    }),
    button: {
      transform: `translateX(${currSwitched ? Number(width) - Number(height) + padding : padding}px)`,
      flex: "0 0 auto",
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
      width: itemSize,
      height: itemSize,
      borderRadius: itemSize,
      background: currSwitched ? "#fff" : theme.baseMediumHigh,
      transition: "all .25s 0s ease-in-out"
    }
  };
}

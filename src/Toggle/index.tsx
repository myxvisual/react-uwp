import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  defaultToggled?: boolean;
  onToggle?: (isOpen?: boolean) => void;
  padding?: number;
  label?: string;
}
export interface ToggleProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ToggleState {
  currToggled?: boolean;
}

const emptyFunc = () => {};
export class Toggle extends React.Component<ToggleProps, ToggleState> {
  static defaultProps: ToggleProps = {
    width: 42,
    height: 18,
    padding: 6,
    onToggle: emptyFunc
  };

  state: ToggleState = {
    currToggled: this.props.defaultToggled
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillReceiveProps(nextProps: ToggleProps) {
    this.setState({ currToggled: nextProps.defaultToggled });
  }

  toggleToggle = (currToggled?: any) => {
    if (typeof currToggled === "boolean") {
      if (currToggled !== this.state.currToggled) {
        this.setState({ currToggled });
        this.props.onToggle(currToggled);
      }
    } else {
      this.setState((prevState, prevProps) => {
        const currToggled = !prevState.currToggled;
        this.props.onToggle(currToggled);
        return { currToggled };
      });
    }
  }

  render() {
    const { style, defaultToggled, onToggle, padding, label, ...attributes } = this.props;
    const { currToggled } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div {...attributes} style={theme.prepareStyles({ display: "inline-block", verticalAlign: "middle", ...style })}>
        <div
          style={styles.root}
          onClick={this.toggleToggle}
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

function getStyles(context: Toggle): {
  root: React.CSSProperties;
  button: React.CSSProperties;
} {
  const { width, height, padding } = context.props;
  const { theme } = context.context;
  const { currToggled } = context.state;
  const itemSize = Number(height) / 1.5;
  return {
    root: theme.prepareStyles({
      userSelect: "none",
      position: "relative",
      display: "inline-block",
      verticalAlign: "middle",
      boxSizing: "content-box",
      width,
      height,
      background: currToggled ? theme.accent : theme.altHigh,
      border: `2px solid ${currToggled ? theme.accent : theme.baseMediumHigh}`,
      borderRadius: height,
      transition: "all .25s 0s ease-in-out"
    }),
    button: {
      transform: `translateX(${currToggled ? Number(width) - Number(height) + padding : padding}px)`,
      flex: "0 0 auto",
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
      width: itemSize,
      height: itemSize,
      borderRadius: itemSize,
      background: currToggled ? "#fff" : theme.baseMediumHigh,
      transition: "all .25s 0s ease-in-out"
    }
  };
}

export default Toggle;

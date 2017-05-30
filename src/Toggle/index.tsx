import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  checked?: boolean;
  onToggle?: (isOpen?: boolean) => void;
  padding?: number;
  label?: string;
}
export interface ToggleProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {
}
export interface ToggleState {
  currChecked?: boolean;
}

const emptyFunc = () => {};
export default class Toggle extends React.Component<ToggleProps, ToggleState> {
  static defaultProps: ToggleProps = {
    width: 42,
    height: 18,
    padding: 6,
    onToggle: emptyFunc
  };

  state: ToggleState = {
    currChecked: this.props.checked
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillReceiveProps(nextProps: ToggleProps) {
    this.setState({ currChecked: nextProps.checked });
  }

  toggleToggle = (currChecked?: any) => {
    if (typeof currChecked === "boolean") {
      if (currChecked !== this.state.currChecked) {
        this.setState({ currChecked });
        this.props.onToggle(currChecked);
      }
    } else {
      this.setState((prevState, prevProps) => {
        const currChecked = !prevState.currChecked;
        this.props.onToggle(currChecked);
        return { currChecked };
      });
    }
  }

  render() {
    const { style, checked, onToggle, padding, label, ...attributes } = this.props;
    const { currChecked } = this.state;
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
  const { currChecked } = context.state;
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
      background: currChecked ? theme.accent : theme.altHigh,
      border: `2px solid ${currChecked ? theme.accent : theme.baseMediumHigh}`,
      borderRadius: height,
      transition: "all .25s 0s ease-in-out"
    }),
    button: {
      transform: `translateX(${currChecked ? Number(width) - Number(height) + padding : padding}px)`,
      flex: "0 0 auto",
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
      width: itemSize,
      height: itemSize,
      borderRadius: itemSize,
      background: currChecked ? "#fff" : theme.baseMediumHigh,
      transition: "all .25s 0s ease-in-out"
    }
  };
}

import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  /**
   * The control Toggle `status`.
   */
  defaultToggled?: boolean;
  /**
   * onToggle `callback`.
   */
  onToggle?: (isOpen?: boolean) => void;
  /**
   * Set custom size, Refer to the `height` of the component.
   */
  size?: number;
  /**
   * Set custom `label text`.
   */
  label?: string;
  /**
   * Set custom Toggle `background`.
   */
  background?: string;
  checked?: boolean;
}
export interface ToggleProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ToggleState {
  currToggled?: boolean;
}

const emptyFunc = () => {};
export class Toggle extends React.Component<ToggleProps, ToggleState> {
  static defaultProps: ToggleProps = {
    size: 18,
    onToggle: emptyFunc
  };

  state: ToggleState = {
    currToggled: this.props.defaultToggled
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillReceiveProps(nextProps: ToggleProps) {
    const { defaultToggled } = nextProps;
    if (this.state.currToggled !== defaultToggled) {
      this.setState({ currToggled: defaultToggled });
    }
  }

  toggleToggle = (currToggled?: any) => {
    if (typeof currToggled === "boolean") {
      if (currToggled !== this.state.currToggled) {
        this.props.onToggle(currToggled);
        this.setState({ currToggled });
      }
    } else {
      this.setState((prevState, prevProps) => {
        currToggled = !prevState.currToggled;
        this.props.onToggle(currToggled);
        return { currToggled };
      });
    }
  }

  render() {
    const {
      style,
      className,
      defaultToggled,
      onToggle,
      label,
      background,
      ...attributes
    } = this.props;
    const { currToggled } = this.state;
    const { theme } = this.context;
    const styles = theme.prepareStyles({
      styles: getStyles(this),
      className: "toggle"
    });

    return (
      <div
        {...attributes}
        style={styles.root.style}
        className={theme.classNames(styles.root.className, className)}
      >
        <div
          {...styles.wrapper}
          onClick={this.toggleToggle}
        >
          <div {...styles.button} />
        </div>
        {label && (
          <span {...styles.label}>
            {label}
          </span>
        )}
      </div>
    );
  }
}

function getStyles(toggle: Toggle): {
  root?: React.CSSProperties;
  wrapper?: React.CSSProperties;
  button?: React.CSSProperties;
  label?: React.CSSProperties;
} {
  const { size, background, style } = toggle.props;
  const { theme } = toggle.context;
  const { currToggled } = toggle.state;

  return {
    root: theme.prefixStyle({
      display: "inline-block",
      verticalAlign: "middle",
      cursor: "default",
        ...style
    }),
    wrapper: theme.prefixStyle({
      userSelect: "none",
      position: "relative",
      display: "inline-block",
      verticalAlign: "middle",
      boxSizing: "content-box",
      width: size * 2.5,
      height: size,
      background: currToggled ? theme.accent : (background || "none"),
      border: `${size / 9}px solid ${currToggled ? theme.accent : theme.baseMediumHigh}`,
      borderRadius: size * 2,
      transition: "all .25s ease-in-out"
    }),
    button: theme.prefixStyle({
      transform: `translateX(${currToggled ? size * 2.5 - size / 1.5 - size / 9 : size / 4.5}px)`,
      flex: "0 0 auto",
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
      width: size / 1.5,
      height: size / 1.5,
      borderRadius: size / 1.5,
      background: currToggled ? "#fff" : theme.baseMediumHigh,
      transition: "all .25s 0s ease-in-out"
    }),
    label: {
      marginLeft: size / 4,
      verticalAlign: "middle",
      fontSize: size / 1.5,
      lineHeight: `${size / 1.5}px`
    }
  };
}

export default Toggle;

import * as React from "react";
import * as PropTypes from "prop-types";

import ElementState from "../ElementState";

export interface DataProps {
  /**
   * Default checked status.
   */
  defaultChecked?: true | false;
  /**
   * `Disabled` the RadioButton.
   */
  disabled?: boolean;
  /**
   * `onCheck` call back.
   */
  onCheck?: (currChecked?: boolean) => void;
  /**
   * Control RadioButton `RadioButton`.
   */
  size?: number;
  /**
   * Set RadioButton `label`.
   */
  label?: string;
}

export interface RadioButtonProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
export interface RadioButtonState {
  currChecked?: boolean;
  hovered?: boolean;
}

const rootStyle: React.CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
  cursor: "default"
};
const emptyFunc = () => {};
export class RadioButton extends React.Component<RadioButtonProps, RadioButtonState> {
  static defaultProps: RadioButtonProps = {
    size: 24,
    onCheck: emptyFunc
  };

  state: RadioButtonState = {
    currChecked: this.props.defaultChecked
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  rootElm: HTMLSpanElement;

  componentWillReceiveProps(nextProps: RadioButtonProps) {
    this.setState({
      currChecked: nextProps.defaultChecked
    });
  }

  handleClick = (e?: React.MouseEvent<HTMLDivElement>) => {
    const { currChecked } = this.state;
    if (!currChecked) {
      this.setState({ currChecked: true });
    }
    this.props.onCheck(true);
  }

  handleMouseEnter = (e?: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: true });
  }

  handleMouseLeave = (e?: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: false });
  }

  render() {
    const {
      defaultChecked,
      onCheck,
      style,
      size,
      disabled,
      label,
      className,
      ...attributes
    } = this.props;
    const { currChecked, hovered } = this.state;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "radio-button",
      styles: inlineStyles
    });

    const normalRender = (
      <div
        onClick={disabled ? void 0 : this.handleClick}
        onMouseEnter={disabled ? void 0 : this.handleMouseEnter}
        onMouseLeave={disabled ? void 0 : this.handleMouseLeave}
        {...styles.wrapper}
      >
        <div {...styles.content} />
      </div>
    );

    return (
      <div
        ref={(rootElm => this.rootElm = rootElm)}
        {...attributes}
        style={styles.root.style}
        className={theme.classNames(styles.root.className, className)}
      >
        {label ? (
          <div {...styles.label}>
            {normalRender}
            <span {...styles.labelText}>
              {label}
            </span>
          </div>
        ) : normalRender}
      </div>
    );
  }
}

function getStyles(radioButton: RadioButton) {
  const {
    props: {
      style,
      size,
      disabled
    },
    state: {
      currChecked,
      hovered
    },
    context: { theme }
  } = radioButton;
  const dotSize = size / 2.5;

  return {
    root: style ? theme.prefixStyle({
      ...rootStyle,
      ...style
    }) : rootStyle,
    wrapper: theme.prefixStyle({
      position: "relative",
      flex: "0 0 auto",
      display: "inline-block",
      borderRadius: size,
      color: theme.altHigh,
      border: disabled ? `${size / 12}px solid ${theme.baseLow}` : `${size / 12}px solid ${currChecked ? theme.accent : (
        hovered ? theme.baseHigh : theme.baseMediumHigh
      )}`,
      width: size,
      height: size,
      overflow: "hidden",
      transition: "all .25s ease-in-out"
    }),
    content: theme.prefixStyle({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: "auto",
      background: disabled ? theme.baseLow : (
        hovered ? theme.baseHigh : theme.baseMediumHigh
      ),
      transition: "all .25s",
      borderRadius: dotSize,
      width: dotSize,
      height: dotSize,
      transform: `scale(${currChecked ? 1 : 0})`
    }),
    label: theme.prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }),
    labelText: {
      fontSize: size / 2,
      lineHeight: `${size}px`,
      color: disabled ? theme.baseLow : theme.baseMediumHigh,
      marginLeft: size / 4,
      cursor: "text"
    }
  };
}

export default RadioButton;

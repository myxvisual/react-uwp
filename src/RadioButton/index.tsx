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
  mouseDowned?: boolean;
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

  handleMouseDown = (e?: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ mouseDowned: true });
  }

  handleMouseUp = (e?: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ mouseDowned: false });
  }

  render() {
    const {
      defaultChecked,
      onCheck,
      style,
      size,
      disabled,
      label,
      ...attributes
    } = this.props;
    const { currChecked, hovered, mouseDowned } = this.state;
    const dotSize = size / 2.5;
    const { theme } = this.context;
    const normalRender = (
      <div
        onClick={disabled ? void 0 : this.handleClick}
        onMouseEnter={disabled ? void 0 : this.handleMouseEnter}
        onMouseLeave={disabled ? void 0 : this.handleMouseLeave}
        onMouseDown={disabled ? void 0 : this.handleMouseDown}
        onMouseUp={disabled ? void 0 : this.handleMouseUp}
        style={theme.prefixStyle({
          position: "relative",
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
        })}
      >
        <div
          style={theme.prefixStyle({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: "auto",
            background: disabled ? theme.baseLow : (
              hovered ? theme.baseHigh : theme.baseMediumHigh
            ),
            borderRadius: dotSize,
            width: dotSize,
            height: dotSize,
            transform: `scale(${currChecked ? 1 : 0})`
          })}
        />
      </div>
    );

    return (
      <div
        ref={(rootElm => this.rootElm = rootElm)}
        {...attributes}
        style={style ? theme.prefixStyle({
          ...rootStyle,
          ...style
        }) : rootStyle}
      >
        {label ? (
          <div
            style={theme.prefixStyle({
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            })}
          >
            {normalRender}
            <span
              style={{
                fontSize: size / 2,
                lineHeight: `${size}px`,
                color: disabled ? theme.baseLow : theme.baseMediumHigh,
                marginLeft: size / 4,
                cursor: "text"
              }}
            >
              {label}
            </span>
          </div>
        ) : normalRender}
      </div>
    );
  }
}

export default RadioButton;

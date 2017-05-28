import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "../styles/ThemeType";

import ElementState from "../ElementState";

export interface DataProps {
  isChecked?: true | false;
  disabled?: boolean;
  onCheck?: (currChecked?: boolean) => void;
  size?: number;
  label?: string;
}

export interface RadiusButtonProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
export interface RadiusButtonState {
  currChecked?: boolean;
  hovered?: boolean;
  mouseDowned?: boolean;
}

const emptyFunc = () => {};
export default class RadiusButton extends React.Component<RadiusButtonProps, RadiusButtonState> {
  static defaultProps: RadiusButtonProps = {
    size: 24,
    onCheck: emptyFunc
  };

  state: RadiusButtonState = {
    currChecked: this.props.isChecked
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };
  rootElm: HTMLSpanElement;

  componentWillReceiveProps(nextProps: RadiusButtonProps) {
    this.setState({
      currChecked: this.props.isChecked
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
      isChecked,
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

    return (
      <div
        ref={(rootElm => this.rootElm = rootElm)}
        {...attributes}
        style={theme.prepareStyles({ display: "inline-block", verticalAlign: "middle", ...style})}
      >
        <div
          onClick={disabled ? void 0 : this.handleClick}
          onMouseEnter={disabled ? void 0 : this.handleMouseEnter}
          onMouseLeave={disabled ? void 0 : this.handleMouseLeave}
          onMouseDown={disabled ? void 0 : this.handleMouseDown}
          onMouseUp={disabled ? void 0 : this.handleMouseUp}
          style={theme.prepareStyles({
            position: "relative",
            display: "inline-block",
            borderRadius: size,
            color: theme.altHigh,
            border: disabled ? `2px solid ${theme.baseLow}` : `2px solid ${currChecked ? theme.accent : (
              hovered ? theme.baseHigh : theme.baseMediumHigh
            )}`,
            width: size,
            height: size,
            overflow: "hidden",
            transition: "all .25s ease-in-out"
          })}
        >
          <div
            style={theme.prepareStyles({
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
        {label && (
          <span
            style={{
              verticalAlign: "super",
              color: disabled ? theme.baseLow : theme.baseMediumHigh,
              marginLeft: 8,
              cursor: "default"
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }
}

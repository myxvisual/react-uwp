import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "../styles/ThemeType";

export interface DataProps {
  hoverStyle?: React.CSSProperties;
  focusStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  onChangeValue?: (value: string) => void;
  leftNode?: any;
  rightNode?: any;
  background?: string;
}

type Attributes = React.HTMLAttributes<HTMLDivElement> | React.HTMLAttributes<HTMLInputElement>;

export interface InputProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export interface InputState {
  hovered?: boolean;
  focused?: boolean;
}
const emptyFunc = () => {};
export default class Input extends React.Component<InputProps, InputState> {
  static defaultProps: InputProps = {
    inputStyle: {
      fontSize: "inherit",
      outline: "none",
      transition: "all .25s"
    },
    onFocus: emptyFunc,
    onBlur: emptyFunc,
    onChange: emptyFunc,
    onChangeValue: emptyFunc
  };

  state: InputState = {};
  rootElm: HTMLDivElement;
  input: HTMLInputElement;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  handleClick = (e?: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: false });
  }

  handleHover = (e?: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: true });
    this.handleBlur = () => {};
  }

  handleUnHover = (e?: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: false });
    this.handleBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
      this.setState({ focused: false });
      this.props.onBlur(e as any);
    };
  }

  handleFocus = (e?: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ focused: true });
    this.props.onFocus(e as any);
  }

  handleBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ focused: false });
    this.props.onBlur(e as any);
  }

  setValue = (value: string) => this.input.value = value;

  getValue = () => this.input.value;

  render() {
    const {
      hoverStyle, // tslint:disable-line:no-unused-variable
      focusStyle, // tslint:disable-line:no-unused-variable
      leftNode,
      rightNode,
      style,
      inputStyle,
      onChangeValue,
      children,
      background,
      ...attributes
    } = this.props;
    const { hovered, focused } = this.state;
    const haveChild = leftNode || rightNode;
    const { theme } = this.context;
    const currBackground = (background === void 0 ? theme.altHigh : background);

    return (
      <div
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleUnHover}
        ref={rootElm => this.rootElm = rootElm}
        style={theme.prepareStyles({
          height: 32,
          width: 296,
          padding: haveChild ? "0 10px" : void 0,
          fontSize: 15,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          color: "#000",
          background: focused ? "#fff" : currBackground,
          boxShadow: focused ? `inset 0px 0px 0 2px ${this.context.theme.accent}` : hovered ? `inset 0px 0px 0 2px ${theme.baseMedium}` : `inset 0px 0px 0 2px ${theme.baseLow}`,
          transition: "all .25s",
          ...style
        })}
        onClick={this.handleClick}
      >
        {leftNode}
        <input
          ref={input => this.input = input}
          {...attributes as any}
          style={theme.prepareStyles({
            color: focused ? "#000" : currBackground,
            width: "100%",
            height: "100%",
            background: "none",
            border: "none",
            outline: "none",
            transition: "all .25s",
            ...inputStyle
          })}
          onChange={(e) => {
            onChangeValue(e.currentTarget.value);
            attributes.onChange(e as any);
          }}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        {rightNode}
        {children}
      </div>
    );
  }
}

import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  /**
   * Applied `hoverStyle` to the root element.
   */
  hoverStyle?: React.CSSProperties;
  /**
   * Applied `focusStyle` to the root element.
   */
  focusStyle?: React.CSSProperties;
  /**
   * Applied `style` to the root input element.
   */
  textBoxStyle?: React.CSSProperties;
  /**
   * onChange value `callback`.
   */
  onChangeValue?: (value: string) => void;
  /**
   * Set `ReactNode` in input element left.
   */
  leftNode?: React.ReactNode;
  /**
   * Set `ReactNode` in input element right.
   */
  rightNode?: React.ReactNode;
  /**
   * Set TextBox `background`.
   */
  placeholder?: string;
  disabled?: string | boolean;
  background?: string;
  type?: string;
}

type Attributes = React.HTMLAttributes<HTMLDivElement> | React.HTMLAttributes<HTMLInputElement>;

export interface TextBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface TextBoxState {
  hovered?: boolean;
  focused?: boolean;
}
const emptyFunc = () => {};
export class TextBox extends React.Component<TextBoxProps, TextBoxState> {
  static defaultProps: TextBoxProps = {
    background: "none",
    textBoxStyle: {
      fontSize: "inherit",
      outline: "none",
      transition: "all .25s"
    },
    onFocus: emptyFunc,
    onBlur: emptyFunc,
    onChange: emptyFunc,
    onChangeValue: emptyFunc
  };

  state: TextBoxState = {};
  rootElm: HTMLDivElement;
  inputElm: HTMLInputElement;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

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

  setValue = (value: string) => this.inputElm.value = value;

  getValue = () => this.inputElm.value;

  render() {
    const {
      hoverStyle,
      focusStyle,
      leftNode,
      rightNode,
      style,
      className,
      textBoxStyle,
      onChange,
      onChangeValue,
      children,
      background,
      ...attributes
    } = this.props;
    const { hovered, focused } = this.state;
    const haveChild = leftNode || rightNode || children;
    const { theme } = this.context;
    const currBackground = (background === void 0 ? theme.altHigh : background);

    const hoverProps = {
      onMouseEnter: this.handleHover,
      onMouseLeave: this.handleUnHover
    };

    const rootWrapperStyle: React.CSSProperties = {
      lineHeight: "32px",
      height: 32,
      width: 296,
      padding: !haveChild ? "0 8px" : 0,
      fontSize: 14,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      color: focused ? "#000" : theme.baseHigh,
      background: focused ? "#fff" : currBackground || "none",
      boxShadow: focused ? `inset 0px 0px 0 2px ${this.context.theme.accent}` : hovered ? `inset 0px 0px 0 2px ${theme.baseMedium}` : `inset 0px 0px 0 2px ${theme.baseLow}`,
      border: "none",
      transition: "all .25s"
    };

    const inlineStyles = {
      root: haveChild ? theme.prefixStyle({
        ...rootWrapperStyle,
        ...style
      }) : {} as React.CSSProperties,
      input: theme.prefixStyle({
        ...(haveChild ? {
          paddingLeft: rightNode ? 8 : void 0,
          paddingRight: leftNode ? 8 : void 0,
          width: "100%",
          height: "100%",
          background: "none",
          border: "none",
          outline: "none",
          color: "inherit",
          transition: "all .25s"
        } : rootWrapperStyle),
        ...(haveChild ? void 0 : style),
        ...textBoxStyle
      }) as React.CSSProperties
    };
    const styles = theme.prepareStyles({
      className: "text-box",
      styles: inlineStyles
    });

    const normalRender = (
      <input
        ref={inputElm => {
          this.inputElm = inputElm;
          if (!haveChild) this.rootElm = inputElm as any;
        }}
        {...attributes as any}
        style={styles.input.style}
        className={theme.classNames(className, styles.input.className)}
        onChange={(e) => {
          onChangeValue(e.currentTarget.value);
          onChange(e as any);
        }}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        {...(haveChild ? void 0 : hoverProps)}
      />
    );

    return haveChild ? (
      <div
        ref={rootElm => this.rootElm = rootElm}
        {...attributes as any}
        {...hoverProps}
        {...styles.root}
        onClick={this.handleClick}
      >
        {leftNode}
        {normalRender}
        {children}
        {rightNode}
      </div>
    ) : normalRender;
  }
}

export default TextBox;

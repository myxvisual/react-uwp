import * as React from "react";
import * as PropTypes from "prop-types";

import TextBox from "../TextBox";
import Icon from "../Icon";

export interface DataProps {
  /**
   * Control default `show password`.
   */
  defaultShowPassword?: boolean;
  /**
   * onChangeValue `callback`.
   */
  onChangeValue?: (value: string) => void;
  /**
   * Control PasswordBox `height` and `icon size`.
   */
  passwordBoxHeight?: number;
  placeholder?: string;
}

export interface PasswordBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface PasswordBoxState {
  showPassword?: boolean;
}

const emptyFunc = () => {};
export class PasswordBox extends React.Component<PasswordBoxProps, PasswordBoxState> {
  static defaultProps: PasswordBoxProps = {
    passwordBoxHeight: 32,
    defaultShowPassword: false,
    onChangeValue: emptyFunc
  };

  state: PasswordBoxState = {
    showPassword: this.props.defaultShowPassword
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  textBox: TextBox;

  handleChange = (e?: any | React.SyntheticEvent<HTMLInputElement>) => {
    let event: React.SyntheticEvent<HTMLInputElement>;
    event = e;
    this.props.onChangeValue(event.currentTarget.value);
  }

  getValue = () => this.textBox.getValue();

  setValue = (value: string) => this.textBox.setValue(value);

  toggleShowPassword = (showPassword?: any) => {
    if (typeof showPassword === "boolean") {
      if (showPassword !== this.state.showPassword) {
        this.setState({ showPassword });
      }
    } else {
      this.setState((prevState, prevProps) => {
        showPassword = !prevState.showPassword;
        return { showPassword };
      });
    }
  }

  render() {
    const {
      onChangeValue,
      defaultShowPassword,
      passwordBoxHeight,
      ...attributes
    } = this.props;
    const { showPassword } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <TextBox
        {...attributes}
        type={showPassword ? "text" : "password"}
        ref={textBox => this.textBox = textBox}
        style={styles.root}
        hoverStyle={{
          border: `2px solid ${theme.accent}`
        }}
        rightNode={<Icon
          onClick={this.toggleShowPassword}
          style={theme.prefixStyle({
            width: passwordBoxHeight,
            height: passwordBoxHeight,
            fontSize: passwordBoxHeight / 2,
            lineHeight: `${passwordBoxHeight}px`,
            cursor: "pointer",
            background: "none",
            color: theme.baseHigh,
            flex: "0 0 auto",
            transition: "all .25s"
          })}
          hoverStyle={{
            color: "#fff",
            background: theme.accent
          }}
        >
          RevealPasswordLegacy
        </Icon>}
        onChange={this.handleChange}
      />
    );
  }
}

function getStyles(passwordBox: PasswordBox): {
  root?: React.CSSProperties;
} {
  const { context, props: { style, passwordBoxHeight } } = passwordBox;
  const { theme } = context;

  return {
    root: theme.prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden",
      fontWeight: "lighter",
      fontSize: passwordBoxHeight / 2,
      padding: 0,
      ...style,
      height: passwordBoxHeight
    })
  };
}

export default PasswordBox;

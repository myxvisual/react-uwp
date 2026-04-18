import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useMemo } from 'react';
import TextBox from './TextBox';
import Icon from './Icon';

export interface DataProps {
  defaultShowPassword?: boolean;
  onChangeValue?: (value: string) => void;
  passwordBoxHeight?: number;
  placeholder?: string;
}
export interface PasswordBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const PasswordBox: React.FC<PasswordBoxProps> = ({
  passwordBoxHeight = 32,
  defaultShowPassword = false,
  onChangeValue,
  style,
  ...attributes
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(defaultShowPassword);
  const textBox = useRef<TextBox>(null);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    onChangeValue?.(e.currentTarget.value);
  };

  const getValue = () => textBox.current?.getValue();
  const setValue = (value: string) => textBox.current?.setValue(value);

  // 挂载方法到组件实例
  PasswordBox.getValue = getValue;
  PasswordBox.setValue = setValue;

  const styles = useMemo(() => getStyles(theme, style, passwordBoxHeight), [theme, style, passwordBoxHeight]);

  const toggleShowPassword = (show?: boolean) => {
    setShowPassword(prev => show ?? !prev);
  };

  return (
    <TextBox
      {...attributes}
      type={showPassword ? "text" : "password"}
      ref={textBox}
      style={styles.root}
      hoverStyle={{
        border: `2px solid ${theme.accent}`
      }}
      rightNode={<Icon
        onClick={() => toggleShowPassword()}
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
      onChange={handleChange}
    />
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, style?: React.CSSProperties, passwordBoxHeight = 32) => {
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
      paddingLeft: 8,
      ...style,
      height: passwordBoxHeight
    })
  };
};


export default PasswordBox;

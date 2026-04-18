import { useTheme } from './hooks/useTheme';
import React, { useState, useRef } from 'react';
import RevealEffect from './RevealEffect';

export interface DataProps {
  hoverStyle?: React.CSSProperties;
  focusStyle?: React.CSSProperties;
  textBoxStyle?: React.CSSProperties;
  onChangeValue?: (value: string) => void;
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  placeholder?: string;
  disabled?: string | boolean;
  background?: string;
  type?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
export interface TextBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const TextBox: React.FC<TextBoxProps> = ({
  background = "none",
  textBoxStyle = { fontSize: "inherit", outline: "none", transition: "all .25s" },
  onFocus = () => {},
  onBlur = () => {},
  onChange = () => {},
  onChangeValue = () => {},
  leftNode,
  rightNode,
  style,
  className,
  children,
  ...attributes
}) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootElm = useRef<HTMLDivElement>(null);
  const inputElm = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setHovered(false);
  };

  const handleHover = () => {
    setHovered(true);
  };

  const handleUnHover = () => {
    setHovered(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur(e);
  };

  const setValue = (value: string) => {
    if (inputElm.current) {
      inputElm.current.value = value;
    }
  };
  const getValue = () => inputElm.current?.value || "";
  TextBox.setValue = setValue;
  TextBox.getValue = getValue;

  const haveChild = leftNode || rightNode || children;
  const currBackground = background ?? theme.altHigh;

  const rootWrapperStyle: React.CSSProperties = {
    position: "relative",
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
    border: focused ? `${theme.borderWidth}px solid ${theme.accent}` : hovered ? `${theme.borderWidth}px solid ${theme.baseMedium}` : `${theme.borderWidth}px solid ${theme.baseLow}`,
    transition: "all .25s"
  };

  const inlineStyles = {
    root: theme.prefixStyle({
      ...rootWrapperStyle,
      ...style
    }),
    input: theme.prefixStyle({
      display: "block",
      paddingLeft: rightNode ? 8 : undefined,
      paddingRight: leftNode ? 8 : undefined,
      width: "100%",
      height: "100%",
      background: "none",
      border: "none",
      outline: "none",
      color: "inherit",
      transition: "all .25s",
      margin: 0,
      "&::placeholder": {
        color: theme.baseMediumHigh
      },
      ...textBoxStyle
    }) as React.CSSProperties
  };
  const styles = theme.prepareStyles({
    className: "text-box",
    styles: inlineStyles
  });

  const normalRender = (
    <input
      ref={inputElm}
      {...attributes as any}
      style={styles.input.style}
      className={theme.classNames(className, styles.input.className)}
      onChange={(e) => {
        onChangeValue(e.currentTarget.value);
        onChange(e);
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...(!haveChild ? { onMouseEnter: handleHover, onMouseLeave: handleUnHover } : {})}
    />
  );

  return (
    <div
      ref={rootElm}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnHover}
      style={styles.root.style}
      className={styles.root.className}
      onClick={handleClick}
      {...attributes}
    >
      {leftNode}
      {normalRender}
      {children}
      {rightNode}
      {!focused && <RevealEffect />}
    </div>
  );
};


export default TextBox;

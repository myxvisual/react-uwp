import { useTheme } from './hooks/useTheme';
import React, { useState, useEffect } from 'react';

export interface DataProps {
  defaultToggled?: boolean;
  onToggle?: (isOpen?: boolean) => void;
  size?: number;
  label?: string;
  background?: string;
  checked?: boolean;
}
export interface ToggleProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const Toggle: React.FC<ToggleProps> = ({
  style,
  className,
  defaultToggled = false,
  onToggle,
  label,
  background,
  size = 18,
  checked,
  ...attributes
}) => {
  const theme = useTheme();
  const [currToggled, setCurrToggled] = useState(checked ?? defaultToggled);

  // 受控组件处理
  useEffect(() => {
    if (checked !== undefined) {
      setCurrToggled(checked);
    }
  }, [checked]);

  // defaultToggled变化同步
  useEffect(() => {
    if (checked === undefined && defaultToggled !== currToggled) {
      setCurrToggled(defaultToggled);
    }
  }, [defaultToggled]);

  const toggleToggle = () => {
    const newToggled = !currToggled;
    if (checked === undefined) {
      setCurrToggled(newToggled);
    }
    onToggle?.(newToggled);
  };

  const styles = getStyles(theme, { size, background, style, currToggled });

  return (
    <div
      {...attributes}
      style={styles.root.style}
      className={theme.classNames(styles.root.className, className)}
    >
      <div
        style={styles.wrapper.style}
        className={styles.wrapper.className}
        onClick={toggleToggle}
      >
        <div style={styles.button.style} className={styles.button.className} />
      </div>
      {label && (
        <span style={styles.label.style} className={styles.label.className}>
          {label}
        </span>
      )}
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  size: number;
  background?: string;
  style?: React.CSSProperties;
  currToggled: boolean;
}) => {
  const { size, background, style, currToggled } = props;

  const root = theme.prepareStyle({
    className: "toggle-root",
    style: theme.prefixStyle({
      display: "inline-block",
      verticalAlign: "middle",
      cursor: "default",
      ...style
    })
  });

  const wrapper = theme.prepareStyle({
    className: "toggle-wrapper",
    style: theme.prefixStyle({
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
    })
  });

  const button = theme.prepareStyle({
    className: "toggle-button",
    style: theme.prefixStyle({
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
    })
  });

  const label = theme.prepareStyle({
    className: "toggle-label",
    style: {
      marginLeft: size / 4,
      verticalAlign: "middle",
      fontSize: size / 1.5,
      lineHeight: `${size / 1.5}px`
    }
  });

  return { root, wrapper, button, label };
};


export default Toggle;

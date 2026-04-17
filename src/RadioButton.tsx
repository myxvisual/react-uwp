import * as React from "react";
import { useContext, useState, useCallback } from "react";

export interface DataProps {
  /**
   * Checked state of the radio button.
   * If provided, component becomes controlled.
   */
  checked?: true | false;
  /**
   * Default checked status for uncontrolled usage.
   */
  defaultChecked?: true | false;
  /**
   * `Disabled` the RadioButton.
   */
  disabled?: boolean;
  /**
   * `onCheck` call back, fired when radio is selected.
   */
  onCheck?: (currChecked: boolean) => void;
  /**
   * Control RadioButton size.
   */
  size?: number;
  /**
   * Set RadioButton `label`.
   */
  label?: string;
  /**
   * Set RadioButton outside shape style.
   */
  radioStyle?: React.CSSProperties;
  /**
   * Set RadioButton outside shape checked style.
   */
  radioCheckedStyle?: React.CSSProperties;
  /**
   * Set RadioButton inside dot style.
   */
  radioDotStyle?: React.CSSProperties;
  /**
   * Set RadioButton inside dot checked style.
   */
  radioDotCheckedStyle?: React.CSSProperties;
}

export type RadioButtonProps = DataProps & React.HTMLAttributes<HTMLSpanElement>;

const RadioButton: React.FC<RadioButtonProps> = (props) => {
  const {
    checked: propsChecked,
    defaultChecked = false,
    disabled,
    onCheck,
    size = 24,
    label,
    className,
    style,
    radioStyle,
    radioCheckedStyle,
    radioDotStyle,
    radioDotCheckedStyle,
    ...attributes
  } = props;

  const theme = useContext<ReactUWP.ThemeType>({ theme: {} } as any);

  // Internal state for uncontrolled mode
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [hovered, setHovered] = useState(false);

  // Effective checked value: controlled takes precedence
  const checked = propsChecked !== void 0 ? propsChecked : internalChecked;

  const handleClick = useCallback((e?: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (!checked) {
      if (propsChecked === void 0) {
        setInternalChecked(true);
      }
      onCheck?.(true);
    }
  }, [checked, disabled, propsChecked, onCheck]);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) setHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (!disabled) setHovered(false);
  }, [disabled]);

  const cls = getCls(theme, props, checked, hovered);

  const normalRender = (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cls.radioShapeClass}
      style={cls.radioShape}
    >
      <div className={cls.radioDotClass} style={cls.radioDot} />
    </div>
  );

  return (
    <div
      {...attributes}
      style={cls.root}
      className={theme.classNames?.(cls.rootClass, className) || cls.rootClass}
    >
      {label ? (
        <div className={cls.labelClass} style={cls.label}>
          {normalRender}
          <span className={cls.labelTextClass} style={cls.labelText}>
            {label}
          </span>
        </div>
      ) : normalRender}
    </div>
  );
};

export default RadioButton;

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const rootStyle: React.CSSProperties = {
  display: "inline-block",
  verticalAlign: "middle",
  cursor: "default"
};

const getCls = (theme: ReactUWP.ThemeType, props: RadioButtonProps, checked: boolean, hovered: boolean) => {
  const {
    style,
    size = 24,
    disabled,
    radioStyle,
    radioCheckedStyle,
    radioDotStyle,
    radioDotCheckedStyle
  } = props;
  const dotSize = size / 2.5;

  const rawStyles = {
    root: theme.prefixStyle({
      ...rootStyle,
      ...style
    }),
    radioShape: theme.prefixStyle({
      position: "relative",
      flex: "0 0 auto",
      display: "inline-block",
      borderRadius: size,
      color: theme.altHigh,
      border: disabled ? `${size / 12}px solid ${theme.baseLow}` : `${size / 12}px solid ${checked ? theme.accent : (
        hovered ? theme.baseHigh : theme.baseMediumHigh
      )}`,
      width: size,
      height: size,
      overflow: "hidden",
      transition: "all .25s ease-in-out",
      ...radioStyle,
      ...(checked ? radioCheckedStyle : void 0)
    }),
    radioDot: theme.prefixStyle({
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
      transform: `scale(${checked ? 1 : 0})`,
      ...radioDotStyle,
      ...(checked ? radioDotCheckedStyle : void 0)
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

  const classMap = theme.prepareStyles({ styles: rawStyles, className: "radio-button" });
  
  return {
    root: rawStyles.root,
    rootClass: classMap.root,
    radioShape: rawStyles.radioShape,
    radioShapeClass: classMap.radioShape,
    radioDot: rawStyles.radioDot,
    radioDotClass: classMap.radioDot,
    label: rawStyles.label,
    labelClass: classMap.label,
    labelText: rawStyles.labelText,
    labelTextClass: classMap.labelText
  };
};

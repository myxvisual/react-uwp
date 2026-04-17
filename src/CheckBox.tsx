import * as React from "react";
import { useContext, useState, useCallback } from "react";
import { CSSProperties as KoCSSProperties } from "koss";

import Icon from "./Icon";
import PseudoClasses from "./PseudoClasses";

export interface DataProps {
  /**
   * Checked state of the checkbox.
   * true: checked, false: unchecked, null: indeterminate.
   * If provided, component becomes controlled and ignores defaultChecked.
   */
  checked?: true | false | null;
  /**
   * Initial checked state for uncontrolled usage.
   * @default null
   */
  defaultChecked?: true | false | null;
  /**
   * Callback fired when checkbox state changes.
   * Required for controlled component.
   */
  onChange?: (checked: boolean | null) => void;
  /**
   * @deprecated Use onChange instead.
   */
  onCheck?: (checked?: boolean) => void;
  /**
   * Position of the label relative to the checkbox.
   * @default "right"
   */
  labelPosition?: "left" | "right";
  /**
   * Custom background color for the checkbox.
   */
  background?: string;
  /**
   * Size of the checkbox in pixels.
   * @default 20
   */
  size?: string | number;
  /**
   * Text label displayed next to the checkbox.
   */
  label?: string;
  /**
   * If true, checkbox is disabled and cannot be interacted with.
   */
  disabled?: boolean | string;
}

export type CheckBoxProps = DataProps & React.HTMLAttributes<HTMLDivElement>;

const CheckBox: React.FC<CheckBoxProps> = (props) => {
  const {
    checked: propsChecked,
    defaultChecked = null,
    onChange,
    onCheck,
    onClick,
    label,
    disabled,
    className,
    size = 20,
    labelPosition = "right",
    ...attributes
  } = props;

  const theme = useContext<ReactUWP.ThemeType>({ theme: {} } as any);

  // Internal state for uncontrolled mode
  const [internalChecked, setInternalChecked] = useState<boolean | null>(
    propsChecked !== void 0 ? propsChecked : defaultChecked
  );

  // Get effective checked value: controlled takes precedence
  const checked = propsChecked !== void 0 ? propsChecked : internalChecked;

  const toggleChecked = useCallback((e?: React.SyntheticEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    // Toggle between true/false, keep null as is for indeterminate
    const newChecked = checked === null ? null : !checked;

    if (propsChecked === void 0) {
      // Uncontrolled mode: update internal state
      setInternalChecked(newChecked);
    }

    onChange?.(newChecked);
    onCheck?.(newChecked as boolean); // Legacy callback for backward compatibility
  }, [checked, disabled, propsChecked, onChange, onCheck]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) toggleChecked(e);
    onClick?.(e);
  }, [disabled, toggleChecked, onClick]);

  // Merge props with default values for style calculation
  const mergedProps = { ...props, size, labelPosition };
  // Get all style classes in one call
  const cls = getCls(theme, mergedProps, checked);
  const haveLabel = label !== void 0;

  const checkbox = (
    <PseudoClasses className={cls.iconParent} disabled={disabled}>
      <div>
        <Icon style={cls.iconStyle}>CheckMarkZeroWidthLegacy</Icon>
      </div>
    </PseudoClasses>
  );

  return (
    <div {...attributes} onClick={handleClick} className={cls.wrapper}>
      {haveLabel ? (
        <div className={cls.root}>
          {checkbox}
          {label && <span className={cls.label}>{label}</span>}
        </div>
      ) : checkbox}
    </div>
  );
};

export default CheckBox;

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, props: CheckBoxProps & { size?: string | number, labelPosition?: "left" | "right" }, checked: boolean | null) => {
  const { style, size, disabled, labelPosition, background, className } = props;
  const checkedIsNull = checked === null;
  const leftLabelPosition = labelPosition === "left";

  const iconParentBase: React.CSSProperties & KoCSSProperties = theme.prefixStyle({
    transition: "all .25s",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.altHigh,
    border: `${theme.borderWidth}px solid ${theme.baseMediumHigh}`,
    width: `${size}px`,
    height: `${size}px`,
    background: background || "none",
    cursor: "default",
    overflow: "hidden"
  });

  const iconParentHover = { border: `${theme.borderWidth}px solid ${theme.baseHigh}` };
  let iconParent: React.CSSProperties & KoCSSProperties;
  switch (checked) {
    case true:
      iconParent = {
        ...iconParentBase,
        border: disabled ? `${theme.borderWidth}px solid ${theme.baseLow}` : `${theme.borderWidth}px solid ${theme.accent}`,
        "&:hover": disabled ? void 0 : iconParentHover,
        "&:disabled": { border: `${theme.borderWidth}px solid ${theme.baseLow}` }
      };
      break;
    case false:
      iconParent = {
        ...iconParentBase,
        border: disabled ? `${theme.borderWidth}px solid ${theme.baseLow}` : `${theme.borderWidth}px solid ${theme.baseMediumHigh}`,
        "&:hover": disabled ? void 0 : iconParentHover,
        "&:disabled": { border: `${theme.borderWidth}px solid ${theme.baseLow}` }
      };
      break;
    case null:
      iconParent = {
        ...iconParentBase,
        border: disabled ? `${theme.borderWidth}px solid ${theme.baseLow}` : `${theme.borderWidth}px solid ${theme.baseMediumHigh}`,
        "&:hover": disabled ? void 0 : iconParentHover,
        "&:disabled": { border: `${theme.borderWidth}px solid ${theme.baseLow}` }
      };
      break;
  }

  const styles = {
    wrapper: theme.prefixStyle({
      position: "relative",
      display: "inline-block",
      verticalAlign: "middle",
      ...style
    }),
    root: theme.prefixStyle({
      display: "flex",
      flex: "0 0 auto",
      justifyContent: leftLabelPosition ? "flex-end" : "flex-start",
      flexDirection: leftLabelPosition ? "row-reverse" : "row",
      alignItems: "center"
    }),
    iconParent,
    label: theme.prefixStyle({
      color: disabled ? theme.baseLow : theme.baseMediumHigh,
      [`margin${leftLabelPosition ? "Right" : "Left"}`]: 8
    })
  };

  const classMap = theme.prepareStyles({ styles, className: "checkbox" });
  const iconStyle = theme.prefixStyle({
    transition: "all .25s",
    color: disabled ? (
      checkedIsNull ? "transparent" : theme.baseLow
    ) : (
      checkedIsNull ? theme.accent : "#fff"
    ),
    flex: "0 0 auto",
    padding: 0,
    margin: 0,
    width: size,
    height: size,
    fontSize: 18,
    transform: checked ? "scale(1)" : (
      checkedIsNull ? "scale(0.6125)" : "scale(0)"
    ),
    background: disabled ? (checkedIsNull ? theme.baseLow : void 0) : theme.accent
  });

  return {
    wrapper: theme.classNames(classMap.wrapper, className),
    root: classMap.root,
    iconParent: classMap.iconParent,
    label: classMap.label,
    iconStyle
  };
};

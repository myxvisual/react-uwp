import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";
import PseudoClasses from "../PseudoClasses";

export interface DataProps {
  /**
   * Checkbox is checked if `true`.
   */
  defaultChecked?: true | false | null;
  /**
   * `Callback` function that is fired when the checkbox is checked.
   */
  onCheck?: (checked?: boolean) => void;
  /**
   * If use `label`, `labelPosition` to control label position.
   */
  labelPosition?: "left" | "right";
  /**
   * Set custom background to CheckBox.
   */
  background?: string;
  size?: string | number;
  label?: string;
  disabled?: boolean | string;
}

export interface CheckBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CheckBoxState {
  checked?: boolean;
}

const emptyFunc = () => {};

export class CheckBox extends React.Component<CheckBoxProps, CheckBoxState> {
  static defaultProps: CheckBoxProps = {
    defaultChecked: null,
    onCheck: emptyFunc,
    onClick: emptyFunc,
    size: 20,
    labelPosition: "right",
    label: void 0
  };

  state: CheckBoxState = {
    checked: this.props.defaultChecked
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  /**
   * rootElm `HTMLDivElement`
   */
  rootElm: HTMLDivElement;

  componentWillReceiveProps(nextProps: CheckBoxProps) {
    this.setState((prevState, prevProps) => ({
      checked: nextProps.defaultChecked
    }));
  }

  /**
   * `Public` Toggle Checked Method.
   */
  toggleChecked = (e?: React.SyntheticEvent<HTMLDivElement>) => {
    let checked: boolean;
    this.setState((prevState, prevProps) => {
      checked = !prevState.checked;
      return { checked };
    }, () => this.props.onCheck(checked));
  }

  handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { disabled, onClick } = this.props;
    if (!disabled) this.toggleChecked(e);
    onClick(e);
  }

  render() {
    const {
      defaultChecked,
      onCheck,
      label,
      labelPosition,
      disabled,
      background,
      style,
      ...attributes
    } = this.props;
    const { checked } = this.state;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "checkbox",
      styles: inlineStyles
    });
    const haveLabel = label !== void 0;

    const checkbox = (
      <PseudoClasses
        {...styles.iconParent}
        disabled={disabled}
      >
      <div ref={rootElm => this.rootElm = rootElm}>
        <Icon style={inlineStyles.icon}>
          CheckMarkZeroWidthLegacy
        </Icon>
      </div>
      </PseudoClasses>
    );

    return (
      <div
        {...attributes}
        onClick={this.handleClick}
        {...styles.wrapper}
      >
        {haveLabel ? (
          <div {...styles.root}>
            {checkbox}
            {label !== void 0 && (
              <span {...styles.label}>
                {label}
              </span>
            )}
          </div>
        ) : checkbox}
      </div>
    );
  }
}

function getStyles(checkBox: CheckBox): {
  wrapper?: React.CSSProperties;
  root?: React.CSSProperties;
  iconParent?: React.CSSProperties;
  icon?: React.CSSProperties;
  label?: React.CSSProperties;
} {
  const {
    context,
    props: { style, size, disabled, labelPosition, background },
    state: { checked }
  } = checkBox;
  const { theme } = context;
  const checkedIsNull = checked === null;

  const iconParentBase: React.CSSProperties = theme.prefixStyle({
    transition: "all .25s",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.altHigh,
    border: `2px solid ${theme.baseMediumHigh}`,
    width: `${size}px`,
    height: `${size}px`,
    background: background || "none",
    cursor: "default",
    overflow: "hidden"
  });

  const iconParentHover = { border: `2px solid ${theme.baseHigh}` };
  let iconParent: ReactUWP.CustomCSSProperties;

  switch (checked) {
    case true: {
      iconParent = {
        ...iconParentBase,
        border: disabled ? `2px solid ${theme.baseLow}` : `2px solid ${theme.accent}`,
        "&:hover": disabled ? void 0 : iconParentHover,
        "&:disabled": {
          border: `2px solid ${theme.baseLow}`
        }
      };
      break;
    }
    case false: {
      iconParent = {
        ...iconParentBase,
        border: disabled ? `2px solid ${theme.baseLow}` : `2px solid ${theme.baseMediumHigh}`,
        "&:hover": disabled ? void 0 : iconParentHover,
        "&:disabled": {
          border: `2px solid ${theme.baseLow}`
        }
      };
      break;
    }
    case null: {
      iconParent = {
        ...iconParentBase,
        border: disabled ? `2px solid ${theme.baseLow}` : `2px solid ${theme.baseMediumHigh}`,
        "&:hover": disabled ? void 0 : iconParentHover,
        "&:disabled": {
          border: `2px solid ${theme.baseLow}`
        }
      };
      break;
    }
    default: {
      break;
    }
  }

  const leftLabelPosition = labelPosition === "left";

  return {
    wrapper: theme.prefixStyle({
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
    icon: theme.prefixStyle({
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
    }),
    label: theme.prefixStyle({
      color: disabled ? theme.baseLow : theme.baseMediumHigh,
      [`margin${leftLabelPosition ? "Right" : "Left"}`]: 8
    })
  };
}

export default CheckBox;

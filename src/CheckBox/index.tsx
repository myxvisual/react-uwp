import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";
import ThemeType from "../styles/ThemeType";

export interface DataProps {
  /**
   * Checkbox is checked if `true`.
   */
  isChecked?: true | false | null;
  /**
   * `Callback` function that is fired when the checkbox is checked.
   */
  onCheck?: (checked?: boolean) => void;
  /**
   * If use `label`, `labelPosition` to control label position.
   */
  labelPosition?: "left" | "right";
}

export interface CheckBoxProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CheckBoxState {
  checked?: boolean;
  hovered?: boolean;
}

const emptyFunc = () => {};

export class CheckBox extends React.Component<CheckBoxProps, CheckBoxState> {
  static defaultProps: CheckBoxProps = {
    isChecked: null,
    onCheck: emptyFunc,
    onClick: emptyFunc,
    size: 20,
    labelPosition: "right",
    label: void 0
  };

  state: CheckBoxState = {
    checked: this.props.isChecked
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  /**
   * rootElm `HTMLDivElement`
   */
  rootElm: HTMLDivElement;

  componentWillReceiveProps(nextProps: CheckBoxProps) {
    this.setState({
      checked: this.props.isChecked
    });
  }

  /**
   * `Public` Toggle Checked Method.
   */
  toggleChecked = (e?: React.SyntheticEvent<HTMLDivElement>) => {
    this.setState((prevState, prevProps) => {
      this.props.onCheck(!prevState.checked);
      return { checked: !prevState.checked };
    });
  }

  handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { disabled, onClick } = this.props;
    if (!disabled) this.toggleChecked(e);
    onClick(e);
  }

  handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: true });
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hovered: false });
  }

  render() {
    const {
      isChecked, // tslint:disable-line:no-unused-variable
      onCheck, // tslint:disable-line:no-unused-variable
      label,
      labelPosition, // tslint:disable-line:no-unused-variable
      disabled, // tslint:disable-line:no-unused-variable
      ...attributes
    } = this.props;
    const { checked, hovered } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);
    const haveLabel = label !== void 0;
    const checkbox = (
      <div
        style={hovered ? {
          ...styles.iconParent.style,
          ...styles.iconParent.hoverStyle
        } : styles.iconParent.style}
        ref={rootElm => this.rootElm = rootElm}
      >
        <Icon style={styles.icon}>
          CheckMarkZeroWidthLegacy
        </Icon>
      </div>
    );

    return (
      <div
        {...attributes}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={theme.prepareStyles({
          display: "inline-block",
          ...attributes.style
        })}
      >
        {haveLabel ? (
          <div style={styles.root}>
            {checkbox}
            {label !== void 0 && (
              <span style={styles.label}>
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
  root?: React.CSSProperties;
  iconParent?: React.CSSProperties;
  icon?: React.CSSProperties;
  label?: React.CSSProperties;
} {
  const {
    context,
    props: { size, disabled, labelPosition },
    state: { checked, hovered }
  } = checkBox;
  const { theme } = context;
  const checkedIsNull = checked === null;

  const iconParentBaseStyle: React.CSSProperties = theme.prepareStyles({
    transition: "all .25s",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.altHigh,
    border: `2px solid ${theme.baseMediumHigh}`,
    width: `${size}px`,
    height: `${size}px`,
    background: theme.altMediumHigh,
    cursor: "default",
    overflow: "hidden"
  });
  const iconParentHoverStyle = { border: `2px solid ${theme.baseHigh}` };
  let iconParent: React.CSSProperties;

  switch (checked) {
    case true: {
      iconParent = {
        style:  {
          ...iconParentBaseStyle,
          border: disabled ? `2px solid ${theme.baseLow}` : (
            hovered ? `2px solid ${disabled ? theme.baseLow : theme.baseMediumHigh}` : "none"
          )
        },
        hoverStyle: disabled ? void 0 : iconParentHoverStyle
      };
      break;
    }
    case false: {
      iconParent =  {
        style: {
          ...iconParentBaseStyle,
          border: `2px solid ${disabled ? theme.baseLow : theme.baseMediumHigh}`
        },
        hoverStyle: disabled ? void 0 : iconParentHoverStyle
      };
      break;
    }
    case null: {
      iconParent =  {
        style: {
          ...iconParentBaseStyle,
          border: `2px solid ${disabled ? theme.baseLow : theme.baseMediumHigh}`
        },
        hoverStyle: disabled ? void 0 : iconParentHoverStyle
      };
      break;
    }
    default: {
      break;
    }
  }

  const leftLabelPosition = labelPosition === "left";

  return {
    root: theme.prepareStyles({
      display: "flex",
      flex: "0 0 auto",
      justifyContent: leftLabelPosition ? "flex-end" : "flex-start",
      flexDirection: leftLabelPosition ? "row-reverse" : "row",
      alignItems: "center"
    }),
    iconParent,
    icon: theme.prepareStyles({
      transition: "all .25s",
      color: disabled ? (
        checkedIsNull ? "transparent" : theme.baseLow
      ) : (
        checkedIsNull ? theme.accent : theme.altHigh
      ),
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
    label: theme.prepareStyles({
      color: disabled ? theme.baseLow : theme.baseMediumHigh,
      [`margin${leftLabelPosition ? "Right" : "Left"}`]: 8
    })
  };
}

export default CheckBox;

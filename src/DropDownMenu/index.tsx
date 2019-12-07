import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import AddBlurEvent from "../utils/AddBlurEvent";
import Icon from "../Icon";
import RevealEffect, { RevealEffectProps } from "../RevealEffect";

export interface DataProps {
  /**
   * Set DropDownMenu values.
   */
  values?: string[];
  /**
   * `onChangeValue` callback.
   */
  onChangeValue?: (value: string) => void;
  /**
   * Set wrapper style.
   */
  wrapperStyle?: React.CSSProperties;
  /**
   * Set full width to DropDownMenu.
   */
  enableFullWidth?: boolean;
  /**
   * Set item selected style.
   */
  itemSelectedStyle?: React.CSSProperties;
  /**
   * Set item hover style.
   */
  itemHoverStyle?: React.CSSProperties;
  /**
   * Set RevealEffect, check the styles/reveal-effect.
   */
  revealConfig?: RevealEffectProps;
}

export interface DropDownMenuProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {
  /**
   * Set default show value, `value` must is one of `values`, default is `values[0]`.
   */
  defaultValue?: string | string[];
}

export interface DropDownMenuState {
  showList?: boolean;
  currentValue?: string | string[];
  currentValues?: string[];
}

export const defaultStyle: React.CSSProperties = {
  display: "inline-block",
  width: 296,
  height: 32
};
export class DropDownMenu extends React.Component<DropDownMenuProps, DropDownMenuState> {
  static contextTypes = { theme: PropTypes.object };
  static defaultProps: DropDownMenuProps = {};
  context: { theme: ReactUWP.ThemeType };
  state: DropDownMenuState = {
    currentValue: this.props.defaultValue || Array.isArray(this.props.values) && this.props.values[0],
    currentValues: (() => {
      let { values, defaultValue } = this.props;
      if (!Array.isArray(values)) return [];
      values = [...values];
      defaultValue = (defaultValue || values[0]) as string;
      values.unshift(...values.splice(values.indexOf(defaultValue), 1));
      return values;
    })()
  };
  addBlurEvent = new AddBlurEvent();
  rootElm: HTMLDivElement;
  itemHeight = 0;

  componentWillReceiveProps(nextProps: DropDownMenuProps) {
    if (!Array.isArray(nextProps.values)) return;
    this.setState({
      currentValue: nextProps.defaultValue || nextProps.values[0],
      currentValues: (() => {
        let { values, defaultValue } = nextProps;
        values = [...values];
        defaultValue = (defaultValue || values[0]) as string;
        values.unshift(...values.splice(values.indexOf(defaultValue), 1));
        return values;
      })()
    });
  }

  addBlurEventMethod = () => {
    this.addBlurEvent.setConfig({
      addListener: this.state.showList,
      clickExcludeElm: this.rootElm,
      blurCallback: () => {
        const { currentValue, currentValues } = this.state;
        currentValues.unshift(...currentValues.splice(currentValues.indexOf(currentValue as string), 1));
        this.setState({
          currentValue,
          showList: false,
          currentValues
        });
      },
      blurKeyCodes: [codes.esc]
    });
  }

  componentDidMount() {
    this.addBlurEventMethod();
    this.updateItemHeight();
  }

  componentDidUpdate() {
    this.addBlurEventMethod();
    this.updateItemHeight();
  }

  componentWillUnmount() {
    this.addBlurEvent.cleanEvent();
  }

  updateItemHeight = () => {
    if (this.rootElm) {
      this.itemHeight = this.rootElm.getBoundingClientRect().height;
    }
  }

  toggleShowList = (currentValue: string) => {
    const { currentValues, showList } = this.state;
    if (showList) {
      currentValues.unshift(...currentValues.splice(currentValues.indexOf(currentValue), 1));
    }
    if (currentValue !== this.state.currentValue) {
      this.props.onChangeValue && this.props.onChangeValue(currentValue);
    }
    this.setState({
      currentValue,
      showList: !showList,
      currentValues: showList ? currentValues : [...this.props.values]
    });
  }

  getValue = () => this.state.currentValue;

  render() {
    const {
      values,
      defaultValue,
      onChangeValue,
      style,
      wrapperStyle,
      revealConfig,
      enableFullWidth,
      itemHoverStyle,
      itemSelectedStyle,
      ...attributes
    } = this.props;
    const { showList, currentValue, currentValues } = this.state;
    const { theme } = this.context;

    const inlineStyles = getStyles(this);
    const classes = theme.prepareStyles({
      className: "dropDownMenu",
      styles: inlineStyles
    });
    const defaultItemSelectedStyle: React.CSSProperties = {
      background: theme.listAccentLow
    };

    return (
      <span {...classes.wrapper}>
      <div
        {...attributes}
        {...classes.root}
        ref={rootElm => this.rootElm = rootElm}
      >
        {currentValues.map((value, index) => {
          const isCurrent = currentValue === value;
          return (
            <div
              className={classes[isCurrent ? "currValue" : "value"].className}
              style={{
                ...classes.value.style,
                ...(isCurrent && showList ? (itemSelectedStyle || defaultItemSelectedStyle) : void 0),
                height: showList ? (this.itemHeight) : (isCurrent ? "100%" : 0),
                padding: showList || isCurrent ? 8 : 0
              } as React.CSSProperties}
              onClick={() => this.toggleShowList(value)}
              key={index}
            >
              <p {...classes.valueContent}>
                {value}
              </p>
              {!showList && isCurrent ? (
                <Icon style={{ marginLeft: 8 }}>
                  ChevronDown4Legacy
                </Icon>
              ) : null}
              {showList && <RevealEffect {...revealConfig} effectRange={showList ? "self" : "all"} />}
            </div>
          );
        })}
      </div>
      </span>
    );
  }
}

export default DropDownMenu;


function getStyles(dropDownMenu: DropDownMenu) {
  let {
    context: { theme },
    props: {
      style,
      wrapperStyle,
      enableFullWidth,
      itemHoverStyle
    },
    itemHeight,
    state: { showList }
  } = dropDownMenu;
  const { prefixStyle } = theme;
  const newStyle = Object.assign({}, defaultStyle, style);
  const zIndex = (style && style.zIndex) ? style.zIndex : (showList ? theme.zIndex.dropDownMenu : 1);
  const defaultItemHoverStyle: React.CSSProperties = {
    background: theme.baseLow
  };

  const currValue = {
    border: `${theme.borderWidth}px solid transparent`,
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    background: "none",
    padding: 8,
    height: showList ? itemHeight : 0,
    borderLeft: showList ? `0px solid transparent` : "none",
    borderRight: showList ? `0px solid transparent` : "none",
    borderTop: showList ? `${theme.borderWidth}px solid transparent` : "none",
    borderBottom: showList ? `${theme.borderWidth}px solid transparent` : "none"
  } as React.CSSProperties;
  return {
    wrapper: prefixStyle({
      flex: "0 0 auto",
      display: "block",
      width: enableFullWidth ? "100%" : newStyle.width,
      height: newStyle.height,
      ...wrapperStyle
    }),
    root: prefixStyle({
      position: "relative",
      verticalAlign: "middle",
      border: `${theme.borderWidth}px solid ${theme.baseLow}`,
      overflowX: "hidden",
      padding: showList ? "6px 0" : 0,
      transition: "all .25s 0s ease-in-out",
      ...theme.acrylicTexture60.style,
      ...newStyle,
      zIndex,
      width: enableFullWidth ? (style && style.width !== void 0 ? newStyle.width : "100%") : newStyle.width,
      height: showList ? "auto" : newStyle.height
    }) as React.CSSProperties,
    value: prefixStyle({
      ...currValue,
      "&:hover": itemHoverStyle || defaultItemHoverStyle
    }),
    currValue: prefixStyle(currValue),
    valueContent: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      textAlign: "left",
      cursor: "default",
      height: "100%",
      width: "100%",
      overflow: "hidden",
      wordWrap: "normal",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    } as React.CSSProperties
  };
}

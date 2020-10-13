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
   * Set item style.
   */
  itemStyle?: React.CSSProperties;
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
  /**
   * replace default dropdown icon.
   */
  iconNode?: React.ReactNode;
}

export interface DropDownMenuProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {
  /**
   * Set default show value, `value` must is one of `values`, default is `values[0]`.
   */
  defaultValue?: string | string[];
}

export interface DropDownMenuState {
  showList?: boolean;
  currValue?: string | string[];
  currValues?: string[];
}

export const defaultStyle: React.CSSProperties = {
  display: "inline-block",
  width: 296,
  height: 32
};
export class DropDownMenu extends React.Component<DropDownMenuProps, DropDownMenuState> {
  static contextTypes = { theme: PropTypes.object };
  static defaultProps: DropDownMenuProps = {
    iconNode: <Icon style={{ marginLeft: 8 }}>ChevronDown4Legacy</Icon>
  };
  context: { theme: ReactUWP.ThemeType };
  state: DropDownMenuState = {
    currValue: this.props.defaultValue || Array.isArray(this.props.values) && this.props.values[0],
    currValues: this.props.values
  };
  addBlurEvent = new AddBlurEvent();
  rootElm: HTMLDivElement;
  itemHeight: string | number;

  addBlurEventMethod = () => {
    this.addBlurEvent.setConfig({
      addListener: this.state.showList,
      clickExcludeElm: this.rootElm,
      blurCallback: () => {
        this.setState({
          showList: false
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
    this.updateItemHeight(!this.state.showList);
  }

  componentWillReceiveProps() {
    this.updateItemHeight();
  }

  componentWillUnmount() {
    this.addBlurEvent.cleanEvent();
  }

  updateItemHeight = (needUpdate = true) => {
    if (this.rootElm && needUpdate) {
      this.itemHeight = window.getComputedStyle(this.rootElm).height;
    }
  }

  toggleShowList = (currentValue: string) => {
    const { showList } = this.state;
    if (currentValue !== this.state.currValue) {
      this.props.onChangeValue && this.props.onChangeValue(currentValue);
    }
    this.setState({
      currValue: currentValue,
      showList: !showList
    });
  }

  getValue = () => this.state.currValue;

  render() {
    const {
      values,
      defaultValue,
      onChangeValue,
      style,
      wrapperStyle,
      revealConfig,
      enableFullWidth,
      itemStyle,
      itemHoverStyle,
      itemSelectedStyle,
      iconNode,
      ...attributes
    } = this.props;
    const { showList, currValue: currentValue, currValues: currentValues } = this.state;
    const { theme } = this.context;

    const styles = getStyles(this);
    const classes = theme.prepareStyles({
      className: "dropDownMenu",
      styles
    });
    const defaultItemSelectedStyle: React.CSSProperties = {
      background: theme.listAccentLow
    };
    const newWrapperStyle = Object.assign({}, defaultStyle, style);

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
              className={classes[isCurrent ? "selectedItem" : "item"].className}
              style={{
                ...classes.item.style,
                ...(isCurrent && showList ? (itemSelectedStyle || defaultItemSelectedStyle) : void 0),
                height: showList ? ((newWrapperStyle && newWrapperStyle.height) ? newWrapperStyle.height : this.itemHeight) : (isCurrent ? "100%" : 0),
                padding: showList || isCurrent ? styles.item.padding : 0
              } as React.CSSProperties}
              onClick={() => this.toggleShowList(value)}
              key={index}
            >
              <p {...classes.valueContent}>
                {value}
              </p>
              {!showList && isCurrent ? iconNode : null}
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
      itemHoverStyle,
      itemStyle
    },
    itemHeight,
    state: { showList }
  } = dropDownMenu;
  const { prefixStyle } = theme;
  const newWrapperStyle = Object.assign({}, defaultStyle, style);
  const zIndex = (style && style.zIndex) ? style.zIndex : (showList ? theme.zIndex.dropDownMenu : void 0);
  const defaultItemHoverStyle: React.CSSProperties = {
    background: theme.baseLow
  };

  const newItemStyle = {
    border: `${theme.borderWidth}px solid transparent`,
    position: "relative",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    background: "none",
    padding: "0 8px",
    ...itemStyle,
    height: showList ? ((newWrapperStyle && newWrapperStyle.height) ? newWrapperStyle.height : itemHeight) : 0,
    borderLeft: showList ? `0px solid transparent` : "none",
    borderRight: showList ? `0px solid transparent` : "none",
    borderTop: showList ? `${theme.borderWidth}px solid transparent` : "none",
    borderBottom: showList ? `${theme.borderWidth}px solid transparent` : "none"
  } as React.CSSProperties;
  return {
    wrapper: prefixStyle({
      flex: "0 0 auto",
      display: "block",
      width: enableFullWidth ? "100%" : newWrapperStyle.width,
      height: newWrapperStyle.height,
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
      ...newWrapperStyle,
      zIndex,
      width: enableFullWidth ? (style && style.width !== void 0 ? newWrapperStyle.width : "100%") : newWrapperStyle.width,
      height: showList ? "auto" : newWrapperStyle.height
    }) as React.CSSProperties,
    item: prefixStyle({
      ...newItemStyle,
      "&:hover": itemHoverStyle || defaultItemHoverStyle
    }),
    selectedItem: prefixStyle(newItemStyle),
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

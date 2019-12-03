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

const defaultStyle: React.CSSProperties = { height: 32, overflowY: "hidden" };
const emptyFunc = () => {};
export class DropDownMenu extends React.Component<DropDownMenuProps, DropDownMenuState> {
  static contextTypes = { theme: PropTypes.object };
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
      revealConfig,
      ...attributes
    } = this.props;
    const { showList, currentValue, currentValues } = this.state;
    const { theme } = this.context;
    const { isDarkTheme } = theme;

    const inlineStyles = getStyles(this);
    const classes = theme.prepareStyles({
      className: "dropDownMenu",
      styles: inlineStyles
    });

    return (
      <div
        {...attributes}
        {...classes.root}
        ref={rootElm => this.rootElm = rootElm}
      >
        {currentValues.map((value, index) => {
          const isCurrent = currentValue === value;
          return (
            <div
              className={classes.value.className}
              style={{
                ...classes.value.style,
                background: (isCurrent && showList) ? theme.listAccentLow : "none",
                height: showList ? (this.itemHeight) : (isCurrent ? "100%" : 0)
              } as React.CSSProperties}
              onClick={() => this.toggleShowList(value)}
              onMouseEnter={!showList ? void 0 : (e) => {
                e.currentTarget.style.background = isCurrent ? theme.listAccentMedium : theme.useFluentDesign ? theme.listLow : theme.chromeMedium;
              }}
              onMouseLeave={!showList ? void 0 : (e) => {
                e.currentTarget.style.background = isCurrent ? theme.listAccentLow : "transparent";
              }}
              key={`${index}`}
            >
              <p {...classes.content}>
                {value}
              </p>
              {!showList && isCurrent ? (
                <Icon>
                  ChevronDown4Legacy
                </Icon>
              ) : null}
              {showList && <RevealEffect {...revealConfig} effectRange={showList ? "self" : "all"} />}
            </div>
          );
        })}
      </div>
    );
  }
}

export default DropDownMenu;


function getStyles(dropDownMenu: DropDownMenu) {
  const {
    context: { theme },
    props: {
      style
    },
    itemHeight,
    state: { showList }
  } = dropDownMenu;
  const { prefixStyle } = theme;
  const zIndex = (style && style.zIndex) ? style.zIndex : (showList ? theme.zIndex.dropDownMenu : 1);

  return {
    root: prefixStyle({
      position: "relative",
      display: "inline-block",
      verticalAlign: "middle",
      width: 160,
      border: `${theme.borderWidth}px solid ${theme.baseLow}`,
      overflowX: "hidden",
      padding: showList ? "6px 0" : 0,
      transition: "all .25s 0s ease-in-out",
      ...theme.acrylicTexture60.style,
      ...style,
      height: showList ? "auto" : (style.height || defaultStyle.height),
      overflowY: style.overflowY || defaultStyle.overflowY,
      zIndex
    }) as React.CSSProperties,
    value: prefixStyle({
      border: `${theme.borderWidth}px solid transparent`,
      position: "relative",
      width: "100%",
      display: "flex",
      padding: "0 8px",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: showList ? itemHeight : 0,
      borderLeft: showList ? `0px solid transparent` : "none",
      borderRight: showList ? `0px solid transparent` : "none",
      borderTop: showList ? `${theme.borderWidth}px solid transparent` : "none",
      borderBottom: showList ? `${theme.borderWidth}px solid transparent` : "none"
    }),
    content: {
      textAlign: "left",
      cursor: "default",
      height: "100%",
      width: "100%",
      overflow: "hidden",
      wordWrap: "normal",
      whiteSpace: "nowrap",
      lineHeight: style.lineHeight === void 0 ? `${style.height || defaultStyle.height}px` : style.lineHeight,
      textOverflow: "ellipsis"
    } as React.CSSProperties
  };
}

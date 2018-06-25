import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import AddBlurEvent from "../common/AddBlurEvent";
import Icon from "../Icon";

export interface DataProps {
  /**
   * Set default show value, `value` must is one of `values`, default is `values[0]`.
   */
  defaultValue?: string | string[];
  /**
   * Set DropDownMenu values.
   */
  values?: string[];
  /**
   * `onChangeValue` callback.
   */
  onChangeValue?: (value: string) => void;
  /**
   * Set DropDownMenu custom background.
   */
  background?: string;
  /**
   * Set DropDownMenu width, only this way set width is right (px).
   */
  itemWidth?: number;
  /**
   * Set DropDownMenu height, only this way set width is right (px).
   */
  itemHeight?: number;
  /**
   * Set DropDownMenu item padding (px).
   */
  padding?: number;
  /**
   * Set `wrapperElm` HTMLAttributes.
   */
  wrapperAttributes?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * Set `itemElm` HTMLAttributes.
   */
  itemAttributes?: React.HTMLAttributes<HTMLDivElement>;
}

export interface DropDownMenuProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface DropDownMenuState {
  showList?: boolean;
  currentValue?: string | string[];
  currentValues?: string[];
}

const emptyFunc = () => {};
export class DropDownMenu extends React.Component<DropDownMenuProps, DropDownMenuState> {
  static defaultProps: DropDownMenuProps = {
    itemWidth: 132,
    padding: 4,
    itemHeight: 28,
    onChangeValue: emptyFunc,
    wrapperAttributes: {
      onMouseEnter: emptyFunc,
      onMouseLeave: emptyFunc
    },
    itemAttributes: {
      onMouseEnter: emptyFunc,
      onMouseLeave: emptyFunc
    }
  };

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
  wrapperElm: HTMLDivElement;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

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
  }

  componentDidUpdate() {
    this.addBlurEventMethod();
  }

  componentWillUnmount() {
    this.addBlurEvent.cleanEvent();
  }

  toggleShowList = (currentValue: string) => {
    const { currentValues, showList } = this.state;
    if (showList) {
      currentValues.unshift(...currentValues.splice(currentValues.indexOf(currentValue), 1));
    }
    if (currentValue !== this.state.currentValue) {
      this.props.onChangeValue(currentValue);
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
      itemWidth,
      itemHeight,
      defaultValue,
      wrapperAttributes,
      itemAttributes,
      onChangeValue,
      background,
      padding,
      style,
      ...attributes
    } = this.props;
    const { showList, currentValue, currentValues } = this.state;
    const { theme } = this.context;
    const { isDarkTheme } = theme;

    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "dropDownMenu",
      styles: inlineStyles
    });

    return (
      <div
        {...attributes}
        {...styles.root}
        ref={rootElm => this.rootElm = rootElm}
      >
        <div
          ref={wrapperElm => this.wrapperElm = wrapperElm}
          style={{
            ...styles.wrapper.style,
            border: `${showList ? "1px" : "2px"} solid ${theme.baseLow}`
          } as React.CSSProperties}
          className={styles.wrapper.className}
          onMouseEnter={(e) => {
            if (!showList) e.currentTarget.style.border = `2px solid ${showList ? theme.baseLow : theme.baseHigh}`;
            if (wrapperAttributes.onMouseEnter) wrapperAttributes.onMouseEnter(e);
          }}
          onMouseLeave={(e) => {
            if (!showList) e.currentTarget.style.border = `2px solid ${theme.baseLow}`;
            if (wrapperAttributes.onMouseLeave) wrapperAttributes.onMouseLeave(e);
          }}
        >
          {currentValues.map((value, index) => {
            const isCurrent = currentValue === value;
            return (
              <div
                className={styles.value.className}
                style={{
                  ...styles.value.style,
                  height: (isCurrent || showList) ? itemHeight : 0,
                  background: (isCurrent && showList) ? theme.listAccentLow : "none"
                } as React.CSSProperties}
                onClick={() => this.toggleShowList(value)}
                onMouseEnter={!showList ? itemAttributes.onMouseEnter : (e) => {
                  e.currentTarget.style.background = isCurrent ? theme.listAccentMedium : theme.useFluentDesign ? theme.listLow : theme.chromeMedium;
                  itemAttributes.onMouseEnter(e);
                }}
                onMouseLeave={!showList ? itemAttributes.onMouseLeave : (e) => {
                  e.currentTarget.style.background = isCurrent ? theme.listAccentLow : "transparent";
                  itemAttributes.onMouseLeave(e);
                }}
                key={`${index}`}
              >
                <p {...styles.content}>
                  {value}
                </p>
                {!showList && isCurrent ? (
                  <Icon style={{ fontSize: itemHeight / 2 }}>
                    ChevronDown4Legacy
                  </Icon>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default DropDownMenu;


function getStyles(dropDownMenu: DropDownMenu) {
  const {
    context: { theme },
    props: {
      style,
      itemHeight,
      itemWidth,
      padding,
      wrapperAttributes,
      background,
      values
    },
    state: { showList }
  } = dropDownMenu;
  const { prefixStyle } = theme;

  const currBackground = background || (theme.useFluentDesign ? theme.acrylicTexture80.background : theme.chromeLow);
  const haveWrapperStyle = wrapperAttributes && wrapperAttributes.style;
  const zIndex = (style && style.zIndex) ? style.zIndex : (showList ? theme.zIndex.dropDownMenu : 1);

  return {
    root: prefixStyle({
      position: "relative",
      display: "inline-block",
      verticalAlign: "middle",
      width: itemWidth,
      height: itemHeight + padding,
      ...style,
      zIndex
    }) as React.CSSProperties,
    wrapper: prefixStyle({
      position: "absolute",
      top: 0,
      left: 0,
      color: theme.baseMediumHigh,
      background: currBackground,
      width: itemWidth,
      height: showList ? values.length * itemHeight + 16 : itemHeight + padding,
      overflowX: "hidden",
      zIndex,
      padding: showList ? "6px 0" : 0,
      transition: "all .25s 0s ease-in-out",
      ...(haveWrapperStyle ? wrapperAttributes.style : void 0),
      overflowY: showList && haveWrapperStyle ? wrapperAttributes.style.overflowY : "hidden"
    }),
    value: prefixStyle({
      width: itemWidth,
      display: "flex",
      padding: "0 8px",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    content: {
      textAlign: "left",
      cursor: "default",
      height: "100%",
      width: "100%",
      overflow: "hidden",
      wordWrap: "normal",
      whiteSpace: "nowrap",
      lineHeight: "28px",
      textOverflow: "ellipsis"
    } as React.CSSProperties
  };
}

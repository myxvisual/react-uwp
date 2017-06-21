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

  toggleShowList = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const { currentValues, showList } = this.state;
    const valueNode = e.currentTarget.children[0] as any;
    const currentValue = valueNode.innerText;
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
    const currBackground = background || (theme.useFluentDesign ? theme.acrylicTexture80.background : theme.chromeLow);
    const zIndex = (style && style.zIndex) ? style.zIndex : (showList ? theme.zIndex.dropDownMenu : 1);

    return (
      <div
        {...attributes}
        style={theme.prepareStyles({
          position: "relative",
          display: "inline-block",
          verticalAlign: "middle",
          width: itemWidth,
          height: itemHeight + padding,
          ...style,
          zIndex
        })}
        ref={rootElm => this.rootElm = rootElm}
      >
        <div
          ref="container"
          style={theme.prepareStyles({
            position: "absolute",
            top: 0,
            left: 0,
            color: theme.baseMediumHigh,
            background: currBackground,
            width: itemWidth,
            height: showList ? values.length * itemHeight + 16 : itemHeight + padding,
            overflow: "hidden",
            zIndex,
            padding: showList ? "8px 0" : 0,
            transition: "all .25s 0s ease-in-out",
            border: `${showList ? "1px" : "2px"} solid ${theme.baseLow}`
          })}
          onMouseEnter={!showList ? (e) => {
            e.currentTarget.style.border = `2px solid ${theme.baseHigh}`;
            wrapperAttributes.onMouseEnter(e);
          } : wrapperAttributes.onMouseEnter}
          onMouseLeave={!showList ? (e) => {
            e.currentTarget.style.border = `2px solid ${theme.baseLow}`;
            wrapperAttributes.onMouseLeave(e);
          } : wrapperAttributes.onMouseLeave}
        >
          {currentValues.map((value, index) => {
            const isCurrent = currentValue === value;
            return (
              <div
                style={theme.prepareStyles({
                  width: itemWidth,
                  height: itemHeight,
                  background: (isCurrent && showList) ? theme.listAccentLow : "none",
                  display: "flex",
                  padding: "0 8px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                })}
                onClick={this.toggleShowList}
                onMouseEnter={!showList ? itemAttributes.onMouseEnter : (e) => {
                  e.currentTarget.style.background = isCurrent ? theme.listAccentMedium : theme.useFluentDesign ? theme.listLow : theme.chromeMedium;
                  itemAttributes.onMouseEnter(e);
                }}
                onMouseLeave={!showList ? itemAttributes.onMouseLeave : (e) => {
                  e.currentTarget.style.background = isCurrent ? theme.listAccentLow : currBackground;
                  itemAttributes.onMouseLeave(e);
                }}
                key={`${index}`}
              >
                <p
                  style={{
                    textAlign: "left",
                    cursor: "default",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                    wordWrap: "normal",
                    whiteSpace: "nowrap",
                    lineHeight: "28px",
                    textOverflow: "ellipsis"
                  }}
                >
                  {value}
                </p>
                {!showList && isCurrent ? <Icon style={{ fontSize: itemHeight / 2 }}>ChevronDown4Legacy</Icon> : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default DropDownMenu;

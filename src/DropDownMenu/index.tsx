import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";

export interface DataProps {
  itemWidth?: number;
  itemHeight?: number;
  padding?: number;
  values?: string[];
  containerAttributes?: React.HTMLAttributes<HTMLDivElement>;
  itemAttributes?: React.HTMLAttributes<HTMLDivElement>;
  onChangeValue?: (value: string) => void;
}

export interface DropDownMenuProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}


export interface DropDownMenuState {
  showList?: boolean;
  currentValue?: string | string[];
  currentValues?: string[];
}

const emptyFunc = () => {};

export default class DropDownMenu extends React.Component<DropDownMenuProps, DropDownMenuState> {
  static defaultProps: DropDownMenuProps = {
    itemWidth: 132,
    padding: 4,
    itemHeight: 28,
    onChangeValue: emptyFunc,
    containerAttributes: {
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
    // tslint:disable-next-line:no-unused-variable
    const { values, itemWidth, itemHeight, defaultValue, containerAttributes, itemAttributes, onChangeValue, padding, ...attributes } = this.props;
    const { showList, currentValue, currentValues } = this.state;
    const { theme } = this.context;
    const isDarkTheme = theme.themeName === "Dark";

    return (
      <div
        {...attributes}
        style={theme.prepareStyles({
          position: "relative",
          display: "inline-block",
          zIndex: showList ? theme.zIndex.dropDownMenu : 1,
          width: itemWidth,
          height: itemHeight + padding,
          ...attributes.style
        })}
      >
        <div
          ref="container"
          style={theme.prepareStyles({
            position: "absolute",
            top: 0,
            left: 0,
            color: theme.baseMediumHigh,
            background: theme.chromeLow,
            width: itemWidth,
            height: showList ? values.length * itemHeight + 16 : itemHeight + padding,
            overflow: "hidden",
            zIndex: showList ? theme.zIndex.dropDownMenu : 1,
            padding: showList ? "8px 0" : 0,
            transition: "all .25s 0s ease-in-out",
            border: `${showList ? "1px" : "2px"} solid ${theme.baseLow}`
          })}
          onMouseEnter={!showList ? (e) => {
            e.currentTarget.style.border = `2px solid ${theme.baseHigh}`;
            containerAttributes.onMouseEnter(e);
          } : containerAttributes.onMouseEnter}
          onMouseLeave={!showList ? (e) => {
            e.currentTarget.style.border = `2px solid ${theme.baseLow}`;
            containerAttributes.onMouseLeave(e);
          } : containerAttributes.onMouseLeave}
        >
          {currentValues.map((value, index) => {
            const isCurrent = currentValue === value;
            return (
              <div
                style={theme.prepareStyles({
                  width: itemWidth,
                  height: itemHeight,
                  background: isCurrent && showList ? theme[isDarkTheme ? "accentDarker2" : "accentLighter2"] : theme.chromeLow,
                  display: "flex",
                  padding: "0 8px",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                })}
                onClick={this.toggleShowList}
                onMouseEnter={!showList ? itemAttributes.onMouseEnter : (e) => {
                  e.currentTarget.style.background = isCurrent ? theme[isDarkTheme ? "accentDarker1" : "accentLighter1"] : theme.chromeMedium;
                  itemAttributes.onMouseEnter(e);
                }}
                onMouseLeave={!showList ? itemAttributes.onMouseLeave : (e) => {
                  e.currentTarget.style.background = isCurrent ? theme[isDarkTheme ? "accentDarker2" : "accentLighter2"] : theme.chromeLow;
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
                {!showList && isCurrent ? <Icon style={{ fontSize: itemHeight / 2 }}>&#xE011;</Icon> : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

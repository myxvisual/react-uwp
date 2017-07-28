import * as React from "react";
import * as PropTypes from "prop-types";
import { codes } from "keycode";

import AddBlurEvent from "../common/AddBlurEvent";
import Separator from "../Separator";
import IconButton from "../IconButton";
import PseudoClasses from "../PseudoClasses";
import ListView from "../ListView";
import scrollToYEasing from "../common/browser/scrollToYEasing";

export interface DataProps {
  /**
   * Set default `hour`.
   */
  defaultHour?: number;
  /**
   * Set default `minute`.
   */
  defaultMinute?: number;
  /**
   * Set default show `Picker` modal.
   */
  defaultShowPicker?: boolean;
  /**
   * `onChangeTime` callback.
   */
  onChangeTime?: (hours?: number, minutes?: number) => void;
  /**
   * Set `Input` element height.
   */
  inputItemHeight?: number;
  /**
   * Set `Picker` element height.
   */
  pickerItemHeight?: number;
  /**
   * Set Custom background.
   */
  background?: string;
}

export interface TimePickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface TimePickerState {
  showPicker?: boolean;
  currHour?: number;
  currMinute?: number;
}

const emptyFunc = () => {};
export class TimePicker extends React.Component<TimePickerProps, TimePickerState> {
  static defaultProps: TimePickerProps = {
    defaultShowPicker: false,
    inputItemHeight: 28,
    pickerItemHeight: 44,
    defaultHour: 12,
    defaultMinute: 30,
    onChangeTime: emptyFunc
  };

  state: TimePickerState = {
    showPicker: this.props.defaultShowPicker,
    currHour: this.props.defaultHour,
    currMinute: this.props.defaultMinute
  };

  addBlurEvent = new AddBlurEvent();
  rootElm: HTMLDivElement = null;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  prevState: {
    currHour: number;
    currMinute: number;
  } = {
    currHour: this.props.defaultHour,
    currMinute: this.props.defaultMinute
  };

  hourListView: ListView;
  minuteListView: ListView;
  timeTypeListView: ListView;

  hourIndex: number;
  minuteIndex: number;
  timeTypeIndex: number;

  componentWillReceiveProps(nextProps: TimePickerProps) {
    const { defaultHour, defaultMinute, defaultShowPicker } = nextProps;
    const { currHour, currMinute, showPicker } = this.state;
    if (defaultHour !== currHour || defaultMinute !== currMinute || defaultShowPicker !== showPicker) {
      this.setState({ currHour: defaultHour, currMinute: defaultMinute, showPicker: defaultShowPicker });
    }
  }

  addBlurEventMethod = () => {
    this.addBlurEvent.setConfig({
      addListener: this.state.showPicker,
      clickExcludeElm: this.rootElm,
      blurCallback: () => {
        this.setState({
          showPicker: false
        });
      },
      blurKeyCodes: [codes.esc]
    });
  }

  componentDidMount() {
    this.addBlurEventMethod();
  }

  componentDidUpdate() {
    const { pickerItemHeight } = this.props;
    scrollToYEasing(this.hourListView.rootElm, this.hourIndex * pickerItemHeight, 0.1);
    scrollToYEasing(this.minuteListView.rootElm, this.minuteIndex * pickerItemHeight, 0.1);
    scrollToYEasing(this.timeTypeListView.rootElm, this.timeTypeIndex * pickerItemHeight, 0.1);

    this.addBlurEventMethod();
  }

  componentWillUnmount() {
    this.addBlurEvent.cleanEvent();
  }

  toggleShowPicker = (showPicker?: any) => {
    if (typeof showPicker === "boolean") {
      if (showPicker !== this.state.showPicker) {
        this.setState({ showPicker });
      }
    } else {
      this.setState((prevState, prevProps) => {
        const showPicker = !prevState.showPicker;
        return { showPicker };
      });
    }
  }

  render() {
    const {
      className,
      defaultShowPicker,
      defaultHour,
      defaultMinute,
      onChangeTime,
      inputItemHeight,
      pickerItemHeight,
      background,
      ...attributes
    } = this.props;
    let {
      currHour,
      currMinute,
      showPicker
    } = this.state;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "date-picker",
      styles: inlineStyles
    });

    const separator = <Separator direction="column" style={{ margin: 0 }} />;
    const currTimeType = currHour < 13 ? "AM" : "PM";
    const hourArray = Array(12).fill(0).map((zero, index) => index + 1);
    const minuteArray = Array(60).fill(0).map((zero, index) => index + 1);
    const timeTypeArray = ["AM", "PM"];

    this.hourIndex = hourArray.indexOf(currHour > 12 ? currHour - 12 : currHour);
    this.minuteIndex = minuteArray.indexOf(currMinute);
    this.timeTypeIndex = timeTypeArray.indexOf(currTimeType);

    return (
      <PseudoClasses
        {...attributes as any}
        {...styles.root}
      >
      <div
        {...attributes}
        style={styles.root.style}
        className={theme.classNames(styles.root.className, className)}
        ref={rootElm => this.rootElm = rootElm}
        >
        <div {...styles.pickerModal}>
          <div {...styles.listViews}>
            <ListView
              ref={hourListView => this.hourListView = hourListView}
              style={inlineStyles.listView}
              listItemStyle={inlineStyles.listItem}
              defaultFocusListIndex={this.hourIndex}
              listSource={hourArray}
              onChooseItem={hourIndex => {
                this.setState({ currHour: currHour > 12 ? 13 + hourIndex : hourIndex + 1 });
              }}
            />
            <ListView
              ref={minuteListView => this.minuteListView = minuteListView}
              style={inlineStyles.listView}
              listItemStyle={inlineStyles.listItem}
              defaultFocusListIndex={this.minuteIndex}
              listSource={minuteArray}
              onChooseItem={minuteIndex => {
                this.setState({ currMinute: minuteIndex + 1 });
              }}
            />
            <ListView
              ref={timeTypeListView => this.timeTypeListView = timeTypeListView}
              style={inlineStyles.listView}
              listItemStyle={inlineStyles.listItem}
              defaultFocusListIndex={this.timeTypeIndex}
              listSource={timeTypeArray}
              onChooseItem={timeTypeIndex => {
                if (timeTypeIndex === 0 && currHour > 12) {
                  this.setState({ currHour: currHour - 12 });
                }
                if (timeTypeIndex === 1 && currHour < 25) {
                  this.setState({ currHour: currHour + 12 });
                }
              }}
            />
          </div>
          <div {...styles.iconButtonGroup}>
            <IconButton
              style={inlineStyles.iconButton}
              size={pickerItemHeight}
              onClick={() => {
                this.setState({ showPicker: false });
                this.prevState = { currHour, currMinute };
              }}
            >
              AcceptLegacy
            </IconButton>
            <IconButton
              style={inlineStyles.iconButton}
              size={pickerItemHeight}
              onClick={() => {
                const { currHour, currMinute } = this.prevState;
                this.setState({ showPicker: false });
                this.setState({ currHour, currMinute });
              }}
            >
              ClearLegacy
            </IconButton>
          </div>
        </div>
        <span
          {...styles.button}
          onClick={this.toggleShowPicker}
        >
          {currHour > 12 ? currHour - 12 : currHour}
        </span>
        {separator}
        <span
          {...styles.button}
          onClick={this.toggleShowPicker}
        >
          {currMinute}
        </span>
        {separator}
        <span
          {...styles.button}
          onClick={this.toggleShowPicker}
        >
          {currTimeType}
        </span>
      </div>
      </PseudoClasses>
    );
  }
}

function getStyles(TimePicker: TimePicker): {
  root?: React.CSSProperties;
  button?: React.CSSProperties;
  pickerModal?: React.CSSProperties;
  listViews?: React.CSSProperties;
  listView?: React.CSSProperties;
  listItem?: React.CSSProperties;
  iconButtonGroup?: React.CSSProperties;
  iconButton?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: {
      style,
      inputItemHeight,
      pickerItemHeight,
      background
    },
    state: {
      showPicker
    }
  } = TimePicker;
  const { prefixStyle } = theme;
  const currBackground = background || (theme.useFluentDesign ? theme.acrylicTexture80.background : theme.chromeLow);

  return {
    root: prefixStyle({
      width: 320,
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      verticalAlign: "middle",
      color: theme.baseMediumHigh,
      boxShadow: `inset 0 0 0 2px ${theme.baseMediumLow}`,
      height: inputItemHeight,
      lineHeight: `${inputItemHeight}px`,
      position: "relative",
      transition: "all .25s ease-in-out",
      "&:hover": {
        boxShadow: `inset 0 0 0 2px ${theme.baseMediumHigh}`
      },
      ...style
    }),
    pickerModal: prefixStyle({
      overflow: "hidden",
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      background: currBackground,
      top: 0,
      left: 0,
      width: "100%",
      opacity: showPicker ? 1 : 0,
      transform: `scaleY(${showPicker ? 1 : 0}) translateY(-50%)`,
      transformOrigin: "top",
      pointerEvents: showPicker ? "all" : "none",
      zIndex: theme.zIndex.flyout,
      transition: "all .25s ease-in-out"
    }),
    listViews: prefixStyle({
      border: `1px solid ${theme.listLow}`,
      flex: "0 0 auto",
      width: "100%",
      height: pickerItemHeight * 7,
      display: "flex",
      flexDirection: "row"
    }),
    listView: prefixStyle({
      userSelect: "none",
      border: "none",
      borderLeft: `1px solid ${theme.listLow}`,
      width: "100%",
      padding: `${pickerItemHeight * 3}px 0`,
      height: pickerItemHeight * 7,
      overflowY: "inherit",
      overflowX: "hidden",
      flex: "1 1 auto"
    }),
    listItem: {
      padding: "0 8px",
      height: pickerItemHeight,
      lineHeight: `${pickerItemHeight}px`,
      flex: "0 0 auto",
      fontSize: pickerItemHeight / 3
    },
    button: {
      flex: "1 1 auto",
      display: "inline-block",
      cursor: "default",
      verticalAlign: "top",
      height: inputItemHeight - 4,
      lineHeight: `${inputItemHeight - 4}px`,
      padding: `0 ${inputItemHeight - 4}px`
    },
    iconButtonGroup: {
      boxShadow: `inset 0 0 0 1px ${theme.baseLow}`,
      zIndex: theme.zIndex.flyout + 1
    },
    iconButton: {
      verticalAlign: "top",
      width: "50%",
      height: pickerItemHeight
    }
  };
}

export default TimePicker;

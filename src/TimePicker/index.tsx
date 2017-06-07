import * as React from "react";
import * as PropTypes from "prop-types";

import Separator from "../Separator";
import IconButton from "../IconButton";
import ElementState from "../ElementState";
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

  componentDidUpdate() {
    const { pickerItemHeight } = this.props;
    scrollToYEasing(this.hourListView.rootElm, this.hourIndex * pickerItemHeight, 0.1);
    scrollToYEasing(this.minuteListView.rootElm, this.minuteIndex * pickerItemHeight, 0.1);
    scrollToYEasing(this.timeTypeListView.rootElm, this.timeTypeIndex * pickerItemHeight, 0.1);
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
    defaultShowPicker,
    defaultHour,
    defaultMinute,
    onChangeTime,
    inputItemHeight,
    pickerItemHeight,
      ...attributes
    } = this.props;
    let {
      currHour,
      currMinute,
      showPicker
    } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);

    const separator = <Separator direction="column" style={{ margin: 0 }} />;
    const currTimeType = currHour < 13 ? "AM" : "PM";
    const hourArray = Array(12).fill(0).map((zero, index) => index + 1);
    const minuteArray = Array(60).fill(0).map((zero, index) => index + 1);
    const timeTypeArray = ["AM", "PM"];

    this.hourIndex = hourArray.indexOf(currHour > 12 ? currHour - 12 : currHour);
    this.minuteIndex = minuteArray.indexOf(currMinute);
    this.timeTypeIndex = timeTypeArray.indexOf(currTimeType);

    return (
      <ElementState
        {...attributes as any}
        style={styles.root}
        hoverStyle={{ boxShadow: `inset 0 0 0 2px ${theme.baseMediumHigh}` }}
      >
      <div>
        <div style={styles.pickerModal}>
          <div style={styles.listViews}>
            <ListView
              ref={hourListView => this.hourListView = hourListView}
              style={styles.listView}
              listItemStyle={styles.listItem}
              defaultFocusListIndex={this.hourIndex}
              listSource={hourArray}
              onChooseItem={hourIndex => {
                this.setState({ currHour: currHour > 12 ? 13 + hourIndex : hourIndex + 1});
              }}
            />
            <ListView
              ref={minuteListView => this.minuteListView = minuteListView}
              style={styles.listView}
              listItemStyle={styles.listItem}
              defaultFocusListIndex={this.minuteIndex}
              listSource={minuteArray}
              onChooseItem={minuteIndex => {
                this.setState({ currMinute: minuteIndex + 1 });
              }}
            />
            <ListView
              ref={timeTypeListView => this.timeTypeListView = timeTypeListView}
              style={styles.listView}
              listItemStyle={styles.listItem}
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
          <div style={{ boxShadow: `inset 0 0 0 1px ${theme.baseLow}` }}>
            <IconButton
              style={styles.iconButton}
              size={pickerItemHeight}
              onClick={() => {
                this.setState({ showPicker: false });
                this.prevState = { currHour, currMinute };
              }}
            >
              AcceptLegacy
            </IconButton>
            <IconButton
              style={styles.iconButton}
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
          style={styles.button}
          onClick={this.toggleShowPicker}
        >
          {currHour > 12 ? currHour - 12 : currHour}
        </span>
        {separator}
        <span
          style={styles.button}
          onClick={this.toggleShowPicker}
        >
          {currMinute}
        </span>
        {separator}
        <span
          style={styles.button}
          onClick={this.toggleShowPicker}
        >
          {currTimeType}
        </span>
      </div>
      </ElementState>
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
  iconButton?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: {
      style,
      inputItemHeight,
      pickerItemHeight
    },
    state: {
      showPicker
    }
  } = TimePicker;
  const { prepareStyles } = theme;
  const background = theme.chromeLow;

  return {
    root: prepareStyles({
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
      ...style
    }),
    pickerModal: prepareStyles({
      flex: "0 0 auto",
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      background: background,
      opacity: showPicker ? 1 : 0,
      transform: `translate3d(0, ${showPicker ? "-50%" : 0}, 0)`,
      pointerEvents: showPicker ? "all" : "none",
      transition: "all .25s ease-in-out"
    }),
    listViews: prepareStyles({
      border: `1px solid ${theme.listLow}`,
      flex: "0 0 auto",
      width: "100%",
      height: pickerItemHeight * 7,
      display: "flex",
      flexDirection: "row",
      zIndex: theme.zIndex.flyout
    }),
    listView: prepareStyles({
      userSelect: "none",
      border: "none",
      borderLeft: `1px solid ${theme.listLow}`,
      padding: `${pickerItemHeight * 3}px 0`,
      width: "auto",
      height: pickerItemHeight * 7,
      overflowY: "auto",
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
    iconButton: {
      verticalAlign: "top",
      width: "50%",
      height: pickerItemHeight
    }
  };
}

export default TimePicker;

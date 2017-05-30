import * as React from "react";
import * as PropTypes from "prop-types";

import DropDownMenu from "../DropDownMenu";

export interface DataProps {
  onChangeDate?: (date: Date) => void;
  defaultDate?: Date;
  isTwentyFourFormat?: boolean;
}

export interface TimePickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class TimePicker extends React.Component<TimePickerProps, void> {
  static defaultProps: TimePickerProps = {
    onChangeDate: () => {},
    defaultDate: new Date(),
    isTwentyFourFormat: true
  };

  dropDownMenus: DropDownMenu[] = [];

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  handelChangeDate = (date: string) => {
    this.props.onChangeDate(this.getDate());
  }

  getDate = () => {
    const { defaultDate } = this.props;
    const currFullYear = defaultDate.getFullYear();
    const currMonth = defaultDate.getMonth();
    const currDate = defaultDate.getDate();
    return new Date(
      currFullYear,
      currMonth,
      currDate,
      this.dropDownMenus[0].getValue() as any,
      this.dropDownMenus[1].getValue() as any,
      this.dropDownMenus[2].getValue() as any
      );
  }

  render() {
    const {
      onChangeDate, // tslint:disable-line:no-unused-variable
      defaultDate, // tslint:disable-line:no-unused-variable
      isTwentyFourFormat, // tslint:disable-line:no-unused-variable
      ...attributes
    } = this.props;
    const styles = getStyles(this);
    const currHours = defaultDate.getHours();
    const currMinutes = defaultDate.getMinutes();
    const currSeconds = defaultDate.getSeconds();


    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <DropDownMenu
          value={`${currHours}`}
          values={[...Array(isTwentyFourFormat ? 24 : 12).keys() as any].map(index => `${index + 1}`)}
          ref={dropDownMenu => this.dropDownMenus[0] = dropDownMenu}
          onChangeValue={this.handelChangeDate}
        />
        <DropDownMenu
          value={`${currMinutes}`}
          values={[...Array(60).keys() as any].map(index => `${index + 1}`)}
          ref={dropDownMenu => this.dropDownMenus[1] = dropDownMenu}
          onChangeValue={this.handelChangeDate}
        />
        <DropDownMenu
          value={`${currSeconds}`}
          values={[...Array(60).keys() as any].map(index => `${index + 1}`)}
          ref={dropDownMenu => this.dropDownMenus[2] = dropDownMenu}
          onChangeValue={this.handelChangeDate}
        />
      </div>
    );
  }
}

function getStyles(timePicker: TimePicker): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = timePicker;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      ...style
    })
  };
}

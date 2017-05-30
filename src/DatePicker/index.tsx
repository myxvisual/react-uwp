import * as React from "react";
import * as PropTypes from "prop-types";

import DropDownMenu from "../DropDownMenu";

export interface DataProps {
  onChangeDate?: (date: Date) => void;
  defaultDate?: Date;
  maxYear?: number;
  minYear?: number;
}

export interface DatePickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface DatePickerState {}

export default class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
  static defaultProps: DatePickerProps = {
    onChangeDate: () => {},
    defaultDate: new Date(),
    maxYear: (new Date()).getFullYear() + 40,
    minYear: (new Date()).getFullYear() - 40
  };

  state: DatePickerState = {};
  dropDownMenus: DropDownMenu[] = [];

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  handelChangeDate = (date: string) => {
    this.props.onChangeDate(this.getDate());
  }

  getDate = () => (
    new Date(
      this.dropDownMenus[0].getValue() as any,
      (this.dropDownMenus[1].getValue() as any - 1),
      this.dropDownMenus[2].getValue() as any
    )
  );

  render() {
    const {
      // tslint:disable-next-line:no-unused-variable
      onChangeDate,
      defaultDate,
      maxYear,
      minYear,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const currYear = defaultDate.getFullYear();
    const currMonth = defaultDate.getMonth();
    const currDate = defaultDate.getDate();
    const years: string[] = [...Array(maxYear - minYear).keys() as any].map((year: string) => `${minYear + year} Year`);
    const dateCount = (new Date(currYear, currMonth + 1, 0)).getDate() - (new Date(currYear, currMonth, 1)).getDate() + 1;

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <DropDownMenu
          defaultValue={`${currYear}`}
          values={years}
          ref={dropDownMenu => this.dropDownMenus[0] = dropDownMenu}
          onChangeValue={this.handelChangeDate}
        />
        <DropDownMenu
          defaultValue={`${currMonth + 1}`}
          values={[...Array(12).keys() as any].map(index => `${index + 1} Month`)}
          ref={dropDownMenu => this.dropDownMenus[1] = dropDownMenu}
          onChangeValue={this.handelChangeDate}
        />
        <DropDownMenu
          defaultValue={`${currDate}`}
          values={[...Array(dateCount).keys() as any].map(index => `${index + 1} Day`)}
          ref={dropDownMenu => this.dropDownMenus[2] = dropDownMenu}
          onChangeValue={this.handelChangeDate}
        />
      </div>
    );
  }
}

function getStyles(datePicker: DatePicker): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = datePicker;
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

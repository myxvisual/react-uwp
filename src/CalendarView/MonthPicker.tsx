import * as React from "react";
import * as PropTypes from "prop-types";

import SlideInOut from "./SlideInOut";

export interface DataProps {
  date?: Date;
  direction?: "bottom" | "top";
  onChooseMonth?: (month: number) => void;
}

export interface MonthPickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class MonthPicker extends React.Component<MonthPickerProps, {}> {
  static defaultProps: MonthPickerProps = {
    date: new Date(),
    direction: "bottom",
    onChooseMonth: () => {}
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, isNow: boolean) => {
    const { theme } = this.context;
    e.currentTarget.style.border = `2px solid ${isNow ? theme.baseHigh : theme.baseLow}`;
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, isNow: boolean) => {
    const { theme } = this.context;
    e.currentTarget.style.border = "2px solid transparent";
  }

  getMonthsArray = () => {
    const months = [];
    for (let i = 0; i < 16; i++) {
      months[i] = i < 12 ? i + 1 : i % 12 + 1;
    }
    return months;
  }

  render() {
    const { date, direction, onChooseMonth, ...attributes } = this.props;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "calendar-view-month",
      styles: inlineStyles
    });

    const months = this.getMonthsArray();

    return (
      <SlideInOut
        {...(attributes as any)}
        style={inlineStyles.root}
        mode="both"
        speed={350}
        direction={direction}
        appearAnimate={false}
      >
        <div key={`${date.getFullYear()}, ${date.getMonth()} ${date.getDate()}`}>
          {months.map((month, index) => {
            const isCurrYear = index < 12;
            const isNow = isCurrYear &&
              date.getFullYear() === (new Date()).getFullYear() &&
              month === (new Date()).getMonth() + 1;
            return <button
              onMouseEnter={(e) => this.handleMouseEnter(e, isNow)}
              onMouseLeave={(e) => this.handleMouseLeave(e, isNow)}
              style={{
                ...styles.monthItem.style,
                background: isNow ? theme.accent : (
                  theme.useFluentDesign ? (
                    isCurrYear ? theme.altLow : theme.listLow
                  ) : (
                    isCurrYear ? theme.altHigh : theme.chromeLow
                  )
                ),
                border: "2px solid transparent"
              } as React.CSSProperties}
              className={styles.monthItem.className}
              onClick={() => onChooseMonth(index)}
              key={`${index}`}
            >
              {`${month}`}
            </button>;
          })}
        </div>
      </SlideInOut>
    );
  }
}

function getStyles(monthPicker: MonthPicker): {
  root?: React.CSSProperties;
  monthItem?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = monthPicker;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      width: 296,
      height: 292,
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      ...style
    }),
    monthItem: {
      transition: "all .25s 0s ease-in-out",
      background: "none",
      outline: "none",
      color: theme.baseHigh,
      border: "none",
      width: 292 / 4,
      height: 292 / 4
    }
  };
}

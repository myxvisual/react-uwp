import * as React from "react";
import * as PropTypes from "prop-types";

import SlideInOut from "./SlideInOut";
import RevealEffect from "../RevealEffect";

export interface DataProps {
  date?: Date;
  direction?: "bottom" | "top";
  onChooseYear?: (year: number) => void;
  maxYear?: number;
  minYear?: number;
}

export interface YearPickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class YearPicker extends React.Component<YearPickerProps, {}> {
  static defaultProps: YearPickerProps = {
    date: new Date(),
    maxYear: 2117, // MAX Year is 275760
    minYear: 1920, // MIN Year is -271821
    direction: "bottom",
    onChooseYear: () => {}
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, isNow: boolean) => {
    const { theme } = this.context;
    e.currentTarget.style.border = `${theme.borderWidth}px solid ${isNow ? theme.baseHigh : theme.baseLow}`;
  }

  handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, isNow: boolean) => {
    const { theme } = this.context;
    e.currentTarget.style.border = `${theme.borderWidth}px solid transparent`;
  }

  getYearsArray = () => {
    const { date } = this.props;
    const year = date.getFullYear();
    const minYearOfTen = Math.floor(year / 10) * 10;
    const years = [];
    for (let i = 0; i < 16; i++) {
      years[i] = minYearOfTen + i;
    }
    return years;
  }

  render() {
    const { date, maxYear, minYear, direction, onChooseYear, ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const classes = theme.prepareStyles({
      className: "calendar-view-year",
      styles
    });
    const years: number[] = this.getYearsArray();

    return (
      <SlideInOut
        {...(attributes as any)}
        style={styles.root}
        mode="both"
        speed={350}
        direction={direction}
        appearAnimate={false}
      >
        <div key={`${date.getFullYear()}, ${date.getMonth()} ${date.getDate()}`}>
          {years.map((year, index) => {
            const isNow = year === (new Date()).getFullYear();
            return <button
              onMouseEnter={(e) => this.handleMouseEnter(e, isNow)}
              onMouseLeave={(e) => this.handleMouseLeave(e, isNow)}
              style={{
                ...classes.yearItem.style,
                position: "relative",
                background: isNow ? theme.accent : theme.useFluentDesign ? theme.altLow : theme.altHigh,
                border: `${theme.borderWidth}px solid transparent`
              } as React.CSSProperties}
              className={classes.yearItem.className}
              onClick={() => onChooseYear(year)}
              key={`${index}`}
            >
              {year}
              <RevealEffect observerTransition="transform" hoverSize={80} />
            </button>;
          })}
        </div>
      </SlideInOut>
    );
  }
}

function getStyles(YearPicker: YearPicker) {
  const {
    context: { theme },
    props: { style }
  } = YearPicker;
  const { prefixStyle } = theme;

  const fullHeight = 296 - theme.borderWidth * 2;
  return {
    root: prefixStyle({
      width: 296,
      height: fullHeight,
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      ...style
    }),
    yearItem: {
      transition: "all .25s ease-in-out",
      background: "none",
      outline: "none",
      color: theme.baseHigh,
      border: "none",
      width: fullHeight / 4,
      height: fullHeight / 4
    }
  };
}

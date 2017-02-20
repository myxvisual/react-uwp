import * as React from "react";
import Icon from "../Icon";
import  * as dateUtils from "../../common/date.utils";
import { ThemeType } from "../../styles/ThemeType";
import SlideInOut from "../Animate/SlideInOut";
import ScaleInOut from "../Animate/ScaleInOut";

const defaultProps: CalendarViewProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	mode?: "Large" | "Small";
	chooseMode?: "YearChoose" | "MonthChoose" | "DayChoose";
}

interface CalendarViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface CalendarViewState {
	dateNow?: Date;
	viewDate?: Date;
	direction?: "Bottom" | "Top";
	chooseISODates?: string[];
	currChooseModeIndex?: number;
}
const chooseModes = ["YearChoose" , "MonthChoose" , "DayChoose"];
export default class CalendarView extends React.Component<CalendarViewProps, CalendarViewState> {
	static defaultProps: CalendarViewProps = {
		...defaultProps,
		chooseMode: "DayChoose",
		mode: "Small",
	};

	state: CalendarViewState = {
		dateNow: new Date(),
		viewDate: new Date(),
		direction: "Bottom",
		chooseISODates: [],
		currChooseModeIndex: chooseModes.indexOf(this.props.chooseMode),
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	nextMonth = () => this.setState({ viewDate: dateUtils.addMonths(this.state.viewDate, 1), direction: "Top" })

	prevMonth = () => this.setState({ viewDate: dateUtils.addMonths(this.state.viewDate, -1), direction: "Bottom" })

	getDaysArray = () => {
		const { viewDate } = this.state;
		const currMonth = viewDate.getMonth();
		const currYear = viewDate.getFullYear();
		const daysArray: { day?: number; isCurrMonth?: boolean; date?: Date }[] = [];
		const prevMonthLast = dateUtils.getLastDayOfPrevMonth(viewDate);
		const prevMonthLastDay = prevMonthLast.getDay();
		const prevMonthLastDate = prevMonthLast.getDate();
		const monthFirst = dateUtils.getFirstDayOfMonth(viewDate);
		const monthFirstDate = monthFirst.getDate();
		const monthLastDate = dateUtils.getLastDayOfMonth(viewDate).getDate();
		for (let i = 0; i < 42; i++) {
			daysArray[i] = {};
			let day: number;
			if (i < prevMonthLastDay) {
				day = prevMonthLastDate - prevMonthLastDay + i + 1;
				daysArray[i]["isCurrMonth"] = false;
			} else if (i < monthLastDate + prevMonthLastDay) {
				day = monthFirstDate - prevMonthLastDay + i;
				daysArray[i]["isCurrMonth"] = true;
			} else {
				day = i - prevMonthLastDay - monthLastDate + 1;
				daysArray[i]["isCurrMonth"] = false;
			}
			daysArray[i]["day"] = day;
			daysArray[i]["date"] = new Date(currYear, currMonth, day);
		}
		return daysArray;
	}

	handleDayMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, date: Date) => {
		const { theme } = this.context;
		e.currentTarget.style.border = `2px solid ${this.state.chooseISODates.includes(date.toISOString()) ? theme.accent : theme.baseMedium}`;
	}

	handleDayMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, date: Date) => {
		const { theme } = this.context;
		e.currentTarget.style.border = `2px solid ${this.state.chooseISODates.includes(date.toISOString()) ? theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"] : theme.baseLow}`;
	}

	chooseDate = (date: Date) => {
		let { chooseISODates } = this.state;
		const dateISOString = date.toISOString();
		const index = chooseISODates.indexOf(dateISOString);
		index > -1 ? chooseISODates.splice(index, 1) : (chooseISODates = [...chooseISODates, dateISOString]);
		this.setState({ chooseISODates });
	}

	toggleMode = (e: React.MouseEvent<HTMLDivElement>) => {
		this.setState({ currChooseModeIndex: (this.state.currChooseModeIndex + 1) % 3 });
	}

	render() {
		const { chooseMode, mode, ...attributes } = this.props;
		const { theme } = this.context;
		const styles = getStyles(this);
		const { dateNow, viewDate, direction, chooseISODates, currChooseModeIndex } = this.state;
		const currChooseMode = chooseModes[currChooseModeIndex];
		const mmyy = `${dateUtils.monthList[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

		return (
			<div
				{...attributes}
				style={styles.root}
			>
				<div style={styles.title}>
					<div onClick={this.toggleMode}>{mmyy}</div>
					<div style={theme.prepareStyles({ display: "flex", flexDirection: "row" })}>
						<Icon
							style={styles.titleIcon}
							onClick={this.prevMonth}
						>
							ChevronUp
						</Icon>
						<Icon
							style={styles.titleIcon}
							onClick={this.nextMonth}
						>
							ChevronDown
						</Icon>
					</div>
				</div>
				<div>
					<div style={styles.weeklyHead}>
						{dateUtils.dayShortList.map((str, index) => (
							<button style={styles.weeklyHeadItem} key={`${index}`}>{str}</button>
						))}
					</div>
					{currChooseMode === "DayChoose" ? (
						<SlideInOut style={styles.weekly} mode="Both" speed={350} direction={direction}>
							<div key={mmyy}>
								{this.getDaysArray().map(({ day, isCurrMonth, date }, index) => (
									<button
										onMouseEnter={(e) => this.handleDayMouseEnter(e, date)}
										onMouseLeave={(e) => this.handleDayMouseLeave(e, date)}
										style={{
											...styles.dayItem,
											border: `1px solid ${chooseISODates.includes(date.toISOString()) ? theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"] : theme.baseLow}`,
											background: isCurrMonth ? theme.altHigh : theme.baseLow
										}}
										onClick={() => this.chooseDate(date)}
										key={`${index}`}
									>
										{day}
									</button>
								))}
							</div>
						</SlideInOut>
					) : (
						<ScaleInOut style={styles.weekly} mode="Both" speed={350}>
							<p key={currChooseModeIndex}>Test</p>
						</ScaleInOut>
					)}
				</div>
			</div>
		);
	}
}

function getStyles(calendarView: CalendarView): {
	root?: React.CSSProperties;
	title?: React.CSSProperties;
	titleIcon?: React.CSSProperties;
	body?: React.CSSProperties;
	weeklyHead?: React.CSSProperties;
	weeklyHeadItem?: React.CSSProperties;
	weekly?: React.CSSProperties;
	dayItem?: React.CSSProperties;
} {
	const { context, props: { style } } = calendarView;
	const { theme } = context;
	const { prepareStyles } = theme;

	return {
		root: prepareStyles({
			fontSize: 14,
			color: theme.baseHigh,
			background: theme.altMediumHigh,
			width: 296,
			// height: 334,
			border: `2px solid ${theme.baseLow}`,
			...style,
		}),
		title: prepareStyles({
			fontSize: 20,
			height: 42,
			padding: "0 16px",
			fontWeight: "lighter",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		}),
		titleIcon: {
			fontSize: 16,
			paddingLeft: 8,
		},
		body: prepareStyles({
			width: 296,
			height: 296,
		}),
		weeklyHead: prepareStyles({
			display: "flex",
			flexDirection: "row",
		}),
		weeklyHeadItem: {
			background: "none",
			border: "none",
			outline: "none",
			color: theme.baseHigh,
			width: 292 / 7,
			height: 40,
		},
		weekly: prepareStyles({
			width: 296,
			height: 292 / 7 * 6 - 2,
			display: "flex",
			flexDirection: "row",
			flexWrap: "wrap",
		}),
		dayItem: {
			background: "none",
			outline: "none",
			color: theme.baseHigh,
			width: 292 / 7,
			height: 292 / 7,
		}
	};
}

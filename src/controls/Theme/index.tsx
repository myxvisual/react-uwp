import * as React from "react";

import darkTheme from "../../styles/darkTheme";
import { ThemeType } from "../../styles/ThemeType";

export interface DataProps {
	theme?: ThemeType;
}
export interface ThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export interface ThemeState {}
export default class Theme extends React.Component<ThemeProps, ThemeState> {
	static childContextTypes = {
		theme: React.PropTypes.object,
	};

	getChildContext() {
		return {
			theme: this.props.theme || darkTheme,
		};
	}

	render() {
		// tslint:disable-next-line:no-unused-variable
		const { children, theme, ...attributes } = this.props;

		return (
			<div
				{...attributes}
				style={theme.prepareStyles({
					width: "100%",
					height: "100%",
					...attributes.style,
					})
				}
			>
				{children}
			</div>
		);
	}
}

import * as React from "react";

import darkTheme from "../../style/darkTheme";
import { ThemeType } from "../../style/ThemeType";

interface DataProps {
	theme?: ThemeType;
}
interface ThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface ThemeState {}
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
			<div {...attributes}>
				{children}
			</div>
		);
	}
}

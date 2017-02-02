import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: MockProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}

interface MockProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface MockState {}

export default class Mock extends React.Component<MockProps, MockState> {
	static defaultProps: MockProps = {
		...defaultProps
	};

	state: MockState = {};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		const { ...attributes } = this.props;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<div
				{...attributes}
				style={{
					...styles.container,
					...attributes.style,
				}}
			>
				Mock
			</div>
		);
	}
}

function getStyles(mock: Mock): {
	container?: React.CSSProperties;
} {
	const { context } = mock;
	const { theme } = context;
	// tslint:disable-next-line:no-unused-variable
	const { prepareStyles } = theme;

	return {
		container: {
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: theme.altMediumHigh,
		},
	};
}

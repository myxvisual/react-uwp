import * as React from "react";

import { ThemeType } from "../../styles/ThemeType";

const defaultProps: ListViewProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {}

interface ListViewProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

interface ListViewState {}

export default class ListView extends React.Component<ListViewProps, ListViewState> {
	static defaultProps: ListViewProps = {
		...defaultProps
	};

	state: ListViewState = {};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	render() {
		const { children, ...attributes } = this.props;
		const { theme } = this.context;
		const styles = getStyles(this);

		return (
			<div
				{...attributes}
				style={{
					...styles.container,
					...theme.prepareStyles(attributes.style),
				}}
			>
				{React.Children.map(children, (child, index) => (
					<div style={styles.item} key={`${index}`}>
						{child}
					</div>
				))}
			</div>
		);
	}
}

function getStyles(listView: ListView): {
	container?: React.CSSProperties;
	item?: React.CSSProperties;
} {
	const { context } = listView;
	const { theme } = context;
	// tslint:disable-next-line:no-unused-variable
	const { prepareStyles } = theme;

	return {
		container: {
			fontSize: 14,
			color: theme.baseMediumHigh,
			background: theme.altMediumHigh,
		},
		item: {
		}
	};
}

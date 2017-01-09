import * as React from "react";

import * as styles from "./index.scss";
const defaultProps: MockProps = __DEV__ ? require("./devDefaultProps").default : {};

interface DataProps {}
interface MockProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface MockState {}

export default class Mock extends React.Component<MockProps, MockState> {
	static defaultProps: MockProps = { ...defaultProps, className: "" };
	state: MockState = {};

	render() {
		const { className, ...attributes } = this.props;

		return (
			<div {...attributes} className={`${styles.c} ${className}`}>
				Mock
			</div>
		);
	}
}

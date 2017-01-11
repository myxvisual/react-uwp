import * as React from "react";

import { ThemeType } from "react-uwp/style/ThemeType";
import * as styles from "./index.scss";

let theme: ThemeType;
const defaultProps: ProgressRingProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	itmeStyle?: string;
}
interface ProgressRingProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
interface ProgressRingState {}

export default class ProgressRing extends React.Component<ProgressRingProps, ProgressRingState> {
	static defaultProps: ProgressRingProps = { ...defaultProps, className: "" };
	state: ProgressRingState = {};
	static contextTypes = { theme: React.PropTypes.object };

	render() {
		const { style, className, ...attributes } = this.props;
		theme = this.context.theme;

		return (
			<div
				{...attributes}
				className={`${styles.c} ${className}`}
				style={style}
			>
				<divt>
					{Array(6).fill(0).map((numb, index) => {
						return <div className={styles[`cItem${index}`]} />;
					})}
				</divt>
			</div>
		);
	}
}

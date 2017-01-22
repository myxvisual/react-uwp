import * as React from "react";

import Image from "../Image";
import { fade } from "../../common/colorManipulator";
import { ThemeType } from "../../styles/ThemeType";

const defaultProps: ArticleCardProps = __DEV__ ? require("./devDefaultProps").default : {};

export interface DataProps {
	author?: string;
	gatogory?: string;
	authorImage?: string;
	like?: string;
	secondaryTitle?: string;
	time?: Date;
	comments?: string[];
	title?: string;
	image?: string;
	href?: string;
}
interface ArticleCardProps extends DataProps, React.HTMLAttributes<HTMLAnchorElement> {}
interface ArticleCardState {
	isHovered?: boolean;
}

export default class ArticleCard extends React.Component<ArticleCardProps, ArticleCardState> {
	static defaultProps: ArticleCardProps = { ...defaultProps, target: "_blank" };
	state: ArticleCardState = {
		isHovered: false
	};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	handleMouseEnter = (e: any) => {
		this.setState({
			isHovered: true
		});
	}

	handleMouseLeave = (e: any) => {
		this.setState({
			isHovered: false
		});
	}

	render() {
		const { title, image, ...attributes } = this.props;
		const { theme } = this.context;
		const { isHovered } = this.state;

		return (
			<a
				{...attributes}
				rel="noopener"
				onMouseEnter={this.handleMouseEnter as any}
				onMouseLeave={this.handleMouseLeave as any}
				style={theme.prepareStyles({
					position: "relative",
					color: theme.baseMediumHigh,
					background: theme.altMediumHigh,
					fontSize: 14,
					width: 200,
					height: 200,
					overflow: "hidden",
					margin: 2,
					flex: "1 1 200px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					...attributes.style,
				})}
			>
				<Image
					isLazyLoad
					useDivContainer
					src={image}
					alt="Work Show"
					style={theme.prepareStyles({
						transition: "all .25s 0s ease-in-out",
						width: "100%",
						height: "100%",
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						backgroundSize: "cover",
					})}
				/>
				<div
					style={theme.prepareStyles({
						position: "absolute",
						transition: "all .5s 0s ease-in-out",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						height: "100%",
						padding: 12,
						background: isHovered ? fade(theme.accent, .85) : "transparent",
					})}
				>
					<p
						style={{ opacity: isHovered ? 1 : 0 }}
					>
						{title}
					</p>
				</div>
			</a>
		);
	}
}

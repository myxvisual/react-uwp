import * as React from "react";

import Image from "../Image";
import Icon from "../Icon";
import { fade } from "../../common/colorManipulator";
import { ThemeType } from "../../styles/ThemeType";

// const defaultProps = __DEV__ ? require("./devDefaultProps").default : {};
const defaultProps = require("./devDefaultProps").default;

export interface DataProps {
	author?: string;
	category?: string;
	authorImage?: string;
	like?: string;
	secondaryTitle?: string;
	time?: Date;
	comments?: string[];
	title?: string;
	image?: string;
	href?: string;
	size?: number;
}

interface ArticleCardProps extends DataProps, React.HTMLAttributes<HTMLAnchorElement> {}

interface ArticleCardState {
	isHovered?: boolean;
	normalColor: string;
}

export default class ArticleCard extends React.Component<ArticleCardProps, ArticleCardState> {
	static defaultProps: ArticleCardProps = {
		...defaultProps,
		target: "_blank",
		size: 200,
	};

	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };

	state: ArticleCardState = {
		isHovered: false,
		normalColor: Math.random() < 0.875 ? this.context.theme.altLow : fade(this.context.theme.accent, 0.875)
	};

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
		// tslint:disable-next-line:no-unused-variable
		const { title, image, size, ...attributes } = this.props;
		const { theme } = this.context;
		const { isHovered, normalColor } = this.state;
		const styles = getStyles(this);

		return (
			<a
				{...attributes}
				rel="noopener"
				onMouseEnter={this.handleMouseEnter as any}
				onMouseLeave={this.handleMouseLeave as any}
				style={{
					...styles.container,
					...theme.prepareStyles(attributes.style),
				}}
			>
				<Image
					isLazyLoad
					useDivContainer
					src={image}
					alt="Work Show"
					style={styles.image}
					placeholder={
						<div style={styles.imagePlaceholder}>
							<Icon
								style={{
									color: theme.baseMedium,
									fontSize: 80,
									textDecoration: "none",
								}}
								hoverStyle={{}}
							>
								&#xEB9F;
							</Icon>
						</div> as any
					}
				/>
				<div style={{ ...styles.content, background: (isHovered || !image) ? "transparent" : normalColor }}>
					<p style={theme.prepareStyles({ color: "#fff", textAlign: "center", opacity: isHovered ? 0 : 1, transition: "all .5s 0s ease-in-out", })}>
						{title}
					</p>
				</div>
			</a>
		);
	}
}

function getStyles(instance: ArticleCard): {
	container?: React.CSSProperties;
	content?: React.CSSProperties;
	image?: React.CSSProperties;
	imagePlaceholder?: React.CSSProperties;
	[key: string]: React.CSSProperties;
} {
	const { size } = instance.props;
	const { isHovered } = instance.state;
	const { context } = instance;
	const { theme } = context;
	const { prepareStyles } = theme;

	return {
		container: prepareStyles({
			position: "relative",
			color: theme.baseMediumHigh,
			background: theme.chromeMedium,
			fontSize: 14,
			width: size,
			height: size,
			overflow: "hidden",
			margin: 2,
			flex: "1 1 auto",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			textDecoration: "none",
		}),
		image: prepareStyles({
			width: "100%",
			height: "100%",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			backgroundSize: "cover",
		}),
		imagePlaceholder: prepareStyles({
			width: "100%",
			height: "100%",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
		}),
		content: prepareStyles({
			position: "absolute",
			transition: "all .5s 0s ease-in-out",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
			height: "100%",
			padding: 12,
		})
	};
}

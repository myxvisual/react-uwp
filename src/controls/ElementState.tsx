import * as React from "react";

import { ThemeType } from "../styles/ThemeType";
import setStyleToElement from "../common/setStyleToElement";

interface DataProps {
	style?: React.CSSProperties;
	hoverStyle?: React.CSSProperties;
	focusStyle?: React.CSSProperties;
	activeStyle?: React.CSSProperties;
	visitedStyle?: React.CSSProperties;
	onHover?: Function;
	onFocus?: Function;
	onActive?: Function;
	onVisited?: Function;
	unHover?: Function;
	unFocus?: Function;
	unActive?: Function;
	unVisited?: Function;
}
interface Attributes {
	[key: string]: any;
}
interface ElementStateProps extends DataProps, Attributes {}
const emptyFunc = () => {};
export default class ElementState extends React.Component<ElementStateProps, {}> {
	static defaultProps: ElementStateProps = {
		onHover: emptyFunc,
		onFocus: emptyFunc,
		onActive: emptyFunc,
		onVisited: emptyFunc,
		unHover: emptyFunc,
		unFocus: emptyFunc,
		unActive: emptyFunc,
		unVisited: emptyFunc,
	};

	static contextTypes = { theme: React.PropTypes.object };

	context: { theme: ThemeType };

	currentDOM: HTMLElement;

	visitedStyle: React.CSSProperties = {};

	componentDidMount() {
		const { currentDOM } = this;
		const { hoverStyle, focusStyle, activeStyle, visitedStyle } = this.props;
		if (hoverStyle) {
			currentDOM.addEventListener("mouseenter", this.hover);
			currentDOM.addEventListener("mouseleave", this.unHover);
		}
		if (activeStyle) {
			currentDOM.addEventListener("mousedown", this.active);
			currentDOM.addEventListener("mouseup", this.unActive);
		}
		if (focusStyle) {
			currentDOM.addEventListener("focus", this.focus);
		}
		if (visitedStyle) {
			currentDOM.addEventListener("click", this.visited);
		}
	}

	componentWillUnmount() {
		const { currentDOM } = this;
		const { hoverStyle, focusStyle, activeStyle, visitedStyle } = this.props;
		if (hoverStyle) {
			currentDOM.removeEventListener("mouseenter", this.hover);
			currentDOM.removeEventListener("mouseleave", this.unHover);
		}
		if (activeStyle) {
			currentDOM.removeEventListener("mousedown", this.active);
			currentDOM.removeEventListener("mouseup", this.unActive);
		}
		if (focusStyle) {
			currentDOM.removeEventListener("focus", this.focus);
		}
		if (visitedStyle) {
			currentDOM.removeEventListener("click", this.visited);
		}
	}

	setStyle = (style: React.CSSProperties) => {
		setStyleToElement(
			this.currentDOM,
			this.context.theme.prepareStyles({ ...this.props.style, ...style })
		);
	}

	hover = () => { this.setStyle(this.props.hoverStyle); this.props.onHover(); }
	unHover = () => { this.resetStyle(); this.props.unHover(); }

	active = () => { this.setStyle(this.props.activeStyle); this.props.onActive(); }
	unActive = () => { this.resetStyle(); this.props.unActive(); }

	focus = () => { this.setStyle(this.props.focusStyle); this.props.onFocus(); }
	unFocus = () => { this.resetStyle(); this.props.unFocus(); }

	visited = () => {
		{ this.setStyle(this.props.visitedStyle); this.props.onVisited(); }
		this.visitedStyle = this.props.visitedStyle;
	}
	unVisited = () => { this.resetStyle(true); this.props.unVisited(); }

	resetStyle = (resetVisited = false) => {
		if (resetVisited) this.visitedStyle = void(0);
		setStyleToElement(this.currentDOM, { ...this.props.style, ...this.visitedStyle } );
	}

	getDOM = () => this.currentDOM

	render() {
		const {
			style,
			// tslint:disable:no-unused-variable
			hoverStyle,
			focusStyle,
			activeStyle,
			visitedStyle,
			onHover,
			onFocus,
			onActive,
			onVisited,
			unHover,
			unFocus,
			unActive,
			unVisited,
			children,
			...attributes
		} = this.props;
		return React.cloneElement(children as any, {
			ref: (currentDOM: any) => this.currentDOM = currentDOM,
			style: style ? this.context.theme.prepareStyles(style) : void(0),
			...attributes
		});
	}
}

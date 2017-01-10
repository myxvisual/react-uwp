import * as React from "react";

interface PrefixAll {
	(style: React.CSSProperties): React.CSSProperties;
}
const prefixAll: PrefixAll = require("inline-style-prefix-all");

import addArrayEvent from "../common/addArrayEvent";
import setStyleToElement from "../common/setStyleToElement";
import removeArrayEvent from "../common/removeArrayEvent";

interface DataProps {
	style?: React.CSSProperties;
	hoverStyle?: React.CSSProperties;
	focusStyle?: React.CSSProperties;
	activeStyle?: React.CSSProperties;
	visitedStyle?: React.CSSProperties;
}
interface Attributes {
	[key: string]: any;
}
interface ElementStateProps extends DataProps, Attributes {}
export default class ElementState extends React.Component<ElementStateProps, {}> {
	currentDOM: any;
	visitedStyle: any = {};

	componentDidMount() {
		const { hoverStyle, focusStyle, activeStyle, visitedStyle } = this.props;
		if (hoverStyle) {
			addArrayEvent(this.currentDOM, ["touchstart", "mouseenter"], this.hover);
			addArrayEvent(this.currentDOM, ["touchend", "mouseleave"], this.resetStyle);
		}
		if (activeStyle) {
			addArrayEvent(this.currentDOM, ["touchstart", "click", "mousedown"], this.active);
			addArrayEvent(this.currentDOM, ["touchend", "mouseup"], this.resetStyle);
		}
		if (focusStyle) {
			addArrayEvent(this.currentDOM, ["focus"], this.focus);
		}
		if (visitedStyle) {
			addArrayEvent(this.currentDOM, ["click"], this.visited);
		}
	}

	componentWillUnmount() {
		const { hoverStyle, focusStyle, activeStyle, visitedStyle } = this.props;
		if (hoverStyle) {
			removeArrayEvent(this.currentDOM, ["touchstart", "mouseenter"], this.hover);
			removeArrayEvent(this.currentDOM, ["touchend", "mouseleave"], this.resetStyle);
		}
		if (activeStyle) {
			removeArrayEvent(this.currentDOM, ["touchstart", "click", "mousedown"], this.active);
			removeArrayEvent(this.currentDOM, ["touchend", "mouseup"], this.resetStyle);
		}
		if (focusStyle) {
			removeArrayEvent(this.currentDOM, ["focus"], this.focus);
		}
		if (visitedStyle) {
			removeArrayEvent(this.currentDOM, ["click"], this.visited);
		}
	}

	setStyle = (style: React.CSSProperties) => { setStyleToElement(this.currentDOM, prefixAll({ ...this.props.style, ...style })); }

	hover = () => { this.setStyle(this.props.hoverStyle); }
	unHover = () => { this.resetStyle(); }

	active = () => { this.setStyle(this.props.activeStyle); }
	unActive = () => { this.resetStyle(); }

	focus = () => { this.setStyle(this.props.focusStyle); }
	unFocus = () => { this.resetStyle(); }

	visited = () => {
		{ this.setStyle(this.props.visitedStyle); }
		this.visitedStyle = this.props.visitedStyle;
	}
	unVisited = () => { this.resetStyle(true); }

	resetStyle = (resetVisited = false) => {
		if (resetVisited) this.visitedStyle = void(0);
		setStyleToElement(this.currentDOM, { ...this.props.style, ...this.visitedStyle } );
	}

	render() {
		const { style, hoverStyle, focusStyle, activeStyle, visitedStyle, children, ...attributes } = this.props;

		return React.cloneElement(children as any, {
			ref: (currentDOM: any) => this.currentDOM = currentDOM,
			style: prefixAll(style),
			...attributes
		});
	}
}

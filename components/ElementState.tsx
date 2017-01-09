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
			addArrayEvent(this.currentDOM, ["touchstart", "mouseenter"], this.hoverHandle);
			addArrayEvent(this.currentDOM, ["touchend", "mouseleave"], this.resetStyle);
		}
		if (activeStyle) {
			addArrayEvent(this.currentDOM, ["touchstart", "click", "mousedown"], this.activeHandle);
			addArrayEvent(this.currentDOM, ["touchend", "mouseup"], this.resetStyle);
		}
		if (focusStyle) {
			addArrayEvent(this.currentDOM, ["focus"], this.focusHandle);
		}
		if (visitedStyle) {
			addArrayEvent(this.currentDOM, ["click"], this.visitedHandle);
		}
	}

	componentWillUnmount() {
		const { hoverStyle, focusStyle, activeStyle, visitedStyle } = this.props;
		if (hoverStyle) {
			removeArrayEvent(this.currentDOM, ["touchstart", "mouseenter"], this.hoverHandle);
			removeArrayEvent(this.currentDOM, ["touchend", "mouseleave"], this.resetStyle);
		}
		if (activeStyle) {
			removeArrayEvent(this.currentDOM, ["touchstart", "click", "mousedown"], this.activeHandle);
			removeArrayEvent(this.currentDOM, ["touchend", "mouseup"], this.resetStyle);
		}
		if (focusStyle) {
			removeArrayEvent(this.currentDOM, ["focus"], this.focusHandle);
		}
		if (visitedStyle) {
			removeArrayEvent(this.currentDOM, ["click"], this.visitedHandle);
		}
	}

	hoverHandle = () => { setStyleToElement(this.currentDOM, prefixAll(this.props.hoverStyle)); }

	activeHandle = () => { setStyleToElement(this.currentDOM, prefixAll(this.props.activeStyle)); }

	focusHandle = () => { setStyleToElement(this.currentDOM, prefixAll(this.props.focusStyle)); }

	visitedHandle = () => {
		{ setStyleToElement(this.currentDOM, prefixAll(this.props.visitedStyle)); }
		this.visitedStyle = this.props.visitedStyle;
	}

	resetStyle = () => { setStyleToElement(this.currentDOM, { ...this.props.style, ...this.visitedStyle } ); }

	render() {
		const { style, hoverStyle, focusStyle, activeStyle, visitedStyle, children, ...attributes } = this.props;

		return React.cloneElement(children as any, {
			ref: (currentDOM: any) => this.currentDOM = currentDOM,
			style: prefixAll(style),
			...attributes
		});
	}
}

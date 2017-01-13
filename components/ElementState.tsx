import * as React from "react";


import prefixAll from "../common/prefixAll";

import addArrayEvent from "../common/addArrayEvent";
import setStyleToElement from "../common/setStyleToElement";
import removeArrayEvent from "../common/removeArrayEvent";

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
}
interface Attributes {
	[key: string]: any;
}
interface ElementStateProps extends DataProps, Attributes {}
const defaultFunc = () => {};
export default class ElementState extends React.Component<ElementStateProps, {}> {
	static defaultProps: ElementStateProps = {
		onHover: defaultFunc,
		onFocus: defaultFunc,
		onActive: defaultFunc,
		onVisited: defaultFunc
	};
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
			removeArrayEvent(this.currentDOM, ["mouseenter"], this.hover);
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

	hover = () => { this.setStyle(this.props.hoverStyle); this.props.onHover(); }
	unHover = () => { this.resetStyle(); }

	active = () => { this.setStyle(this.props.activeStyle); this.props.onActive(); }
	unActive = () => { this.resetStyle(); }

	focus = () => { this.setStyle(this.props.focusStyle); this.props.onFocus(); }
	unFocus = () => { this.resetStyle(); }

	visited = () => {
		{ this.setStyle(this.props.visitedStyle); this.props.onVisited(); }
		this.visitedStyle = this.props.visitedStyle;
	}
	unVisited = () => { this.resetStyle(true); }

	resetStyle = (resetVisited = false) => {
		if (resetVisited) this.visitedStyle = void(0);
		setStyleToElement(this.currentDOM, { ...this.props.style, ...this.visitedStyle } );
	}

	getDOM = () => this.currentDOM

	render() {
		const {
			style,
			hoverStyle,
			focusStyle,
			activeStyle,
			visitedStyle,
			children,
			onHover,
			onFocus,
			onActive,
			onVisited,
			...attributes
		} = this.props;

		return React.cloneElement(children as any, {
			ref: (currentDOM: any) => this.currentDOM = currentDOM,
			style: prefixAll(style),
			...attributes
		});
	}
}

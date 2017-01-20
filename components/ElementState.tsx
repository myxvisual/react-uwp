import * as React from "react";

import { ThemeType } from "../style/ThemeType";
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
	unHover?: Function;
	unFocus?: Function;
	unActive?: Function;
	unVisited?: Function;
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
		onVisited: defaultFunc,
		unHover: defaultFunc,
		unFocus: defaultFunc,
		unActive: defaultFunc,
		unVisited: defaultFunc,
	};
	static contextTypes = { theme: React.PropTypes.object };
	context: { theme: ThemeType };
	currentDOM: any;
	visitedStyle: any = {};

	componentDidMount() {
		const { hoverStyle, focusStyle, activeStyle, visitedStyle } = this.props;
		if (hoverStyle) {
			addArrayEvent(this.currentDOM, ["mouseenter"], this.hover);
			addArrayEvent(this.currentDOM, ["mouseleave"], this.unHover);
		}
		if (activeStyle) {
			addArrayEvent(this.currentDOM, ["touchstart", "click", "mousedown"], this.active);
			addArrayEvent(this.currentDOM, ["touchend", "mouseup"], this.unActive);
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
			removeArrayEvent(this.currentDOM, ["mouseleave"], this.unHover);
		}
		if (activeStyle) {
			removeArrayEvent(this.currentDOM, ["touchstart", "click", "mousedown"], this.active);
			removeArrayEvent(this.currentDOM, ["touchend", "mouseup"], this.unActive);
		}
		if (focusStyle) {
			removeArrayEvent(this.currentDOM, ["focus"], this.focus);
		}
		if (visitedStyle) {
			removeArrayEvent(this.currentDOM, ["click"], this.visited);
		}
	}

	setStyle = (style: React.CSSProperties) => { setStyleToElement(this.currentDOM, this.context.theme.prepareStyles({ ...this.props.style, ...style })); }

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
		// tslint:disable-next-line:no-unused-variable
		const { style, hoverStyle, focusStyle, activeStyle, visitedStyle, onHover, onFocus, onActive, onVisited, unHover, unFocus, unActive, unVisited, children, ...attributes } = this.props;
		return React.cloneElement(children as any, {
			ref: (currentDOM: any) => this.currentDOM = currentDOM,
			style: style ? this.context.theme.prepareStyles(style) : void(0),
			...attributes
		});
	}
}

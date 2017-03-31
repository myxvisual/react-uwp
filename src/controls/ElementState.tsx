import * as React from "react";

import { ThemeType } from "../styles/ThemeType";
import setStyleToElement from "../common/setStyleToElement";

export interface DataProps {
	children?: React.ReactNode;
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
export interface Attributes {
	[key: string]: any;
}

export interface ElementStateProps extends DataProps, Attributes {}
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
		onMouseEnter: emptyFunc,
		onMouseLeave: emptyFunc,
		onMouseDown: emptyFunc,
		onMouseUp: emptyFunc,
		onClick: emptyFunc,
	};

	static contextTypes = { theme: React.PropTypes.object };

	context: { theme: ThemeType };

	currentDOM: HTMLElement;

	visitedStyle: React.CSSProperties = {};

	setStyle = (style: React.CSSProperties) => {
		setStyleToElement(
			this.currentDOM,
			this.context.theme.prepareStyles({ ...this.props.style, ...style })
		);
	}

	hover = () => {
		this.setStyle(this.props.hoverStyle);
		this.props.onMouseEnter();
		this.props.onHover();
	}
	unHover = () => {
		this.resetStyle();
		this.props.onMouseLeave();
		this.props.unHover();
	}

	active = () => {
		this.setStyle(this.props.activeStyle);
		this.props.onMouseDown();
		this.props.onActive();
	}
	unActive = () => {
		this.resetStyle();
		this.props.onMouseUp();
		this.props.unActive();
	}

	focus = () => {
		this.setStyle(this.props.focusStyle);
		this.props.onFocus();
	}
	unFocus = () => {
		this.resetStyle();
		this.props.unFocus();
	}

	visited = () => {
		this.setStyle(this.props.visitedStyle);
		this.props.onClick();
		this.props.onVisited();
		this.visitedStyle = this.props.visitedStyle;
	}
	unVisited = () => {
		this.resetStyle(true);
		this.props.onClick();
		this.props.unVisited();
	}

	resetStyle = (resetVisited = false) => {
		if (resetVisited) this.visitedStyle = void 0;
		setStyleToElement(this.currentDOM, { ...this.props.style, ...this.visitedStyle } );
	}

	getDOM = () => this.currentDOM;

	render() {
		const {
			style,
			// tslint:disable:no-unused-variable
			hoverStyle,
			focusStyle,
			activeStyle,
			visitedStyle,
			onMouseEnter,
			onMouseLeave,
			onMouseDown,
			onMouseUp,
			onClick,
			onHover,
			onFocus,
			onActive,
			onVisited,
			unHover,
			unFocus,
			unActive,
			unVisited,
			visited,
			children,
			...attributes
		} = this.props;

		return React.cloneElement(children as any, {
			...attributes,
			ref: (currentDOM: any) => this.currentDOM = currentDOM,
			style: this.context.theme.prepareStyles(style),
			onMouseEnter: hoverStyle ? this.hover : onMouseEnter,
			onMouseLeave: hoverStyle ? this.unHover : onMouseLeave,
			onMouseDown: activeStyle ? this.active : onMouseDown,
			onMouseUp: activeStyle ? this.unActive : onMouseUp,
			onClick: visitedStyle ? this.visited : onClick,
			onFocus: focusStyle ? this.focus : onFocus
		});
	}
}

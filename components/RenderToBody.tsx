import * as React from "react";
import * as ReactDOM from "react-dom";

interface RenderToBodypRrops {
	renderMethod?: "react-dom" | "subtree";
	children: React.DOMElement<any, any>;
}
export default class RenderToBody extends React.Component<RenderToBodypRrops, any> {
	containerElm?: HTMLDivElement;

	componentDidMount() {
		this.renderComponent();
	}

	componentDidUpdate() {
		this.renderComponent();
	}

	componentWillUnmount() {
		this.unRenderComponent();
	}

	renderComponent = () => {
		const { children, renderMethod } = this.props;
		this.containerElm = document.createElement("div");
		document.body.appendChild(this.containerElm);
		if (renderMethod === "react-dom") {
			ReactDOM.render(
				children,
				this.containerElm
			);
		} else {
			ReactDOM.unstable_renderSubtreeIntoContainer(
				this,
				children,
				this.containerElm
			);
		};
	}

	unRenderComponent = () => {
		if (!this.containerElm) return;
		ReactDOM.unmountComponentAtNode(this.containerElm);
		document.body.removeChild(this.containerElm);
		this.containerElm = null;
	}

	getNode = () => this.containerElm

	render() {
		return null as any;
	}
}



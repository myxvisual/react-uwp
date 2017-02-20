import * as React from "react";
import * as ReactDOM from "react-dom";

interface RenderToBodypRrops {
	children?: React.ReactNode;
}
export default class RenderToBody extends React.Component<RenderToBodypRrops, any> {
	containerElm?: HTMLDivElement;

	componentDidMount() {
		this.containerElm = document.createElement("div");
		document.body.appendChild(this.containerElm);
		this.renderComponent();
	}

	componentDidUpdate() {
		this.renderComponent();
	}

	componentWillUnmount() {
		this.unRenderComponent();
		document.body.removeChild(this.containerElm);
		this.containerElm = null;
	}

	renderComponent = () => {
		const { children } = this.props;
		ReactDOM.unstable_renderSubtreeIntoContainer(
			this,
			children as React.ReactElement<any>,
			this.containerElm
		);
	}

	unRenderComponent = () => {
		if (!this.containerElm) return;
		ReactDOM.unmountComponentAtNode(this.containerElm);
	}

	getNode = () => this.containerElm

	render() {
		return null as any;
	}
}

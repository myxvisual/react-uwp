import * as React from "react";
import * as ReactDOM from "react-dom";

export interface RenderToBodyProps {
  children?: React.ReactElement<any>;
}

export default class RenderToBody extends React.PureComponent<RenderToBodyProps, void> {
  rootElm?: HTMLDivElement;

  componentDidMount() {
    this.rootElm = document.createElement("div");
    document.body.appendChild(this.rootElm);
    this.renderComponent();
  }

  componentDidUpdate() {
    this.renderComponent();
  }

  componentWillUnmount() {
    this.unRenderComponent();
    document.body.removeChild(this.rootElm);
    this.rootElm = null;
  }

  renderComponent = () => {
    const { children } = this.props;
    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      children,
      this.rootElm
    );
  }

  unRenderComponent = () => {
    if (!this.rootElm) return;
    ReactDOM.unmountComponentAtNode(this.rootElm);
  }

  getRootElement = () => this.rootElm;

  render() {
    return null as any;
  }
}

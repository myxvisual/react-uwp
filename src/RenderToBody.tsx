import * as React from "react";
import * as ReactDOM from "react-dom";
import IS_NODE_ENV from "./common/nodeJS/IS_NODE_ENV";

export interface RenderToBodyProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactElement<any>;
}

export default class RenderToBody extends React.Component<RenderToBodyProps> {
  rootElm = IS_NODE_ENV ? null : document.createElement("div");

  componentDidMount() {
    if (IS_NODE_ENV) this.rootElm = document.createElement("div");
    const { style, className } = this.props;
    Object.assign(this.rootElm.style, style);
    if (className) this.rootElm.setAttribute("class", className);

    document.body.appendChild(this.rootElm);
    this.renderComponent();
  }

  componentDidUpdate() {
    this.renderComponent();
    const { style, className } = this.props;
    Object.assign(this.rootElm.style, style);
    if (className) this.rootElm.setAttribute("class", className);
  }

  componentWillUnmount() {
    if (this.props.children) {
      this.unRenderComponent();
    }
    document.body.removeChild(this.rootElm);
    this.rootElm = null;
  }

  renderComponent = () => {
    const { children } = this.props;
    if (children) {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        children,
        this.rootElm
      );
    }
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

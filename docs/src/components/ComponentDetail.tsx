import * as React from "react";
import Title from "react-title-component";

import ComponentDescription from "./ComponentDescription";
import MarkdownRender from "./MarkdownRender";

export interface ComponentDetailProps {
  title?: string;
  docEntry?: any;
  readmeText?: string;
  children?: any;
}

export default class ComponentDetail extends React.Component<ComponentDetailProps, void> {
  static defaultProps: ComponentDetailProps = {
    title: `${location.pathname.split("/").slice(-1)[0].split("-").map((str: string) => str[0].toUpperCase() + str.slice(1)).join(" ")} React-UWP App developer | Docs`
  };

  render() {
    const { title, docEntry, readmeText, children, ...attributes } = this.props;
    return (
      <div>
        <Title render={title} />
        <div style={{ padding: 20 }}>
          <MarkdownRender text={readmeText} />
          {children}
          {docEntry && (
            <ComponentDescription docEntry={docEntry} />
          )}
        </div>
      </div>
    );
  }
}

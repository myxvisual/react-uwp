import * as React from "react";
import Title from "react-title-component";
import ComponentDescription from "./ComponentDescription";
import MarkdownRender from "./MarkdownRender";

export interface DataProps {
  title?: string;
  docEntry?: any;
  readmeText?: string;
}

export interface ComponentDetailProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class ComponentDetail extends React.PureComponent<ComponentDetailProps, void> {
  static defaultProps: ComponentDetailProps = {
    title: `${location.pathname.split("/").slice(-1)[0].split("-").map((str: string) => str[0].toUpperCase() + str.slice(1)).join(" ")} React-UWP App developer | Docs`
  };

  render() {
    const { title, docEntry, readmeText, children, ...attributes } = this.props;
    return (
      <div {...attributes}>
        <Title render={title} />
        <div style={{ padding: 24 }}>
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

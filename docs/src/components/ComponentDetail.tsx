import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDescription from "./ComponentDescription";
import MarkdownRender from "react-uwp/MarkdownRender";
export interface ComponentDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  docEntry?: any;
  readmeText?: string;
  children?: any;
  renderOtherTypes?: string[];
}

export default class ComponentDetail extends React.Component<ComponentDetailProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  render() {
    const { theme } = this.context;
    const { style, className, title, docEntry, readmeText, children, renderOtherTypes, ...attributes } = this.props;
    const rootStyle = {
      position: "relative",
      margin: "0 20px"
    } as React.CSSProperties;
    const classes = theme.prepareStyle({
      style: rootStyle,
      className: "ComponentDetail",
      extendsClassName: className
    });
    return (
      <div {...attributes} {...classes}>
        <MarkdownRender text={readmeText} />
        {children}
        {docEntry && (
          <ComponentDescription renderOtherTypes={renderOtherTypes} docEntry={docEntry} />
        )}
      </div>
    );
  }
}

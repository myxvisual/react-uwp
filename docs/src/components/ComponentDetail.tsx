import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDescription from "./ComponentDescription";
import MarkdownRender from "react-uwp/MarkdownRender";

export interface ComponentDetailProps {
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
    const { title, docEntry, readmeText, children, renderOtherTypes, ...attributes } = this.props;
    return (
      <div>
        <div style={{ padding: "0 20px" }}>
          <MarkdownRender text={readmeText} />
          {children}
          {docEntry && (
            <ComponentDescription renderOtherTypes={renderOtherTypes} docEntry={docEntry} />
          )}
        </div>
      </div>
    );
  }
}

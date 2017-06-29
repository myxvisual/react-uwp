import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDescription from "./ComponentDescription";
import MarkdownRender from "react-uwp/MarkdownRender";

export interface ReadmeText {
  "en-US"?: string;
  "zh-CN"?: string;
}

export interface ComponentDetailProps {
  title?: string;
  docEntry?: any;
  readmeText?: string | ReadmeText;
  children?: any;
  renderOtherTypes?: string[];
}

export default class ComponentDetail extends React.Component<ComponentDetailProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { title, docEntry, readmeText, children, renderOtherTypes, ...attributes } = this.props;
    const { theme } = this.context;
    const { language } = theme;

    const isMultipleLanguage = typeof readmeText === "object";
    const currReadmeText = isMultipleLanguage ? (
      (readmeText as any)[(language as any)] || (readmeText as ReadmeText)["en-US"]
    ) : readmeText;

    return (
      <div>
        <div style={{ padding: "0 20px" }}>
          <MarkdownRender text={currReadmeText} />
          {children}
          {docEntry && (
            <ComponentDescription renderOtherTypes={renderOtherTypes} docEntry={docEntry} />
          )}
        </div>
      </div>
    );
  }
}

import * as React from "react";
import * as PropTypes from "prop-types";
import MarkdownRender from "react-uwp/MarkdownRender";
import * as readmeText from "!raw!./README.md";

import CodeExample from "components/CodeExample";

import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample";

export default class Mock extends React.Component<any> {
  static contextTypes = { theme: PropTypes.object };

  render() {
    const {
      location,
      params,
      route,
      router,
      routeParams,
      routes,
      ...attributes
    } = this.props;

    return (
      <div style={{ padding: "0 20px" }}>
        <MarkdownRender text={readmeText as any} />
        <CodeExample
          title="Simple Examples"
          code={SimpleExampleCode as any}
          useSingleTheme
        >
          <SimpleExample />
        </CodeExample>
      </div>
    );
  }
}

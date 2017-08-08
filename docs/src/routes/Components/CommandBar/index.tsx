import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "../../../components/ComponentDetail";
import * as docEntry from "react-uwp/CommandBar/index.doc.json";
import * as readmeText from "!raw!./README.md";

import CodeExample from "../../../components/CodeExample";

import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample";
import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

export default class CommandBar extends React.Component<any> {
  static contextTypes = { theme: PropTypes.object };

  render() {
    const {
      location,
      params,
      route,
      router,
      routeParams,
      routes
    } = this.props;

    return (
      <ComponentDetail
        readmeText={readmeText as any}
        docEntry={docEntry}
      >
        <CodeExample
          title="Simple Examples"
          code={SimpleExampleCode as any}
          description={SimpleExampleDesc as any}
          direction="column"
          useChromeColor
          doubleThemeStyle={{ padding: "40px 0" }}
        >
          <SimpleExample />
        </CodeExample>
      </ComponentDetail>
    );
  }
}

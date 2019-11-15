import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "../../../components/ComponentDetail";
import * as sourceCode from "!raw!react-uwp/CheckBox/index.tsx";
import sourceCode2docEntry from "utils/sourceCode2docEntry";
import * as readmeText from "!raw!./README.md";

import CodeExample from "../../../components/CodeExample";

import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample";
import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

export default class CheckBox extends React.Component<any> {
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
    const docEntry = sourceCode2docEntry(sourceCode);

    return (
      <ComponentDetail
        {...attributes}
        readmeText={readmeText as any}
        docEntry={docEntry}
      >
        <CodeExample
          title="Simple Examples"
          code={SimpleExampleCode as any}
          description={SimpleExampleDesc as any}
        >
          <SimpleExample />
        </CodeExample>
      </ComponentDetail>
    );
  }
}

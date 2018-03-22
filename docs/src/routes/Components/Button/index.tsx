import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "../../../components/ComponentDetail";
import CodeExample from "../../../components/CodeExample";

import * as sourceCode from "!raw!react-uwp/Button/index.tsx";
import sourceCode2docEntry from "common/sourceCode2docEntry";
const docEntry = sourceCode2docEntry(sourceCode);

import * as readmeText from "!raw!./README.md";

import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample.tsx";
import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

import ComplexExample from "./ComplexExample";
import * as ComplexExampleCode from "!raw!./ComplexExample.tsx";
import * as ComplexExampleDesc from "!raw!./ComplexExample.md";

import InlineStyleExample from "./InlineStyleExample";
import * as InlineStyleExampleCode from "!raw!./InlineStyleExample.tsx";
import * as InlineStyleExampleDesc from "!raw!./InlineStyleExample.md";

export default class Button extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  props: any;

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
        >
          <SimpleExample />
        </CodeExample>

        <CodeExample
          title="Complex Style Examples"
          code={ComplexExampleCode as any}
          description={ComplexExampleDesc as any}
        >
          <ComplexExample />
        </CodeExample>

        <CodeExample
          title="Inline Style Examples"
          code={InlineStyleExampleCode as any}
          description={InlineStyleExampleDesc as any}
        >
          <InlineStyleExample />
        </CodeExample>
      </ComponentDetail>
    );
  }
}

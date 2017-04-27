import * as React from "react";

import ComponentDetail from "../../../components/ComponentDetail";
import * as docEntry from "react-uwp/Button/index.doc.json";
import * as readmeText from "!raw!./README.md";

import CodeExample from "../../../components/CodeExample";

import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample";
import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

import ComplexExample from "./ComplexExample";
import * as ComplexExampleCode from "!raw!./ComplexExample";
import * as ComplexExampleDesc from "!raw!./ComplexExample.md";

import InlineStyleExample from "./InlineStyleExample";
import * as InlineStyleExampleCode from "!raw!./InlineStyleExample";
import * as InlineStyleExampleDesc from "!raw!./InlineStyleExample.md";

export default class Button extends React.PureComponent<any, void> {
  render() {
    const {
      location, // tslint:disable-line:no-unused-variable
      params, // tslint:disable-line:no-unused-variable
      route, // tslint:disable-line:no-unused-variable
      router, // tslint:disable-line:no-unused-variable
      routeParams, // tslint:disable-line:no-unused-variable
      routes, // tslint:disable-line:no-unused-variable
      ...attributes
    } = this.props;

    return (
      <ComponentDetail
        {...attributes}
        readmeText={readmeText}
        docEntry={docEntry}
      >
        <CodeExample
          title="Simple Examples"
          code={SimpleExampleCode}
          description={SimpleExampleDesc}
        >
          <SimpleExample />
        </CodeExample>

        <CodeExample
          title="Complex Style Examples"
          code={ComplexExampleCode}
          description={ComplexExampleDesc}
        >
          <ComplexExample />
        </CodeExample>

        <CodeExample
          title="Inline Style Examples"
          code={InlineStyleExampleCode}
          description={InlineStyleExampleDesc}
        >
          <InlineStyleExample />
        </CodeExample>
      </ComponentDetail>
    );
  }
}

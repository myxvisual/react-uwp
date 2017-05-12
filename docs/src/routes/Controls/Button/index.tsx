import * as React from "react";

import ComponentDetail from "../../../components/ComponentDetail";
import CodeExample from "../../../components/CodeExample";

const docEntry = require<any>("react-uwp/Button/index.doc.json");
// import * as docEntry from "react-uwp/Button/index.doc.json";
const readmeText = require<string>("!raw!./README.md");
// import * as readmeText from "!raw!./README.md";
import ast from "./components/ast";

import SimpleExample from "./SimpleExample";
import SimpleExampleCode from "!raw!./SimpleExample.tsx";
import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

import ComplexExample from "./ComplexExample";
import * as ComplexExampleCode from "!raw!./ComplexExample.tsx";
import * as ComplexExampleDesc from "!raw!./ComplexExample.md";

import InlineStyleExample from "./InlineStyleExample";
import * as InlineStyleExampleCode from "!raw!./InlineStyleExample.tsx";
import * as InlineStyleExampleDesc from "!raw!./InlineStyleExample.md";
console.log(ast, InlineStyleExampleDesc);

export default class Button extends React.Component<any, void> {
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

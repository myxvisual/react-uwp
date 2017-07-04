import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "../../../components/ComponentDetail";
import CodeExample from "../../../components/CodeExample";

import * as docEntry from "react-uwp/Button/index.doc.json";
import * as readme from "!raw!./README.md";
import * as readme_zh_CN from "!raw!./README.zh-CN.md";

import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample.tsx";
import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

import ComplexExample from "./ComplexExample";
import * as ComplexExampleCode from "!raw!./ComplexExample.tsx";
import * as ComplexExampleDesc from "!raw!./ComplexExample.md";

import InlineStyleExample from "./InlineStyleExample";
import * as InlineStyleExampleCode from "!raw!./InlineStyleExample.tsx";
import * as InlineStyleExampleDesc from "!raw!./InlineStyleExample.md";

export default class Button extends React.Component<any> {
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
        readmeText={{ "en-US": readme as any, "zh-CN": readme_zh_CN as any }}
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

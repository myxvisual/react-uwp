import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "components/ComponentDetail";
import * as docEntry from "react-uwp/ScrollReveal/index.doc.json";
import * as readme from "!raw!./README.md";
import * as readme_zh_CN from "!raw!./README.zh-CN.md";

import CodeExample from "components/CodeExample";

import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample";
import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

export default class ScrollReveal extends React.Component<any> {
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
      <ComponentDetail
        readmeText={{ "en-US": readme as any, "zh-CN": readme_zh_CN as any }}
        docEntry={docEntry}
      >
        <CodeExample
          title="Simple Examples"
          code={SimpleExampleCode as any}
          description={SimpleExampleDesc as any}
          doubleThemeStyle={{ padding: 20 }}
        >
          <SimpleExample />
        </CodeExample>
      </ComponentDetail>
    );
  }
}

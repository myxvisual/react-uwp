import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "../../../components/ComponentDetail";
import * as docEntry from "react-uwp/AutoSuggestBox/index.doc.json";
import * as readme from "!raw!./README.md";
import * as readme_zh_CN from "!raw!./README.zh-CN.md";

import CodeExample from "../../../components/CodeExample";

import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample";
import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

import ListSourceExample from "./ListSourceExample";
import * as ListSourceExampleCode from "!raw!./ListSourceExample";
import * as ListSourceExampleDesc from "!raw!./ListSourceExample.md";

import ListSourceComplexExample from "./ListSourceComplexExample";
import * as ListSourceComplexExampleCode from "!raw!./ListSourceComplexExample";
import * as ListSourceComplexExampleDesc from "!raw!./ListSourceComplexExample.md";

import SearchExample from "./SearchExample";
import * as SearchExampleCode from "!raw!./SearchExample";
import * as SearchExampleDesc from "!raw!./SearchExample.md";

export default class AutoSuggestBox extends React.Component<any> {
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
        {...attributes}
        readmeText={{ "en-US": readme as any, "zh-CN": readme_zh_CN as any }}
        docEntry={docEntry}
      >
        <CodeExample
          title="Simple Examples"
          code={SimpleExampleCode as any}
          description={SimpleExampleDesc as any}
          useSingleTheme
        >
          <SimpleExample />
        </CodeExample>

        <CodeExample
          title="ListSource Examples"
          code={ListSourceExampleCode as any}
          description={ListSourceExampleDesc as any}
          useSingleTheme
        >
          <ListSourceExample />
        </CodeExample>

        <CodeExample
          title="ListSource Complex Examples"
          code={ListSourceComplexExampleCode as any}
          description={ListSourceComplexExampleDesc as any}
          useSingleTheme
        >
          <ListSourceComplexExample />
        </CodeExample>

        <CodeExample
          title="Search Examples"
          code={SearchExampleCode as any}
          description={SearchExampleDesc as any}
          useSingleTheme
        >
          <SearchExample />
        </CodeExample>
      </ComponentDetail>
    );
  }
}

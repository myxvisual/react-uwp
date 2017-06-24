import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "../../../components/ComponentDetail";
import * as docEntry from "react-uwp/AutoSuggestBox/index.doc.json";
import * as readmeText from "!raw!./README.md";

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
          title="ListSource Examples"
          code={ListSourceExampleCode as any}
          description={ListSourceExampleDesc as any}
        >
          <ListSourceExample />
        </CodeExample>

        <CodeExample
          title="ListSource Complex Examples"
          code={ListSourceComplexExampleCode as any}
          description={ListSourceComplexExampleDesc as any}
        >
          <ListSourceComplexExample />
        </CodeExample>

        <CodeExample
          title="Search Examples"
          code={SearchExampleCode as any}
          description={SearchExampleDesc as any}
        >
          <SearchExample />
        </CodeExample>
      </ComponentDetail>
    );
  }
}

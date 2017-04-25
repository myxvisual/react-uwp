import * as React from "react";

import ComponentDetail from "../../../components/ComponentDetail";
import * as docEntry from "react-uwp/src/controls/Button/index.doc.json";
import * as readmeText from "!raw!./README.md";

// import CodeExample from "../../../components/CodeExample";

// import SimpleExample from "./SimpleExample";
// import * as SimpleExampleCode from "!raw!./SimpleExample";
// import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

export default class Mock extends React.PureComponent<any, void> {
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
        {/*<CodeExample
          title="Simple Examples"
          code={SimpleExampleCode}
          description={SimpleExampleDesc}
        >
          <SimpleExample />
        </CodeExample>*/}
      </ComponentDetail>
    );
  }
}

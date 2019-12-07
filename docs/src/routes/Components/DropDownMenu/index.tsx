import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "components/ComponentDetail";
import * as sourceCode from "!raw!react-uwp/DropDownMenu/index.tsx";
import sourceCode2docEntry from "utils/sourceCode2docEntry";
import * as readmeText from "!raw!./README.md";

import CodeExample from "components/CodeExample";

import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample";
import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

import CustomStyle from "./CustomStyle";
import * as CustomStyleCode from "!raw!./CustomStyle";
import * as CustomStyleDesc from "!raw!./CustomStyle.md";

export default class DropDownMenu extends React.Component<any> {
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
        readmeText={readmeText as any}
        docEntry={docEntry}
      >
        <CodeExample
          title="Simple Examples"
          code={SimpleExampleCode as any}
          description={SimpleExampleDesc as any}
          doubleThemeStyle={{ padding: 20 }}
          useSingleTheme
        >
          <SimpleExample />
        </CodeExample>

        <CodeExample
          title="Custom Style"
          code={CustomStyleCode as any}
          description={CustomStyleDesc as any}
          doubleThemeStyle={{ padding: 20 }}
          useSingleTheme
        >
          <CustomStyle />
        </CodeExample>
      </ComponentDetail>
    );
  }
}

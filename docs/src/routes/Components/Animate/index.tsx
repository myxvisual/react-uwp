import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "components/ComponentDetail";

import * as sourceCode from "!raw!react-uwp/Animate/CustomAnimate.tsx";
import sourceCode2docEntry from "common/sourceCode2docEntry";
import CodeExample from "components/CodeExample";
import SimpleExample from "./SimpleExample";

import * as SimpleExampleCode from "!raw!./SimpleExample";

import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

import * as readmeText from "!raw!./README.md";
import Animation from "../../Styles/Animation";
import * as AnimationCode from "!raw!../../Styles/Animation";

export default class CustomAnimate extends React.Component<any> {
  static contextTypes = { theme: PropTypes.object };

  render() {
    const docEntry = sourceCode2docEntry(sourceCode);
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
          title="Complex Example"
          code={AnimationCode as any}
          useSingleTheme
        >
          <Animation />
        </CodeExample>
      </ComponentDetail>
    );
  }
}

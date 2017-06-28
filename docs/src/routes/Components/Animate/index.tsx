import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "components/ComponentDetail";
import * as docEntry from "react-uwp/Animate/CustomAnimate.doc.json";
import * as readmeText from "!raw!./README.md";
import * as readmeText_zh_CN from "!raw!./README.md";

import CodeExample from "components/CodeExample";

import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample";
import * as SimpleExampleDesc from "!raw!./SimpleExample.md";

import Animation from "../../Styles/Animation";
import * as AnimationCode from "!raw!../../Styles/Animation";

export default class CustomAnimate extends React.Component<any> {
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

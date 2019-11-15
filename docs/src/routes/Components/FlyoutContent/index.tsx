import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "components/ComponentDetail";
import * as sourceCode from "!raw!react-uwp/FlyoutContent/index.tsx";
import sourceCode2docEntry from "utils/sourceCode2docEntry";
import * as readmeText from "!raw!./README.md";

export default class FlyoutContent extends React.Component<any> {
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
      />
    );
  }
}

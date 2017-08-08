import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "components/ComponentDetail";
import * as docEntry from "react-uwp/FlyoutContent/index.doc.json";
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

    return (
      <ComponentDetail
        readmeText={readmeText as any}
        docEntry={docEntry}
      />
    );
  }
}

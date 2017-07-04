import * as React from "react";
import * as PropTypes from "prop-types";

import ComponentDetail from "components/ComponentDetail";
import * as docEntry from "react-uwp/FlyoutContent/index.doc.json";
import * as readme from "!raw!./README.md";
import * as readme_zh_CN from "!raw!./README.zh-CN.md";

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
        readmeText={{ "en-US": readme as any, "zh-CN": readme_zh_CN as any }}
        docEntry={docEntry}
      />
    );
  }
}

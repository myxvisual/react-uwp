import * as React from "react";

import ComponentDetail from "../../../components/ComponentDetail";
import * as readmeText from "!raw!./README.md";

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
      />
    );
  }
}

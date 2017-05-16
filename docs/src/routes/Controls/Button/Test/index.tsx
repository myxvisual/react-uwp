import * as React from "react";

import A from "./A";

export default class Test extends React.PureComponent<any, void> {
  render() {
    const { a, ...b } = this.props;
    return (
      <div {...b}>
        <A />
        Test
      </div>
    );
  }
}

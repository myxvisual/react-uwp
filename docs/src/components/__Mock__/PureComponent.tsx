import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface MockProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Mock extends React.Component<MockProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;

    return (
      <div {...attributes}>
        Mock
      </div>
    );
  }
}

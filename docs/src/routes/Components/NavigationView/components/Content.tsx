import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface ContentProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Content extends React.Component<ContentProps, void> {

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;

    return (
      <div {...attributes}>
        <img src={require("./images/golden-gate-bridge-2037990_1280.jpg")} height={400} />
      </div>
    );
  }
}

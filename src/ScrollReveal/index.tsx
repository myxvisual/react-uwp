import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {
  children?: React.ReactElement<any>;
}

export interface ScrollRevealProps extends DataProps {}

export interface ScrollRevealState {}

export class ScrollReveal extends React.Component<ScrollRevealProps, ScrollRevealState> {
  static defaultProps: ScrollRevealProps = {};

  state: ScrollRevealState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { children, ...attributes } = this.props;
    const { theme } = this.context;

    return (
      <div
        {...attributes}
      >
        ScrollReveal
      </div>
    );
  }
}

export default ScrollReveal;
